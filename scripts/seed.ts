import { PrismaClient } from '@greenproof/db'
import * as fs from 'fs'
import * as path from 'path'
import * as dotenv from 'dotenv'

dotenv.config({ path: path.join(__dirname, '../apps/api/.env') })

const prisma = new PrismaClient()
const DEPLOYED = path.join(__dirname, '../contracts/deployed.json')

async function main() {
  const deployed = fs.existsSync(DEPLOYED)
    ? (JSON.parse(fs.readFileSync(DEPLOYED, 'utf8')) as {
        packageId?: string
        demoCompany?: { treasuryCapId?: string; registryId?: string }
      })
    : null

  const company = await prisma.company.upsert({
    where: { id: 'demo-company-001' },
    update: {},
    create: {
      id: 'demo-company-001',
      name: 'PT Nusantara Agro Lestari',
      tokenName: 'PTPN GreenProof Token',
      tokenSymbol: 'PTPN',
      subscriptionTier: 'growth',
      aiMode: 'greenproof',
      contractAddress: deployed?.packageId,
      treasuryCapId: deployed?.demoCompany?.treasuryCapId,
      taskRegistryId: deployed?.demoCompany?.registryId,
      sealPolicyId: `seal-demo-${Date.now()}`,
    },
  })
  console.log('Company:', company.id)

  const validators = [
    { name: 'Pak Surya', level: 3, suiAddress: '0x1111111111111111111111111111111111111111111111111111111111111111' },
    { name: 'Bu Dewi', level: 2, suiAddress: '0x2222222222222222222222222222222222222222222222222222222222222222' },
    { name: 'Agus Mulyono', level: 2, suiAddress: '0x3333333333333333333333333333333333333333333333333333333333333333' },
    { name: 'Wahyu Santoso', level: 1, suiAddress: '0x4444444444444444444444444444444444444444444444444444444444444444' },
    { name: 'Fitri Handayani', level: 1, suiAddress: '0x5555555555555555555555555555555555555555555555555555555555555555' },
  ]

  for (const v of validators) {
    await prisma.validator.upsert({
      where: { suiAddress: v.suiAddress },
      update: {},
      create: { companyId: company.id, ...v },
    })
  }
  console.log('Validators seeded:', validators.length)

  const tasks = [
    {
      id: 'TK-2847',
      title: 'Deteksi Ganoderma — Blok KB-C3',
      type: 'ANOMALY_CRITICAL',
      lat: -2.1847,
      lng: 114.2341,
      blok: 'KB-C3',
      estate: 'Kapuas Barat',
      rewardTokens: 150,
      requiredLevel: 3,
      status: 'COMPLETED',
    },
    {
      id: 'TK-2848',
      title: 'Hitung Pohon — Blok KB-D1',
      type: 'TREE_COUNT',
      lat: -2.192,
      lng: 114.24,
      blok: 'KB-D1',
      estate: 'Kapuas Barat',
      rewardTokens: 50,
      requiredLevel: 1,
      status: 'COMPLETED',
    },
    {
      id: 'TK-2849',
      title: 'Kondisi Umum Area — Blok KB-D2',
      type: 'AREA_CONDITION',
      lat: -2.201,
      lng: 114.251,
      blok: 'KB-D2',
      estate: 'Kapuas Barat',
      rewardTokens: 75,
      requiredLevel: 1,
      status: 'FLAGGED',
    },
    {
      id: 'TK-2850',
      title: 'Diagnosis Kesehatan — Blok KT-A1',
      type: 'HEALTH_DIAGNOSIS',
      lat: -2.45,
      lng: 114.81,
      blok: 'KT-A1',
      estate: 'Kapuas Timur',
      rewardTokens: 80,
      requiredLevel: 2,
      status: 'COMPLETED',
    },
    {
      id: 'TK-2851',
      title: 'Anomali Semi-Kritis — Blok KT-B3',
      type: 'ANOMALY_SEMI',
      lat: -2.48,
      lng: 114.84,
      blok: 'KT-B3',
      estate: 'Kapuas Timur',
      rewardTokens: 200,
      requiredLevel: 2,
      status: 'IN_PROGRESS',
    },
    {
      id: 'TK-2852',
      title: 'Estimasi Serangan Hama — Blok MT-C2',
      type: 'ANOMALY_SEMI',
      lat: -3.12,
      lng: 116.21,
      blok: 'MT-C2',
      estate: 'Mentaya',
      rewardTokens: 120,
      requiredLevel: 2,
      status: 'PUBLISHED',
    },
    {
      id: 'TK-2853',
      title: 'Estimasi Serangan Hama — Blok KB-C3',
      type: 'ANOMALY_SEMI',
      lat: -2.185,
      lng: 114.235,
      blok: 'KB-C3',
      estate: 'Kapuas Barat',
      rewardTokens: 120,
      requiredLevel: 2,
      status: 'PUBLISHED',
    },
  ]

  for (const t of tasks) {
    await prisma.task.upsert({
      where: { id: t.id },
      update: {},
      create: {
        id: t.id,
        companyId: company.id,
        title: t.title,
        type: t.type as any,
        lat: t.lat,
        lng: t.lng,
        blok: t.blok,
        estate: t.estate,
        rewardTokens: t.rewardTokens,
        requiredLevel: t.requiredLevel,
        status: t.status as any,
        coordinates: { lat: t.lat, lng: t.lng },
        anomalySource: 'manual',
        description: '',
      },
    })
  }
  console.log('Tasks seeded:', tasks.length)

  console.log('Seed complete.')
}

main()
  .catch(err => {
    console.error(err)
    process.exit(1)
  })
  .finally(() => prisma.$disconnect())
