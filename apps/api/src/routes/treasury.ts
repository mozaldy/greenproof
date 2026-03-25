import { Router, type Router as ExpressRouter } from 'express'
import { prisma } from '../lib/prisma'
import { requireAuth } from '../middleware/auth'

export const treasuryRouter: ExpressRouter = Router()
treasuryRouter.use(requireAuth)

/** GET /api/v1/treasury — token treasury stats for the company */
treasuryRouter.get('/', async (req, res, next) => {
  try {
    const company = await prisma.company.findUniqueOrThrow({
      where: { id: req.auth!.companyId! },
    })

    const [distributed, pending, recentSubs] = await Promise.all([
      prisma.submission.aggregate({
        where: { task: { companyId: company.id }, status: 'VERIFIED' },
        _sum: { tokenAwarded: true },
      }),
      prisma.submission.aggregate({
        where: {
          task: { companyId: company.id },
          status: { in: ['PENDING', 'LLM_CHECKING', 'FLAGGED'] },
        },
        _sum: { tokenAwarded: true },
      }),
      prisma.submission.findMany({
        where: { task: { companyId: company.id }, status: { in: ['VERIFIED', 'REWARDED'] } },
        orderBy: { verifiedAt: 'desc' },
        take: 10,
        include: {
          user: { select: { id: true, name: true } },
          task: { select: { id: true } },
        },
      }),
    ])

    res.json({
      token: {
        symbol: company.tokenSymbol,
        contractAddress: company.contractAddress,
        decimals: 0,
      },
      summary: {
        distributed: distributed._sum.tokenAwarded ?? 0,
        lockedInEscrow: pending._sum.tokenAwarded ?? 0,
      },
      recentTransactions: recentSubs.map(s => ({
        id: s.id,
        type: 'distributed',
        amount: s.tokenAwarded,
        recipient: { id: s.user.id, name: s.user.name },
        taskId: s.task.id,
        txHash: s.onChainSubmitId,
        status: 'confirmed',
        timestamp: s.verifiedAt,
      })),
    })
  } catch (err) {
    next(err)
  }
})
