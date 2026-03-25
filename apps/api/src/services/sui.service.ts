import { SuiClient, getFullnodeUrl } from '@mysten/sui.js/client'
import { TransactionBlock } from '@mysten/sui.js/transactions'
import { Ed25519Keypair } from '@mysten/sui.js/keypairs/ed25519'

const NETWORK = (process.env.SUI_NETWORK as 'testnet' | 'mainnet' | 'devnet') ?? 'testnet'
const PACKAGE_ID = process.env.GREENPROOF_PACKAGE_ID ?? ''
const ADMIN_CAP_ID = process.env.GREENPROOF_ADMIN_CAP_ID ?? ''

/** Call once at API startup to fail fast if SUI env vars are missing. */
export function validateSuiEnv(): void {
  const required: Record<string, string | undefined> = {
    GREENPROOF_PACKAGE_ID: process.env.GREENPROOF_PACKAGE_ID,
    GREENPROOF_ADMIN_CAP_ID: process.env.GREENPROOF_ADMIN_CAP_ID,
    GREENPROOF_DEPLOYER_PRIVATE_KEY: process.env.GREENPROOF_DEPLOYER_PRIVATE_KEY,
  }
  const missing = Object.entries(required)
    .filter(([, v]) => !v)
    .map(([k]) => k)
  if (missing.length > 0) {
    throw new Error(`SUI env vars not configured: ${missing.join(', ')}`)
  }
}

let _client: SuiClient | undefined
let _keypair: Ed25519Keypair | undefined

function getClient(): SuiClient {
  if (!_client) {
    _client = new SuiClient({ url: process.env.SUI_RPC_URL ?? getFullnodeUrl(NETWORK) })
  }
  return _client
}

function getDeployerKeypair(): Ed25519Keypair {
  if (!_keypair) {
    const key = process.env.GREENPROOF_DEPLOYER_PRIVATE_KEY
    if (!key) throw new Error('GREENPROOF_DEPLOYER_PRIVATE_KEY not set')
    _keypair = Ed25519Keypair.fromSecretKey(Buffer.from(key, 'hex'))
  }
  return _keypair
}

function deployerAddress(): string {
  return getDeployerKeypair().getPublicKey().toSuiAddress()
}

async function executeAdmin(tx: TransactionBlock) {
  const client = getClient()
  const keypair = getDeployerKeypair()
  const result = await client.signAndExecuteTransactionBlock({
    signer: keypair,
    transactionBlock: tx,
    options: { showEffects: true, showObjectChanges: true },
  })
  if (result.effects?.status.status !== 'success') {
    throw new Error(`SUI tx failed: ${result.effects?.status.error ?? 'unknown error'}`)
  }
  return result
}

/**
 * Creates a CompanyTreasuryCap for a new company at onboarding.
 * Requires GreenproofAdminCap which is held by deployer.
 */
export async function createCompanyToken(params: {
  companyId: string
  name: string
  symbol: string
}): Promise<{ treasuryCapId: string; txHash: string }> {
  const tx = new TransactionBlock()
  const [cap] = tx.moveCall({
    target: `${PACKAGE_ID}::validator_token::create_company_token`,
    arguments: [
      tx.object(ADMIN_CAP_ID),
      tx.pure(params.companyId),
      tx.pure(params.name),
      tx.pure(params.symbol),
    ],
  })
  tx.transferObjects([cap], tx.pure(deployerAddress()))

  const result = await executeAdmin(tx)
  const created = (result.objectChanges ?? []).find(
    c => c.type === 'created' && c.objectType?.includes('CompanyTreasuryCap')
  )
  if (!created || created.type !== 'created') {
    throw new Error('CompanyTreasuryCap not found in tx result')
  }
  return { treasuryCapId: created.objectId, txHash: result.digest }
}

/**
 * Creates a TaskRegistry object for a company at onboarding.
 */
export async function createTaskRegistry(
  companyId: string
): Promise<{ registryId: string; txHash: string }> {
  const tx = new TransactionBlock()
  const [registry] = tx.moveCall({
    target: `${PACKAGE_ID}::task_registry::create_registry`,
    arguments: [tx.pure(companyId)],
  })
  tx.transferObjects([registry], tx.pure(deployerAddress()))

  const result = await executeAdmin(tx)
  const created = (result.objectChanges ?? []).find(
    c => c.type === 'created' && c.objectType?.includes('TaskRegistry')
  )
  if (!created || created.type !== 'created') {
    throw new Error('TaskRegistry not found in tx result')
  }
  return { registryId: created.objectId, txHash: result.digest }
}

/**
 * Mints escrow tokens and creates a Task on-chain in a single PTB.
 * Coordinates are encoded as UTF-8 bytes of a JSON string { lat, lng }.
 */
export async function createOnChainTask(params: {
  dbTaskId: string
  treasuryCapId: string
  registryId: string
  companyId: string
  title: string
  taskType: number    // 0=area_condition, 1=tree_count, 2=health_diagnosis, 3=anomaly_semi, 4=anomaly_critical
  lat: number
  lng: number
  rewardAmount: number
  minValidatorLevel: number
}): Promise<{ suiTaskId: string; txHash: string }> {
  const coords = Array.from(Buffer.from(JSON.stringify({ lat: params.lat, lng: params.lng })))

  const tx = new TransactionBlock()
  // Step 1: Mint the escrow token
  const [coin] = tx.moveCall({
    target: `${PACKAGE_ID}::validator_token::mint`,
    arguments: [
      tx.object(params.treasuryCapId),
      tx.pure(params.rewardAmount),
      tx.pure(params.dbTaskId),  // task_id label for event emission
    ],
  })
  // Step 2: Create task with minted coin as escrow
  tx.moveCall({
    target: `${PACKAGE_ID}::task_registry::create_task`,
    arguments: [
      tx.object(params.registryId),
      tx.pure(params.companyId),
      tx.pure(params.title),
      tx.pure(params.taskType),
      tx.pure(coords),
      tx.pure(params.rewardAmount),
      tx.pure(params.minValidatorLevel),
      coin,
    ],
  })

  const result = await executeAdmin(tx)
  const created = (result.objectChanges ?? []).find(
    c => c.type === 'created' && c.objectType?.includes('task_registry::Task')
  )
  if (!created || created.type !== 'created') {
    throw new Error('Task object not found in tx result')
  }
  return { suiTaskId: created.objectId, txHash: result.digest }
}

/**
 * Validator claims a task. Backend-sponsored: deployer pays gas, validator is logical sender.
 * For MVP: uses deployer key as proxy signer since zkLogin session keys aren't stored server-side.
 */
export async function claimTask(params: {
  suiTaskId: string
  validatorAddress: string
  validatorPrivKeyHex: string  // ephemeral key from zkLogin session; MVP: use deployer key
}): Promise<{ txHash: string }> {
  if (params.validatorPrivKeyHex === process.env.GREENPROOF_DEPLOYER_PRIVATE_KEY) {
    console.warn('[sui.service] WARNING: using deployer key as validator proxy — replace with session key in production')
  }

  const client = getClient()
  const deployerKeypair = getDeployerKeypair()
  const validatorKeypair = Ed25519Keypair.fromSecretKey(Buffer.from(params.validatorPrivKeyHex, 'hex'))

  const tx = new TransactionBlock()
  tx.moveCall({
    target: `${PACKAGE_ID}::task_registry::claim_task`,
    arguments: [tx.object(params.suiTaskId)],
  })
  tx.setSender(params.validatorAddress)
  tx.setGasOwner(deployerAddress())

  const bytes = await tx.build({ client })
  const validatorSig = (await validatorKeypair.signTransactionBlock(bytes)).signature
  const sponsorSig = (await deployerKeypair.signTransactionBlock(bytes)).signature

  const result = await client.executeTransactionBlock({
    transactionBlock: bytes,
    signature: [validatorSig, sponsorSig],
    options: { showEffects: true },
  })
  if (result.effects?.status.status !== 'success') {
    throw new Error(`claimTask tx failed: ${result.effects?.status.error ?? 'unknown'}`)
  }
  return { txHash: result.digest }
}

/**
 * Submits validation evidence on-chain (blob_id + diagnosis).
 * Backend-sponsored transaction: deployer pays gas.
 */
export async function submitValidationOnChain(params: {
  suiTaskId: string
  blobId: string
  diagnosis: string
  validatorAddress: string
  validatorPrivKeyHex: string
}): Promise<{ txHash: string }> {
  if (params.validatorPrivKeyHex === process.env.GREENPROOF_DEPLOYER_PRIVATE_KEY) {
    console.warn('[sui.service] WARNING: using deployer key as validator proxy — replace with session key in production')
  }

  const client = getClient()
  const deployerKeypair = getDeployerKeypair()
  const validatorKeypair = Ed25519Keypair.fromSecretKey(Buffer.from(params.validatorPrivKeyHex, 'hex'))

  const tx = new TransactionBlock()
  tx.moveCall({
    target: `${PACKAGE_ID}::task_registry::submit_validation`,
    arguments: [
      tx.object(params.suiTaskId),
      tx.pure(params.blobId),
      tx.pure(params.diagnosis),
    ],
  })
  tx.setSender(params.validatorAddress)
  tx.setGasOwner(deployerAddress())

  const bytes = await tx.build({ client })
  const validatorSig = (await validatorKeypair.signTransactionBlock(bytes)).signature
  const sponsorSig = (await deployerKeypair.signTransactionBlock(bytes)).signature

  const result = await client.executeTransactionBlock({
    transactionBlock: bytes,
    signature: [validatorSig, sponsorSig],
    options: { showEffects: true },
  })
  if (result.effects?.status.status !== 'success') {
    throw new Error(`submitValidation tx failed: ${result.effects?.status.error ?? 'unknown'}`)
  }
  return { txHash: result.digest }
}

/**
 * Releases escrow reward to validator after QC pass or agronomist verdict.
 * Deployer-only: extracts coin from task escrow and transfers to validator.
 */
export async function releaseReward(params: {
  suiTaskId: string
  validatorAddress: string
}): Promise<{ txHash: string }> {
  const tx = new TransactionBlock()
  const [coin] = tx.moveCall({
    target: `${PACKAGE_ID}::task_registry::release_reward`,
    arguments: [
      tx.object(params.suiTaskId),
      tx.pure(params.validatorAddress),
    ],
  })
  // Transfer the returned CompanyToken to the validator's wallet
  tx.transferObjects([coin], tx.pure(params.validatorAddress))

  const result = await executeAdmin(tx)
  return { txHash: result.digest }
}

/**
 * Flags a task on-chain. Called after LLM quality gate returns FLAG_FOR_REVIEW.
 */
export async function flagTaskOnChain(
  suiTaskId: string,
  reason: string
): Promise<{ txHash: string }> {
  const tx = new TransactionBlock()
  tx.moveCall({
    target: `${PACKAGE_ID}::task_registry::flag_task`,
    arguments: [tx.object(suiTaskId), tx.pure(reason)],
  })
  const result = await executeAdmin(tx)
  return { txHash: result.digest }
}

/**
 * Creates a ValidatorReputation shared object for a newly registered validator.
 */
export async function createReputation(params: {
  companyId: string
  validatorAddress: string
}): Promise<{ reputationId: string; txHash: string }> {
  const tx = new TransactionBlock()
  tx.moveCall({
    target: `${PACKAGE_ID}::reward_engine::create_reputation`,
    arguments: [tx.pure(params.companyId), tx.pure(params.validatorAddress)],
  })
  const result = await executeAdmin(tx)
  const created = (result.objectChanges ?? []).find(
    c => c.type === 'created' && c.objectType?.includes('ValidatorReputation')
  )
  // reputationId may be undefined if chain didn't return it — treat as optional
  const reputationId = (created?.type === 'created' ? created.objectId : undefined) ?? ''
  return { reputationId, txHash: result.digest }
}
