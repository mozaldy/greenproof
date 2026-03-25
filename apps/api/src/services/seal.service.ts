import {
  createSealPolicy,
  grantSealAccess,
  revokeSealAccess,
  encryptForPolicy,
} from '@greenproof/sui-client'
import { prisma } from '../lib/prisma'

const AI_SERVICE_ADDRESS = process.env.GREENPROOF_SERVICE_ADDRESS ?? ''
const GREENPROOF_CONTRACT = process.env.GREENPROOF_PACKAGE_ID ?? ''

/**
 * Provisions a Seal policy for a new company at onboarding.
 * Allows: company wallet + GreenProof contract + optionally the AI service.
 */
export async function provisionCompanyPolicy(params: {
  companyId: string
  companyWalletAddress: string
  includeAiService: boolean
}): Promise<{ policyId: string }> {
  const owners = [params.companyWalletAddress, GREENPROOF_CONTRACT]
  if (params.includeAiService && AI_SERVICE_ADDRESS) owners.push(AI_SERVICE_ADDRESS)

  const { policyId } = await createSealPolicy(owners)

  await prisma.sealAccessLog.create({
    data: {
      companyId: params.companyId,
      policyId,
      grantedTo: owners.join(','),
      action: 'GRANT',
      service: 'Company onboarding',
    },
  })
  return { policyId }
}

/**
 * Toggles AI service access on a company's Seal policy.
 * Called when operator switches between AI mode A (own model) and B (GreenProof AI).
 */
export async function toggleAiAccess(params: {
  companyId: string
  policyId: string
  enable: boolean
}): Promise<void> {
  if (params.enable) {
    await grantSealAccess(params.policyId, AI_SERVICE_ADDRESS)
  } else {
    await revokeSealAccess(params.policyId, AI_SERVICE_ADDRESS)
  }
  await prisma.sealAccessLog.create({
    data: {
      companyId: params.companyId,
      policyId: params.policyId,
      grantedTo: AI_SERVICE_ADDRESS,
      action: params.enable ? 'GRANT' : 'REVOKE',
      service: 'AI Mode toggle',
    },
  })
}

/** Encrypt photo data for a company's Seal policy before uploading to Walrus. */
export async function encryptPhoto(data: Buffer, policyId: string): Promise<Buffer> {
  return encryptForPolicy(data, policyId)
}
