import Anthropic from '@anthropic-ai/sdk'
import type { QualityGateResult, DroneAnomaly } from '@greenproof/shared'

const client = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY })
const MOCK_LLM = process.env.MOCK_LLM === 'true'

// ─── Quality Gate ───────────────────────────────────────────────────────────

/**
 * Runs an LLM quality gate on a validator submission.
 * Returns a QualityGateResult indicating whether to APPROVE, FLAG_FOR_REVIEW, or REJECT.
 * Uses claude-3-5-sonnet with vision for photo analysis.
 */
export async function runQualityGate(params: {
  diagnosis: string
  taskTitle: string
  taskType: string
  gpsDistanceM: number
  photoBase64s: string[]  // base64-encoded photo buffers
}): Promise<QualityGateResult> {
  if (MOCK_LLM) return mockQcPass()

  const imageBlocks = params.photoBase64s.slice(0, 3).map(b64 => ({
    type: 'image' as const,
    source: {
      type: 'base64' as const,
      media_type: 'image/jpeg' as const,
      data: b64,
    },
  }))

  const systemPrompt = `You are an expert palm oil agronomist quality control system.
Evaluate field validator submissions for accuracy and relevance.
Respond ONLY with a valid JSON object matching this exact schema (no markdown, no code fences):
{
  "qualityScore": <number 0-100>,
  "isConsistent": <boolean>,
  "hasRelevantContent": <boolean>,
  "flags": [<"GPS_TOO_FAR"|"PHOTO_IRRELEVANT"|"DIAGNOSIS_INCONSISTENT"|"INCOMPLETE_COVERAGE">],
  "reasoning": "<string>",
  "recommendedAction": <"APPROVE"|"FLAG_FOR_REVIEW"|"REJECT">
}`

  const userContent: Anthropic.MessageParam['content'] = [
    ...imageBlocks,
    {
      type: 'text',
      text: `Task: ${params.taskTitle} (type: ${params.taskType})
GPS distance from task center: ${params.gpsDistanceM}m (flag GPS_TOO_FAR if > 100m)
Validator diagnosis: ${params.diagnosis}

Evaluate whether the photos support the diagnosis and are taken at the correct location.`,
    },
  ]

  const response = await client.messages.create({
    model: 'claude-3-5-sonnet-20240620',
    max_tokens: 512,
    system: systemPrompt,
    messages: [{ role: 'user', content: userContent }],
  })

  const text = response.content.find(b => b.type === 'text')?.text ?? '{}'
  return parseQcResponse(text)
}

function parseQcResponse(raw: string): QualityGateResult {
  try {
    // Strip markdown code fences if LLM adds them despite instructions
    const cleaned = raw.replace(/```json?\n?/g, '').replace(/```/g, '').trim()
    const json = JSON.parse(cleaned)
    const validActions = ['APPROVE', 'FLAG_FOR_REVIEW', 'REJECT']
    return {
      qualityScore: typeof json.qualityScore === 'number' ? json.qualityScore : 50,
      isConsistent: Boolean(json.isConsistent),
      hasRelevantContent: Boolean(json.hasRelevantContent ?? true),
      flags: Array.isArray(json.flags) ? json.flags : [],
      reasoning: typeof json.reasoning === 'string' ? json.reasoning : 'No reasoning provided',
      recommendedAction: validActions.includes(json.recommendedAction)
        ? json.recommendedAction
        : 'FLAG_FOR_REVIEW',
    }
  } catch {
    return {
      qualityScore: 30,
      isConsistent: false,
      hasRelevantContent: false,
      flags: ['DIAGNOSIS_INCONSISTENT'],
      reasoning: 'Failed to parse quality gate response',
      recommendedAction: 'FLAG_FOR_REVIEW',
    }
  }
}

function mockQcPass(): QualityGateResult {
  return {
    qualityScore: 85,
    isConsistent: true,
    hasRelevantContent: true,
    flags: [],
    reasoning: '[MOCK] Auto-approved for local development',
    recommendedAction: 'APPROVE',
  }
}

// ─── Anomaly Simulator ──────────────────────────────────────────────────────

/**
 * Generates realistic drone anomaly detections for a palm oil estate using Claude.
 * Returns an array of DroneAnomaly objects matching the shared type.
 */
export async function simulateAnomalies(params: {
  estate: string
  blockIds: string[]
  count: number
  includeKritikal: boolean
}): Promise<DroneAnomaly[]> {
  if (MOCK_LLM) return mockAnomalies(params.count)

  const prompt = `Generate ${params.count} realistic palm oil drone anomaly detections for estate "${params.estate}".
Blocks: ${params.blockIds.join(', ')}.
${params.includeKritikal ? 'Include 1-2 critical anomalies (Ganoderma).' : 'No critical anomalies — medium severity max.'}
Output ONLY a valid JSON array. No markdown, no code fences, no extra text.
Each item must have exactly these fields:
{
  "anomalyType": "<GANODERMA_SUSPECT|NUTRIENT_DEFICIENCY|PEST_ATTACK|WATER_STRESS|ABNORMAL_GROWTH|OTHER>",
  "severity": "<low|medium|high|critical>",
  "lat": <number, Kalimantan: -1 to -4>,
  "lng": <number, Kalimantan: 113 to 117>,
  "description": "<realistic Indonesian palm oil disease description>",
  "suggestedTaskType": "<TREE_COUNT|AREA_CONDITION|HEALTH_DIAGNOSIS|ANOMALY_SEMI|ANOMALY_CRITICAL>",
  "confidence": <number 0-100>
}
Use realistic disease names: Ganoderma boninense, BSR, Crown Disease, Defisiensi Magnesium, Oryctes rhinoceros, waterlogging, Nettle caterpillar.`

  const response = await client.messages.create({
    model: 'claude-3-haiku-20240307',
    max_tokens: 2048,
    messages: [{ role: 'user', content: prompt }],
  })

  const text = response.content.find(b => b.type === 'text')?.text ?? '[]'
  try {
    const cleaned = text.replace(/```json?\n?/g, '').replace(/```/g, '').trim()
    const parsed = JSON.parse(cleaned)
    if (!Array.isArray(parsed)) throw new Error('Expected array')
    return parsed as DroneAnomaly[]
  } catch (err) {
    throw new Error(
      `Failed to parse LLM anomaly output: ${err instanceof Error ? err.message : String(err)}. Raw: ${text.slice(0, 200)}`
    )
  }
}

function mockAnomalies(count: number): DroneAnomaly[] {
  const types = ['GANODERMA_SUSPECT', 'NUTRIENT_DEFICIENCY', 'PEST_ATTACK'] as const
  const tasks = ['HEALTH_DIAGNOSIS', 'ANOMALY_SEMI', 'HEALTH_DIAGNOSIS'] as const
  return Array.from({ length: count }, (_, i) => ({
    anomalyType: types[i % 3],
    severity: 'medium' as const,
    lat: Number((-2.5 + i * 0.01).toFixed(6)),
    lng: Number((114.5 + i * 0.01).toFixed(6)),
    description: `[MOCK] Defisiensi Magnesium — gejala klorosis pada daun tua (blok ${i + 1})`,
    suggestedTaskType: tasks[i % 3],
    confidence: 70 + (i % 20),
  }))
}
