# Scripts

CLI helpers for GreenProof operations. Run directly via `npx tsx`.

## Setup

```bash
cp apps/api/.env.example apps/api/.env
# Fill in GREENPROOF_DEPLOYER_PRIVATE_KEY, DATABASE_URL, etc.
pnpm install
```

## Deploy Contracts

```bash
npx tsx scripts/deploy.ts
```

Requires `GREENPROOF_DEPLOYER_PRIVATE_KEY` in `apps/api/.env`. Writes `contracts/deployed.json` with all object IDs.

## Seed Demo Data

```bash
npx tsx scripts/seed.ts
```

Creates demo company (PTPN), 5 validators, and 7 tasks. Reads `contracts/deployed.json` if available to populate on-chain IDs.

---

## API Curl Examples

Start the API first:

```bash
MOCK_WALRUS=true MOCK_SEAL=true MOCK_LLM=true pnpm --filter @greenproof/api dev
```

### Health check

```bash
curl http://localhost:3001/health
```

### Onboard a company (no auth required)

```bash
curl -s -X POST http://localhost:3001/api/v1/onboarding/company \
  -H "Content-Type: application/json" \
  -d '{
    "companyName": "PT Demo Sawit",
    "tokenName": "Demo Token",
    "tokenSymbol": "DEMO",
    "operatorEmail": "operator@demo.com",
    "operatorName": "Operator Demo",
    "aiMode": "B"
  }' | jq .
# Save the returned "token" as TOKEN=...
```

### Authenticate

```bash
TOKEN="<token from onboarding response>"
```

### List tasks

```bash
curl http://localhost:3001/api/v1/tasks \
  -H "Authorization: Bearer $TOKEN" | jq .
```

### Create a task (draft)

```bash
curl -s -X POST http://localhost:3001/api/v1/tasks \
  -H "Authorization: Bearer $TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "title": "Deteksi Ganoderma Blok A1",
    "taskType": "ANOMALY_CRITICAL",
    "lat": -2.185,
    "lng": 114.235,
    "blok": "A1",
    "estate": "Kapuas Barat",
    "rewardAmount": 150,
    "publish": false
  }' | jq .
```

### Generate drone anomalies (simulator)

```bash
curl -s -X POST http://localhost:3001/api/v1/simulator/generate \
  -H "Authorization: Bearer $TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "estate": "Kapuas Barat",
    "blockIds": ["KB-A1", "KB-A2", "KB-B1"],
    "count": 5,
    "includeKritikal": true
  }' | jq .
```

### Treasury overview

```bash
curl http://localhost:3001/api/v1/treasury \
  -H "Authorization: Bearer $TOKEN" | jq .
```

### Audit log

```bash
curl http://localhost:3001/api/v1/audit \
  -H "Authorization: Bearer $TOKEN" | jq .
```

### Verifier queue (flagged submissions)

```bash
curl http://localhost:3001/api/v1/verifier/queue \
  -H "Authorization: Bearer $TOKEN" | jq .
```

### Submit a verdict

```bash
curl -s -X POST http://localhost:3001/api/v1/verifier/verdict \
  -H "Authorization: Bearer $TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "submissionId": "<submission-id>",
    "verdict": "CONFIRMED",
    "notes": "Foto jelas, diagnosis sesuai gejala lapangan.",
    "isTrainingData": true
  }' | jq .
```
