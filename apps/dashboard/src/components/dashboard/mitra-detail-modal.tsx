'use client'

import {
  X,
  Zap,
  CheckCircle2,
  AlertTriangle,
  MapPin,
  Briefcase
} from 'lucide-react'
import { VALIDATORS, TypeBadge } from '@/app/dashboard/validators/page'

// ─── Scenario seed profiles task history ───────────────────────────────────

const TASK_HISTORY: Record<string, any[]> = {
  'M-001': [
    { taskId: 'TK-2847', title: 'Deteksi Ganoderma — KB-C3', date: '15 Mar', status: 'VERIFIED', reward: 150 },
    { taskId: 'TK-2853', title: 'Estimasi Serangan Hama — KB-C3', date: '15 Mar', status: 'FLAGGED', reward: 0 },
    { taskId: 'TK-2841', title: 'Health Diagnosis — KB-B4', date: '12 Mar', status: 'VERIFIED', reward: 100 },
  ],
  'M-002': [
    { taskId: 'TK-2848', title: 'Hitung Pohon Mati — KB-C4', date: '14 Mar', status: 'VERIFIED', reward: 50 },
    { taskId: 'TK-2840', title: 'Kondisi Umum — KB-E1', date: '11 Mar', status: 'VERIFIED', reward: 40 },
  ],
  'M-003': [
    { taskId: 'TK-2849', title: 'Kondisi Umum — KB-D2', date: '14 Mar', status: 'FLAGGED', reward: 0 },
    { taskId: 'TK-2834', title: 'Anomali Drainase — KT-B2', date: '7 Mar', status: 'VERIFIED', reward: 80 },
  ],
  'M-004': [
    { taskId: 'TK-2849', title: 'Kondisi Umum — KB-D2', date: '14 Mar', status: 'FLAGGED', reward: 0 },
    { taskId: 'TK-2837', title: 'Hitung Pohon — KB-C2', date: '9 Mar', status: 'VERIFIED', reward: 50 },
  ],
  'M-005': [
    { taskId: 'TK-2842', title: 'Kondisi Umum — MT-A2', date: '12 Mar', status: 'VERIFIED', reward: 40 },
  ],
}

// ─── Component ──────────────────────────────────────────────────────────────

interface Props {
  mitraId: string
  onClose: () => void
}

export function MitraDetailModal({ mitraId, onClose }: Props) {
  const profile = VALIDATORS.find(v => v.id === mitraId)
  const history = TASK_HISTORY[mitraId] || []

  if (!profile) {
    return (
      <div className="fixed inset-0 z-50 flex items-center justify-center" style={{ background: 'rgba(0,0,0,0.6)' }} onClick={onClose}>
        <div className="rounded-xl p-8 text-center" style={{ background: 'var(--bg-surface)', border: '1px solid var(--border)' }}>
          <p style={{ fontFamily: 'var(--font-sans)', color: 'var(--text-muted)', fontSize: 14 }}>
            Profil mitra belum tersedia.
          </p>
          <button onClick={onClose} className="mt-4 px-4 py-2 rounded-lg border hover:bg-[var(--bg-hover)]" style={{ background: 'var(--bg-elevated)', border: '1px solid var(--border)', color: 'var(--text-secondary)', fontFamily: 'var(--font-sans)', fontSize: 12, cursor: 'pointer' }}>
            Tutup
          </button>
        </div>
      </div>
    )
  }

  return (
    <div className="fixed inset-0 z-50 flex" onClick={onClose}>
      <div className="absolute inset-0" style={{ background: 'rgba(0,0,0,0.55)' }} />

      <div
        className="relative ml-auto h-full overflow-y-auto"
        style={{ width: '480px', maxWidth: '90vw', background: 'var(--bg-base)', borderLeft: '1px solid var(--border)' }}
        onClick={e => e.stopPropagation()}
      >
        {/* Header Photo & Info */}
        <div className="sticky top-0 z-10 px-8 py-8 flex flex-col items-center justify-center" style={{ background: 'var(--bg-surface)', borderBottom: '1px solid var(--border)' }}>
          <button onClick={onClose} className="absolute top-4 right-4 p-1.5 rounded-lg border shadow-sm transition-colors hover:bg-[var(--bg-hover)]" style={{ background: 'var(--bg-elevated)', borderColor: 'var(--border)', cursor: 'pointer', color: 'var(--text-muted)' }}>
            <X size={16} />
          </button>
          
          <div className="w-24 h-24 rounded-full overflow-hidden border-4 mb-4 shadow-lg shrink-0" style={{ borderColor: 'var(--bg-elevated)' }}>
            <img src={profile.avatar} alt={profile.name} className="w-full h-full object-cover" />
          </div>

          <h2 style={{ fontFamily: 'var(--font-sans)', fontSize: 24, fontWeight: 700, color: 'var(--text-primary)', letterSpacing: '-0.02em', textAlign: 'center' }}>
            {profile.name}
          </h2>
          <div className="flex items-center gap-3 mt-3">
            <TypeBadge type={profile.type} />
            <span className="flex items-center gap-1.5" style={{ fontFamily: 'var(--font-sans)', fontSize: 12, color: 'var(--text-muted)', fontWeight: 600 }}>
              <MapPin size={12} />{profile.estate}
            </span>
          </div>
        </div>

        <div className="p-6 flex flex-col gap-5">

          {/* Stats grid */}
          <div className="grid grid-cols-2 gap-4">
            <div className="rounded-xl p-4 border shadow-sm" style={{ background: 'var(--bg-surface)', borderColor: 'var(--border)' }}>
              <div className="w-8 h-8 rounded shrink-0 flex items-center justify-center mb-3" style={{ background: 'var(--primary-muted)', color: 'var(--primary)' }}>
                <CheckCircle2 size={16} />
              </div>
              <div style={{ fontFamily: 'var(--font-mono)', fontSize: 24, fontWeight: 700, color: 'var(--primary)', lineHeight: 1 }}>
                {profile.totalTasks}
              </div>
              <div style={{ fontFamily: 'var(--font-sans)', fontSize: 11, color: 'var(--text-muted)', marginTop: 4, fontWeight: 600 }}>
                Total Task Diselesaikan
              </div>
            </div>
            <div className="rounded-xl p-4 border shadow-sm" style={{ background: 'var(--bg-surface)', borderColor: 'var(--border)' }}>
              <div className="w-8 h-8 rounded shrink-0 flex items-center justify-center mb-3" style={{ background: 'var(--warning)18', color: 'var(--warning)' }}>
                <Zap size={16} />
              </div>
              <div style={{ fontFamily: 'var(--font-mono)', fontSize: 24, fontWeight: 700, color: 'var(--warning)', lineHeight: 1 }}>
                {profile.tokenBalance.toLocaleString()}
              </div>
              <div style={{ fontFamily: 'var(--font-sans)', fontSize: 11, color: 'var(--text-muted)', marginTop: 4, fontWeight: 600 }}>
                Poin Pendapatan
              </div>
            </div>
          </div>

          {/* Task history */}
          <div className="rounded-xl overflow-hidden border shadow-sm" style={{ background: 'var(--bg-surface)', borderColor: 'var(--border)' }}>
            <div className="px-5 py-4 flex items-center gap-2" style={{ borderBottom: '1px solid var(--border)', background: 'var(--bg-elevated)' }}>
              <Briefcase size={16} style={{ color: 'var(--text-muted)' }} />
              <h3 style={{ fontFamily: 'var(--font-sans)', fontSize: 14, fontWeight: 700, color: 'var(--text-primary)' }}>
                Riwayat Pekerjaan Terbaru
              </h3>
            </div>
            <div>
              {history.map((t, i) => {
                const statusMap: Record<string, { label: string; color: string; icon: React.ElementType }> = {
                  VERIFIED:    { label: 'Selesai',     color: 'var(--primary)', icon: CheckCircle2 },
                  FLAGGED:     { label: 'Dikoreksi AI', color: 'var(--danger)',  icon: AlertTriangle },
                }
                const sm = statusMap[t.status] || { label: 'Selesai', color: 'var(--primary)', icon: CheckCircle2 }
                return (
                  <div
                    key={t.taskId}
                    className="flex flex-col gap-2 px-5 py-4"
                    style={{ borderBottom: i < history.length - 1 ? '1px solid var(--border-subtle)' : 'none' }}
                  >
                    <div className="flex justify-between items-start">
                      <div style={{ fontFamily: 'var(--font-sans)', fontSize: 13, fontWeight: 600, color: 'var(--text-primary)' }}>
                        {t.title}
                      </div>
                      <span className="flex items-center gap-1.5 px-2 py-1 rounded" style={{ fontFamily: 'var(--font-sans)', fontSize: 10, fontWeight: 700, color: sm.color, background: `${sm.color}15` }}>
                        <sm.icon size={11} strokeWidth={3} /> {sm.label}
                      </span>
                    </div>
                    
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <span style={{ fontFamily: 'var(--font-mono)', fontSize: 10, color: 'var(--text-muted)' }}>{t.taskId}</span>
                        <span style={{ fontFamily: 'var(--font-sans)', fontSize: 11, color: 'var(--text-secondary)' }}>Tanggal Laporan: {t.date}</span>
                      </div>
                      {t.reward > 0 && (
                        <span className="flex items-center gap-1" style={{ fontFamily: 'var(--font-mono)', fontSize: 13, fontWeight: 700, color: 'var(--accent)' }}>
                          <Zap strokeWidth={3} size={12} /> {t.reward}
                        </span>
                      )}
                    </div>
                  </div>
                )
              })}
            </div>
          </div>

        </div>
      </div>
    </div>
  )
}
