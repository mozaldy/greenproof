import { Router, type Router as ExpressRouter } from 'express'
import { z } from 'zod'
import { prisma } from '../lib/prisma'
import * as llmService from '../services/llm.service'
import { requireAuth, requireRole } from '../middleware/auth'
import type { Prisma } from '@greenproof/db'

export const simulatorRouter: ExpressRouter = Router()
simulatorRouter.use(requireAuth, requireRole('OPERATOR', 'SUPERVISOR'))

const GenerateSchema = z.object({
  estate: z.string(),
  blockIds: z.array(z.string()),
  count: z.number().int().min(1).max(20).default(5),
  includeKritikal: z.boolean().default(false),
})

/** POST /api/v1/simulator/generate — generate drone anomaly simulation */
simulatorRouter.post('/generate', async (req, res, next) => {
  try {
    const body = GenerateSchema.parse(req.body)
    const anomalies = await llmService.simulateAnomalies(body)

    const log = await prisma.anomalyLog.create({
      data: {
        companyId: req.auth!.companyId!,
        estateInfo: { estate: body.estate, blockIds: body.blockIds },
        rawOutput: anomalies as unknown as Prisma.InputJsonValue,
        tasksCreated: 0,
      },
    })

    res.json({ tasks: anomalies, anomalyLogId: log.id, generatedAt: log.generatedAt })
  } catch (err) {
    next(err)
  }
})

/** POST /api/v1/simulator/create-tasks — convert anomaly log into Task rows (DRAFT) */
simulatorRouter.post('/create-tasks', async (req, res, next) => {
  try {
    const { anomalyLogId } = z.object({ anomalyLogId: z.string() }).parse(req.body)
    const log = await prisma.anomalyLog.findUniqueOrThrow({ where: { id: anomalyLogId } })
    const anomalies = log.rawOutput as Array<Record<string, unknown>>

    const created = await Promise.all(
      anomalies.map(a =>
        prisma.task.create({
          data: {
            companyId: req.auth!.companyId!,
            title: `${String(a.anomalyType)} — ${String((log.estateInfo as Record<string, unknown>).estate ?? '')}`,
            type: (a.suggestedTaskType as string) as any,
            rewardTokens: 100,
            requiredLevel: 1,
            lat: Number(a.lat),
            lng: Number(a.lng),
            estate: String((log.estateInfo as Record<string, unknown>).estate ?? ''),
            coordinates: { lat: Number(a.lat), lng: Number(a.lng) },
            description: String(a.description ?? ''),
            anomalySource: 'drone_simulator',
            anomalyRaw: a as unknown as Prisma.InputJsonValue,
            status: 'DRAFT',
            createdByUserId: req.auth!.userId,
          },
        })
      )
    )

    await prisma.anomalyLog.update({
      where: { id: anomalyLogId },
      data: { tasksCreated: created.length },
    })
    res.status(201).json({ created: created.map(t => t.id) })
  } catch (err) {
    next(err)
  }
})
