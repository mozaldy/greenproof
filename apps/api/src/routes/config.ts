import { Router, type Router as ExpressRouter } from 'express'
import { z } from 'zod'
import { prisma } from '../lib/prisma'
import * as sealService from '../services/seal.service'
import { requireAuth, requireRole } from '../middleware/auth'

export const configRouter: ExpressRouter = Router()
configRouter.use(requireAuth)

/** GET /api/v1/config — company configuration */
configRouter.get('/', async (req, res, next) => {
  try {
    const company = await prisma.company.findUniqueOrThrow({
      where: { id: req.auth!.companyId! },
    })
    const sealLogs = await prisma.sealAccessLog.findMany({
      where: { companyId: company.id },
      orderBy: { createdAt: 'desc' },
      take: 10,
    })
    res.json({ aiMode: company.aiMode, sealPolicyId: company.sealPolicyId, sealLogs })
  } catch (err) {
    next(err)
  }
})

/** PATCH /api/v1/config/ai-mode — toggle AI mode A (own model) or B (GreenProof AI) */
configRouter.patch(
  '/ai-mode',
  requireRole('OPERATOR'),
  async (req, res, next) => {
    try {
      const { mode } = z.object({ mode: z.enum(['A', 'B']) }).parse(req.body)
      const company = await prisma.company.findUniqueOrThrow({
        where: { id: req.auth!.companyId! },
      })

      if (company.sealPolicyId) {
        await sealService.toggleAiAccess({
          companyId: company.id,
          policyId: company.sealPolicyId,
          enable: mode === 'B',
        })
      }

      const updated = await prisma.company.update({
        where: { id: company.id },
        data: { aiMode: mode === 'A' ? 'own_model' : 'greenproof' },
      })

      await prisma.auditLog.create({
        data: {
          companyId: company.id,
          actorId: req.auth!.userId,
          action: 'config_changed',
          entityType: 'Company',
          entityId: company.id,
          metadata: { aiMode: mode },
        },
      })

      res.json({ aiMode: updated.aiMode })
    } catch (err) {
      next(err)
    }
  }
)
