/**
 * @greenproof/sui-client
 *
 * Wrapper around @mysten/sui.js for GreenProof-specific blockchain operations.
 * Handles sponsored transactions and zkLogin flows.
 *
 * See TechSpec Section 4 (Smart Contract Interface) and Section 9 (zkLogin + Sponsored Tx).
 */

// Re-export SUI primitives needed across apps
export { SuiClient, getFullnodeUrl } from '@mysten/sui.js/client'
export { TransactionBlock } from '@mysten/sui.js/transactions'
export { Ed25519Keypair } from '@mysten/sui.js/keypairs/ed25519'

// Re-export Walrus HTTP client
export * from './walrus'

// TODO: Implement after Move contracts are deployed
// export { publishTask }     from './task-registry'
// export { claimTask }       from './task-registry'
// export { confirmSubmission } from './task-registry'
// export { mintReward }      from './validator-token'
// export { sponsoredClaim }  from './sponsored-tx'
// export { deriveZkLoginAddress } from './zklogin'
