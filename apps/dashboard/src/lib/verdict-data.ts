// ─── Verifier Dashboard — Shared Types & Mock Data ──────────────────────────

export type SubmissionTier = 'QUICK' | 'FIELD' | 'EXPERT'
export type VerdictValue = 'CONFIRMED' | 'REJECTED' | 'INCONCLUSIVE' | null
export type Priority = 'TINGGI' | 'SEDANG' | 'RENDAH'

export interface Submission {
  id: string
  mitra: string
  tier: SubmissionTier
  time: string
  photos: number
  hasVideo: boolean
  gpsOk: boolean
  gpsDistM: number
  // Quick (Tipe A)
  kondisi?: string
  catatanSingkat?: string
  // Field (Tipe B)
  gejala?: string[]
  keparahan?: number
  estimasiLuas?: string
  catatanTambahan?: string
  // Expert (Tipe C)
  diagnosisPrimer?: string
  expertSymptoms?: string
  urgensi?: string
  rekomendasiTindakan?: string
  estimasiPohon?: string
}

export interface DronePrediction {
  label: string
  confidence: number
  notes: string
  boundingBox?: string
}

export interface BlockContext {
  blockId: string
  estate: string
  umurTanaman: string
  jenisTanah: string
  riwayat: { date: string; desc: string; resolved: boolean }[]
  curahHujan7d: string
}

// Grading per validator
export interface ValidatorGrade {
  submissionId: string
  mitraName: string
  imageScore: number      // 0-100
  analysisScore: number   // 0-100
  reliable: boolean
}

export interface VerifierCase {
  caseId: string
  taskId: string
  taskTitle: string
  block: string
  priority: Priority
  waitingSince: string
  
  // What the Drone AI said
  dronePrediction: DronePrediction
  
  // What the Humans said
  submissions: Submission[]
  
  // Context
  blockCtx: BlockContext
  
  // Evaluation Output (Verdict form)
  verdictPhase: 'PENDING' | 'GRADED'
  verdictData?: {
    finalLabel: string
    replacesDroneAi: boolean
    grades: ValidatorGrade[]
    reasoningNotes: string
    gradedAt: string
  }
}

// ─── Tier metadata ──────────────────────────────────────────────────────────

export const TIER_META: Record<SubmissionTier, { label: string; color: string; bg: string; desc: string }> = {
  QUICK:  { label: 'Quick Observation',  color: '#6b7280', bg: 'rgba(107,114,128,0.12)', desc: 'Tipe A' },
  FIELD:  { label: 'Field Report',       color: '#6366f1', bg: 'rgba(99,102,241,0.12)',  desc: 'Tipe B' },
  EXPERT: { label: 'Expert Assessment',  color: '#10b981', bg: 'rgba(16,185,129,0.12)',  desc: 'Tipe C' },
}

export const PRIORITY_META: Record<Priority, { color: string; bg: string }> = {
  TINGGI: { color: '#ef4444', bg: 'rgba(239,68,68,0.12)' },
  SEDANG: { color: '#eab308', bg: 'rgba(234,179,8,0.12)' },
  RENDAH: { color: '#6b7280', bg: 'rgba(107,114,128,0.12)' },
}

// ─── Mock Cases ─────────────────────────────────────────────────────────────

export const MOCK_CASES: VerifierCase[] = [
  // Case 1: PENDING — Drone salah tebak, beda pendapat human
  {
    caseId: 'VRD-001', taskId: 'TK-2849', taskTitle: 'Kondisi Umum Area — Blok KB-D2',
    block: 'KB-D2', priority: 'TINGGI', waitingSince: '6 jam lalu',
    dronePrediction: {
      label: 'Crown Disease atau Defisiensi',
      confidence: 51,
      notes: 'Area dengan luas ~200m2 menunjukkan klorosis ringan pada tajuk atas poligon D2-Barat.',
    },
    submissions: [
      { id: 'SUB-101', mitra: 'Agus Mulyono', tier: 'FIELD', time: '09:47, 15 Mar', photos: 4, hasVideo: false, gpsOk: true, gpsDistM: 12,
        gejala: ['Daun menguning', 'Bercak coklat kecil'], keparahan: 3, estimasiLuas: '~15-20 pohon di bagian barat blok',
        catatanTambahan: 'Pola kuning di pelepah tengah ke atas, tidak ada tanda jamur di pangkal. Analisis: kemungkinan Defisiensi Magnesium karena hujan intensif.' },
      { id: 'SUB-102', mitra: 'Wahyu Santoso', tier: 'QUICK', time: '11:22, 15 Mar', photos: 2, hasVideo: false, gpsOk: true, gpsDistM: 8,
        kondisi: 'Normal', catatanSingkat: 'Pohon terlihat wajar. Fotonya saya ambil dari sudut yang jelas.' },
    ],
    blockCtx: {
      blockId: 'KB-D2', estate: 'Kapuas Barat', umurTanaman: '9 tahun', jenisTanah: 'Gambut dalam',
      riwayat: [{ date: 'Nov 2024', desc: 'Gejala kuning sporadis', resolved: false }],
      curahHujan7d: '214 mm (ekstrem)',
    },
    verdictPhase: 'PENDING',
  },
  
  // Case 2: PENDING — Drone ragu-ragu
  {
    caseId: 'VRD-002', taskId: 'TK-2853', taskTitle: 'Estimasi Serangan Hama — Blok KB-C3',
    block: 'KB-C3', priority: 'SEDANG', waitingSince: '2 jam lalu',
    dronePrediction: {
      label: 'Kerusakan Mekanis Daun',
      confidence: 65,
      notes: 'Pola tajuk rusak secara ireguler. AI Drone mendeteksi patahan tajuk seperti jatuhan fisik mekanis.',
    },
    submissions: [
      { id: 'SUB-201', mitra: 'Pak Surya', tier: 'EXPERT', time: '10:32, 15 Mar', photos: 5, hasVideo: true, gpsOk: true, gpsDistM: 8,
        diagnosisPrimer: 'Nettle caterpillar infestation', expertSymptoms: 'Bekas gigitan ulat pada daun sangat masif di area pucuk, ribuan ulat teridentifikasi di lapangan.',
        urgensi: 'Sedang', rekomendasiTindakan: 'Penyemprotan targeted insektisida. Pemasangan perangkap + monitoring intensif.', estimasiPohon: '~25 pohon, 3 cluster bersebelahan' },
    ],
    blockCtx: {
      blockId: 'KB-C3', estate: 'Kapuas Barat', umurTanaman: '12 tahun', jenisTanah: 'Mineral lempung',
      riwayat: [{ date: 'Sep 2024', desc: 'Serangan hama ringan', resolved: true }],
      curahHujan7d: '87 mm (normal)',
    },
    verdictPhase: 'PENDING',
  },

  // Case 3: GRADED — AI Drone benar, Human mensupport dengan data bagus
  {
    caseId: 'VRD-003', taskId: 'TK-2847', taskTitle: 'Deteksi Ganoderma — Blok KB-C3',
    block: 'KB-C3', priority: 'TINGGI', waitingSince: '—',
    dronePrediction: {
      label: 'Suspected Ganoderma',
      confidence: 73,
      notes: 'Anomali spektral terdeteksi pada baris ke-7; indikasi awal busuk pangkal batang.',
    },
    submissions: [
      { id: 'SUB-301', mitra: 'Sari Lestari', tier: 'EXPERT', time: '07:53, 15 Mar', photos: 3, hasVideo: true, gpsOk: true, gpsDistM: 3,
        diagnosisPrimer: 'Ganoderma boninense (BSR)', expertSymptoms: 'Daun pucat menguning massal, mahkota menipis >50%, dan terdapat jamur bracket (fruiting body) di pangkal batang pohon.',
        urgensi: 'Kritis', rekomendasiTindakan: 'Pembongkaran pohon dan injeksi fungisida', estimasiPohon: '3 pohon terdampak langsung, ~15 pohon berisiko' },
    ],
    blockCtx: {
      blockId: 'KB-C3', estate: 'Kapuas Barat', umurTanaman: '12 tahun', jenisTanah: 'Mineral lempung',
      riwayat: [],
      curahHujan7d: '87 mm (normal)',
    },
    verdictPhase: 'GRADED',
    verdictData: {
      finalLabel: 'Ganoderma boninense (BSR)',
      replacesDroneAi: false, // Label AI Drone sudah benar ("Suspected Ganoderma")
      grades: [
        { submissionId: 'SUB-301', mitraName: 'Sari Lestari', imageScore: 95, analysisScore: 98, reliable: true }
      ],
      reasoningNotes: 'Model AI Drone sudah mendeteksi Ganoderma dengan benar, hanya butuh expert human label untuk konfirmasi final dan training model image classification basah.',
      gradedAt: '15 Mar 2025, 08:45',
    }
  },
]

export const LABEL_OPTIONS = [
  'Ganoderma boninense (BSR)', 'Defisiensi Magnesium', 'Defisiensi Boron',
  'Crown Disease', 'Nettle caterpillar infestation', 'Oryctes',
  'Waterlogging damage', 'Mechanical injury', 'Normal / Sehat', 'Lainnya'
]
