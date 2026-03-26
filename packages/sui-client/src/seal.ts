/**
 * Seal HTTP abstraction layer for GreenProof.
 *
 * Provides access control and encryption/decryption for data stored in Walrus.
 * If SEAL_SERVICE_URL is not set, falls back to mock mode (logs warnings, never crashes).
 *
 * See TechSpec Section 7 (Access Control with Seal).
 */

const SEAL_URL = process.env.SEAL_SERVICE_URL
const MOCK = !SEAL_URL || true

export interface SealPolicy {
  policyId: string
  ownerAddresses: string[]
}

/**
 * Create a new Seal policy allowing the given addresses to decrypt blobs.
 *
 * In mock mode: returns a synthetic policy ID and logs a warning.
 * In real mode: POST to Seal service with owner addresses.
 */
export async function createSealPolicy(ownerAddresses: string[]): Promise<{ policyId: string }> {
  if (MOCK) {
    const mockId = `seal-mock-${Date.now()}`
    console.warn(
      `[SEAL MOCK] createSealPolicy called with owners: ${ownerAddresses.join(', ')} → ${mockId}`
    )
    return { policyId: mockId }
  }

  const response = await fetch(`${SEAL_URL}/v1/policies`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ owners: ownerAddresses }),
  })

  if (!response.ok) {
    throw new Error(
      `Seal createPolicy failed with status ${response.status}: ${response.statusText}`
    )
  }

  const json = (await response.json()) as { policyId: string }
  return { policyId: json.policyId }
}

/**
 * Grant an address access to decrypt a Seal policy.
 *
 * In mock mode: logs a warning and returns.
 * In real mode: POST to Seal service to add a grant.
 */
export async function grantSealAccess(policyId: string, address: string): Promise<void> {
  if (MOCK) {
    console.warn(`[SEAL MOCK] grantSealAccess: policy ${policyId} → ${address}`)
    return
  }

  const response = await fetch(`${SEAL_URL}/v1/policies/${policyId}/grants`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ address }),
  })

  if (!response.ok) {
    throw new Error(
      `Seal grantAccess failed with status ${response.status}: ${response.statusText}`
    )
  }
}

/**
 * Revoke an address's access to a Seal policy.
 *
 * In mock mode: logs a warning and returns.
 * In real mode: DELETE the grant from Seal service.
 */
export async function revokeSealAccess(policyId: string, address: string): Promise<void> {
  if (MOCK) {
    console.warn(`[SEAL MOCK] revokeSealAccess: policy ${policyId} ← ${address}`)
    return
  }

  const response = await fetch(`${SEAL_URL}/v1/policies/${policyId}/grants/${address}`, {
    method: 'DELETE',
  })

  if (!response.ok) {
    throw new Error(
      `Seal revokeAccess failed with status ${response.status}: ${response.statusText}`
    )
  }
}

/**
 * Get the access log (all grants) for a Seal policy.
 *
 * In mock mode: returns an empty array.
 * In real mode: GET the grants from Seal service.
 */
export async function getSealAccessLog(
  policyId: string
): Promise<Array<{ address: string; grantedAt: string }>> {
  if (MOCK) {
    return []
  }

  const response = await fetch(`${SEAL_URL}/v1/policies/${policyId}/grants`, {
    method: 'GET',
  })

  if (!response.ok) {
    throw new Error(
      `Seal getAccessLog failed with status ${response.status}: ${response.statusText}`
    )
  }

  const json = (await response.json()) as Array<{ address: string; grantedAt: string }>
  return json
}

/**
 * Encrypt data for a Seal policy before uploading to Walrus.
 *
 * In mock mode: returns the data unchanged (plaintext in dev).
 * In real mode: POST to Seal service to encrypt with the policy.
 */
export async function encryptForPolicy(data: Buffer, policyId: string): Promise<Buffer> {
  if (MOCK) {
    return data
  }

  const response = await fetch(`${SEAL_URL}/v1/encrypt`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      policyId,
      data: data.toString('base64'),
    }),
  })

  if (!response.ok) {
    throw new Error(`Seal encrypt failed with status ${response.status}: ${response.statusText}`)
  }

  const json = (await response.json()) as { encrypted: string }
  return Buffer.from(json.encrypted, 'base64')
}

/**
 * Decrypt data from Walrus using Seal.
 *
 * In mock mode: returns the data unchanged.
 * In real mode: POST to Seal service to decrypt with the policy.
 */
export async function decryptFromPolicy(data: Buffer, policyId: string): Promise<Buffer> {
  if (MOCK) {
    return data
  }

  const response = await fetch(`${SEAL_URL}/v1/decrypt`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      policyId,
      data: data.toString('base64'),
    }),
  })

  if (!response.ok) {
    throw new Error(`Seal decrypt failed with status ${response.status}: ${response.statusText}`)
  }

  const json = (await response.json()) as { decrypted: string }
  return Buffer.from(json.decrypted, 'base64')
}
