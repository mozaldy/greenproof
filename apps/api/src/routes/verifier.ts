import { Router, type Router as ExpressRouter } from 'express'
import { z } from 'zod'
import { prisma } from '../lib/prisma'
import * as suiService from '../services/sui.service'
import { requireAuth, requireRole } from '../middleware/auth'

export const verifierRouter: ExpressRouter = Router()
verifierRouter.use(requireAuth, requireRole('AGRONOMIS', 'SUPERVISOR', 'OPERATOR'))

/** GET /api/v1/verifier/queue — flagged submissions awaiting agronomist verdict */
verifierRouter.get('/queue', async (req, res, next) => {
  try {
    const flagged = await prisma.submission.findMany({
      where: {
        status: 'FLAGGED',
        task: { companyId: req.auth!.companyId! },
        verdict: null,
      },
      include: {
        task: { select: { id: true, title: true, type: true, suiTaskId: true, rewardTokens: true } },
        user: { select: { id: true, name: true, suiAddress: true } },
      },
      orderBy: { submittedAt: 'asc' },
    })
    res.json(flagged)
  } catch (err) {
    next(err)
  }
})

const VerdictSchema = z.object({
  submissionId: z.string(),
  verdict: z.enum(['CONFIRMED', 'REJECTED', 'INCONCLUSIVE']),
  diagnosisCode: z.string().optional(),
  notes: z.string(),
  isTrainingData: z.boolean().default(true),
})

/** POST /api/v1/verifier/verdict — agronomist submits final verdict */
verifierRouter.post('/verdict', async (req, res, next) => {
  try {
    const body = VerdictSchema.parse(req.body)

    const submission = await prisma.submission.findUniqueOrThrow({
      where: { id: body.submissionId },
      include: {
        task: true,
        user: true,
      },
    })

    const verdictRecord = await prisma.verdict.create({
      data: {
        submissionId: body.submissionId,
        agronomistId: req.auth!.userId,
        verdict: body.verdict,
        diagnosisCode: body.diagnosisCode,
        notes: body.notes,
        isTrainingData: body.isTrainingData,
      },
    })

    let rewardTxHash: string | undefined

    if (body.verdict === 'CONFIRMED' && submission.task.suiTaskId) {
      try {
        const result = await suiService.releaseReward({
          suiTaskId: submission.task.suiTaskId,
          validatorAddress: submission.user.suiAddress ?? '0x0',
        })
        rewardTxHash = result.txHash
        await prisma.submission.update({
          where: { id: body.submissionId },
          data: {
            status: 'REWARDED',
            tokenAwarded: submission.task.rewardTokens,
            onChainSubmitId: rewardTxHash,
          },
        })
        await prisma.task.update({
          where: { id: submission.taskId },
          data: { status: 'COMPLETED' },
        })
      } catch (err) {
        console.error('[verifier] releaseReward failed:', err)
      }
    } else if (body.verdict === 'REJECTED') {
      await prisma.submission.update({
        where: { id: body.submissionId },
        data: { status: 'REJECTED' },
      })
      await prisma.task.update({
        where: { id: submission.taskId },
        data: { status: 'PUBLISHED' },
      })
    }

    await prisma.auditLog.create({
      data: {
        companyId: submission.task.companyId,
        actorId: req.auth!.userId,
        action: 'verdict',
        entityType: 'Submission',
        entityId: body.submissionId,
        txHash: rewardTxHash,
        metadata: { verdict: body.verdict, notes: body.notes },
      },
    })

    res.json({ success: true, verdictId: verdictRecord.id, rewardTxHash })
  } catch (err) {
    next(err)
  }
})
