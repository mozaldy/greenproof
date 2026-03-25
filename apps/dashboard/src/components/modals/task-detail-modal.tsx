'use client'

import { useEffect, useState } from 'react'
import { X, Zap, ShieldCheck, Image as ImageIcon, PlayCircle, ChevronDown, MapPin, Cpu } from 'lucide-react'
import { TASK_DETAILS } from '@/lib/mock-data'
import type { TaskDetail } from '@/types'

interface TaskDetailDrawerProps {
  taskId: string | null
  onClose: () => void
}

function getStatusLabel(status: string): string {
  switch (status) {
    case 'COMPLETED': return 'Terverifikasi'
    case 'IN_PROGRESS':
    case 'PENDING_APPROVAL':
    case 'PUBLISHED': return 'Menunggu Verifikasi'
    default: return 'Sedang Diproses'
  }
}

type Submission = TaskDetail['submissions'][number]

function SubmissionCard({ sub, idx }: { sub: Submission; idx: number }) {
  const [open, setOpen] = useState(idx === 0)
  const [lightbox, setLightbox] = useState<string | null>(null)

  const initials = sub.validator
    .split(' ')
    .map(w => w[0])
    .join('')
    .substring(0, 2)
    .toUpperCase()

  const gpsOk = sub.gpsDistanceM <= 50
  const avatarColors = [
    'bg-blue-500/10 text-blue-600 dark:text-blue-400',
    'bg-amber-500/10 text-amber-600 dark:text-amber-400',
    'bg-violet-500/10 text-violet-600 dark:text-violet-400',
  ]
  const avatarColor = avatarColors[idx % avatarColors.length]

  return (
    <>
      {lightbox && (
        <div
          className="fixed inset-0 z-[100] flex items-center justify-center bg-black/80 backdrop-blur-sm"
          onClick={() => setLightbox(null)}
        >
          <div className="relative bg-[var(--bg-elevated)] rounded-2xl p-6 shadow-2xl flex flex-col items-center gap-4 max-w-sm w-full mx-4">
            <div className="w-full aspect-video rounded-xl bg-[var(--bg-surface)] border border-[var(--border)] flex flex-col items-center justify-center gap-2 text-[var(--text-muted)]">
              {lightbox.endsWith('.mp4') ? (
                <>
                  <PlayCircle size={32} className="text-emerald-500" />
                  <span className="text-xs font-mono">{lightbox}</span>
                </>
              ) : (
                <>
                  <ImageIcon size={32} />
                  <span className="text-xs font-mono">{lightbox}</span>
                </>
              )}
            </div>
            <p className="text-xs text-[var(--text-muted)]">Klik di luar untuk tutup</p>
          </div>
        </div>
      )}

      <div className="border border-[var(--border)] rounded-xl overflow-hidden bg-[var(--bg-surface)]">
        <button
          className="w-full flex items-center gap-3 px-4 py-3 hover:bg-[var(--bg-elevated)] transition-colors text-left"
          onClick={() => setOpen(v => !v)}
        >
          <div className={`w-8 h-8 rounded-full flex items-center justify-center text-[11px] font-semibold flex-shrink-0 ${avatarColor}`}>
            {initials}
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-[13px] font-semibold text-[var(--text-primary)] truncate">{sub.validator}</p>
            <p className="text-[11px] text-[var(--text-muted)] flex items-center gap-1.5 mt-0.5">
              <span>{sub.time}</span>
              <span>·</span>
              <span className={gpsOk ? 'text-emerald-500' : 'text-amber-500'}>
                <MapPin size={9} className="inline mr-0.5" />
                {sub.gpsDistanceM}m{!gpsOk && ' !'}
              </span>
            </p>
          </div>
          <span className="text-[11px] font-semibold text-[var(--text-secondary)] truncate max-w-[120px] flex-shrink-0">
            {sub.diagnosis}
          </span>
          <ChevronDown
            size={14}
            className={`text-[var(--text-muted)] flex-shrink-0 transition-transform duration-200 ${open ? 'rotate-180' : ''}`}
          />
        </button>

        {open && (
          <div className="px-4 pb-4 border-t border-[var(--border-subtle)] space-y-3 pt-3">
            {sub.symptoms && (
              <div>
                <p className="text-[10px] font-bold text-[var(--text-muted)] uppercase tracking-wider mb-1">Gejala</p>
                <p className="text-[12px] text-[var(--text-secondary)] leading-relaxed">{sub.symptoms}</p>
              </div>
            )}
            {sub.note && (
              <div>
                <p className="text-[10px] font-bold text-[var(--text-muted)] uppercase tracking-wider mb-1">Rekomendasi</p>
                <p className="text-[12px] text-[var(--text-secondary)] leading-relaxed">{sub.note}</p>
              </div>
            )}

            {(sub.photos?.length || sub.video) && (
              <div>
                <p className="text-[10px] font-bold text-[var(--text-muted)] uppercase tracking-wider mb-2">Lampiran</p>
                <div className="flex flex-wrap gap-2">
                  {sub.photos?.map((photo, pIdx) => (
                    <button
                      key={pIdx}
                      onClick={() => setLightbox(photo)}
                      className="w-14 h-14 rounded-lg bg-[var(--bg-elevated)] border border-[var(--border)] flex flex-col items-center justify-center gap-1 hover:border-[var(--primary)] hover:bg-[var(--primary-muted)] transition-all group"
                    >
                      <ImageIcon size={14} className="text-[var(--text-muted)] group-hover:text-[var(--primary)]" />
                      <span className="text-[8px] font-mono text-[var(--text-muted)] group-hover:text-[var(--primary)] leading-none px-0.5 truncate w-full text-center">
                        {photo.split('.')[0].substring(0, 8)}
                      </span>
                    </button>
                  ))}
                  {sub.video && (
                    <button
                      onClick={() => setLightbox(sub.video ?? null)}
                      className="w-14 h-14 rounded-lg bg-emerald-500/8 border border-emerald-500/20 flex flex-col items-center justify-center gap-1 hover:bg-emerald-500/15 transition-all"
                    >
                      <PlayCircle size={14} className="text-emerald-500" />
                      <span className="text-[8px] font-bold text-emerald-500 uppercase">Video</span>
                    </button>
                  )}
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </>
  )
}

export function TaskDetailDrawer({ taskId, onClose }: TaskDetailDrawerProps) {
  const detail = taskId ? TASK_DETAILS[taskId] : null
  const isOpen = !!detail

  useEffect(() => {
    if (isOpen) document.body.style.overflow = 'hidden'
    else document.body.style.overflow = ''
    return () => { document.body.style.overflow = '' }
  }, [isOpen])

  useEffect(() => {
    const handler = (e: KeyboardEvent) => { if (e.key === 'Escape') onClose() }
    window.addEventListener('keydown', handler)
    return () => window.removeEventListener('keydown', handler)
  }, [onClose])

  const isCompleted = detail?.status === 'COMPLETED'

  return (
    <>
      <div
        className={`fixed inset-0 z-50 bg-black/40 backdrop-blur-sm transition-opacity duration-300 ${
          isOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'
        }`}
        onClick={onClose}
      />

      <div
        className={`fixed top-0 right-0 z-50 h-full w-[560px] max-w-[95vw] flex flex-col bg-[var(--bg-surface)] border-l border-[var(--border)] shadow-2xl transition-transform duration-300 ease-out ${
          isOpen ? 'translate-x-0' : 'translate-x-full'
        }`}
      >
        {detail && (
          <>
            <div className="px-5 py-4 border-b border-[var(--border)] flex-shrink-0">
              <div className="flex items-start justify-between gap-3 mb-3">
                <div className="min-w-0">
                  <p className="text-[11px] font-mono text-[var(--text-muted)] mb-1">{detail.id}</p>
                  <h2 className="text-[15px] font-semibold text-[var(--text-primary)] leading-snug">{detail.title}</h2>
                </div>
                <button
                  onClick={onClose}
                  className="flex-shrink-0 w-7 h-7 rounded-full border border-[var(--border)] flex items-center justify-center text-[var(--text-muted)] hover:bg-[var(--bg-elevated)] transition-colors mt-0.5"
                >
                  <X size={13} />
                </button>
              </div>

              <div className="flex items-center gap-2 flex-wrap">
                <span className={`inline-flex items-center gap-1.5 text-[11px] font-semibold px-2.5 py-1 rounded-full ${
                  isCompleted
                    ? 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400'
                    : 'bg-blue-500/10 text-blue-600 dark:text-blue-400'
                }`}>
                  <span className={`w-1.5 h-1.5 rounded-full ${isCompleted ? 'bg-emerald-500' : 'bg-blue-500'}`} />
                  {getStatusLabel(detail.status)}
                </span>
                {detail.contract?.txHash ? (
                  <span className="text-[11px] font-mono text-[var(--text-muted)] px-2 py-1 bg-[var(--bg-elevated)] rounded-full border border-[var(--border)]">
                    {detail.contract.txHash} · SUI
                  </span>
                ) : (
                  <span className="text-[11px] font-mono text-[var(--text-muted)] px-2 py-1 bg-[var(--bg-elevated)] rounded-full border border-[var(--border)]">
                    {detail.estate} · Onchain
                  </span>
                )}
              </div>
            </div>

            <div className="grid grid-cols-3 gap-px border-b border-[var(--border)] flex-shrink-0 bg-[var(--border)]">
              {[
                { label: 'Blok · Estate', value: `${detail.block} · ${detail.estate.split(' ')[0]}` },
                { label: 'Koordinat', value: detail.coordinates, mono: true },
                { label: 'Reward', value: `${detail.reward} Poin`, accent: true },
              ].map(item => (
                <div key={item.label} className="bg-[var(--bg-surface)] px-4 py-3">
                  <p className="text-[10px] font-bold text-[var(--text-muted)] uppercase tracking-wider mb-1">{item.label}</p>
                  <p className={`text-[12px] font-semibold truncate ${
                    item.accent ? 'text-emerald-500' :
                    item.mono ? 'font-mono text-[11px] text-[var(--text-primary)]' :
                    'text-[var(--text-primary)]'
                  }`}>
                    {item.accent && <Zap size={10} className="inline mr-0.5 mb-0.5" />}
                    {item.value}
                  </p>
                </div>
              ))}
            </div>

            {detail.dronePrediction && (
              <div className="mx-4 mt-3 px-3 py-2.5 rounded-xl bg-[var(--bg-elevated)] border border-[var(--border)] flex-shrink-0">
                <div className="flex items-center gap-1.5 mb-1">
                  <Cpu size={10} className="text-[var(--text-muted)]" />
                  <p className="text-[10px] font-bold text-[var(--text-muted)] uppercase tracking-wider">Prediksi Drone AI</p>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-[12px] font-semibold text-blue-500 dark:text-blue-400">
                    {detail.dronePrediction.label}
                  </span>
                  <span className="text-[11px] text-[var(--text-muted)]">
                    {detail.dronePrediction.confidence}% confidence
                  </span>
                </div>
              </div>
            )}

            <div className="flex-1 overflow-y-auto px-4 py-4 space-y-2.5">
              <p className="text-[10px] font-bold text-[var(--text-muted)] uppercase tracking-wider mb-1">
                Submission Mitra ({detail.submissions.length})
              </p>

              {detail.submissions.map((sub, idx) => (
                <SubmissionCard key={idx} sub={sub} idx={idx} />
              ))}

              <p className="text-[11px] text-[var(--text-muted)] pt-2 border-t border-[var(--border-subtle)] leading-relaxed">
                {isCompleted
                  ? 'Verdict agronomis telah diterbitkan. Data submission masuk ke training dataset.'
                  : 'Task ini sedang diproses verifier — reward dikunci otomatis setelah verdict diterbitkan onchain.'}
              </p>
            </div>

            <div className={`flex-shrink-0 px-5 py-3 border-t border-[var(--border)] flex items-center justify-between ${
              isCompleted ? 'bg-emerald-500/5' : 'bg-[var(--bg-elevated)]'
            }`}>
              {isCompleted && detail.contract?.tokenMinted ? (
                <div className="flex items-center gap-3">
                  <div className="w-7 h-7 rounded-full bg-emerald-500/15 flex items-center justify-center">
                    <ShieldCheck size={13} className="text-emerald-500" />
                  </div>
                  <div>
                    <p className="text-[11px] font-mono text-emerald-600 dark:text-emerald-400">
                      TX: {detail.contract.txHash}
                    </p>
                    <p className="text-[10px] text-[var(--text-muted)]">
                      {detail.contract.mintedAt} · {detail.contract.amount} Poin dikirim
                    </p>
                  </div>
                </div>
              ) : (
                <div className="flex items-center gap-2 text-[11px] text-[var(--text-muted)]">
                  <div className="w-1.5 h-1.5 rounded-full bg-blue-400 animate-pulse" />
                  Menunggu verdict dari verifier
                </div>
              )}
              <button
                onClick={onClose}
                className="text-[12px] font-semibold text-[var(--text-secondary)] px-3 py-1.5 rounded-lg hover:bg-[var(--bg-hover)] transition-colors"
              >
                Tutup
              </button>
            </div>
          </>
        )}
      </div>
    </>
  )
}
