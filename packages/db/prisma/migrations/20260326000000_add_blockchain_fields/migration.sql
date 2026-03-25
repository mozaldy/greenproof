-- AlterTable: Company — add blockchain fields
ALTER TABLE "Company" ADD COLUMN IF NOT EXISTS "tokenSymbol"     TEXT;
ALTER TABLE "Company" ADD COLUMN IF NOT EXISTS "tokenName"       TEXT;
ALTER TABLE "Company" ADD COLUMN IF NOT EXISTS "contractAddress" TEXT;
ALTER TABLE "Company" ADD COLUMN IF NOT EXISTS "treasuryCapId"   TEXT;
ALTER TABLE "Company" ADD COLUMN IF NOT EXISTS "taskRegistryId"  TEXT;

-- AlterTable: Task — add blockchain + location fields
ALTER TABLE "Task" ADD COLUMN IF NOT EXISTS "suiTaskId"       TEXT;
ALTER TABLE "Task" ADD COLUMN IF NOT EXISTS "lat"             DOUBLE PRECISION;
ALTER TABLE "Task" ADD COLUMN IF NOT EXISTS "lng"             DOUBLE PRECISION;
ALTER TABLE "Task" ADD COLUMN IF NOT EXISTS "blok"            TEXT;
ALTER TABLE "Task" ADD COLUMN IF NOT EXISTS "estate"          TEXT;
ALTER TABLE "Task" ADD COLUMN IF NOT EXISTS "txHash"          TEXT;
ALTER TABLE "Task" ADD COLUMN IF NOT EXISTS "createdByUserId" TEXT;

-- CreateIndex: unique constraint on Task.suiTaskId
CREATE UNIQUE INDEX IF NOT EXISTS "Task_suiTaskId_key" ON "Task"("suiTaskId");

-- CreateTable: Validator
CREATE TABLE IF NOT EXISTS "Validator" (
    "id"         TEXT NOT NULL,
    "companyId"  TEXT NOT NULL,
    "name"       TEXT NOT NULL,
    "phone"      TEXT,
    "suiAddress" TEXT,
    "level"      INTEGER NOT NULL DEFAULT 1,
    "isActive"   BOOLEAN NOT NULL DEFAULT true,
    "createdAt"  TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Validator_pkey" PRIMARY KEY ("id")
);

-- CreateIndex: unique constraint on Validator.suiAddress
CREATE UNIQUE INDEX IF NOT EXISTS "Validator_suiAddress_key" ON "Validator"("suiAddress");

-- AddForeignKey: Validator -> Company
DO $$ BEGIN
  ALTER TABLE "Validator" ADD CONSTRAINT "Validator_companyId_fkey"
    FOREIGN KEY ("companyId") REFERENCES "Company"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
EXCEPTION WHEN duplicate_object THEN NULL;
END $$;

-- CreateTable: SealAccessLog
CREATE TABLE IF NOT EXISTS "SealAccessLog" (
    "id"        TEXT NOT NULL,
    "companyId" TEXT NOT NULL,
    "policyId"  TEXT NOT NULL,
    "grantedTo" TEXT NOT NULL,
    "action"    TEXT NOT NULL,
    "service"   TEXT,
    "blobCount" INTEGER NOT NULL DEFAULT 0,
    "purpose"   TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "SealAccessLog_pkey" PRIMARY KEY ("id")
);

-- CreateTable: AuditLog
CREATE TABLE IF NOT EXISTS "AuditLog" (
    "id"         TEXT NOT NULL,
    "companyId"  TEXT,
    "actorId"    TEXT,
    "actorName"  TEXT,
    "action"     TEXT NOT NULL,
    "entityType" TEXT NOT NULL,
    "entityId"   TEXT,
    "estate"     TEXT,
    "txHash"     TEXT,
    "metadata"   JSONB,
    "createdAt"  TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "AuditLog_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey: AuditLog -> Company
DO $$ BEGIN
  ALTER TABLE "AuditLog" ADD CONSTRAINT "AuditLog_companyId_fkey"
    FOREIGN KEY ("companyId") REFERENCES "Company"("id") ON DELETE SET NULL ON UPDATE CASCADE;
EXCEPTION WHEN duplicate_object THEN NULL;
END $$;

-- Indexes for common query patterns
CREATE INDEX IF NOT EXISTS "Validator_companyId_idx" ON "Validator"("companyId");
CREATE INDEX IF NOT EXISTS "AuditLog_companyId_createdAt_idx" ON "AuditLog"("companyId", "createdAt" DESC);
CREATE INDEX IF NOT EXISTS "SealAccessLog_companyId_idx" ON "SealAccessLog"("companyId");
CREATE INDEX IF NOT EXISTS "SealAccessLog_policyId_idx" ON "SealAccessLog"("policyId");
