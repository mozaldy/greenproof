import { ElementType, ReactNode } from 'react'

export type Severity = 'low' | 'medium' | 'high' | 'critical'
export type Priority = 'TINGGI' | 'SEDANG' | 'RENDAH'
export type AnomalyType = 'GANODERMA_SUSPECT' | 'NUTRIENT_DEFICIENCY' | 'PEST_ATTACK' | 'WATER_STRESS' | 'ABNORMAL_GROWTH' | 'OTHER'
export type TaskType = 'TREE_COUNT' | 'AREA_CONDITION' | 'HEALTH_DIAGNOSIS' | 'ANOMALY_SEMI' | 'ANOMALY_CRITICAL'
export type SubmissionTier = 'QUICK' | 'FIELD' | 'EXPERT'

export interface SystemNode {
  name: string
  status: 'healthy' | 'degraded' | 'offline'
  latency: string
  uptime: string
  icon: ElementType
}

export interface Drone {
  id: string
  name?: string
  pilot?: string
  type?: string
  estate: string
  block?: string
  status: 'FLYING' | 'CHARGING' | 'STANDBY' | 'OFFLINE' | 'ACTIVE' | 'MAINTENANCE'
  battery: number
  altitude?: number
  speed?: number
  coverage?: number
  lat?: number
  lng?: number
  signal?: string
  model?: string
  lastUpdate?: string
}

export interface AnomalyAlert {
  id: string
  ts?: string
  block: string
  type: string
  severity: Severity | string
  conf?: number
  taskId?: string
  fresh?: boolean
  lat?: number
  lng?: number
  description?: string
  suggestedTaskType?: TaskType | string
  confidence?: number
  selected?: boolean
}

export interface Task {
  id: string
  title: string
  type: TaskType | string
  priority: Priority | string
  status: string
  reward: number
  level?: number
  estate: string
  claims?: number
  max?: number
  created?: string
}

export interface FieldSubmission {
  id: string
  mitra: string
  validator?: string
  tier: SubmissionTier
  time: string
  photos: number | string[]
  hasVideo?: boolean
  video?: string
  gpsOk?: boolean
  gpsDistM: number | string
  kondisi?: string
  catatanSingkat?: string
  gejala?: string[]
  keparahan?: number | string
  severity?: string | number    
  estimasiLuas?: string
  catatanTambahan?: string
  diagnosisPrimer?: string
  diagnosis?: string
  expertSymptoms?: string
  symptoms?: string
  urgensi?: string
  rekomendasiTindakan?: string
  estimasiPohon?: string
  estimate?: string
  note?: string
}

export interface DronePrediction {
  label: string
  confidence: number
  notes: string
  boundingBox?: string
}

export interface ValidatorGrade {
  submissionId: string
  mitraName: string
  imageScore: number
  analysisScore: number
  reliable: boolean
}

export interface VerifierCase {
  caseId: string
  taskId: string
  taskTitle: string
  block: string
  priority: Priority
  waitingSince: string
  dronePrediction: DronePrediction
  submissions: FieldSubmission[]
  blockCtx: {
    blockId: string
    estate: string
    umurTanaman: string
    jenisTanah: string
    riwayat: { date: string; desc: string; resolved: boolean }[]
    curahHujan7d: string
  }
  verdictPhase: 'PENDING' | 'GRADED'
  verdictData?: {
    finalLabel: string
    replacesDroneAi: boolean
    grades: ValidatorGrade[]
    reasoningNotes: string
    gradedAt: string
  }
}

export interface KbItem {
  id: string
  title: string
  category: string
  icon: ElementType
  color: string
  desc: string
  content?: ReactNode
}

export interface TaskDetail {
  id: string
  title: string
  block: string
  coordinates: string
  estate: string
  reward: number
  status: string
  dronePrediction?: {
    label: string
    confidence: number
    notes: string
  }
  submissions: {
    validator: string
    time: string
    photos: string[]
    video?: string
    symptoms?: string
    severity?: string
    estimate?: string
    diagnosis: string
    note: string
    gpsDistanceM: number
  }[]
  qualityGate: {
    status: 'PASS' | 'FLAGGED'
    analysis: string
  }
  contract: {
    tokenMinted: boolean
    amount: number
    mintedAt?: string
    txHash?: string
    rewardDistribution?: { validator: string; amount: number; percentage: number }[]
  }
}

export interface ValidatorProfile {
  id: string
  name: string
  walletAddress: string // <-- Tambahan baru
  type: string
  status: string
  totalTasks: number
  tokenBalance: number
  estate: string
  avatar: string
}