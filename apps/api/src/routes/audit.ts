import { Router, type Router as ExpressRouter } from 'express'
import { prisma } from '../lib/prisma'
import { requireAuth } from '../middleware/auth'

export const auditRouter: ExpressRouter = Router()
auditRouter.use(requireAuth)

/** GET /api/v1/audit — paginated audit log for the company */
auditRouter.get('/', async (req, res, next) => {
  try {
    const { type, estate, page = '1', limit = '50' } = req.query as Record<string, string>
    const skip = (parseInt(page) - 1) * parseInt(limit)
    const where: Record<string, unknown> = { companyId: req.auth!.companyId! }
    if (type) where.action = type
    if (estate) where.estate = estate

    const [logs, total] = await Promise.all([
      prisma.auditLog.findMany({
        where,
        skip,
        take: parseInt(limit),
        orderBy: { createdAt: 'desc' },
      }),
      prisma.auditLog.count({ where }),
    ])
    res.json({ logs, total, page: parseInt(page) })
  } catch (err) {
    next(err)
  }
})

/** GET /api/v1/audit/seal — Seal access log for the company */
auditRouter.get('/seal', async (req, res, next) => {
  try {
    const logs = await prisma.sealAccessLog.findMany({
      where: { companyId: req.auth!.companyId! },
      orderBy: { createdAt: 'desc' },
      take: 50,
    })
    res.json(logs)
  } catch (err) {
    next(err)
  }
})
