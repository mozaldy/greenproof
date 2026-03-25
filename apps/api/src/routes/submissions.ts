import { Router, type Router as ExpressRouter } from 'express'
import multer from 'multer'
import { z } from 'zod'
import { prisma } from '../lib/prisma'
import * as walrusService from '../services/walrus.service'
import * as sealService from '../services/seal.service'
import * as suiService from '../services/sui.service'
import * as llmService from '../services/llm.service'
import { requireAuth } from '../middleware/auth'
import { GPS_MAX_DISTANCE_M } from '@greenproof/shared'
import { retrieveFromWalrus } from '@greenproof/sui-client'

export const submissionsRouter: ExpressRouter = Router()
submissionsRouter.use(requireAuth)

const upload = multer({
  storage: multer.memoryStorage(),
  limits: { files: 5, fileSize: 10 * 1024 * 1024 },
})

const SubmitSchema = z.object({
  diagnosis: z.string().min(5),
  gpsLat: z.coerce.number(),
  gpsLng: z.coerce.number(),
  symptoms: z.string().optional(),
  recommendation: z.string().optional(),
})

function haversineMeters(
  lat1: number,
  lng1: number,
  lat2: number,
  lng2: number
): number {
  const R = 6_371_000
  const dLat = ((lat2 - lat1) * Math.PI) / 180
  const dLng = ((lng2 - lng1) * Math.PI) / 180
  const a =
    Math.sin(dLat / 2) ** 2 +
    Math.cos((lat1 * Math.PI) / 180) *
      Math.cos((lat2 * Math.PI) / 180) *
      Math.sin(dLng / 2) ** 2
  return R * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a))
}

/**
 * POST /api/v1/tasks/:id/submit
 * Validator submits photo evidence + diagnosis for a task.
 * Photos are uploaded to Walrus with Seal encryption.
 * LLM quality gate runs asynchronously after response.
 */
submissionsRouter.post(
  '/tasks/:id/submit',
  upload.array('photos', 5),
  async (req, res, next) => {
    try {
      const task = await prisma.task.findUniqueOrThrow({
        where: { id: req.params.id },
        include: { company: true },
      })

      if (!['PUBLISHED', 'IN_PROGRESS'].includes(task.status)) {
        return res.status(400).json({
          error: 'Task is not accepting submissions',
          code: 'INVALID_STATUS',
        })
      }

      const body = SubmitSchema.parse(req.body)
      const files = req.files as Express.Multer.File[]
      if (!files?.length) {
        return res.status(400).json({
          error: 'At least one photo required',
          code: 'NO_PHOTOS',
        })
      }

      // GPS distance check
      let gpsDistanceM = 0
      if (task.lat && task.lng) {
        gpsDistanceM = haversineMeters(body.gpsLat, body.gpsLng, task.lat, task.lng)
        if (gpsDistanceM > GPS_MAX_DISTANCE_M) {
          return res.status(400).json({
            error: `GPS location too far from task center (${Math.round(gpsDistanceM)}m, max ${GPS_MAX_DISTANCE_M}m)`,
            code: 'GPS_TOO_FAR',
          })
        }
      }

      // Upload photos to Walrus (with Seal encryption if policy exists)
      const policyId = task.company.sealPolicyId
      const blobIds: string[] = []
      const photoMeta: Array<{
        blobId: string
        gpsLat: number
        gpsLng: number
        timestamp: string
      }> = []

      for (const file of files) {
        const data = policyId
          ? await sealService.encryptPhoto(file.buffer, policyId)
          : file.buffer
        const { blobId } = await walrusService.uploadPhoto(data, file.mimetype)
        blobIds.push(blobId)
        photoMeta.push({
          blobId,
          gpsLat: body.gpsLat,
          gpsLng: body.gpsLng,
          timestamp: new Date().toISOString(),
        })
      }

      // Submit first blob_id on-chain
      let onChainTxHash: string | undefined
      if (task.suiTaskId) {
        try {
          const result = await suiService.submitValidationOnChain({
            suiTaskId: task.suiTaskId,
            blobId: blobIds[0],
            diagnosis: body.diagnosis,
            validatorAddress: req.auth!.suiAddress ?? '0x0',
            validatorPrivKeyHex: process.env.GREENPROOF_DEPLOYER_PRIVATE_KEY ?? '',
          })
          onChainTxHash = result.txHash
        } catch (chainErr) {
          console.warn('[submissions] on-chain submit failed, continuing:', chainErr)
        }
      }

      // Save submission to DB
      const submission = await prisma.submission.create({
        data: {
          taskId: task.id,
          userId: req.auth!.userId,
          status: 'PENDING',
          photos: photoMeta,
          diagnosis: body.diagnosis,
          gpsLat: body.gpsLat,
          gpsLng: body.gpsLng,
          gpsDistanceM,
          onChainSubmitId: onChainTxHash,
        },
      })

      // Fire-and-forget async QC (does not block the response)
      setImmediate(() => runAsyncQc(submission.id))

      res.status(201).json({
        submissionId: submission.id,
        blobIds,
        txHash: onChainTxHash,
        status: 'pending_qc',
      })
    } catch (err) {
      next(err)
    }
  }
)

/** GET /api/v1/submissions/:id */
submissionsRouter.get('/:id', async (req, res, next) => {
  try {
    const sub = await prisma.submission.findUniqueOrThrow({
      where: { id: req.params.id },
    })
    res.json(sub)
  } catch (err) {
    next(err)
  }
})

/**
 * Async LLM quality gate. Called via setImmediate after submission is saved.
 * On QC pass: releases on-chain reward, marks submission VERIFIED.
 * On FLAG_FOR_REVIEW: marks submission FLAGGED, flags task on-chain.
 * On REJECT: marks submission REJECTED.
 */
async function runAsyncQc(submissionId: string): Promise<void> {
  try {
    await prisma.submission.update({
      where: { id: submissionId },
      data: { status: 'LLM_CHECKING' },
    })

    const sub = await prisma.submission.findUniqueOrThrow({
      where: { id: submissionId },
      include: {
        task: { include: { company: true } },
        user: true,
      },
    })

    // Fetch up to 3 photos from Walrus for LLM analysis
    const photos = (sub.photos as Array<{ blobId: string }>) ?? []
    const photoBase64s: string[] = []
    for (const p of photos.slice(0, 3)) {
      try {
        const buf = await retrieveFromWalrus(p.blobId)
        photoBase64s.push(buf.toString('base64'))
      } catch (err) {
        console.warn('[QC] failed to fetch photo', p.blobId, err)
      }
    }

    const qcResult = await llmService.runQualityGate({
      diagnosis: sub.diagnosis,
      taskTitle: sub.task.title,
      taskType: sub.task.type,
      gpsDistanceM: sub.gpsDistanceM ?? 0,
      photoBase64s,
    })

    if (qcResult.recommendedAction === 'APPROVE') {
      let rewardTxHash: string | undefined
      if (sub.task.suiTaskId) {
        try {
          const r = await suiService.releaseReward({
            suiTaskId: sub.task.suiTaskId,
            validatorAddress: sub.user.suiAddress ?? '0x0',
          })
          rewardTxHash = r.txHash
        } catch (err) {
          console.error('[QC] releaseReward failed:', err)
        }
      }
      await prisma.submission.update({
        where: { id: submissionId },
        data: {
          status: 'VERIFIED',
          llmQualityScore: qcResult.qualityScore / 100,
          llmQualityNote: qcResult.reasoning,
          llmFlags: qcResult.flags,
          tokenAwarded: sub.task.rewardTokens,
          verifiedAt: new Date(),
          onChainSubmitId: rewardTxHash ?? sub.onChainSubmitId,
        },
      })
      await prisma.task.update({
        where: { id: sub.taskId },
        data: { status: 'COMPLETED' },
      })
      await prisma.auditLog.create({
        data: {
          companyId: sub.task.companyId,
          actorId: sub.userId,
          action: 'qc_pass',
          entityType: 'Submission',
          entityId: submissionId,
          txHash: rewardTxHash,
          metadata: { score: qcResult.qualityScore, reasoning: qcResult.reasoning },
        },
      })
    } else if (qcResult.recommendedAction === 'FLAG_FOR_REVIEW') {
      await prisma.submission.update({
        where: { id: submissionId },
        data: {
          status: 'FLAGGED',
          llmQualityScore: qcResult.qualityScore / 100,
          llmQualityNote: qcResult.reasoning,
          llmFlags: qcResult.flags,
        },
      })
      await prisma.task.update({
        where: { id: sub.taskId },
        data: { status: 'FLAGGED' },
      })
      if (sub.task.suiTaskId) {
        try {
          await suiService.flagTaskOnChain(sub.task.suiTaskId, qcResult.reasoning)
        } catch {}
      }
      await prisma.auditLog.create({
        data: {
          companyId: sub.task.companyId,
          action: 'flagged',
          entityType: 'Submission',
          entityId: submissionId,
          metadata: { flags: qcResult.flags, reasoning: qcResult.reasoning },
        },
      })
    } else {
      // REJECT
      await prisma.submission.update({
        where: { id: submissionId },
        data: {
          status: 'REJECTED',
          llmQualityScore: qcResult.qualityScore / 100,
          llmQualityNote: qcResult.reasoning,
        },
      })
    }
  } catch (err) {
    console.error('[AsyncQC] unhandled error for submission', submissionId, err)
    // Reset to PENDING so it can be retried manually
    await prisma.submission
      .update({ where: { id: submissionId }, data: { status: 'PENDING' } })
      .catch(() => {})
  }
}
