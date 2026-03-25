'use client'

import { X, Zap, CheckCircle2, AlertTriangle, MapPin, Briefcase } from 'lucide-react'
import { VALIDATORS, TASK_HISTORY } from '@/lib/mock-data'
import { StatCard } from '@/components/ui/stat-card'
import { Badge } from '@/components/ui/badge'

import type { ValidatorProfile } from '@/types'

interface MitraDetailModalProps {
  mitraId: string
  onClose: () => void
}

export function MitraDetailModal({ mitraId, onClose }: MitraDetailModalProps) {
  const profile = VALIDATORS.find((v: ValidatorProfile) => v.id === mitraId)
  const history = TASK_HISTORY[mitraId] || []

  if (!profile) return null

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center" onClick={onClose}>
      <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" />

      <div className="relative ml-auto h-full overflow-y-auto shadow-2xl w-[480px] max-w-[90vw] bg-[var(--bg-base)] border-l border-[var(--border)]" onClick={e => e.stopPropagation()}>
        <div className="sticky top-0 z-10 px-8 py-8 flex flex-col items-center justify-center bg-[var(--bg-surface)] border-b border-[var(--border)]">
          <button onClick={onClose} className="absolute top-4 right-4 p-1.5 rounded-lg bg-[var(--bg-elevated)] border border-[var(--border)] text-[var(--text-muted)] hover:text-white cursor-pointer">
            <X size={16} />
          </button>
          
          <img src={profile.avatar} alt={profile.name} className="w-24 h-24 rounded-full border-4 border-[var(--bg-elevated)] mb-4 object-cover" />
          <h2 className="text-2xl font-bold text-[var(--text-primary)]">{profile.name}</h2>
          
          <div className="flex items-center gap-3 mt-3 text-xs font-semibold text-[var(--text-muted)]">
             <Badge 
               bg={profile.type === 'Internal' ? 'var(--primary-muted)' : 'var(--bg-elevated)'} 
               color={profile.type === 'Internal' ? 'var(--primary)' : 'var(--text-secondary)'}
               border={profile.type === 'Internal' ? 'var(--primary-border)' : 'var(--border)'}
             >
               {profile.type === 'Internal' ? 'INTERNAL (KARYAWAN)' : 'EKSTERNAL (MITRA)'}
             </Badge>
             <span className="flex items-center gap-1"><MapPin size={12}/>{profile.estate}</span>
          </div>
        </div>

        <div className="p-6 flex flex-col gap-5">
          <div className="grid grid-cols-2 gap-4">
            <StatCard label="Total Task Diselesaikan" value={profile.totalTasks} icon={CheckCircle2} color="var(--primary)" />
            <StatCard label="Poin Pendapatan" value={profile.tokenBalance.toLocaleString()} icon={Zap} color="var(--warning)" />
          </div>

          {/* History List */}
          <div className="rounded-xl overflow-hidden border shadow-sm" style={{ background: 'var(--bg-surface)', borderColor: 'var(--border)' }}>
            <div className="px-5 py-4 flex items-center gap-2" style={{ borderBottom: '1px solid var(--border)', background: 'var(--bg-elevated)' }}>
              <Briefcase size={16} style={{ color: 'var(--text-muted)' }} />
              <h3 className="font-sans text-sm font-bold text-[var(--text-primary)]">Riwayat Pekerjaan Terbaru</h3>
            </div>
            <div>
              {history.map((t, i) => {
                const isVerified = t.status === 'VERIFIED'
                return (
                  <div
                    key={t.taskId}
                    className="flex flex-col gap-2 px-5 py-4"
                    style={{ borderBottom: i < history.length - 1 ? '1px solid var(--border-subtle)' : 'none' }}
                  >
                    <div className="flex justify-between items-start">
                      <div className="font-sans text-[13px] font-semibold text-[var(--text-primary)]">{t.title}</div>
                      <Badge 
                        bg={isVerified ? 'var(--primary-muted)' : 'var(--danger-muted)'} 
                        color={isVerified ? 'var(--primary)' : 'var(--danger)'}
                        icon={isVerified ? CheckCircle2 : AlertTriangle}
                      >
                        {isVerified ? 'Selesai' : 'Dikoreksi AI'}
                      </Badge>
                    </div>

                    <div className="flex items-center justify-between mt-1">
                      <div className="flex items-center gap-3">
                        <span className="font-mono text-[10px] text-[var(--text-muted)]">{t.taskId}</span>
                        <span className="font-sans text-[11px] text-[var(--text-secondary)]">Tanggal: {t.date}</span>
                      </div>
                      {t.reward > 0 && (
                        <span className="flex items-center gap-1 font-mono text-[13px] font-bold text-[var(--accent)]">
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