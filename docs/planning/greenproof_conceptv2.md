# GreenProof: Ground Truth Validation Network for Palm Oil Plantations
## A Decentralized Physical Infrastructure Network (DePIN) on SUI Blockchain

**Document Type:** System Design Synthesis  
**Status:** Hackathon POC — Architecture Finalized  
**Prepared from:** Internal brainstorming and design session synthesis

---

## 1. PROBLEM STATEMENT

### 1.1 Industry Context

The Indonesian palm oil industry, one of the largest in the world, is undergoing a technological transformation. Medium-to-large plantation corporations have begun adopting unmanned aerial vehicles (drones) equipped with RGB and multispectral sensors, combined with AI-based inference systems, to monitor plantation health at scale. A single drone flight can scan thousands of hectares in a matter of hours, generating anomaly maps that identify potentially diseased trees, drainage problems, pest infestations, and nutritional deficiencies at coordinate-level precision.

Despite this capability, the adoption of drone AI has not translated into proportional operational efficiency gains. The root cause is not technological — it is structural.

### 1.2 The Structural Gap

Drone AI systems operate at confidence levels of 70–90%. The remaining 10–30% represents cases where the system either cannot confidently classify an anomaly or produces classifications that require human verification before any remediation action can be taken. In large-scale plantations spanning tens of thousands of hectares, this uncertainty translates into hundreds of unverified anomaly points per flight cycle.

The conventional response — dispatching inspection teams manually — is expensive, slow, and unstructured. No system exists to efficiently coordinate human verification at scale, assign accountability to individual field workers, or ensure that the resulting verification data is recorded in a tamper-resistant and auditable manner.

Simultaneously, a profound information asymmetry persists at the field level. Experienced field workers, plasma farmers, and local agricultural laborers possess tacit knowledge — the ability to identify Ganoderma from soil odor, recognize historical anomaly patterns in specific blocks, or distinguish pest damage by texture — that has no channel into any formal data system. This knowledge is lost when workers rotate, retire, or disengage.

### 1.3 Stakeholders

**Primary stakeholders with direct problems:**
- **Plantation corporations** (medium-to-large scale): have invested in drone and AI infrastructure but cannot fully leverage it without structured ground truth verification
- **Field validators** (plantation employees, plasma farmers, registered local workers): possess valuable knowledge but have no mechanism for individual recognition or proportional compensation
- **Agronomists and domain experts**: handle high-stakes diagnostic decisions but are bottlenecked by the absence of triage systems that distinguish routine from critical cases

**Secondary stakeholders:**
- **AI/drone vendors**: whose model accuracy depends on labeled ground truth data
- **GreenProof** (platform operator): provides the infrastructure connecting all parties

### 1.4 Why This Problem Matters

The combination of unverified drone data and unrecognized field expertise creates compounding inefficiencies: plantation companies cannot act decisively on drone output, field workers have no incentive to contribute quality data, and AI models cannot improve without verified training data. The result is a cycle of declining trust in technology-driven agriculture, with measurable impact on crop yield and disease containment outcomes.

---

## 2. PROBLEM DEFINITION

### 2.1 Component Breakdown

**Problem A — Verification Gap**
Drone AI anomaly maps cannot be acted upon without field verification. The current process of manual team dispatch is: (a) not systematically coordinated, (b) not tracked at the individual contribution level, (c) not integrated with the AI feedback loop.

**Problem B — Incentive Misalignment**
Field workers performing verification receive flat compensation regardless of quality or quantity of contribution. This creates no incentive for accuracy, timeliness, or volume. High-performing validators are indistinguishable from low-performing ones in any existing HR or operational system.

**Problem C — Data Integrity and Trust**
Reports submitted through conventional hierarchical channels (field worker → foreman → manager) are subject to filtering and manipulation at each layer. There is no mechanism for plantation management to verify that a report accurately reflects what was observed at a specific GPS coordinate at a specific time.

**Problem D — Knowledge Capture and Loss**
Tacit knowledge held by senior field workers and plasma farmers has no structured pathway into operational or AI training systems. When these individuals leave the workforce, their knowledge is irrecoverably lost.

**Problem E — Data Sovereignty Concern**
Plantation corporations are reluctant to adopt third-party platforms because doing so typically requires sharing sensitive operational data — lahan coordinates, productivity figures, disease prevalence maps — with a platform operator who could potentially expose it to competitors or misuse it.

### 2.2 Constraints and Limitations

- Field validators often operate in areas with weak or intermittent mobile network connectivity
- Many field validators have minimal digital literacy and no prior experience with blockchain or digital wallets
- Indonesian regulatory frameworks for digital tokens (POJK No. 27 Tahun 2024) require that validator reward tokens be closed-loop and non-transferable to external markets
- Drone integration at the POC stage is not feasible — drone output must be simulated
- The platform must operate as a SaaS product, meaning plantation companies require zero development effort to adopt it

### 2.3 Assumptions

- **Assumption 1**: Plantation companies are willing to pay a subscription fee if the platform demonstrably improves the actionability of drone investment without requiring them to share raw drone data.
- **Assumption 2**: Field validators are motivated by tangible, near-immediate rewards rather than deferred or abstract incentives.
- **Assumption 3**: Plasma farmers whose land borders corporate estates are the most natural validator pool due to geographic proximity and pre-existing familiarity with the plantation environment.
- **Assumption 4**: The validator pool is recruited and managed by the plantation company itself — GreenProof does not operate or maintain a central validator marketplace.
- **Assumption 5**: For the hackathon proof-of-concept, blockchain wallet management is custodial on behalf of companies. Post-hackathon, a fully non-custodial model is intended.

### 2.4 Success Criteria

**Quantitative:**
- End-to-end demo flow operational: task creation → field submission → LLM quality gate → token reward distribution, completable in under 5 minutes
- Smart contracts deployed on SUI testnet with verifiable transaction hashes
- Photo submissions stored on Walrus with Seal encryption policy enforced per company
- Zero instances of GreenProof server-side access to company photo data

**Qualitative:**
- A non-technical observer can understand the value proposition within 60 seconds of viewing the demo
- The trust model is demonstrably superior to a centralized alternative — enforced by architecture, not policy
- All three user interfaces (operator dashboard, verifier dashboard, field validator app) are functional and visually complete

---

## 3. PROPOSED SOLUTION

### 3.1 System Overview

GreenProof is a SaaS B2B2C platform built on the SUI blockchain ecosystem. It transforms the reporting paradigm for plantation field validation from a push model (workers report upward through a hierarchy) to a pull model (the system dispatches structured, rewarded tasks to registered field workers). The platform is fully developed and maintained by GreenProof — plantation companies require no development capacity of their own to adopt it.

The platform operates across three primary user interfaces and one supporting layer of smart contracts and decentralized storage infrastructure.

### 3.2 Core System Flow

```
[COMPANY] Publishes task from drone anomaly output
    ↓ (task + reward token locked in smart contract escrow)
[SUI BLOCKCHAIN] Task object created on-chain, immutable
    ↓ (notification to registered validators)
[FIELD VALIDATOR] Receives task on mobile app, travels to GPS coordinate
    ↓ (photos + diagnosis submitted)
[BACKEND] Uploads encrypted photos to Walrus via Seal policy
    ↓ (blob_id registered on-chain)
[LLM QUALITY GATE] Analyzes photo-diagnosis consistency asynchronously
    ↓ (if flagged: route to verifier; if passed: release reward)
[SMART CONTRACT] Automatically mints and distributes token reward to validator
    ↓ (if flagged: agronomist reviews and issues verdict)
[VERIFIER DASHBOARD] Agronomist verdict recorded, reward released or denied
    ↓ (labeled data enters AI training pipeline)
[AI MODEL] Accuracy improves → future tasks become more relevant
```

### 3.3 Token Economy

Each plantation company receives a unique token contract upon onboarding. The token is:
- Named and symboled by the company (e.g., "PTPN Field Points" / "PTPN")
- Minted exclusively by the company via their `TreasuryCap` (a SUI Move primitive that grants sole minting authority)
- Non-transferable outside the company's ecosystem
- Distributed automatically by the escrow smart contract upon successful task verification
- Redeemable for benefits defined by the company (vouchers, airtime, in-kind rewards)

GreenProof deploys the token contract but immediately transfers `TreasuryCap` to the company's wallet address upon onboarding. From that point forward, GreenProof has zero ability to mint tokens on behalf of any company.

**Token lifecycle:**

| Stage | Trigger | Actor |
|---|---|---|
| Mint | Task published | Company (via TreasuryCap) |
| Lock | Token deposited to escrow | Smart contract (automatic) |
| Release | QC pass or agronomist verdict | Smart contract (automatic) |
| Void | Task cancelled before claim | Company (returns from escrow) |

### 3.4 Data Sovereignty Architecture

GreenProof does not store, read, or have access to plantation companies' operational data. The architecture enforces this technically rather than through policy:

- **Drone anomaly data** remains in the company's internal systems. Only derived tasks (GPS coordinate + anomaly type + reward) are published to the smart contract.
- **Photo evidence** submitted by validators is encrypted using **Seal** (SUI ecosystem access control layer) before upload to **Walrus** (SUI ecosystem decentralized storage). The Seal policy, controlled by the company, determines who may decrypt.
- **Default Seal policy**: company wallet address + GreenProof smart contract address (for verification logic only)
- **Mode B Seal policy**: adds GreenProof AI service address for model training/inference
- GreenProof servers only see encrypted blob data and the `blob_id` reference — never the photo content
- All access events are logged on-chain and visible in the company dashboard in real time

### 3.5 AI Integration — Two Modes

**Mode A — Company's Own Model**
Companies with existing drone AI models provide anomaly maps in a standard format (GeoJSON). The Seal policy remains at its default. GreenProof does not access photo data for AI purposes.

**Mode B — GreenProof Model (LLM for hackathon)**
Companies without their own AI model use GreenProof's inference service. The Seal policy is extended to include the GreenProof AI service address. For the hackathon, this is implemented via a multimodal LLM (Claude/GPT-4o) that receives photos and diagnosis text and returns a consistency score and reasoning. In production, this will be replaced by a domain-specific computer vision model trained on accumulated labeled data.

The LLM serves two distinct roles in the hackathon implementation:
1. **Drone Anomaly Simulator**: generates realistic anomaly task lists in JSON from a textual estate context (replaces actual drone output)
2. **Quality Gate Layer 2**: evaluates consistency between submitted photos and validator-provided diagnosis

### 3.6 Flagging Mechanism

A submission is flagged if and only if its diagnosis deviates significantly from the consensus of other submissions for the same task — not from the original drone prediction. "Significant deviation" is defined as a different disease category (not merely a different severity level). Flagged submissions enter the agronomist verifier's queue. The token reward is held in escrow until a verdict is issued.

The threshold for flagging (default: confidence score below 70% from LLM quality gate, or categorical disagreement with majority submission) is configurable per company by the Operator role.

### 3.7 Scope Definition

**Included in hackathon POC:**
- Company operator dashboard (web)
- Agronomist verifier dashboard (web)
- Field validator mobile web application
- SUI smart contracts: `validator_token`, `task_registry`, `reward_engine`
- Node.js backend API
- Walrus integration for photo storage
- Seal integration for per-company access policy
- LLM integration for drone simulator and quality gate
- zkLogin for all user authentication

**Explicitly excluded from hackathon:**
- Admin GreenProof dashboard (CLI/script sufficient for demo)
- Real drone hardware integration
- Automated level promotion (manual operator assignment for hackathon)
- Token redemption catalog
- Multi-region AI model fine-tuning

---

## 4. IMPACT & OUTCOME

### 4.1 Target Users and Benefits

**Plantation Companies (B2B clients):**
- Transform drone AI investment from partially actionable to fully actionable
- Receive cryptographically verifiable field evidence — photos and reports immutably linked to GPS coordinates and timestamps
- Accumulate labeled training data that improves their AI model accuracy over time
- Maintain complete data sovereignty — platform adoption does not require sharing sensitive operational data with a third party
- Avoid building or maintaining any technical infrastructure

**Field Validators (B2C end users):**
- Receive individual, transparent, manipulation-proof recognition for contributions
- Earn token rewards proportional to task type difficulty and personal accuracy track record
- Progress through a leveling system that unlocks higher-value tasks and reward multipliers
- Access the system from any smartphone browser — no installation, no wallet setup

**Agronomists:**
- Receive structured, pre-filtered caseload rather than ad-hoc escalations
- Access photographic evidence and cross-validator reports in a purpose-built review interface
- Contribute diagnoses that become high-quality labeled training data

### 4.2 Expected Outcomes

**Best-case scenario:**
GreenProof is adopted by two or more plantation corporations within six months of launch. The accumulated labeled dataset across companies begins generating measurable improvements in drone AI confidence scores. Validators in participating estates demonstrate measurably higher task completion rates than pre-GreenProof inspection rates. The system becomes a standard component of smart agriculture infrastructure in Indonesia.

**Typical-case scenario:**
One enterprise pilot with a medium-scale plantation (50,000–100,000 ha). The platform reduces manual inspection coordination overhead by 40–60%. Validators complete 200–500 tasks per month across the pilot estate. Drone AI confidence on re-scanned previously-flagged areas improves by 5–10 percentage points within one growing season.

**Worst-case scenario:**
Low validator adoption due to insufficient reward value or digital literacy barriers. Plantation companies find the onboarding effort — specifically the requirement to recruit and register their own validator pool — to be a friction point. The platform is used sporadically for high-stakes task types only (Ganoderma detection) but not at volume.

### 4.3 Risks and Mitigations

| Risk | Likelihood | Mitigation |
|---|---|---|
| Low validator adoption | Medium | zkLogin removes wallet friction; sponsored transactions remove gas cost; reward is immediate and visible |
| Company data sovereignty concern | Low | Architecture enforces it technically — cannot be mitigated by policy alone, but GreenProof can demonstrate this in a technical audit |
| GPS spoofing by validators | Medium | Cross-validation consensus flagging; GPS geofencing; LLM photo analysis provides secondary signal |
| Token perceived as cryptocurrency | Low | Closed-loop architecture + POJK No. 27/2024 exemption clearly documented in terms |
| Drone integration dependency | Mitigated | LLM simulator provides fully functional demo path without real drone hardware |
| Company loses Google account (zkLogin) | Low | Documented as company responsibility; noted in onboarding terms of service |

---

## 5. INNOVATION & DIFFERENTIATION

### 5.1 Positioning in the DePIN Landscape

GreenProof belongs to the Decentralized Physical Infrastructure Network (DePIN) category — projects that use blockchain-based incentive mechanisms to crowdsource physical-world data or services. Known global precedents include:

**Hivemapper**: pays drivers to record roads and builds a decentralized map. Structural similarity: pays individual contributors for real-world data collection. Key difference: Hivemapper operates an open marketplace — any driver globally can contribute. GreenProof's validator pool is closed to company-registered members, reflecting the security requirements of private plantation land access.

**Helium**: pays device owners to provide wireless network coverage. Structural similarity: infrastructure provision as a service paid in tokens. Key difference: Helium's value is network coverage (a fungible utility); GreenProof's value is knowledge specificity — a Ganoderma diagnosis from a 20-year veteran farmer is not fungible with one from a new registrant.

**WeatherXM**: pays station operators for meteorological data. Structural similarity: physical sensing paid in tokens. Key difference: Weather data is inherently public and non-sensitive. GreenProof deals with commercially sensitive plantation data requiring enterprise-grade access control.

**Key differentiator across all comparisons**: GreenProof is the only DePIN implementation that (a) targets a B2B enterprise market with a ready-to-use SaaS delivery model, (b) enforces data sovereignty at the cryptographic layer rather than contractually, and (c) combines a human knowledge incentive network with an AI training data flywheel.

### 5.2 Versus Conventional Plantation Management Systems

Existing plantation management software (e.g., ERP-integrated field reporting modules from SAP Agri, or standalone tools like AgroStar or Cropwise) operates on the following assumptions: data flows upward through the organizational hierarchy, trust is administrative (enforced by employment), and reporting is push-based.

GreenProof inverts these assumptions: data flows from verified field events to an immutable ledger, trust is cryptographic (enforced by architecture), and reporting is pull-based. This is not an incremental improvement — it is a structural redesign of the verification incentive mechanism.

### 5.3 Unique Value Propositions

**For companies**: "We cannot access your photos, legally or technically. Here is the cryptographic proof."

**For validators**: "Your contribution is recorded on a public blockchain. Your manager cannot edit it, hide it, or reassign it to someone else."

**For the AI ecosystem**: Every verified field submission is a labeled training datum with GPS coordinates, timestamp, photographic evidence, agronomist-confirmed diagnosis, and environmental metadata. This is a dataset category that does not exist in any commercial form today.

---

## 6. TECHNICAL APPROACH

### 6.1 System Architecture Overview

The system is composed of three distinct layers with clean separation of concerns:

**Layer 1 — SUI Smart Contracts (Move Language)**
Deployed once on SUI blockchain. Provides trustless execution of task lifecycle management and token economics. No single party, including GreenProof, can modify behavior post-deployment.

**Layer 2 — Walrus + Seal (Decentralized Storage + Access Control)**
Walrus provides immutable blob storage with a 4–5x replication factor and Byzantine fault tolerance. Seal provides cryptographic access control on top of Walrus blobs. Together they ensure photo evidence is permanently available, unmodifiable, and accessible only by authorized parties.

**Layer 3 — Node.js Backend (Orchestrator)**
Stateless orchestrator that bridges the web interfaces, smart contracts, Walrus, Seal, and LLM services. Does not make trust decisions — all trust decisions are delegated to Layer 1. Handles gas sponsorship for user transactions.

### 6.2 Smart Contract Architecture (Move on SUI)

**Module: `validator_token`**
Implements a company-specific closed-loop token using SUI's `coin` module with a one-time witness pattern. Key functions: `create_company_token(name, symbol, ctx)` which creates a `TreasuryCap` and transfers it to the calling address; `mint(treasury_cap, amount, ctx)`; `burn(treasury_cap, coin, ctx)`. The module is deployed once by GreenProof; each company activation calls `create_company_token` which instantiates a new object with a unique type.

**Module: `task_registry`**
Manages the full lifecycle of validation tasks. Each company has a `TaskRegistry` shared object. Task objects contain: GPS coordinates (byte-encoded), reward amount, minimum validator level, status enum, array of `blob_ids` from Walrus submissions, and locked escrow coin. Functions: `create_task`, `claim_task`, `submit_validation`, `flag_task`, `release_reward`, `verdict_and_release`.

**Module: `reward_engine`**
Manages `ValidatorReputation` objects per company. Tracks tasks completed, accuracy score, current level, and total earned per validator address. Implements automatic level promotion logic and reward multiplier calculation. Emits `LevelUp` events observable by the backend for dashboard updates.

**Event schema**: All state-changing functions emit typed events queryable via SUI's event indexer. This is the primary mechanism by which the backend constructs dashboard views from on-chain state.

### 6.3 Walrus Integration

Walrus is accessed via its HTTP Publisher API (`https://publisher.walrus-testnet.walrus.space`). Photos are uploaded as encrypted blobs (post-Seal encryption) with a durability epoch parameter of 5. The returned `blob_id` is a 32-byte identifier stored both in the backend database and registered on-chain as part of the task submission record.

The Walrus aggregator endpoint (`https://aggregator.walrus-testnet.walrus.space`) is used for retrieval. Retrieval requires Seal decryption post-fetch if the blob was encrypted.

### 6.4 Seal Integration

Seal is used as an access control layer on top of Walrus. For each company onboarded, the backend creates a Seal policy containing:
- Company's zkLogin-derived SUI address
- GreenProof smart contract package address

If Mode B is active, the AI service address is added to the policy. Policy management (creation, modification, revocation) is performed by the backend using the GreenProof service keypair, acting on behalf of the company's authorization. All access events are recorded to the `SealAccessLog` database table and surfaced in the company dashboard.

### 6.5 Authentication — zkLogin

All user authentication uses SUI's **zkLogin** primitive, which derives a deterministic SUI address from an OAuth provider credential (Google). This means:
- No user ever creates or manages a cryptographic wallet directly
- GreenProof never holds private keys for any user account
- The company's SUI address (used for `TreasuryCap` custody and Seal policy ownership) is derived from their corporate Google account
- Validator addresses are derived from their personal Google accounts
- Gas fees for all blockchain transactions are sponsored by GreenProof via the Sponsored Transactions mechanism, making the blockchain completely invisible to end users

### 6.6 LLM Integration (Hackathon-Specific)

The LLM (Anthropic Claude via `@anthropic-ai/sdk@0.24.3`) serves two functions in the hackathon implementation:

**Drone Anomaly Simulator**: Receives estate context and returns a JSON array of realistic anomaly task objects including coordinates, disease type, confidence score, and severity. This replaces real drone output for demo purposes.

**Quality Gate Layer 2**: Receives base64-encoded photos and validator-provided diagnosis text. Returns a structured JSON response: `{ consistent: boolean, confidence: number, reasoning: string, flags: string[] }`. This drives the automated pass/flag decision. The LLM call is asynchronous — the submission endpoint returns immediately, and the frontend polls for QC result.

### 6.7 Backend API Structure

The Express API at `apps/api` provides the following endpoint groups:

| Group | Key Endpoints |
|---|---|
| Onboarding | `POST /api/onboarding` — sequential deploy: token contract → task registry → Seal policy |
| Tasks | `GET/POST /api/tasks`, `POST /api/tasks/:id/submit` |
| Quality Control | Internal QC worker triggered async post-submission |
| Verifier | `POST /api/verifier/verdict` |
| Treasury | `GET /api/treasury` — aggregates on-chain token events |
| Config | `GET/PUT /api/config`, `PUT /api/config/ai-mode` |
| Audit | `GET /api/audit` |
| Simulator | `POST /api/simulator` — LLM anomaly generation |
| Validators | `GET/POST /api/validators` |

### 6.8 Database Schema

The PostgreSQL database (via Prisma ORM) stores off-chain operational data that would be too expensive or unnecessary to store on-chain. Key models: `Company` (contract addresses, Seal policy ID, AI mode), `Task` (mirrors on-chain task with additional metadata), `Submission` (blob_ids, QC scores, reward transaction hashes), `Validator` (level, accuracy, total earned), `SealAccessLog`, `AuditLog`.

The database is authoritative for query performance (dashboard views, pagination, filtering) but the blockchain is authoritative for trust (token balances, task state, reward distribution).

### 6.9 Role and Access Control

| Role | Interface | Managed By | Key Privileges |
|---|---|---|---|
| Admin GreenProof | CLI (hackathon) | GreenProof | Deploy contracts, onboard companies |
| Operator | Company Dashboard | Company | Publish tasks, manage validators, configure AI |
| Supervisor | Company Dashboard | Company | Approve critical tasks, escalate to agronomist |
| Agronomist | Verifier Dashboard | Company | Review flagged cases, issue verdicts |
| Field Observer (Level 1) | Mobile App | Company-registered | Basic tasks, 1x reward multiplier |
| Field Analyst (Level 2) | Mobile App | Auto-promoted | Mid-tier tasks, 1.5x multiplier |
| Field Expert (Level 3) | Mobile App | Auto-promoted | All tasks, 2x multiplier, 2x cross-validation weight |

Level promotion criteria: Level 1→2 requires 50 completed tasks with accuracy above 75%. Level 2→3 requires 200 tasks, accuracy above 85%, and a minimum 3-month tenure. For the hackathon, level assignment is manual via the Operator interface.

### 6.10 Technology Stack Summary

| Component | Technology |
|---|---|
| Blockchain | SUI Network (Testnet for POC) |
| Smart Contracts | Move Language |
| Decentralized Storage | Walrus Protocol (Mainnet as of March 2025) |
| Access Control | Seal (SUI Ecosystem) |
| Authentication | zkLogin (SUI) |
| Backend | Node.js / Express / TypeScript |
| Database | PostgreSQL via Prisma ORM |
| Frontend (Operator/Verifier) | Next.js 14 / TailwindCSS / shadcn/ui |
| Frontend (Validator App) | Next.js 14 (Mobile Web, no install) |
| AI/LLM | Anthropic Claude (via SDK, hackathon placeholder) |
| Monorepo | Turborepo / pnpm workspaces |

### 6.11 Scalability Considerations

- Each company's token contract is an independent SUI object — no shared mutable state across companies, eliminating cross-company contention
- The backend is stateless with respect to trust — all trust state lives on-chain, enabling horizontal scaling
- Walrus storage costs scale linearly with photo volume; at approximately $50/TB/year, storage is not a material cost constraint at early scale
- The LLM quality gate is the primary latency bottleneck at scale; the async QC architecture isolates this from submission response time
- Regional AI model fine-tuning is architecturally supported by the Walrus blob tagging system but is a post-hackathon roadmap item

### 6.12 Security Considerations

- GreenProof's service keypair (used for contract calls and gas sponsorship) is stored server-side with environment variable injection — this is the primary attack surface for the backend
- Seal policy ownership resides with the company's zkLogin address — compromise of GreenProof's backend does not grant access to company photo data
- Smart contract logic is open-source and auditable by any party
- `TreasuryCap` custody rests with the company's zkLogin-derived address — GreenProof server compromise does not enable unauthorized token minting
- GPS spoofing is partially mitigated by LLM photo analysis (photo content must be consistent with reported location) and cross-validator consensus; full mitigation requires post-hackathon hardware attestation

---

## 7. REFERENCES

All content in this document is derived from internal synthesis of the brainstorming and design session. No external publications were directly cited as sources. The following external concepts, standards, frameworks, and products are referenced by name:

**Regulatory:**
- POJK No. 27 Tahun 2024 — Otoritas Jasa Keuangan (OJK), Indonesia. Regulation on digital asset classification; specifically its exclusion clause for closed-loop tokens.
- UU No. 13 Tahun 2003 — Indonesian Manpower Act. Basis for framing token reward as a supplementary benefit, not a wage substitute.
- UU No. 7 Tahun 2011 — Indonesian Currency Act. Establishes Rupiah as the sole legal tender; token system is designed to not conflict with this.

**Blockchain and Protocol:**
- SUI Network — Layer 1 blockchain by Mysten Labs. https://sui.io
- Move Language — Smart contract language used on SUI. https://move-book.com
- Walrus Protocol — Decentralized blob storage by Mysten Labs, mainnet live March 2025. https://walrus.xyz
- Seal — Access control layer for Walrus in the SUI ecosystem. Part of SUI ecosystem tooling.
- zkLogin — SUI primitive for deriving blockchain addresses from OAuth credentials. https://docs.sui.io/concepts/cryptography/zklogin
- Sponsored Transactions — SUI mechanism for third-party gas payment. https://docs.sui.io/concepts/transactions/sponsored-transactions
- Closed-Loop Token Standard — SUI loyalty token pattern. https://docs.sui.io/guides/developer/coin/loyalty

**DePIN Reference Projects (for comparative context):**
- Hivemapper — Decentralized mapping network. https://hivemapper.com
- Helium Network — Decentralized wireless infrastructure. https://www.helium.com
- WeatherXM — Decentralized weather station network. https://weatherxm.com

**AI/LLM:**
- Anthropic Claude API — Used for quality gate and drone simulator. https://docs.anthropic.com

**Software Frameworks:**
- Next.js 14 — React framework for frontend applications. https://nextjs.org
- Prisma ORM — Type-safe database client for Node.js. https://prisma.io
- Turborepo — Monorepo build system. https://turbo.build
- `@mysten/sui.js v0.54.1` — JavaScript SDK for SUI blockchain interaction

*All technical decisions, architectural choices, business model constructs, and system design elements described in this document were derived from internal synthesis of the brainstorming discussion and do not represent external research findings unless a specific external reference is cited above.*
