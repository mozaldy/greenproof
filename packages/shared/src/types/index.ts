// ─── Enums (mirrored from Prisma for use in frontend/backend) ────────────────

export type Role =
  | 'ADMIN_GREENPROOF'
  | 'OPERATOR'
  | 'SUPERVISOR'
  | 'AGRONOMIS'
  | 'FIELD_OBSERVER'  // Level 1
  | 'FIELD_ANALYST'   // Level 2
  | 'FIELD_EXPERT'    // Level 3

export type TaskType =
  | 'TREE_COUNT'        // min Level 1
  | 'AREA_CONDITION'    // min Level 1
  | 'HEALTH_DIAGNOSIS'  // min Level 2
  | 'ANOMALY_SEMI'      // min Level 2
  | 'ANOMALY_CRITICAL'  // min Level 3

export type TaskStatus =
  | 'DRAFT'
  | 'PENDING_APPROVAL'
  | 'PUBLISHED'
  | 'IN_PROGRESS'
  | 'COMPLETED'
  | 'FLAGGED'
  | 'EXPIRED'
  | 'CANCELLED'

export type SubmissionStatus =
  | 'PENDING'
  | 'LLM_CHECKING'
  | 'VERIFIED'
  | 'REJECTED'
  | 'FLAGGED'
  | 'REWARDED'

// ─── Shared DTOs ─────────────────────────────────────────────────────────────

export interface Coordinates {
  lat: number
  lng: number
}

export interface WalrusPhoto {
  walrusObjectId: string
  sealPolicyId: string
  gpsLat: number
  gpsLng: number
  timestamp: string
}

// ─── LLM Types ───────────────────────────────────────────────────────────────

export type AnomalyType =
  | 'GANODERMA_SUSPECT'
  | 'NUTRIENT_DEFICIENCY'
  | 'PEST_ATTACK'
  | 'WATER_STRESS'
  | 'ABNORMAL_GROWTH'
  | 'OTHER'

export interface DroneAnomaly {
  anomalyType: AnomalyType
  severity: 'low' | 'medium' | 'high' | 'critical'
  lat: number
  lng: number
  description: string
  suggestedTaskType: TaskType
  confidence: number
}

export interface QualityGateResult {
  qualityScore: number
  isConsistent: boolean
  hasRelevantContent: boolean
  flags: Array<'GPS_TOO_FAR' | 'PHOTO_IRRELEVANT' | 'DIAGNOSIS_INCONSISTENT' | 'INCOMPLETE_COVERAGE'>
  reasoning: string
  recommendedAction: 'APPROVE' | 'FLAG_FOR_REVIEW' | 'REJECT'
}

// ─── Validator leveling thresholds ───────────────────────────────────────────

export const LEVEL_THRESHOLDS = {
  1: { minTasks: 0,   minAccuracy: 0 },
  2: { minTasks: 50,  minAccuracy: 0.75 },
  3: { minTasks: 200, minAccuracy: 0.85, minConsecutiveMonths: 3 },
} as const

export const REWARD_MULTIPLIERS: Record<number, number> = {
  1: 1.0,
  2: 1.5,
  3: 2.0,
}

export const TASK_MIN_LEVEL: Record<TaskType, number> = {
  TREE_COUNT: 1,
  AREA_CONDITION: 1,
  HEALTH_DIAGNOSIS: 2,
  ANOMALY_SEMI: 2,
  ANOMALY_CRITICAL: 3,
}

// GPS max distance (meters) before auto-reject
export const GPS_MAX_DISTANCE_M = 100
