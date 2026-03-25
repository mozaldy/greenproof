import { Router, type Router as ExpressRouter } from 'express'
import { z } from 'zod'
import { prisma } from '../lib/prisma'
import * as suiService from '../services/sui.service'
import { requireAuth, requireRole } from '../middleware/auth'

export const validatorsRouter: ExpressRouter = Router()
validatorsRouter.use(requireAuth)

const CreateValidatorSchema = z.object({
  name: z.string().min(2),
  phone: z.string().optional(),
  suiAddress: z.string().optional(),
  level: z.number().int().min(1).max(3).default(1),
})

validatorsRouter.get('/', async (req, res, next) => {
  try {
    const validators = await prisma.validator.findMany({
      where: { companyId: req.auth!.companyId! },
      orderBy: { createdAt: 'desc' },
    })
    res.json(validators)
  } catch (err) {
    next(err)
  }
})

validatorsRouter.post('/', requireRole('OPERATOR'), async (req, res, next) => {
  try {
    const body = CreateValidatorSchema.parse(req.body)
    const validator = await prisma.validator.create({
      data: { ...body, companyId: req.auth!.companyId! },
    })
    if (validator.suiAddress) {
      try {
        await suiService.createReputation({
          companyId: req.auth!.companyId!,
          validatorAddress: validator.suiAddress,
        })
      } catch (err) {
        console.warn('[validators] createReputation failed:', err)
      }
    }
    res.status(201).json(validator)
  } catch (err) {
    next(err)
  }
})

validatorsRouter.patch('/:id', requireRole('OPERATOR'), async (req, res, next) => {
  try {
    const { level, isActive } = z
      .object({ level: z.number().int().min(1).max(3).optional(), isActive: z.boolean().optional() })
      .parse(req.body)
    const updated = await prisma.validator.update({
      where: { id: req.params.id },
      data: { level, isActive },
    })
    res.json(updated)
  } catch (err) {
    next(err)
  }
})
