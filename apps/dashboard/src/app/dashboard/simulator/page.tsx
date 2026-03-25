'use client'

import { useState } from 'react'
import { CreateTaskModal } from '@/components/dashboard/create-task-modal'
import {
  Cpu,
  MapPin,
  Leaf,
  Zap,
  Plus,
  Trash2,
  RefreshCw,
  CheckCircle2,
  AlertTriangle,
  TrendingUp,
  Waves,
  Bug,
  Droplets,
  Sprout,
} from 'lucide-react'

// ─── Types ──────────────────────────────────────────────────────────────────

type Severity  = 'low' | 'medium' | 'high' | 'critical'
type AnomalyType = 'GANODERMA_SUSPECT' | 'NUTRIENT_DEFICIENCY' | 'PEST_ATTACK' | 'WATER_STRESS' | 'ABNORMAL_GROWTH' | 'OTHER'
type TaskType  = 'TREE_COUNT' | 'AREA_CONDITION' | 'HEALTH_DIAGNOSIS' | 'ANOMALY_SEMI' | 'ANOMALY_CRITICAL'

interface Anomaly {
  anomalyType:       AnomalyType
  severity:          Severity
  lat:               number
  lng:               number
  description:       string
  suggestedTaskType: TaskType
  confidence:        number
  selected:          boolean
}

// ─── Static mock output ─────────────────────────────────────────────────────

const MOCK_ANOMALIES: Omit<Anomaly, 'selected'>[] = [
  { anomalyType: 'GANODERMA_SUSPECT',  severity: 'critical', lat: -2.1847, lng: 114.2341, description: 'Suspected Ganoderma — mahkota menipis, Blok KB-C3',              suggestedTaskType: 'ANOMALY_CRITICAL', confidence: 0.73 },
  { anomalyType: 'NUTRIENT_DEFICIENCY',severity: 'medium',   lat: -2.1823, lng: 114.2298, description: 'Crown Disease atau Defisiensi hara — Blok KB-D2',               suggestedTaskType: 'HEALTH_DIAGNOSIS', confidence: 0.51 },
  { anomalyType: 'ABNORMAL_GROWTH',    severity: 'medium',   lat: -2.1799, lng: 114.2189, description: 'Anomali warna vegetasi tidak normal — Blok KB-A2',              suggestedTaskType: 'HEALTH_DIAGNOSIS', confidence: 0.68 },
  { anomalyType: 'WATER_STRESS',       severity: 'low',      lat: -2.1882, lng: 114.2411, description: 'Dry spells pattern terdeteksi — Blok KB-D4',                    suggestedTaskType: 'AREA_CONDITION',  confidence: 0.44 },
  { anomalyType: 'PEST_ATTACK',        severity: 'high',     lat: -2.1842, lng: 114.2338, description: 'Estimasi serangan hama ulat api — Blok KB-C3',                  suggestedTaskType: 'ANOMALY_SEMI',    confidence: 0.81 },
  { anomalyType: 'GANODERMA_SUSPECT',  severity: 'high',     lat: -2.1790, lng: 114.2200, description: 'BSR suspect — pangkal batang retak, Blok KB-A1',               suggestedTaskType: 'ANOMALY_CRITICAL', confidence: 0.83 },
  { anomalyType: 'NUTRIENT_DEFICIENCY',severity: 'low',      lat: -2.2310, lng: 114.1987, description: 'Defisiensi Boron suspect — daun muda kering, Blok MT-C2',       suggestedTaskType: 'HEALTH_DIAGNOSIS', confidence: 0.55 },
]

// ─── Helpers ────────────────────────────────────────────────────────────────

const ANOMALY_META: Record<AnomalyType, { label: string; icon: React.ElementType; color: string }> = {
  GANODERMA_SUSPECT:  { label: 'Ganoderma Suspect',  icon: Leaf,     color: 'var(--danger)' },
  NUTRIENT_DEFICIENCY:{ label: 'Def. Nutrisi',       icon: Sprout,   color: 'var(--warning)' },
  PEST_ATTACK:        { label: 'Serangan Hama',      icon: Bug,      color: 'var(--accent)' },
  WATER_STRESS:       { label: 'Water Stress',       icon: Droplets, color: 'var(--info)' },
  ABNORMAL_GROWTH:    { label: 'Pertumbuhan Abnorm.', icon: TrendingUp, color: 'var(--warning)' },
  OTHER:              { label: 'Lainnya',            icon: Waves,    color: 'var(--text-muted)' },
}

const SEVERITY_META: Record<Severity, { label: string; color: string; bg: string }> = {
  low:      { label: 'LOW',      color: 'var(--text-secondary)', bg: 'var(--bg-elevated)' },
  medium:   { label: 'MEDIUM',   color: 'var(--warning)',        bg: 'var(--warning-muted)' },
  high:     { label: 'HIGH',     color: 'var(--accent)',         bg: 'var(--accent-muted)' },
  critical: { label: 'CRITICAL', color: 'var(--danger)',         bg: 'var(--danger-muted)' },
}

const TASK_TYPE_LABEL: Record<TaskType, string> = {
  TREE_COUNT:       'Hitung Pohon',
  AREA_CONDITION:   'Kondisi Area',
  HEALTH_DIAGNOSIS: 'Diagnosis',
  ANOMALY_SEMI:     'Anomali',
  ANOMALY_CRITICAL: 'Kritis',
}

const TASK_LEVEL_MAP: Record<TaskType, number> = {
  TREE_COUNT:       1,
  AREA_CONDITION:   1,
  HEALTH_DIAGNOSIS: 2,
  ANOMALY_SEMI:     2,
  ANOMALY_CRITICAL: 3,
}


// ─── Component ──────────────────────────────────────────────────────────────

export default function SimulatorPage() {
  const [form, setForm] = useState({
    estateName: '',
    location:   '',
    areaHa:     '',
    centerLat:  '',
    centerLng:  '',
    context:    '',
  })
  const [loading,   setLoading]   = useState(false)
  const [anomalies, setAnomalies] = useState<Anomaly[] | null>(null)
  const [published, setPublished] = useState(false)
  const [createTaskIdx, setCreateTaskIdx] = useState<number | null>(null)

  const handleGenerate = () => {
    setLoading(true)
    setPublished(false)
    // Simulate async LLM call
    setTimeout(() => {
      setAnomalies(MOCK_ANOMALIES.map(a => ({ ...a, selected: true })))
      setLoading(false)
    }, 1800)
  }

  const toggleRow = (i: number) => {
    setAnomalies(prev => prev!.map((a, idx) => idx === i ? { ...a, selected: !a.selected } : a))
  }

  const deleteRow = (i: number) => {
    setAnomalies(prev => prev!.filter((_, idx) => idx !== i))
  }

  const selectedCount = anomalies?.filter(a => a.selected).length ?? 0
  const totalReward   = anomalies?.filter(a => a.selected).reduce((s, a) => s + 0, 0) ?? 0

  const handlePublish = () => {
    setPublished(true)
  }

  const canGenerate = form.estateName && form.location && form.areaHa && form.centerLat && form.centerLng

  return (
    <div style={{ minHeight: '100vh', background: 'var(--bg-base)' }}>

      {/* ── Header ─────────────────────────────────────────────── */}
      <header
        className="flex items-center justify-between px-8 py-4 sticky top-0 z-10"
        style={{
          background: 'var(--bg-surface)',
          borderBottom: '1px solid var(--border)',
        }}
      >
        <div>
          <div className="flex items-center gap-2 mb-1">
            <Cpu size={16} style={{ color: 'var(--accent)' }} />
            <h1
              style={{
                fontFamily: 'var(--font-sans)',
                fontSize: 20,
                fontWeight: 700,
                color: 'var(--text-primary)',
                lineHeight: 1,
                letterSpacing: '-0.02em',
              }}
            >
              Drone Simulator
            </h1>
          </div>
          <p style={{ fontFamily: 'var(--font-sans)', fontSize: 11, color: 'var(--text-muted)' }}>
            Simulasi scan drone untuk deteksi anomali
          </p>
        </div>
      </header>

      <div className="px-8 py-6">
        <div className="grid gap-6" style={{ gridTemplateColumns: '380px 1fr' }}>

          {/* ── Input form ─────────────────────────────────────── */}
          <div>
            <div
              className="rounded-lg overflow-hidden"
              style={{ background: 'var(--bg-surface)', border: '1px solid var(--border)' }}
            >
              <div
                className="px-5 py-3"
                style={{ borderBottom: '1px solid var(--border)', background: 'var(--bg-elevated)' }}
              >
                <h2
                  style={{
                    fontFamily: 'var(--font-sans)',
                    fontSize: 14,
                    fontWeight: 700,
                    color: 'var(--text-primary)',
                  }}
                >
                  Informasi Estate
                </h2>
                <p style={{ fontFamily: 'var(--font-sans)', fontSize: 11, color: 'var(--text-muted)', marginTop: 2 }}>
                  Data ini dikirim ke LLM sebagai konteks scan drone
                </p>
              </div>

              <div className="p-5 flex flex-col gap-4">
                <Field
                  label="Nama Estate"
                  placeholder="cth. Estate Utara Blok A-D"
                  value={form.estateName}
                  onChange={v => setForm(f => ({ ...f, estateName: v }))}
                />
                <Field
                  label="Lokasi / Wilayah"
                  placeholder="cth. Kubu Raya, Kalimantan Barat"
                  value={form.location}
                  onChange={v => setForm(f => ({ ...f, location: v }))}
                />
                <div className="grid gap-3" style={{ gridTemplateColumns: '1fr 1fr 1fr' }}>
                  <Field
                    label="Luas (Ha)"
                    placeholder="500"
                    value={form.areaHa}
                    onChange={v => setForm(f => ({ ...f, areaHa: v }))}
                    mono
                  />
                  <Field
                    label="Lat Tengah"
                    placeholder="-2.5423"
                    value={form.centerLat}
                    onChange={v => setForm(f => ({ ...f, centerLat: v }))}
                    mono
                  />
                  <Field
                    label="Lng Tengah"
                    placeholder="112.342"
                    value={form.centerLng}
                    onChange={v => setForm(f => ({ ...f, centerLng: v }))}
                    mono
                  />
                </div>
                <div>
                  <label
                    style={{
                      display: 'block',
                      fontFamily: 'var(--font-sans)',
                      fontSize: 10,
                      fontWeight: 700,
                      letterSpacing: '0.08em',
                      textTransform: 'uppercase',
                      color: 'var(--text-muted)',
                      marginBottom: 6,
                    }}
                  >
                    Konteks Tambahan <span style={{ fontWeight: 400, textTransform: 'none', letterSpacing: 0 }}>(opsional)</span>
                  </label>
                  <textarea
                    rows={3}
                    placeholder="cth. Musim kemarau, estimasi umur tanaman 8 tahun, pernah ada outbreak Ganoderma di Blok D"
                    value={form.context}
                    onChange={e => setForm(f => ({ ...f, context: e.target.value }))}
                    style={{
                      width: '100%',
                      background: 'var(--bg-base)',
                      border: '1px solid var(--border)',
                      borderRadius: 6,
                      padding: '8px 12px',
                      fontFamily: 'var(--font-sans)',
                      fontSize: 12,
                      color: 'var(--text-primary)',
                      outline: 'none',
                      resize: 'vertical',
                      lineHeight: 1.5,
                    }}
                  />
                </div>

                <button
                  onClick={handleGenerate}
                  disabled={!canGenerate || loading}
                  style={{
                    width: '100%',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    gap: 8,
                    padding: '11px 0',
                    borderRadius: 6,
                    background: canGenerate && !loading ? 'var(--accent)' : 'var(--bg-elevated)',
                    border: `1px solid ${canGenerate && !loading ? 'var(--accent)' : 'var(--border)'}`,
                    color: canGenerate && !loading ? 'var(--text-inverse)' : 'var(--text-muted)',
                    fontFamily: 'var(--font-sans)',
                    fontSize: 13,
                    fontWeight: 700,
                    letterSpacing: '0.06em',
                    cursor: canGenerate && !loading ? 'pointer' : 'not-allowed',
                    transition: 'all 0.15s',
                  }}
                >
                  {loading ? (
                    <>
                      <RefreshCw size={14} style={{ animation: 'spin 1s linear infinite' }} />
                      Memindai dengan AI...
                    </>
                  ) : (
                    <>
                      <Cpu size={14} />
                      GENERATE ANOMALI
                    </>
                  )}
                </button>
              </div>
            </div>

            {/* Tips panel */}
            <div
              className="rounded-lg p-4 mt-4"
              style={{ background: 'var(--primary-muted)', border: '1px solid var(--primary-border)' }}
            >
              <div
                style={{
                  fontFamily: 'var(--font-sans)',
                  fontSize: 10,
                  fontWeight: 700,
                  letterSpacing: '0.08em',
                  color: 'var(--primary)',
                  marginBottom: 8,
                }}
              >
                CARA KERJA SIMULATOR
              </div>
              {[
                'Claude Haiku menghasilkan daftar anomali realistis berdasarkan karakteristik estate',
                'Anomali di-generate dalam radius ±0.02° dari koordinat pusat estate',
                'Pilih anomali mana yang relevan, lalu publish sebagai task untuk mitra lapangan',
                'Set LLM_MOCK=true di .env untuk skip API call saat dev',
              ].map((tip, i) => (
                <div key={i} className="flex items-start gap-2 mb-2">
                  <span style={{ fontFamily: 'var(--font-mono)', fontSize: 10, color: 'var(--primary)', marginTop: 1 }}>
                    {String(i + 1).padStart(2, '0')}
                  </span>
                  <span style={{ fontFamily: 'var(--font-sans)', fontSize: 11, color: 'var(--text-secondary)', lineHeight: 1.4 }}>
                    {tip}
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* ── Results ────────────────────────────────────────── */}
          <div>
            {!anomalies && !loading && (
              <div
                className="rounded-lg flex flex-col items-center justify-center"
                style={{
                  height: 400,
                  background: 'var(--bg-surface)',
                  border: '1px solid var(--border)',
                  borderStyle: 'dashed',
                }}
              >
                <div
                  className="w-16 h-16 rounded-full flex items-center justify-center mb-4"
                  style={{ background: 'var(--bg-elevated)', border: '1px solid var(--border)' }}
                >
                  <Cpu size={24} style={{ color: 'var(--text-muted)' }} />
                </div>
                <p
                  style={{
                    fontFamily: 'var(--font-sans)',
                    fontSize: 16,
                    fontWeight: 700,
                    color: 'var(--text-muted)',
                  }}
                >
                  Belum ada hasil scan
                </p>
                <p style={{ fontFamily: 'var(--font-sans)', fontSize: 11, color: 'var(--text-muted)', marginTop: 6 }}>
                  Isi form estate dan klik Generate untuk memulai
                </p>
              </div>
            )}

            {loading && (
              <div
                className="rounded-lg flex flex-col items-center justify-center"
                style={{
                  height: 400,
                  background: 'var(--bg-surface)',
                  border: '1px solid var(--border)',
                }}
              >
                <div
                  className="w-16 h-16 rounded-full flex items-center justify-center mb-4"
                  style={{ background: 'var(--accent-muted)', border: '1px solid rgba(212,151,58,0.3)' }}
                >
                  <RefreshCw size={24} style={{ color: 'var(--accent)', animation: 'spin 1s linear infinite' }} />
                </div>
                <p
                  style={{
                    fontFamily: 'var(--font-sans)',
                    fontSize: 16,
                    fontWeight: 700,
                    color: 'var(--text-primary)',
                  }}
                >
                  AI sedang menganalisis...
                </p>
                <p style={{ fontFamily: 'var(--font-sans)', fontSize: 11, color: 'var(--text-muted)', marginTop: 6 }}>
                  Claude Haiku memproses peta anomali drone
                </p>
                <div className="flex gap-1 mt-4">
                  {[0, 1, 2].map(i => (
                    <div
                      key={i}
                      className="w-2 h-2 rounded-full"
                      style={{
                        background: 'var(--accent)',
                        animation: `pulse-dot 1.2s ease-in-out ${i * 0.2}s infinite`,
                      }}
                    />
                  ))}
                </div>
              </div>
            )}

            {anomalies && !loading && (
              <div
                className="rounded-lg overflow-hidden"
                style={{ background: 'var(--bg-surface)', border: '1px solid var(--border)' }}
              >
                {/* Results header */}
                <div
                  className="px-5 py-3 flex items-center justify-between"
                  style={{ borderBottom: '1px solid var(--border)', background: 'var(--bg-elevated)' }}
                >
                  <div>
                    <h2
                      style={{
                        fontFamily: 'var(--font-sans)',
                        fontSize: 14,
                        fontWeight: 700,
                        color: 'var(--text-primary)',
                      }}
                    >
                      Hasil Analisis — {form.estateName || 'Estate'}
                    </h2>
                    <p style={{ fontFamily: 'var(--font-sans)', fontSize: 11, color: 'var(--text-muted)', marginTop: 2 }}>
                      {anomalies.length} anomali terdeteksi · {selectedCount} dipilih
                    </p>
                  </div>
                  <div className="flex items-center gap-2">
                    <button
                      onClick={handleGenerate}
                      style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: 6,
                        padding: '6px 12px',
                        borderRadius: 4,
                        background: 'var(--bg-elevated)',
                        border: '1px solid var(--border)',
                        color: 'var(--text-secondary)',
                        fontFamily: 'var(--font-sans)',
                        fontSize: 11,
                        cursor: 'pointer',
                      }}
                    >
                      <RefreshCw size={11} /> Regenerate
                    </button>
                  </div>
                </div>

                {/* Table */}
                <div>
                  {/* Table head */}
                  <div
                    className="grid px-5 py-2"
                    style={{
                      gridTemplateColumns: '32px 24px 150px 100px 1fr 130px 70px 36px',
                      borderBottom: '1px solid var(--border)',
                    }}
                  >
                    {['', '#', 'Tipe', 'Severity', 'Deskripsi', 'Saran Task', 'Conf.', ''].map((h) => (
                      <div
                        key={h}
                        style={{
                          fontFamily: 'var(--font-sans)',
                          fontSize: 10,
                          fontWeight: 700,
                          letterSpacing: '0.08em',
                          textTransform: 'uppercase',
                          color: 'var(--text-muted)',
                        }}
                      >
                        {h}
                      </div>
                    ))}
                  </div>

                  {anomalies.map((a, i) => {
                    const am = ANOMALY_META[a.anomalyType]
                    const sm = SEVERITY_META[a.severity]
                    const AIcon = am.icon
                    return (
                      <div
                        key={i}
                        className="grid px-5 py-3 items-center"
                        style={{
                          gridTemplateColumns: '32px 24px 150px 100px 1fr 130px 70px 36px',
                          borderBottom: i < anomalies.length - 1 ? '1px solid var(--border-subtle)' : 'none',
                          opacity: a.selected ? 1 : 0.4,
                          transition: 'opacity 0.15s',
                          background: a.selected ? 'transparent' : 'var(--bg-base)',
                        }}
                      >
                        {/* Checkbox */}
                        <button
                          onClick={() => toggleRow(i)}
                          style={{
                            width: 16,
                            height: 16,
                            borderRadius: 3,
                            background: a.selected ? 'var(--primary)' : 'var(--bg-elevated)',
                            border: `1px solid ${a.selected ? 'var(--primary)' : 'var(--border)'}`,
                            cursor: 'pointer',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                          }}
                        >
                          {a.selected && <CheckCircle2 size={10} style={{ color: 'var(--text-inverse)' }} />}
                        </button>

                        {/* Row number */}
                        <span style={{ fontFamily: 'var(--font-mono)', fontSize: 10, color: 'var(--text-muted)' }}>
                          {String(i + 1).padStart(2, '0')}
                        </span>

                        {/* Anomaly type */}
                        <div className="flex items-center gap-1.5">
                          <AIcon size={12} style={{ color: am.color, flexShrink: 0 }} />
                          <span
                            style={{
                              fontFamily: 'var(--font-sans)',
                              fontSize: 11,
                              fontWeight: 600,
                              color: am.color,
                            }}
                          >
                            {am.label}
                          </span>
                        </div>

                        {/* Severity */}
                        <span
                          style={{
                            fontFamily: 'var(--font-sans)',
                            fontSize: 9,
                            fontWeight: 700,
                            letterSpacing: '0.08em',
                            color: sm.color,
                            background: sm.bg,
                            border: `1px solid ${sm.color}44`,
                            borderRadius: 3,
                            padding: '2px 6px',
                            display: 'inline-block',
                          }}
                        >
                          {sm.label}
                        </span>

                        {/* Description */}
                        <span
                          style={{
                            fontFamily: 'var(--font-sans)',
                            fontSize: 11,
                            color: 'var(--text-secondary)',
                            overflow: 'hidden',
                            textOverflow: 'ellipsis',
                            whiteSpace: 'nowrap',
                            paddingRight: 12,
                          }}
                        >
                          {a.description}
                        </span>

                        {/* Suggested task */}
                        <div>
                          <span
                            style={{
                              fontFamily: 'var(--font-sans)',
                              fontSize: 10,
                              fontWeight: 600,
                              color: 'var(--text-secondary)',
                            }}
                          >
                            {TASK_TYPE_LABEL[a.suggestedTaskType]}
                          </span>
                          <div
                            className="flex items-center gap-0.5"
                            style={{ fontFamily: 'var(--font-mono)', fontSize: 9, color: 'var(--accent)', marginTop: 1 }}
                          >
                            <Zap size={8} /> L{TASK_LEVEL_MAP[a.suggestedTaskType]}
                          </div>
                        </div>

                        {/* Confidence */}
                        <div>
                          <span
                            style={{
                              fontFamily: 'var(--font-mono)',
                              fontSize: 12,
                              fontWeight: 700,
                              color: a.confidence >= 0.8 ? 'var(--primary)' : a.confidence >= 0.6 ? 'var(--warning)' : 'var(--text-muted)',
                            }}
                          >
                            {(a.confidence * 100).toFixed(0)}%
                          </span>
                          <div
                            className="w-full rounded-full overflow-hidden mt-1"
                            style={{ height: 2, background: 'var(--bg-elevated)' }}
                          >
                            <div
                              style={{
                                height: '100%',
                                width: `${a.confidence * 100}%`,
                                background: a.confidence >= 0.8 ? 'var(--primary)' : a.confidence >= 0.6 ? 'var(--warning)' : 'var(--text-muted)',
                                borderRadius: 9999,
                              }}
                            />
                          </div>
                        </div>

                        {/* Actions */}
                        <div className="flex items-center gap-1">
                          <button
                            onClick={() => setCreateTaskIdx(i)}
                            title="Jadikan Task"
                            style={{
                              background: 'var(--primary-muted)',
                              border: '1px solid var(--primary-border)',
                              cursor: 'pointer',
                              padding: '3px 6px',
                              borderRadius: 4,
                              display: 'flex',
                              alignItems: 'center',
                              gap: 3,
                              fontFamily: 'var(--font-sans)',
                              fontSize: 9,
                              fontWeight: 600,
                              color: 'var(--primary)',
                            }}
                          >
                            <Plus size={9} />Task
                          </button>
                          <button
                            onClick={() => deleteRow(i)}
                            style={{
                              background: 'transparent',
                              border: 'none',
                              cursor: 'pointer',
                              padding: 4,
                              borderRadius: 3,
                              display: 'flex',
                              alignItems: 'center',
                            }}
                          >
                            <Trash2 size={11} style={{ color: 'var(--text-muted)' }} />
                          </button>
                        </div>
                      </div>
                    )
                  })}
                </div>

                {/* Publish footer */}
                <div
                  className="px-5 py-4 flex items-center justify-between"
                  style={{ borderTop: '1px solid var(--border)', background: 'var(--bg-elevated)' }}
                >
                  <div>
                    <div style={{ fontFamily: 'var(--font-sans)', fontSize: 12, color: 'var(--text-secondary)' }}>
                      <span style={{ fontFamily: 'var(--font-mono)', fontWeight: 700, color: 'var(--text-primary)' }}>
                        {selectedCount}
                      </span>{' '}
                      task akan dibuat
                      {selectedCount > 0 && (
                        <>
                          {' · Total '}
                          <span className="flex items-center gap-0.5 inline-flex" style={{ color: 'var(--accent)', fontFamily: 'var(--font-mono)', fontWeight: 700 }}>
                            <Zap size={10} />{totalReward}
                          </span>
                          {' poin dialokasikan'}
                        </>
                      )}
                    </div>
                    {published && (
                      <div
                        className="flex items-center gap-1.5 mt-1"
                        style={{ fontFamily: 'var(--font-sans)', fontSize: 11, color: 'var(--primary)' }}
                      >
                        <CheckCircle2 size={11} />
                        {selectedCount} task berhasil dipublish
                      </div>
                    )}
                  </div>
                  <div className="flex items-center gap-2">
                    <div
                      style={{
                        fontFamily: 'var(--font-mono)',
                        fontSize: 10,
                        color: 'var(--text-muted)',
                      }}
                    >
                      <MapPin size={9} style={{ display: 'inline', marginRight: 3 }} />
                      {form.centerLat || '-2.5423'}, {form.centerLng || '112.3421'}
                    </div>
                    <button
                      onClick={handlePublish}
                      disabled={selectedCount === 0 || published}
                      style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: 8,
                        padding: '9px 20px',
                        borderRadius: 6,
                        background: selectedCount > 0 && !published ? 'var(--primary)' : 'var(--bg-elevated)',
                        border: `1px solid ${selectedCount > 0 && !published ? 'var(--primary)' : 'var(--border)'}`,
                        color: selectedCount > 0 && !published ? 'var(--text-inverse)' : 'var(--text-muted)',
                        fontFamily: 'var(--font-sans)',
                        fontSize: 12,
                        fontWeight: 700,
                        letterSpacing: '0.06em',
                        cursor: selectedCount > 0 && !published ? 'pointer' : 'not-allowed',
                      }}
                    >
                      {published ? (
                        <><CheckCircle2 size={13} /> SUDAH DIPUBLISH</>
                      ) : (
                        <><Plus size={13} /> BUAT &amp; PUBLISH TASK</>
                      )}
                    </button>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      <style>{`
        @keyframes spin { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }
      `}</style>

      {/* Create Task Modal */}
      {createTaskIdx !== null && anomalies && anomalies[createTaskIdx] && (() => {
        const a = anomalies[createTaskIdx]
        const blockMatch = a.description.match(/Blok\s([A-Z]{2}-[A-Z0-9]+)/)
        const block = blockMatch ? blockMatch[1] : 'KB-XX'
        return (
          <CreateTaskModal
            anomalyIndex={createTaskIdx + 1}
            block={block}
            coordinates={`${a.lat}, ${a.lng}`}
            anomalyType={a.anomalyType}
            confidence={a.confidence}
            onClose={() => setCreateTaskIdx(null)}
            onPublish={() => setCreateTaskIdx(null)}
          />
        )
      })()}
    </div>
  )
}

// ─── Field component ─────────────────────────────────────────────────────────

function Field({
  label,
  placeholder,
  value,
  onChange,
  mono = false,
}: {
  label: string
  placeholder: string
  value: string
  onChange: (v: string) => void
  mono?: boolean
}) {
  return (
    <div>
      <label
        style={{
          display: 'block',
          fontFamily: 'var(--font-sans)',
          fontSize: 10,
          fontWeight: 700,
          letterSpacing: '0.08em',
          textTransform: 'uppercase',
          color: 'var(--text-muted)',
          marginBottom: 6,
        }}
      >
        {label}
      </label>
      <input
        type="text"
        placeholder={placeholder}
        value={value}
        onChange={e => onChange(e.target.value)}
        style={{
          width: '100%',
          background: 'var(--bg-base)',
          border: '1px solid var(--border)',
          borderRadius: 6,
          padding: '8px 12px',
          fontFamily: mono ? 'var(--font-mono)' : 'var(--font-sans)',
          fontSize: mono ? 12 : 13,
          color: 'var(--text-primary)',
          outline: 'none',
          transition: 'border-color 0.15s',
        }}
        onFocus={e => (e.target.style.borderColor = 'var(--primary-border)')}
        onBlur={e => (e.target.style.borderColor = 'var(--border)')}
      />
    </div>
  )
}
