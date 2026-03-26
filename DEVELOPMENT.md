# GreenProof Backend MVP — Development Summary

## What Was Built

This document describes every file created or modified during the backend MVP implementation sprint.

---

## 1. Smart Contracts (SUI Move)

### `contracts/sources/task_registry.move` — Bug Fix
**Fix:** Added missing `const E_INSUFFICIENT_BALANCE: u64 = 4;` to the error constants block.
The constant was referenced on line ~70 (`validator_token::value(&coin) == reward_amount`) but never declared, causing a compile failure.

**Error constants block after fix:**
```move
const E_NOT_AUTHORIZED: u64 = 1;
const E_INVALID_STATUS: u64 = 2;
const E_INSUFFICIENT_LEVEL: u64 = 3;
const E_INSUFFICIENT_BALANCE: u64 = 4;
```

**Existing contracts (unchanged, already implemented):**
- `contracts/sources/validator_token.move` — `GreenproofAdminCap`, `CompanyTreasuryCap`, `CompanyToken`; mint/split/join/burn operations
- `contracts/sources/reward_engine.move` — `ValidatorReputation`; accuracy scoring, auto-promotion at L1→L2 (50 tasks, 75% accuracy) and L2→L3 (200 tasks, 85% accuracy)
- `contracts/sources/task_registry.move` — `TaskRegistry`, `Task`, `Submission`; claim/submit/release/flag flow

---

## 2. Database Schema (Prisma)

### `packages/db/prisma/schema.prisma` — Additive Migration Only

**New fields added to `Company`:**
| Field | Type | Purpose |
|-------|------|---------|
| `tokenSymbol` | `String?` | e.g. "PTPN" |
| `tokenName` | `String?` | e.g. "PTPN GreenProof Token" |
| `contractAddress` | `String?` | SUI package ID |
| `treasuryCapId` | `String?` | CompanyTreasuryCap object ID on-chain |
| `taskRegistryId` | `String?` | TaskRegistry object ID on-chain |

**New fields added to `Task`:**
| Field | Type | Purpose |
|-------|------|---------|
| `suiTaskId` | `String? @unique` | Canonical on-chain Task object ID |
| `lat` / `lng` | `Float?` | GPS coordinates |
| `blok` | `String?` | Block identifier (e.g. "KB-C3") |
| `estate` | `String?` | Estate name (e.g. "Kapuas Barat") |
| `txHash` | `String?` | On-chain publish transaction digest |
| `createdByUserId` | `String?` | User who created the task |

**New models:**

`Validator` — Field partner registered per company
```
id, companyId, name, phone?, suiAddress? @unique, level (1-3), isActive, createdAt
```

`SealAccessLog` — Audit trail for Seal policy grants/revokes
```
id, companyId, policyId, grantedTo, action (GRANT|REVOKE), service?, blobCount, purpose?, createdAt
```

`AuditLog` — General audit trail for all significant actions
```
id, companyId?, actorId?, actorName?, action, entityType, entityId?, estate?, txHash?, metadata Json?, createdAt
```

**Migration file:** `packages/db/prisma/migrations/20260326000000_add_blockchain_fields/migration.sql`
All `ALTER TABLE` statements use `IF NOT EXISTS`. FK constraints wrapped in idempotent `DO $$ BEGIN ... EXCEPTION WHEN duplicate_object THEN NULL; END $$;` blocks.

---

## 3. packages/sui-client

### `packages/sui-client/src/walrus.ts` — NEW
Walrus decentralized storage HTTP client.

**Exports:**
- `uploadToWalrus(data: Buffer, mimeType: string): Promise<WalrusUploadResult>` — PUT to publisher, handles both `newlyCreated` and `alreadyCertified` response shapes, 3 retries with 1s/2s backoff
- `retrieveFromWalrus(blobId: string): Promise<Buffer>` — GET from aggregator
- `verifyBlobExists(blobId: string): Promise<boolean>` — HEAD check

**Mock mode:** Set `MOCK_WALRUS=true` to write/read blobs from `/tmp/greenproof-walrus/` (no network needed for dev/test).

**Env vars:**
```
WALRUS_PUBLISHER_URL  (default: https://publisher.walrus-testnet.walrus.space)
WALRUS_AGGREGATOR_URL (default: https://aggregator.walrus-testnet.walrus.space)
WALRUS_EPOCHS         (default: 5)
MOCK_WALRUS           (default: false)
```

### `packages/sui-client/src/seal.ts` — NEW
Seal access control HTTP abstraction. There is no `@mysten/seal` npm package; this is a custom HTTP client that falls back to mock when `SEAL_SERVICE_URL` is unset.

**Exports:**
- `createSealPolicy(ownerAddresses: string[]): Promise<{ policyId: string }>`
- `grantSealAccess(policyId, address): Promise<void>`
- `revokeSealAccess(policyId, address): Promise<void>`
- `getSealAccessLog(policyId): Promise<Array<{address, grantedAt}>>`
- `encryptForPolicy(data: Buffer, policyId: string): Promise<Buffer>`
- `decryptFromPolicy(data: Buffer, policyId: string): Promise<Buffer>`

**Mock mode:** Automatically active when `SEAL_SERVICE_URL` is unset or `MOCK_SEAL=true`. Mock encrypt/decrypt are identity operations (data passes through unchanged).

### `packages/sui-client/src/index.ts` — Updated
Added `export * from './walrus'` and `export * from './seal'`.

---

## 4. apps/api — Services

### `apps/api/src/lib/prisma.ts` — NEW
Prisma singleton to avoid multiple connection pools.
```typescript
export const prisma: PrismaClient = new PrismaClient()
```

### `apps/api/src/services/sui.service.ts` — NEW
Wraps all SUI Move contract calls using `@mysten/sui.js@0.54.1` (TransactionBlock API).

**Key design decisions:**
- Module-level lazy singletons for `SuiClient` and `Ed25519Keypair` (created once on first use)
- All deployer-signed transactions use `signAndExecuteTransactionBlock`
- Sponsored transactions (claim, submit) use dual-signature pattern: validator signs intent, deployer signs as gas owner
- Coordinates encoded as `Array.from(Buffer.from(JSON.stringify({ lat, lng })))` for Move `vector<u8>`

**Exported functions:**
| Function | Move call | Returns |
|----------|-----------|---------|
| `createCompanyToken(params)` | `validator_token::create_company_token` | `{ treasuryCapId, txHash }` |
| `createTaskRegistry(companyId)` | `task_registry::create_registry` | `{ registryId, txHash }` |
| `createOnChainTask(params)` | mint + `task_registry::create_task` (single PTB) | `{ suiTaskId, txHash }` |
| `claimTask(params)` | `task_registry::claim_task` (sponsored) | `{ txHash }` |
| `submitValidationOnChain(params)` | `task_registry::submit_validation` (sponsored) | `{ txHash }` |
| `releaseReward(params)` | `task_registry::release_reward` + transferObjects | `{ txHash }` |
| `flagTaskOnChain(suiTaskId, reason)` | `task_registry::flag_task` | `{ txHash }` |
| `createReputation(params)` | `reward_engine::create_reputation` | `{ reputationId, txHash }` |
| `validateSuiEnv()` | — | throws if env vars missing |

### `apps/api/src/services/walrus.service.ts` — NEW
Thin wrapper around `@greenproof/sui-client` walrus functions:
- `uploadPhoto(buffer, mimeType)` → `WalrusUploadResult`
- `fetchPhoto(blobId)` → `Buffer`
- `blobExists(blobId)` → `boolean`

### `apps/api/src/services/seal.service.ts` — NEW
- `provisionCompanyPolicy(params)` — creates Seal policy with company + contract + optional AI service addresses; writes `SealAccessLog` row
- `toggleAiAccess(params)` — grants/revokes AI service address on Seal policy; writes `SealAccessLog` row
- `encryptPhoto(data, policyId)` — wraps `encryptForPolicy`

### `apps/api/src/services/token.service.ts` — NEW
- `calculateReward(baseAmount, validatorLevel)` — applies multiplier from `@greenproof/shared` (L1=1x, L2=1.5x, L3=2x)

### `apps/api/src/services/llm.service.ts` — NEW
Uses `@anthropic-ai/sdk`. Client is initialized lazily (not at module load) so `MOCK_LLM=true` never requires `ANTHROPIC_API_KEY`.

**`runQualityGate(params)`** — Vision QC using `claude-3-5-sonnet-20240620`
- Accepts up to 3 base64 photos + diagnosis text + GPS distance
- Returns `QualityGateResult`: `{ qualityScore, isConsistent, hasRelevantContent, flags, reasoning, recommendedAction }`
- `recommendedAction`: `APPROVE` | `FLAG_FOR_REVIEW` | `REJECT`
- Flags: `GPS_TOO_FAR` | `PHOTO_IRRELEVANT` | `DIAGNOSIS_INCONSISTENT` | `INCOMPLETE_COVERAGE`

**`simulateAnomalies(params)`** — Drone anomaly simulation using `claude-3-haiku-20240307`
- Generates `count` realistic palm oil anomaly detections for a given estate + block list
- Returns `DroneAnomaly[]`: `{ anomalyType, severity, lat, lng, description, suggestedTaskType, confidence }`

---

## 5. apps/api — Middleware

### `apps/api/src/middleware/auth.ts` — NEW
- `requireAuth` — validates `Authorization: Bearer <jwt>`, attaches decoded payload to `req.auth`
- `requireRole(...roles)` — factory, returns middleware that 403s if `req.auth.role` not in list
- `issueToken(payload)` — signs JWT with `JWT_SECRET` (falls back to `'dev-secret-change-me'` if unset)
- `AuthPayload` type: `{ userId, companyId?, role, suiAddress? }`

### `apps/api/src/middleware/error.ts` — NEW
Global Express error handler (must be last `app.use()`).
- `ZodError` → 400 with per-field details
- `PrismaClientKnownRequestError P2025` → 404
- `PrismaClientKnownRequestError P2002` → 409 (duplicate)
- Everything else → 500 (stack trace shown only in `NODE_ENV=development`)

---

## 6. apps/api — Routes

### `apps/api/src/routes/onboarding.ts` — NEW
Mounted at `/api/v1`

| Method | Path | Auth | Description |
|--------|------|------|-------------|
| POST | `/onboarding/company` | None | Onboard company: SUI token + registry + Seal policy + DB row + JWT |
| GET | `/me` | Required | Current user + company |

**Onboarding flow:**
1. Validate unique `tokenSymbol`
2. `suiService.createCompanyToken` — creates `CompanyTreasuryCap` on-chain
3. `suiService.createTaskRegistry` — creates `TaskRegistry` shared object
4. `sealService.provisionCompanyPolicy` — non-blocking (failure is logged, not fatal)
5. `prisma.company.create` + `prisma.user.create` (OPERATOR role)
6. `prisma.auditLog.create`
7. Return JWT + all IDs

### `apps/api/src/routes/tasks.ts` — NEW
Mounted at `/api/v1/tasks` (all endpoints require auth)

| Method | Path | Role | Description |
|--------|------|------|-------------|
| GET | `/` | Any | Paginated list (filters: status, estate, search) |
| GET | `/:id` | Any | Task detail with submissions |
| POST | `/` | OPERATOR, SUPERVISOR | Create task (DRAFT or publish immediately) |
| PATCH | `/:id/publish` | OPERATOR | Publish DRAFT task on-chain |
| PATCH | `/:id/claim` | Any | Claim task (sets IN_PROGRESS) |

### `apps/api/src/routes/submissions.ts` — NEW
Mounted at `/api/v1`

| Method | Path | Auth | Description |
|--------|------|------|-------------|
| POST | `/tasks/:id/submit` | Required | Submit photo evidence (multipart/form-data) |
| GET | `/submissions/:id` | Required | Submission detail |

**Submit flow:**
1. GPS distance check (max `GPS_MAX_DISTANCE_M` from task center)
2. Seal-encrypt each photo (if company has `sealPolicyId`)
3. Upload each photo to Walrus
4. Submit first blob on-chain via `suiService.submitValidationOnChain`
5. Save `Submission` row (status: `PENDING`)
6. `setImmediate(() => runAsyncQc(submissionId))` — non-blocking
7. Return 201 with `submissionId + blobIds + txHash`

**Async QC (`runAsyncQc`):**
- Sets status → `LLM_CHECKING`
- Fetches up to 3 photos from Walrus
- Calls `llmService.runQualityGate`
- `APPROVE` → `releaseReward` on-chain → `VERIFIED` + `COMPLETED` + AuditLog
- `FLAG_FOR_REVIEW` → `flagTaskOnChain` → `FLAGGED` + AuditLog
- `REJECT` → `REJECTED`
- Error → resets to `PENDING`

### `apps/api/src/routes/validators.ts` — NEW
Mounted at `/api/v1/validators`

| Method | Path | Role | Description |
|--------|------|------|-------------|
| GET | `/` | Any | List validators for company |
| POST | `/` | OPERATOR | Create validator (+ optional on-chain reputation) |
| PATCH | `/:id` | OPERATOR | Update level / isActive |

### `apps/api/src/routes/simulator.ts` — NEW
Mounted at `/api/v1/simulator`

| Method | Path | Role | Description |
|--------|------|------|-------------|
| POST | `/generate` | OPERATOR, SUPERVISOR | LLM generates anomaly list → AnomalyLog |
| POST | `/create-tasks` | OPERATOR, SUPERVISOR | Convert AnomalyLog → DRAFT Tasks |

### `apps/api/src/routes/treasury.ts` — NEW
Mounted at `/api/v1/treasury`

| Method | Path | Auth | Description |
|--------|------|------|-------------|
| GET | `/` | Required | Token summary: distributed total, locked in escrow, recent transactions |

### `apps/api/src/routes/audit.ts` — NEW
Mounted at `/api/v1/audit`

| Method | Path | Auth | Description |
|--------|------|------|-------------|
| GET | `/` | Required | Paginated AuditLog (filter: type, estate) |
| GET | `/seal` | Required | SealAccessLog for company |

### `apps/api/src/routes/config.ts` — NEW
Mounted at `/api/v1/config`

| Method | Path | Role | Description |
|--------|------|------|-------------|
| GET | `/` | Any | Company AI mode + Seal policy info |
| PATCH | `/ai-mode` | OPERATOR | Toggle AI mode A/B (updates Seal grant) |

### `apps/api/src/routes/verifier.ts` — NEW
Mounted at `/api/v1/verifier`

| Method | Path | Role | Description |
|--------|------|------|-------------|
| GET | `/queue` | AGRONOMIS, SUPERVISOR, OPERATOR | Flagged submissions without verdict |
| POST | `/verdict` | AGRONOMIS, SUPERVISOR, OPERATOR | Submit verdict (CONFIRMED/REJECTED/INCONCLUSIVE) |

**Verdict flow:**
- `CONFIRMED` → `releaseReward` on-chain → submission `REWARDED` → task `COMPLETED`
- `REJECTED` → submission `REJECTED` → task back to `PUBLISHED`
- Either → writes AuditLog

### `apps/api/src/app.ts` — Updated
Mounts all routers in correct order. `errorHandler` is last.

```
GET  /health
POST /api/v1/onboarding/company
GET  /api/v1/me
GET  /api/v1/tasks
POST /api/v1/tasks
...
POST /api/v1/tasks/:id/submit
GET  /api/v1/submissions/:id
GET  /api/v1/validators
POST /api/v1/validators
...
POST /api/v1/simulator/generate
POST /api/v1/simulator/create-tasks
GET  /api/v1/treasury
GET  /api/v1/audit
GET  /api/v1/audit/seal
GET  /api/v1/config
PATCH /api/v1/config/ai-mode
GET  /api/v1/verifier/queue
POST /api/v1/verifier/verdict
```

---

## 7. Scripts

### `scripts/deploy.ts` — Rewritten
Reads `GREENPROOF_DEPLOYER_PRIVATE_KEY` from `apps/api/.env`. Steps:
1. Build contracts via `sui move build --dump-bytecode-as-base64`
2. Publish package → extract `packageId` + `adminCapId`
3. Call `create_company_token` for demo company "PT Nusantara Agro Lestari" / "PTPN"
4. Call `create_registry` for demo company
5. Write `contracts/deployed.json` with all object IDs

### `scripts/seed.ts` — NEW
Seeds demo data. Reads `contracts/deployed.json` if available to populate on-chain IDs.
- 1 company: PT Nusantara Agro Lestari (PTPN)
- 5 validators: 1× L3, 2× L2, 2× L1
- 7 tasks across 3 estates (Kapuas Barat, Kapuas Timur, Mentaya) in various statuses

### `apps/api/.env.example` — NEW
Template for all required environment variables with comments.

### `scripts/README.md` — Updated
Curl examples for all main API flows.

---

## Environment Variables

| Variable | Required | Description |
|----------|----------|-------------|
| `GREENPROOF_DEPLOYER_PRIVATE_KEY` | Yes (deploy) | Hex-encoded Ed25519 private key |
| `GREENPROOF_PACKAGE_ID` | Yes (API) | Set after deploy |
| `GREENPROOF_ADMIN_CAP_ID` | Yes (API) | Set after deploy |
| `GREENPROOF_SERVICE_ADDRESS` | Optional | Deployer SUI address |
| `DATABASE_URL` | Yes | PostgreSQL connection string |
| `JWT_SECRET` | Yes | JWT signing secret |
| `ANTHROPIC_API_KEY` | Yes (if `MOCK_LLM=false`) | Anthropic API key |
| `WALRUS_PUBLISHER_URL` | No | Defaults to testnet |
| `WALRUS_AGGREGATOR_URL` | No | Defaults to testnet |
| `MOCK_WALRUS` | No | `true` = use local filesystem |
| `SEAL_SERVICE_URL` | No | Unset = mock mode |
| `MOCK_SEAL` | No | `true` = force mock |
| `MOCK_LLM` | No | `true` = skip Anthropic calls |

---

## Quick Start

```bash
# 1. Copy and fill env file
cp apps/api/.env.example apps/api/.env

# 2. Install dependencies
pnpm install

# 3. Run DB migration
pnpm db:migrate

# 4. Generate Prisma client
pnpm db:generate

# 5. Seed demo data (optional)
npx tsx scripts/seed.ts

# 6. Start API (all mocks enabled)
MOCK_WALRUS=true MOCK_SEAL=true MOCK_LLM=true pnpm --filter @greenproof/api dev

# 7. Health check
curl http://localhost:3001/health

# 8. To deploy contracts to testnet (requires wallet key)
npx tsx scripts/deploy.ts
```

---

## Architecture Decisions

**Why no `@mysten/seal` package?**
No such npm package exists. Seal is implemented as a custom HTTP client pointing to `SEAL_SERVICE_URL`. All functions gracefully mock when the URL is unset.

**Why `setImmediate` for LLM QC?**
Fire-and-forget async QC keeps the submission endpoint fast (< 2s response). A message queue (Bull, SQS) would be more robust but is out of scope for MVP.

**Why deployer key as proxy for sponsored transactions?**
For MVP, the backend holds the deployer key and sponsors all transactions. In production, each validator would have an ephemeral session keypair generated server-side at login (zkLogin integration).

**Why `@mysten/sui.js@0.54.1` not newer `@mysten/sui`?**
The monorepo already pins this version. `TransactionBlock` (not `Transaction`) and `signAndExecuteTransactionBlock` (not `signAndExecuteTransaction`) are the correct APIs for this version.
