import { Router, type Router as ExpressRouter } from 'express'
import { z } from 'zod'
import { prisma } from '../lib/prisma'
import * as suiService from '../services/sui.service'
import * as sealService from '../services/seal.service'
import { issueToken, requireAuth } from '../middleware/auth'

export const onboardingRouter: ExpressRouter = Router()

const CompanySchema = z.object({
  companyName: z.string().min(3),
  tokenName: z.string().min(2),
  tokenSymbol: z.string().min(2).max(10).toUpperCase(),
  operatorEmail: z.string().email(),
  operatorName: z.string().min(2),
  aiMode: z.enum(['A', 'B']).default('B'),
})

/**
 * POST /api/v1/onboarding/company
 * Creates company: DB row + SUI token + TaskRegistry + Seal policy.
 * Returns JWT for the initial Operator user.
 */
onboardingRouter.post('/company', async (req, res, next) => {
  try {
    const body = CompanySchema.parse(req.body)

    // Check token symbol uniqueness
    const existing = await prisma.company.findFirst({
      where: { tokenSymbol: body.tokenSymbol },
    })
    if (existing) {
      return res.status(409).json({ error: 'Token symbol already in use', code: 'SYMBOL_TAKEN' })
    }

    // Step 1: Create SUI company token
    const { treasuryCapId, txHash: tokenTxHash } = await suiService.createCompanyToken({
      companyId: 'pending',
      name: body.tokenName,
      symbol: body.tokenSymbol,
    })

    // Step 2: Create TaskRegistry
    const { registryId, txHash: registryTxHash } = await suiService.createTaskRegistry('pending')

    // Step 3: Create Seal policy (non-blocking — partial success is OK)
    let sealPolicyId: string | null = null
    try {
      const { policyId } = await sealService.provisionCompanyPolicy({
        companyId: 'pending',
        companyWalletAddress: treasuryCapId,
        includeAiService: body.aiMode === 'B',
      })
      sealPolicyId = policyId
    } catch (err) {
      console.warn('[onboarding] Seal policy creation failed, continuing:', err)
    }

    // Step 4: Save to DB
    const company = await prisma.company.create({
      data: {
        name: body.companyName,
        tokenName: body.tokenName,
        tokenSymbol: body.tokenSymbol,
        contractAddress: process.env.GREENPROOF_PACKAGE_ID,
        treasuryCapId,
        taskRegistryId: registryId,
        sealPolicyId,
        aiMode: body.aiMode === 'A' ? 'own_model' : 'greenproof',
        subscriptionTier: 'starter',
      },
    })

    // Step 5: Create initial Operator user
    const user = await prisma.user.create({
      data: {
        companyId: company.id,
        email: body.operatorEmail,
        name: body.operatorName,
        role: 'OPERATOR',
        isActive: true,
        googleId: `onboard-${company.id}`,
      },
    })

    // Step 6: Audit log
    await prisma.auditLog.create({
      data: {
        companyId: company.id,
        actorId: user.id,
        actorName: user.name,
        action: 'company_onboarded',
        entityType: 'Company',
        entityId: company.id,
        metadata: { tokenTxHash, registryTxHash, sealPolicyId },
      },
    })

    const token = issueToken({
      userId: user.id,
      companyId: company.id,
      role: 'OPERATOR',
    })

    res.status(201).json({
      companyId: company.id,
      contractAddress: company.contractAddress,
      taskRegistryId: registryId,
      sealPolicyId,
      deployTxHash: tokenTxHash,
      registryTxHash,
      tokenSymbol: company.tokenSymbol,
      tokenName: company.tokenName,
      token,
    })
  } catch (err) {
    next(err)
  }
})

/**
 * GET /api/v1/me
 * Returns current user + company context.
 */
onboardingRouter.get('/me', requireAuth, async (req, res, next) => {
  try {
    const user = await prisma.user.findUniqueOrThrow({
      where: { id: req.auth!.userId },
      include: { company: true },
    })
    res.json({ user, company: user.company })
  } catch (err) {
    next(err)
  }
})
