import { Router, type Router as ExpressRouter } from 'express'
import { z } from 'zod'
import { prisma } from '../lib/prisma'
import * as suiService from '../services/sui.service'
import { requireAuth, requireRole } from '../middleware/auth'
import { TASK_MIN_LEVEL } from '@greenproof/shared'

export const tasksRouter: ExpressRouter = Router()
tasksRouter.use(requireAuth)

const TASK_TYPE_TO_INT: Record<string, number> = {
  AREA_CONDITION: 0,
  TREE_COUNT: 1,
  HEALTH_DIAGNOSIS: 2,
  ANOMALY_SEMI: 3,
  ANOMALY_CRITICAL: 4,
}

const CreateTaskSchema = z.object({
  title: z.string().min(5),
  taskType: z.enum(['TREE_COUNT', 'AREA_CONDITION', 'HEALTH_DIAGNOSIS', 'ANOMALY_SEMI', 'ANOMALY_CRITICAL']),
  lat: z.number().min(-90).max(90),
  lng: z.number().min(-180).max(180),
  blok: z.string(),
  estate: z.string(),
  rewardAmount: z.number().int().positive(),
  description: z.string().optional(),
  publish: z.boolean().default(false),
})

/** GET /api/v1/tasks — paginated task list for the authenticated company */
tasksRouter.get('/', async (req, res, next) => {
  try {
    const {
      status,
      estate,
      search,
      page = '1',
      limit = '20',
    } = req.query as Record<string, string>

    const companyId = req.auth!.companyId
    if (!companyId) return res.status(400).json({ error: 'Company context required', code: 'NO_COMPANY' })

    const skip = (parseInt(page) - 1) * parseInt(limit)

    const where: Record<string, unknown> = { companyId }
    if (status && status !== 'all') where.status = status
    if (estate) where.estate = estate
    if (search) where.title = { contains: search, mode: 'insensitive' }

    const [tasks, total] = await Promise.all([
      prisma.task.findMany({
        where,
        skip,
        take: parseInt(limit),
        orderBy: { createdAt: 'desc' },
        include: { _count: { select: { submissions: true } } },
      }),
      prisma.task.count({ where }),
    ])

    res.json({
      tasks: tasks.map(t => ({
        id: t.id,
        suiTaskId: t.suiTaskId,
        title: t.title,
        status: t.status,
        taskType: t.type,
        rewardAmount: t.rewardTokens,
        estate: t.estate,
        blok: t.blok,
        lat: t.lat,
        lng: t.lng,
        txHash: t.txHash,
        createdAt: t.createdAt,
        submissionCount: t._count.submissions,
        prediksiDrone: t.anomalyRaw
          ? {
              label: (t.anomalyRaw as Record<string, unknown>).description,
              confidence: (t.anomalyRaw as Record<string, unknown>).confidence,
            }
          : null,
      })),
      total,
      page: parseInt(page),
      limit: parseInt(limit),
    })
  } catch (err) {
    next(err)
  }
})

/** GET /api/v1/tasks/:id */
tasksRouter.get('/:id', async (req, res, next) => {
  try {
    const task = await prisma.task.findUniqueOrThrow({
      where: { id: req.params.id },
      include: {
        submissions: {
          include: { user: { select: { name: true, suiAddress: true } } },
        },
        _count: { select: { submissions: true } },
      },
    })
    res.json({ ...task, rewardAmount: task.rewardTokens })
  } catch (err) {
    next(err)
  }
})

/** POST /api/v1/tasks — create (and optionally publish) task */
tasksRouter.post(
  '/',
  requireRole('OPERATOR', 'SUPERVISOR'),
  async (req, res, next) => {
    try {
      const body = CreateTaskSchema.parse(req.body)
      const companyId = req.auth!.companyId!
      const minLevel = (TASK_MIN_LEVEL as Record<string, number>)[body.taskType] ?? 1

      const task = await prisma.task.create({
        data: {
          companyId,
          title: body.title,
          type: body.taskType as any,
          rewardTokens: body.rewardAmount,
          requiredLevel: minLevel,
          lat: body.lat,
          lng: body.lng,
          blok: body.blok,
          estate: body.estate,
          description: body.description ?? '',
          coordinates: { lat: body.lat, lng: body.lng },
          status: body.publish ? 'PUBLISHED' : 'DRAFT',
          createdByUserId: req.auth!.userId,
        },
      })

      let suiTaskId: string | undefined
      let txHash: string | undefined

      if (body.publish) {
        const company = await prisma.company.findUniqueOrThrow({
          where: { id: companyId },
        })
        if (!company.treasuryCapId || !company.taskRegistryId) {
          return res.status(400).json({
            error: 'Company not fully onboarded on-chain',
            code: 'ONBOARDING_INCOMPLETE',
          })
        }
        const onChain = await suiService.createOnChainTask({
          dbTaskId: task.id,
          treasuryCapId: company.treasuryCapId,
          registryId: company.taskRegistryId,
          companyId: task.companyId,
          title: task.title,
          taskType: TASK_TYPE_TO_INT[body.taskType] ?? 0,
          lat: body.lat,
          lng: body.lng,
          rewardAmount: body.rewardAmount,
          minValidatorLevel: minLevel,
        })
        suiTaskId = onChain.suiTaskId
        txHash = onChain.txHash

        await prisma.task.update({
          where: { id: task.id },
          data: { suiTaskId, txHash },
        })

        await prisma.auditLog.create({
          data: {
            companyId,
            actorId: req.auth!.userId,
            action: 'task_published',
            entityType: 'Task',
            entityId: task.id,
            estate: body.estate,
            txHash,
            metadata: { suiTaskId },
          },
        })
      }

      res.status(201).json({ ...task, suiTaskId, txHash, rewardAmount: task.rewardTokens })
    } catch (err) {
      next(err)
    }
  }
)

/** PATCH /api/v1/tasks/:id/publish — publish a DRAFT task on-chain */
tasksRouter.patch(
  '/:id/publish',
  requireRole('OPERATOR'),
  async (req, res, next) => {
    try {
      const task = await prisma.task.findUniqueOrThrow({
        where: { id: req.params.id },
      })
      if (task.status !== 'DRAFT') {
        return res.status(400).json({
          error: 'Only DRAFT tasks can be published',
          code: 'INVALID_STATUS',
        })
      }
      const company = await prisma.company.findUniqueOrThrow({
        where: { id: task.companyId },
      })
      if (!company.treasuryCapId || !company.taskRegistryId) {
        return res.status(400).json({
          error: 'Company not fully onboarded on-chain',
          code: 'ONBOARDING_INCOMPLETE',
        })
      }
      const { suiTaskId, txHash } = await suiService.createOnChainTask({
        dbTaskId: task.id,
        treasuryCapId: company.treasuryCapId,
        registryId: company.taskRegistryId,
        companyId: task.companyId,
        title: task.title,
        taskType: TASK_TYPE_TO_INT[task.type] ?? 0,
        lat: task.lat ?? 0,
        lng: task.lng ?? 0,
        rewardAmount: task.rewardTokens,
        minValidatorLevel: task.requiredLevel,
      })
      const updated = await prisma.task.update({
        where: { id: task.id },
        data: { status: 'PUBLISHED', suiTaskId, txHash },
      })
      res.json({ ...updated, rewardAmount: updated.rewardTokens })
    } catch (err) {
      next(err)
    }
  }
)

/** PATCH /api/v1/tasks/:id/claim — validator claims a task */
tasksRouter.patch('/:id/claim', async (req, res, next) => {
  try {
    const task = await prisma.task.findUniqueOrThrow({
      where: { id: req.params.id },
    })
    if (task.status !== 'PUBLISHED') {
      return res.status(400).json({
        error: 'Task is not available for claiming',
        code: 'INVALID_STATUS',
      })
    }
    await prisma.task.update({
      where: { id: task.id },
      data: { status: 'IN_PROGRESS', currentClaims: { increment: 1 } },
    })
    res.json({ success: true, taskId: task.id })
  } catch (err) {
    next(err)
  }
})
