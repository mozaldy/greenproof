# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Commands

```bash
# Install all dependencies
pnpm install

# Run all apps in dev mode
pnpm dev

# Run a single app
pnpm --filter @greenproof/dashboard dev   # port 3000
pnpm --filter @greenproof/mitra dev       # port 3002
pnpm --filter @greenproof/api dev         # port 3001

# Build everything (respects Turborepo dependency order)
pnpm build

# Type-check all packages
pnpm type-check

# Prisma
pnpm db:generate        # regenerate Prisma client after schema changes
pnpm db:migrate         # run migrations in dev (creates migration files)
pnpm --filter @greenproof/db run db:migrate:deploy   # production
pnpm --filter @greenproof/db run db:studio           # Prisma Studio GUI
pnpm --filter @greenproof/db run db:seed             # seed demo data

# Add shadcn/ui component to dashboard or mitra
pnpm --filter @greenproof/dashboard dlx shadcn-ui@latest add button
pnpm --filter @greenproof/mitra dlx shadcn-ui@latest add button
```

## Project Status

The monorepo scaffold is in place. Planning documents are in `greenproof_concept.md` and `GreenProof_TechSpec.docx` (the authoritative source for all implementation details).

## What GreenProof Is

A SaaS B2B2C platform (DePIN category) that pays field validators to verify agricultural drone data. Plantation companies publish verification tasks to a SUI blockchain smart contract; field workers complete tasks with photo evidence stored on Walrus; smart contracts auto-distribute token rewards.

**Core principle:** GreenProof never touches company data. Validation photos go directly to Walrus (decentralized, immutable storage), encrypted via Seal. Only the company and the GreenProof smart contract have access by default.

## Tech Stack

- **Blockchain:** SUI (with zkLogin so users log in via Google — no wallet UX)
- **Storage:** Walrus (immutable decentralized photo storage)
- **Access Control:** Seal (encrypts Walrus data, company controls who can read)
- **Smart Contracts:** SUI Move language
- **Backend:** Node.js REST API
- **Frontend:** Web-based (responsive mobile-first for the Field Partner App)
- **Auth:** Google OAuth + SUI zkLogin
- **AI/LLM:** LLM for MVP (drone anomaly simulation + quality gate); replaced by CV models post-hackathon
- **Gas:** GreenProof sponsors transactions via sponsored transactions (users never pay gas)

## Architecture: Three Main Interfaces

### 1. Company Dashboard (Web)
For Operator and Supervisor roles. Key features:
- Publish tasks (input coordinates, validation type, token reward value)
- Manage validators (register, assign initial level, deactivate)
- LLM-powered drone anomaly simulator (generates realistic anomaly lists as task sources)
- Monitor all tasks: status, who's working, proof photos, submitted diagnoses
- Configure AI model mode (Mode A: bring-your-own model, Mode B: use GreenProof's model)
- View Seal access logs and revoke access

### 2. Agronomist Dashboard (Web)
For Agronomis role. Key features:
- Queue of flagged cases (high validator disagreement or low LLM confidence)
- Review proof photos from Walrus + all submitted diagnoses for a case
- Submit final verdict with reasoning (becomes highest-value training data)
- Review history

### 3. Field Partner App (Mobile Web — no install required)
For Mitra Validator roles. Key features:
- Google login via zkLogin
- GPS-based task discovery (filtered by validator level)
- Accept task → navigate → capture photo → submit diagnosis form
- Photo uploads directly to Walrus with Seal encryption
- LLM quality gate verifies photo/diagnosis consistency
- View incoming token rewards and level progress

## Supporting Backend Components

- **SUI Smart Contract:** Task registry, claim logic, verification, token minting, immutable audit trail
- **Node.js API:** Connects all three interfaces, handles LLM integration, sponsored transactions, orchestration
- **LLM layer:** (1) Drone anomaly simulator for demo — generates realistic anomaly lists; (2) Quality gate — verifies photo and diagnosis are consistent before token issuance

## Role & Access Model

| Role | Interface | Key Capability |
|---|---|---|
| Admin GreenProof | Dashboard (cross-client) | Platform ops — no access to company photos (Seal-blocked) |
| Operator | Company Dashboard | Publish tasks, manage validators, configure AI/Seal |
| Supervisor | Company Dashboard | Approve critical tasks, review flags (read + approve only) |
| Agronomis | Agronomist Dashboard | Verdict on flagged cases |
| Field Observer (L1) | Field App | Basic tasks (counting, general condition); 1x reward |
| Field Analyst (L2) | Field App | + Health diagnosis, semi-critical anomalies; 1.5x reward |
| Field Expert (L3) | Field App | All task types; 2x reward; 2x cross-validation weight |

Level-up thresholds: L1→L2 requires 50 tasks + >75% accuracy. L2→L3 requires 200 tasks + >85% accuracy + 3 months consistency.

## MVP Scope (Hackathon)

**Must build end-to-end:**
1. Company Dashboard (task creation, validator management, drone simulator, monitoring)
2. Agronomist Dashboard (flagged case queue, verdict submission)
3. Field Partner App (task discovery via GPS, photo capture, submission, reward display)
4. SUI smart contract (task registry, claim, verification, token mint)
5. Node.js backend API
6. Walrus + Seal integration
7. LLM integration (anomaly simulator + quality gate)

**Deferred to post-hackathon:**
- Admin GreenProof Dashboard (use scripts/CLI for demo)
- Specialized CV models (LLM placeholder)
- Automated level-up calculation (manual assignment OK for demo)
- Real drone platform integration
- Token redemption catalog

## Data Sovereignty Architecture

- Companies upload **only task requests** to the smart contract — not raw drone data
- Validation photos go **directly** to Walrus from the Field App (never through GreenProof servers)
- Seal policy: default access = company + GreenProof smart contract only
- Mode B (use GreenProof AI): company explicitly grants additional Seal access to AI service; full audit log available and revocable anytime

## Legal Context (Indonesia)

Tokens are classified as closed-loop digital vouchers (not crypto assets). POJK No. 27 Tahun 2024 explicitly exempts closed-loop tokens from OJK crypto regulation. Tokens cannot be traded on exchanges or converted to Rupiah — redeemable only within company-defined benefit catalogs.
