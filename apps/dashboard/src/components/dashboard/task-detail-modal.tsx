'use client'

import { X, MapPin, Zap, Clock, Camera, Video, Shield, User, Cpu } from 'lucide-react'
import type { TaskDetail } from '@/types'

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

interface TaskDetailModalProps {
  taskId: string
  onClose: () => void
}

export function TaskDetailModal({ taskId, onClose }: TaskDetailModalProps) {
  const detail = TASK_DETAILS[taskId]

  if (!detail) {
    return (
      <div className="fixed inset-0 z-50 flex items-center justify-center" style={{ background: 'rgba(0,0,0,0.6)' }} onClick={onClose}>
        <div className="rounded-xl p-8 text-center" style={{ background: 'var(--bg-surface)', border: '1px solid var(--border)' }}>
          <p style={{ fontFamily: 'var(--font-sans)', color: 'var(--text-muted)', fontSize: 14 }}>
            Detail untuk task <span style={{ fontFamily: 'var(--font-mono)', color: 'var(--text-primary)' }}>{taskId}</span> belum tersedia.
          </p>
          <button onClick={onClose} className="mt-4 px-4 py-2 rounded-lg" style={{ background: 'var(--bg-elevated)', border: '1px solid var(--border)', color: 'var(--text-secondary)', fontFamily: 'var(--font-sans)', fontSize: 12, cursor: 'pointer' }}>
            Tutup
          </button>
        </div>
      </div>
    )
  }

  const statusMeta: Record<string, { label: string; color: string }> = {
    COMPLETED:   { label: 'Selesai — Terverifikasi', color: 'var(--primary)' },
    FLAGGED:     { label: 'Flagged — Perlu Review',  color: 'var(--danger)' },
    IN_PROGRESS: { label: 'Sedang Dikerjakan',       color: 'var(--info)' },
    PUBLISHED:   { label: 'Terbuka',                 color: 'var(--text-muted)' },
  }
  const sm = statusMeta[detail.status] ?? statusMeta.PUBLISHED

  return (
    <div className="fixed inset-0 z-50 flex" onClick={onClose}>
      {/* Backdrop */}
      <div className="absolute inset-0" style={{ background: 'rgba(0,0,0,0.55)' }} />

      {/* Panel */}
      <div
        className="relative ml-auto h-full overflow-y-auto"
        style={{ width: '680px', maxWidth: '90vw', background: 'var(--bg-base)', borderLeft: '1px solid var(--border)' }}
        onClick={e => e.stopPropagation()}
      >
        {/* Header */}
        <div className="sticky top-0 z-10 px-6 py-4 flex items-start justify-between" style={{ background: 'var(--bg-surface)', borderBottom: '1px solid var(--border)' }}>
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span style={{ fontFamily: 'var(--font-mono)', fontSize: 12, color: 'var(--text-muted)' }}>{detail.id}</span>
              <span className="px-2 py-0.5 rounded" style={{ fontFamily: 'var(--font-sans)', fontSize: 10, fontWeight: 600, color: sm.color, background: `${sm.color}18` }}>
                {sm.label}
              </span>
            </div>
            <h2 style={{ fontFamily: 'var(--font-sans)', fontSize: 18, fontWeight: 700, color: 'var(--text-primary)', letterSpacing: '-0.02em' }}>
              {detail.title}
            </h2>
            <div className="flex items-center gap-4 mt-2">
              <span className="flex items-center gap-1" style={{ fontFamily: 'var(--font-sans)', fontSize: 11, color: 'var(--text-muted)' }}>
                <MapPin size={10} />{detail.block} · {detail.estate}
              </span>
              <span className="flex items-center gap-1" style={{ fontFamily: 'var(--font-mono)', fontSize: 11, color: 'var(--text-muted)' }}>
                {detail.coordinates}
              </span>
              <span className="flex items-center gap-0.5" style={{ fontFamily: 'var(--font-mono)', fontSize: 12, fontWeight: 700, color: 'var(--accent)' }}>
                <Zap size={10} />{detail.reward} poin
              </span>
            </div>
          </div>
          <button onClick={onClose} className="p-1.5 rounded-lg" style={{ background: 'var(--bg-elevated)', border: '1px solid var(--border)', cursor: 'pointer', color: 'var(--text-muted)' }}>
            <X size={16} />
          </button>
        </div>

        <div className="p-6 flex flex-col gap-5">

          {/* ── Drone Prediction Statement ─────────────────────── */}
          {detail.dronePrediction && (
            <div className="rounded-lg p-4" style={{ background: 'rgba(99,102,241,0.05)', border: '1px solid rgba(99,102,241,0.2)' }}>
              <div className="flex items-center gap-2 mb-3">
                <Cpu size={14} style={{ color: '#6366f1' }} />
                <span style={{ fontFamily: 'var(--font-sans)', fontSize: 12, fontWeight: 700, letterSpacing: '0.04em', textTransform: 'uppercase', color: '#6366f1' }}>
                  Prediksi AI Drone (Initial Statement)
                </span>
              </div>
              <div className="flex gap-6">
                <div>
                  <div style={{ fontFamily: 'var(--font-sans)', fontSize: 10, color: 'var(--text-muted)', marginBottom: 2 }}>Asumsi Anomali</div>
                  <div style={{ fontFamily: 'var(--font-sans)', fontSize: 13, fontWeight: 600, color: 'var(--text-primary)' }}>{detail.dronePrediction.label}</div>
                </div>
                <div>
                  <div style={{ fontFamily: 'var(--font-sans)', fontSize: 10, color: 'var(--text-muted)', marginBottom: 2 }}>Confidence</div>
                  <div style={{ fontFamily: 'var(--font-mono)', fontSize: 13, fontWeight: 700, color: '#10b981' }}>{detail.dronePrediction.confidence}%</div>
                </div>
                <div className="flex-1">
                  <div style={{ fontFamily: 'var(--font-sans)', fontSize: 10, color: 'var(--text-muted)', marginBottom: 2 }}>Catatan Sistem</div>
                  <div style={{ fontFamily: 'var(--font-sans)', fontSize: 12, color: 'var(--text-secondary)' }}>{detail.dronePrediction.notes}</div>
                </div>
              </div>
            </div>
          )}

          {/* ── Submissions ─────────────────────────────────── */}
          {detail.submissions.map((sub, idx) => (
            <div key={idx} className="rounded-lg overflow-hidden" style={{ background: 'var(--bg-surface)', border: '1px solid var(--border)' }}>
              <div className="px-5 py-3 flex items-center justify-between" style={{ borderBottom: '1px solid var(--border)', background: 'var(--bg-elevated)' }}>
                <div className="flex items-center gap-2">
                  <User size={13} style={{ color: 'var(--text-muted)' }} />
                  <span style={{ fontFamily: 'var(--font-sans)', fontSize: 13, fontWeight: 600, color: 'var(--text-primary)' }}>
                    {sub.validator}
                  </span>
                </div>
                <div className="flex items-center gap-1" style={{ fontFamily: 'var(--font-mono)', fontSize: 10, color: 'var(--text-muted)' }}>
                  <Clock size={10} />{sub.time}
                </div>
              </div>

              <div className="p-5">
                {/* Photos */}
                <div className="mb-5">
                  <div className="flex items-center gap-1 mb-3" style={{ fontFamily: 'var(--font-sans)', fontSize: 10, fontWeight: 700, letterSpacing: '0.08em', textTransform: 'uppercase' as const, color: 'var(--text-muted)' }}>
                    <Camera size={10} /> Foto Temuan Kolaborator ({sub.photos.length})
                  </div>
                  
                  {/* Featured Big Image based on task ID */}
                  <div className="relative rounded-lg overflow-hidden mb-2 " style={{ border: '1px solid var(--border)', aspectRatio: '16/9' }}>
                    <img 
                      src={
                        taskId === 'TK-2847' 
                          ? 'https://picsum.photos/seed/ganoderma/800/450' 
                          : taskId === 'TK-2849' 
                            ? 'https://picsum.photos/seed/klorosis/800/450' 
                            : 'https://picsum.photos/seed/pests/800/450' 
                      } 
                      alt="Bukti Temuan" 
                      className="w-full h-full object-cover" 
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-[rgba(15,23,42,0.8)] via-transparent to-transparent flex flex-col justify-end p-4">
                       <span style={{ fontFamily: 'var(--font-sans)', fontSize: 13, fontWeight: 600, color: '#fff' }}>
                         Foto Utama: {sub.photos[0]}
                       </span>
                    </div>
                  </div>

                  {/* Thumbnail strip */}
                  <div className="flex gap-2 w-full overflow-x-auto pb-1" style={{ scrollbarWidth: 'none' }}>
                    {sub.photos.slice(1).map((photo, pi) => (
                      <div key={pi} className="rounded-md shrink-0 flex items-center justify-center relative overflow-hidden" style={{ width: 80, height: 50, background: 'var(--bg-elevated)', border: '1px solid var(--border)' }}>
                        <img 
                          src={
                            pi === 0 ? 'https://images.unsplash.com/photo-1599388145244-23947b1e411b?auto=format&fit=crop&q=60&w=150' 
                            : 'https://images.unsplash.com/photo-1500382017468-9049fed747ef?auto=format&fit=crop&q=60&w=150'
                          } 
                          alt="Thumb" 
                          className="w-full h-full object-cover opacity-60" 
                        />
                        <div className="absolute inset-x-0 bottom-0 bg-slate-900/80 p-0.5 text-center">
                          <span style={{ fontFamily: 'var(--font-mono)', fontSize: 7, color: 'var(--text-muted)' }}>
                            {photo.slice(0, 10)}...
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>
                  {sub.video && (
                    <div className="flex items-center gap-1.5 mt-2 px-3 py-1.5 rounded w-fit" style={{ background: 'var(--bg-elevated)', border: '1px solid var(--border)' }}>
                      <Video size={11} style={{ color: 'var(--info)' }} />
                      <span style={{ fontFamily: 'var(--font-mono)', fontSize: 10, color: 'var(--info)' }}>{sub.video}</span>
                    </div>
                  )}
                </div>

                {/* Symptoms */}
                {sub.symptoms && (
                  <div className="mb-3">
                    <div style={{ fontFamily: 'var(--font-sans)', fontSize: 10, fontWeight: 700, letterSpacing: '0.08em', textTransform: 'uppercase' as const, color: 'var(--text-muted)', marginBottom: 4 }}>Gejala Fisik Ditemukan</div>
                    <div className="rounded-lg p-3" style={{ background: 'var(--bg-elevated)', border: '1px solid var(--border)' }}>
                      <p style={{ fontFamily: 'var(--font-sans)', fontSize: 12, color: 'var(--text-secondary)', lineHeight: 1.5, margin: 0 }}>
                        {sub.symptoms}
                      </p>
                    </div>
                  </div>
                )}

                {/* Severity + Estimate */}
                {sub.severity && (
                  <div className="flex gap-6 mb-3">
                    <div>
                      <div style={{ fontFamily: 'var(--font-sans)', fontSize: 10, fontWeight: 700, letterSpacing: '0.08em', textTransform: 'uppercase' as const, color: 'var(--text-muted)', marginBottom: 2 }}>Keparahan</div>
                      <span style={{ fontFamily: 'var(--font-sans)', fontSize: 13, fontWeight: 700, color: sub.severity === 'Kritis' ? 'var(--danger)' : sub.severity === 'Tinggi' ? 'var(--warning)' : 'var(--text-primary)' }}>
                        {sub.severity}
                      </span>
                    </div>
                    {sub.estimate && (
                      <div>
                        <div style={{ fontFamily: 'var(--font-sans)', fontSize: 10, fontWeight: 700, letterSpacing: '0.08em', textTransform: 'uppercase' as const, color: 'var(--text-muted)', marginBottom: 2 }}>Estimasi Dampak</div>
                        <span style={{ fontFamily: 'var(--font-sans)', fontSize: 12, color: 'var(--text-primary)' }}>{sub.estimate}</span>
                      </div>
                    )}
                  </div>
                )}

                {/* Diagnosis */}
                <div className="mb-3">
                  <div style={{ fontFamily: 'var(--font-sans)', fontSize: 10, fontWeight: 700, letterSpacing: '0.08em', textTransform: 'uppercase' as const, color: 'var(--text-muted)', marginBottom: 2 }}>Diagnosis</div>
                  <span className="px-2 py-1 rounded" style={{ fontFamily: 'var(--font-sans)', fontSize: 12, fontWeight: 600, color: 'var(--text-primary)', background: 'var(--bg-elevated)', border: '1px solid var(--border)' }}>
                    {sub.diagnosis}
                  </span>
                </div>

                {/* Note */}
                <div className="mb-2">
                  <div style={{ fontFamily: 'var(--font-sans)', fontSize: 10, fontWeight: 700, letterSpacing: '0.08em', textTransform: 'uppercase' as const, color: 'var(--text-muted)', marginBottom: 2 }}>Rekomendasi Agronomis / Mitigasi</div>
                  <div className="rounded-lg p-3" style={{ background: 'var(--bg-elevated)', border: '1px solid var(--border)' }}>
                    <p style={{ fontFamily: 'var(--font-sans)', fontSize: 12, color: 'var(--text-secondary)', lineHeight: 1.5, margin: 0 }}>
                      &ldquo;{sub.note}&rdquo;
                    </p>
                  </div>
                </div>

                {/* GPS */}
                <div className="flex items-center gap-1 mt-2">
                  <MapPin size={10} style={{ color: sub.gpsDistanceM <= 15 ? 'var(--primary)' : 'var(--danger)' }} />
                  <span style={{ fontFamily: 'var(--font-mono)', fontSize: 10, color: sub.gpsDistanceM <= 15 ? 'var(--primary)' : 'var(--danger)' }}>
                    {sub.gpsDistanceM}m dari titik task
                    {sub.gpsDistanceM > 50 && ' ⚠️'}
                  </span>
                </div>
              </div>
            </div>
          ))}

          {/* ── Quality Gate ─────────────────────────────── */}
          <div className="rounded-lg overflow-hidden" style={{ background: 'var(--bg-surface)', border: `1px solid ${detail.qualityGate.status === 'PASS' ? 'var(--primary-border)' : 'var(--danger)'}40` }}>
            <div className="px-5 py-3 flex items-center justify-between" style={{ borderBottom: '1px solid var(--border)', background: detail.qualityGate.status === 'PASS' ? 'var(--primary-muted)' : 'var(--danger-muted)' }}>
              <div className="flex items-center gap-2">
                <Shield size={13} style={{ color: detail.qualityGate.status === 'PASS' ? 'var(--primary)' : 'var(--danger)' }} />
                <span style={{ fontFamily: 'var(--font-sans)', fontSize: 13, fontWeight: 700, color: detail.qualityGate.status === 'PASS' ? 'var(--primary)' : 'var(--danger)' }}>
                  Sistem Quality Gate — {detail.qualityGate.status === 'PASS' ? 'LULUS (AUTO-VERIFY)' : 'FLAGGED (MEMBUTUHKAN REVIEW)'}
                </span>
              </div>
            </div>
            <div className="p-5">
              <div className="mb-1">
                <div style={{ fontFamily: 'var(--font-sans)', fontSize: 10, fontWeight: 700, letterSpacing: '0.08em', textTransform: 'uppercase' as const, color: 'var(--text-muted)', marginBottom: 4 }}>Log Sistem</div>
                <p style={{ fontFamily: 'var(--font-sans)', fontSize: 12, color: 'var(--text-secondary)', lineHeight: 1.6, margin: 0 }}>
                  {detail.qualityGate.analysis}
                </p>
              </div>
            </div>
          </div>

          {/* Action buttons (for FLAGGED tasks) */}
          {detail.status === 'FLAGGED' && (
            <div className="rounded-lg p-5 mt-2 flex items-center gap-3" style={{ background: 'var(--warning-muted)', border: '1px solid var(--warning)' }}>
              <Clock size={16} className="text-[var(--warning)] shrink-0" />
              <div>
                <div style={{ fontFamily: 'var(--font-sans)', fontSize: 13, fontWeight: 700, color: 'var(--warning)' }}>Tahap Verifikasi Manual Berjalan</div>
                <div style={{ fontFamily: 'var(--font-sans)', fontSize: 11, color: 'var(--text-secondary)', marginTop: 4 }}>
                  Task ini tidak lulus Quality Gate dan telah diteruskan secara otomatis ke tim Agronomis Verifier. 
                  (Reward Verifikasi: {detail.reward * 0.5} poin).
                </div>
              </div>
            </div>
          )}

          {/* Reward Distribution (for COMPLETED tasks) */}
          {detail.status === 'COMPLETED' && detail.contract?.rewardDistribution && (
            <div className="rounded-lg overflow-hidden mt-2 border border-[#10b981]" style={{ background: 'var(--bg-surface)' }}>
              <div className="px-5 py-3 flex items-center justify-between bg-[#10b981] bg-opacity-10 border-b border-[#10b981] border-opacity-20">
                <div className="flex items-center gap-2">
                  <Zap size={14} className="text-[#10b981]" />
                  <span className="font-bold text-sm text-[#10b981]">Distribusi Final Reward</span>
                </div>
                <span className="font-mono text-xs text-[#10b981]">Total: {detail.contract.amount} Poin</span>
              </div>
              <div className="p-5 flex flex-col gap-3">
                {detail.contract.rewardDistribution.map((dist, i) => (
                  <div key={i} className="flex items-center justify-between p-3 rounded-lg bg-[var(--bg-elevated)] border border-[var(--border)]">
                    <div className="flex items-center gap-3">
                      <User size={14} className="text-[var(--text-muted)]" />
                      <span className="font-bold text-sm text-[var(--text-primary)]">{dist.validator}</span>
                    </div>
                    <div className="flex items-center gap-4">
                      <div className="w-32 h-2 text-right">
                        <span className="text-xs font-bold text-[var(--text-muted)]">{dist.percentage}%</span>
                      </div>
                      <span className="font-mono text-sm font-bold text-[var(--accent)]">+{dist.amount} ⚡</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
