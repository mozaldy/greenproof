import { Server, Cpu, ShieldCheck, Database, Radio, Leaf, Bug, Droplets, AlertTriangle, BookMarked } from 'lucide-react'
import { Drone, AnomalyAlert, SystemNode, Task, VerifierCase, KbItem, TaskDetail } from '@/types'

// ─── Dashboard Totals ───────────────────────────────────────────────────────
export const DASHBOARD_STATS = {
  TOTAL_COVERAGE_HA: 5842,
  TOTAL_ANOMALIES: 31,
  ACTIVE_DRONES: 3,
  POIN_TODAY: 2340,
  VERIFIED_TODAY: 7,
  PENDING_REVIEW: 3
}

export const SYSTEM_NODES: SystemNode[] = [
  { name: 'API Server',      status: 'healthy',  latency: '12ms',  uptime: '99.8%', icon: Server },
  { name: 'AI Engine (LLM)', status: 'healthy',  latency: '340ms', uptime: '99.2%', icon: Cpu },
  { name: 'SUI Blockchain',  status: 'healthy',  latency: '88ms',  uptime: '100%',  icon: ShieldCheck },
  { name: 'Walrus Storage',  status: 'healthy',  latency: '45ms',  uptime: '99.9%', icon: Database },
  { name: 'Drone Comm Link', status: 'degraded', latency: '210ms', uptime: '97.1%', icon: Radio },
  { name: 'Seal / Access',   status: 'healthy',  latency: '22ms',  uptime: '100%',  icon: ShieldCheck },
]

export const ESTATES = [
  { code: 'KB', name: 'Kapuas Barat',  area: '4.200 ha', droneActive: 2, coverage: 68, anomalies: 3, flagged: 2 },
  { code: 'KT', name: 'Kapuas Timur', area: '4.800 ha', droneActive: 1, coverage: 44, anomalies: 1, flagged: 1 },
  { code: 'MT', name: 'Mentaya',       area: '3.400 ha', droneActive: 0, coverage: 12, anomalies: 1, flagged: 0 },
]

// ─── Drones & Alerts ────────────────────────────────────────────────────────
export const DRONE_FLEET: Drone[] = [
  { id: 'GP-D01', name: 'Alpha Scout', type: 'DJI Matrice 300 RTK', pilot: 'Pak Surya', estate: 'KB', block: 'KB-C3', status: 'FLYING',   battery: 78, altitude: 120, speed: 8.4,  coverage: 82, lat: 2.8821, lng: 101.4871, model: 'GP-Vision-v2.1', lastUpdate: 'Live', signal: 'Kuat' },
  { id: 'GP-D02', name: 'Beta Observer', type: 'DJI Mavic 3 Multispectral', pilot: 'Bu Dewi',   estate: 'KB', block: 'KB-D2', status: 'FLYING',   battery: 45, altitude: 95,  speed: 6.1,  coverage: 61, lat: 2.8793, lng: 101.4902, model: 'GP-Vision-v2.1', lastUpdate: '2 jam lalu', signal: '-' },
  { id: 'GP-D03', name: 'Delta Mapper', type: 'DJI Matrice 350 RTK', pilot: 'Agus M.',   estate: 'KT', block: 'KT-B1', status: 'FLYING',   battery: 91, altitude: 110, speed: 9.2,  coverage: 44, lat: 2.8760, lng: 101.4855, model: 'GP-Vision-v2.1', lastUpdate: 'Live', signal: 'Sedang' },
  { id: 'GP-D04', name: 'Echo Patrol', type: 'Autel Evo Max 4T', pilot: '—',          estate: 'MT', block: '—',     status: 'CHARGING', battery: 22, altitude: 0,   speed: 0,    coverage: 0,  lat: 0,      lng: 0, model: 'GP-NDVI-Beta', lastUpdate: '2 hari lalu', signal: '-' },
  { id: 'GP-D05', pilot: '—', estate: 'KB', block: '—', status: 'STANDBY',  battery: 100, altitude: 0, speed: 0, coverage: 0, lat: 0, lng: 0 },
  { id: 'GP-D06', pilot: '—', estate: 'MT', block: '—', status: 'OFFLINE',  battery: 0, altitude: 0, speed: 0, coverage: 0, lat: 0, lng: 0 },
]

export const ANOMALY_FEED: AnomalyAlert[] = [
  { id: 'ANM-089', ts: '03:12', block: 'KB-C3', type: 'Ganoderma Suspect',     severity: 'critical', conf: 87, taskId: 'TK-2847', fresh: true },
  { id: 'ANM-088', ts: '02:58', block: 'KT-B1', type: 'Anomali Drainase',      severity: 'high',     conf: 74, taskId: 'TK-2850', fresh: true },
  { id: 'ANM-087', ts: '02:41', block: 'KB-D2', type: 'Crown Disease Suspect', severity: 'medium',   conf: 51, taskId: 'TK-2849', fresh: false },
  { id: 'ANM-086', ts: '02:15', block: 'KB-A1', type: 'BSR (Busuk Pangkal)',   severity: 'critical', conf: 83, taskId: 'TK-2851', fresh: false },
  { id: 'ANM-085', ts: '01:54', block: 'MT-C2', type: 'Defisiensi Boron',      severity: 'low',      conf: 55, taskId: 'TK-2852', fresh: false },
  { id: 'ANM-084', ts: '01:33', block: 'KB-C3', type: 'Serangan Hama Ulat',    severity: 'high',     conf: 81, taskId: 'TK-2853', fresh: false },
]

// ─── Tasks ──────────────────────────────────────────────────────────────────
export const ALL_TASKS: Task[] = [
  { id: 'TK-2853', title: 'Estimasi Serangan Hama — Blok KB-C3', type: 'ANOMALY_SEMI',     priority: 'critical', status: 'PUBLISHED',   reward: 120, level: 3, estate: 'Kapuas Barat', claims: 0, max: 1, created: '15 Mar' },
  { id: 'TK-2852', title: 'Kualitas Pelepah — Blok MT-C2',       type: 'AREA_CONDITION',  priority: 'normal',  status: 'PUBLISHED',   reward: 60,  level: 1, estate: 'Mentaya',      claims: 0, max: 2, created: '15 Mar' },
  { id: 'TK-2851', title: 'Deteksi BSR (Busuk Pangkal) — Blok KB-A1', type: 'ANOMALY_CRITICAL', priority: 'critical', status: 'PUBLISHED', reward: 200, level: 3, estate: 'Kapuas Barat', claims: 0, max: 1, created: '15 Mar' },
  { id: 'TK-2850', title: 'Anomali Drainase — Blok KT-B1',       type: 'AREA_CONDITION',  priority: 'normal',  status: 'IN_PROGRESS', reward: 80,  level: 2, estate: 'Kapuas Timur', claims: 1, max: 1, created: '14 Mar' },
  { id: 'TK-2849', title: 'Kondisi Umum Area — Blok KB-D2',      type: 'AREA_CONDITION',  priority: 'critical', status: 'FLAGGED',     reward: 40,  level: 1, estate: 'Kapuas Barat', claims: 2, max: 2, created: '14 Mar' },
  { id: 'TK-2848', title: 'Hitung Pohon Mati — Blok KB-C4',      type: 'TREE_COUNT',      priority: 'normal',  status: 'COMPLETED',   reward: 50,  level: 1, estate: 'Kapuas Barat', claims: 1, max: 1, created: '14 Mar' },
  { id: 'TK-2847', title: 'Deteksi Ganoderma — Blok KB-C3',      type: 'ANOMALY_CRITICAL', priority: 'critical', status: 'COMPLETED',   reward: 150, level: 3, estate: 'Kapuas Barat', claims: 1, max: 1, created: '14 Mar' },
]

export const ALL_STATUSES = ['Semua', 'DRAFT', 'PUBLISHED', 'IN_PROGRESS', 'FLAGGED', 'COMPLETED']

// ─── Verifier Cases ─────────────────────────────────────────────────────────
export const MOCK_CASES: VerifierCase[] = [
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
        catatanTambahan: 'Pola kuning di pelepah tengah ke atas, tidak ada tanda jamur di pangkal. Analisis: kemungkinan Defisiensi Magnesium.' },
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
        diagnosisPrimer: 'Ganoderma boninense (BSR)', expertSymptoms: 'Daun pucat menguning massal, mahkota menipis >50%, dan terdapat jamur bracket di pangkal batang.',
        urgensi: 'Kritis', rekomendasiTindakan: 'Pembongkaran pohon dan injeksi fungisida', estimasiPohon: '3 pohon terdampak langsung' },
    ],
    blockCtx: {
      blockId: 'KB-C3', estate: 'Kapuas Barat', umurTanaman: '12 tahun', jenisTanah: 'Mineral lempung',
      riwayat: [], curahHujan7d: '87 mm (normal)',
    },
    verdictPhase: 'GRADED',
    verdictData: {
      finalLabel: 'Ganoderma boninense (BSR)',
      replacesDroneAi: false, 
      grades: [
        { submissionId: 'SUB-301', mitraName: 'Sari Lestari', imageScore: 95, analysisScore: 98, reliable: true }
      ],
      reasoningNotes: 'Model AI Drone sudah mendeteksi Ganoderma dengan benar, hanya butuh expert human label untuk konfirmasi.',
      gradedAt: '15 Mar 2025, 08:45',
    }
  },
]

// ─── Knowledge Base ─────────────────────────────────────────────────────────
export const KB_ITEMS: KbItem[] = [
  { id: 'KB-01', title: 'Panduan Deteksi Ganoderma (BSR)', category: 'Penyakit Jamur', icon: Leaf, color: '#ef4444', desc: 'Ciri-ciri badan buah, perubahan warna daun, dan metode diagnosis.' },
  { id: 'KB-02', title: 'Modul Defisiensi Magnesium', category: 'Nutrisi', icon: Droplets, color: '#eab308', desc: 'Klorosis pada pelepah bawah vs pelepah atas. Perbedaan dengan penyakit tajuk.' },
  { id: 'KB-03', title: 'Serangan Ulat Api (Nettle Caterpillar)', category: 'Hama', icon: Bug, color: '#ef4444', desc: 'Identifikasi pola gigitan pada daun dan cara estimasi tingkat serangan.' },
  { id: 'KB-08', title: 'SOP Investigasi Sabotase Pohon', category: 'Vandalisme', icon: AlertTriangle, color: '#dc2626', desc: 'Pedoman membedakan kematian tajuk alami vs kematian mendadak akibat injeksi zat kimia.' },
  { id: 'KB-07', title: 'Deteksi Ganoderma Standar (VRD-003)', category: 'Dataset Referensi', icon: BookMarked, color: '#10b981', desc: 'Preseden dari Labeled Data VRD-003.' },
]

export const VALIDATORS = [
  { id: 'M-001', name: 'Pak Surya',       type: 'Internal', status: 'active', totalTasks: 347, tokenBalance: 42300, estate: 'Kapuas Barat',   avatar: 'https://images.unsplash.com/photo-1560250097-0b93528c311a?auto=format&fit=crop&q=80&w=150' },
  { id: 'M-002', name: 'Bu Dewi',         type: 'Internal', status: 'active', totalTasks: 128, tokenBalance: 14890, estate: 'KB & KT',        avatar: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&q=80&w=150' },
  { id: 'M-003', name: 'Agus Mulyono',    type: 'Eksternal',status: 'active', totalTasks: 95,  tokenBalance: 8200,  estate: 'Kapuas Timur',   avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?auto=format&fit=crop&q=80&w=150' },
  { id: 'M-004', name: 'Wahyu Santoso',   type: 'Eksternal',status: 'active', totalTasks: 23,  tokenBalance: 1150,  estate: 'Kapuas Barat',   avatar: 'https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?auto=format&fit=crop&q=80&w=150' },
  { id: 'M-005', name: 'Fitri Handayani', type: 'Eksternal',status: 'active', totalTasks: 11,  tokenBalance: 520,   estate: 'Mentaya',        avatar: 'https://images.unsplash.com/photo-1580489944761-15a19d654956?auto=format&fit=crop&q=80&w=150' },
]

interface TaskHistoryItem {
  taskId: string
  title: string
  date: string
  status: string
  reward: number
}

export const TASK_HISTORY: Record<string, TaskHistoryItem[]> = {
  'M-001': [
    { taskId: 'TK-2847', title: 'Deteksi Ganoderma — KB-C3', date: '15 Mar', status: 'VERIFIED', reward: 150 },
    { taskId: 'TK-2853', title: 'Estimasi Serangan Hama — KB-C3', date: '15 Mar', status: 'FLAGGED', reward: 0 },
  ],
  'M-002': [
    { taskId: 'TK-2848', title: 'Hitung Pohon Mati — KB-C4', date: '14 Mar', status: 'VERIFIED', reward: 50 },
  ],
  'M-003': [
    { taskId: 'TK-2849', title: 'Kondisi Umum — KB-D2', date: '14 Mar', status: 'FLAGGED', reward: 0 },
  ],
}

export const TASK_DETAILS: Record<string, TaskDetail> = {
  'TK-2847': {
    id: 'TK-2847',
    title: 'Deteksi Ganoderma — Blok KB-C3',
    block: 'KB-C3',
    coordinates: '-2.1847, 114.2341',
    estate: 'Kapuas Barat',
    reward: 150,
    status: 'COMPLETED',
    dronePrediction: {
      label: 'Suspected Ganoderma',
      confidence: 73,
      notes: 'Anomali spektral terdeteksi pada baris ke-7; indikasi awal busuk pangkal batang.',
    },
    submissions: [
      {
        validator: 'Pak Surya',
        time: '15 Mar 2025, 07:53',
        photos: ['root_base.jpg', 'fruitbody.jpg', 'crown.jpg', 'area_view.jpg', 'ring_pattern.jpg'],
        video: 'ganoderma_context.mp4',
        symptoms: 'Daun pucat menguning massal, mahkota menipis >50%, dan terdapat jamur bracket (fruiting body) di pangkal batang pohon.',
        severity: 'Kritis',
        estimate: '3 pohon terdampak langsung, ~15 pohon berisiko',
        diagnosis: 'Ganoderma boninense (BSR)',
        note: 'Jamur bracket teridentifikasi jelas di pangkal batang. Mahkota sudah menipis >50%. Rekomendasi: bongkar + injeksi fungisida radius 5 pohon.',
        gpsDistanceM: 3,
      },
    ],
    qualityGate: {
      status: 'PASS',
      analysis: 'Validasi lapangan sesuai dengan prediksi AI Drone. Bukti foto, koordinat GPS, dan analisis agronomis sangat konsisten. Data memenuhi syarat kualitas untuk training.',
    },
    contract: {
      tokenMinted: true,
      amount: 150,
      mintedAt: '15 Mar 2025, 08:01',
      txHash: '0x7a3f...b2e1',
      rewardDistribution: [
        { validator: 'Pak Surya', amount: 150, percentage: 100 }
      ]
    },
  },
  'TK-2849': {
    id: 'TK-2849',
    title: 'Kondisi Umum Area — Blok KB-D2',
    block: 'KB-D2',
    coordinates: '-2.1823, 114.2298',
    estate: 'Kapuas Barat',
    reward: 40,
    status: 'FLAGGED',
    dronePrediction: {
      label: 'Crown Disease atau Defisiensi',
      confidence: 51,
      notes: 'Area dengan luas ~200m2 menunjukkan klorosis ringan pada tajuk atas poligon D2-Barat.',
    },
    submissions: [
      {
        validator: 'Agus Mulyono',
        time: '15 Mar 2025, 09:47',
        photos: ['blok_overview.jpg', 'daun_kuning.jpg', 'pohon_dampak.jpg', 'batang_bawah.jpg'],
        symptoms: 'Daun tengah menguning dengan bercak coklat kecil tersebar secara merata di sepanjang anak daun.',
        severity: 'Tinggi',
        estimate: '~15-20 pohon di bagian barat blok',
        diagnosis: 'Defisiensi Magnesium',
        note: 'Pola kuning pada pelepah tengah ke atas setelah periode hujan intensif. Tidak ada tanda jamur di pangkal. Kemungkinan pencucian Magnesium karena hujan deras.',
        gpsDistanceM: 5,
      },
      {
        validator: 'Wahyu Santoso',
        time: '15 Mar 2025, 11:22',
        photos: ['tampak_luar.jpg', 'pohon_umum.jpg'],
        diagnosis: 'Normal',
        note: 'Tidak ada yang mencurigakan. Warna daun terlihat biasa saja dari yang saya lihat.',
        gpsDistanceM: 180,
      },
    ],
    qualityGate: {
      status: 'FLAGGED',
      analysis: 'Terdeteksi anomali pada submission: 1) Pertentangan diagnosis (Defisiensi vs Normal) terhadap titik koordinat yang sama. 2) Salah satu submission terdeteksi out-of-bounds dari koordinat task (180 meter).',
    },
    contract: {
      tokenMinted: false,
      amount: 0,
    },
  },
  'TK-2853': {
    id: 'TK-2853',
    title: 'Estimasi Serangan Hama — Blok KB-C3',
    block: 'KB-C3',
    coordinates: '-2.1842, 114.2338',
    estate: 'Kapuas Barat',
    reward: 120,
    status: 'FLAGGED',
    dronePrediction: {
      label: 'Kerusakan Mekanis Daun',
      confidence: 65,
      notes: 'Pola tajuk rusak secara ireguler, prediksi awal kerusakan akibat angin kencang/jatuhan.',
    },
    submissions: [
      {
        validator: 'Pak Surya',
        time: '15 Mar 2025, 10:32',
        photos: ['cluster_1.jpg', 'cluster_2.jpg', 'leaf_damage.jpg', 'caterpillar_close.jpg', 'area_wide.jpg'],
        symptoms: 'Bekas gigitan ulat pada daun sangat masif di area pucuk, ribuan ulat teridentifikasi di lapangan.',
        severity: 'Sedang',
        estimate: '3 cluster bersebelahan, ~25 pohon terdampak',
        diagnosis: 'Serangan hama ulat api (Nettle caterpillar)',
        note: 'Tanda gigitan ulat api di 3 cluster bersebelahan. Kemungkinan infestasi Nettle caterpillar level sedang. Rekomendasi: penyemprotan targeted insektisida.',
        gpsDistanceM: 8,
      },
    ],
    qualityGate: {
      status: 'FLAGGED',
      analysis: 'Submission validator menyimpang secara signifikan dari tebakan AI Drone (Kerusakan Mekanis vs Hama). Kualitas foto tinggi namun anomali ini butuh evaluasi pakar untuk memastikan kebenaran klasifikasi sistem vs manusia.',
    },
    contract: {
      tokenMinted: false,
      amount: 0,
    },
  },
}