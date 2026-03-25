'use client'

import { useEffect, useState } from 'react'
import { X, Zap, ShieldCheck, PlayCircle, ChevronDown, ChevronUp, MapPin, Cpu, Camera, Search, Activity, User, AlertTriangle } from 'lucide-react'
import { TASK_DETAILS, VALIDATORS } from '@/lib/mock-data'
import { TIER_META } from '@/lib/constants'

interface TaskDetailDrawerProps {
  taskId: string | null
  onClose: () => void
}

function getStatusLabel(status: string): string {
  switch (status) {
    case 'COMPLETED': return 'Terverifikasi'
    case 'FLAGGED': return 'Perlu Review (Flagged)'
    default: return 'Sedang Diproses'
  }
}

// ─── Component: Kartu Laporan Mitra ───
function SubmissionCard({ sub, idx }: { sub: any; idx: number }) {
  const [open, setOpen] = useState(idx === 0)
  const [lightbox, setLightbox] = useState<string | null>(null)

  const tierMeta = TIER_META[sub.tier as keyof typeof TIER_META] || TIER_META['FIELD'];
  
  const getAvatarUrl = (mitraName: string) => {
    const validator = VALIDATORS.find(v => v.name === mitraName);
    return validator ? validator.avatar : null;
  }
  
  const getInitials = (name: string) => name.split(' ').map(n => n[0]).join('').substring(0, 2).toUpperCase()
  const avatarUrl = getAvatarUrl(sub.mitra)
  
  const actualPhotos = typeof sub.photos === 'number' ? [] : (sub.photos as string[] || [])
  const photoCount = actualPhotos.length
  const titleLabel = sub.diagnosisPrimer || sub.diagnosis || sub.kondisi || 'Observasi Lapangan'

  return (
    <>
      {lightbox && (
        <div className="fixed inset-0 z-[120] flex items-center justify-center bg-black/90 backdrop-blur-sm" onClick={() => setLightbox(null)}>
          <div className="relative max-w-5xl w-full mx-4" onClick={e => e.stopPropagation()}>
            <img src={lightbox} alt="Enlarged" className="w-full h-auto max-h-[85vh] object-contain rounded-xl shadow-2xl" />
            <button onClick={() => setLightbox(null)} className="absolute -top-12 right-0 text-white hover:text-emerald-400 p-2 font-bold tracking-wider">TUTUP (ESC)</button>
          </div>
        </div>
      )}

      <div className="rounded-2xl border shadow-sm overflow-hidden bg-[var(--bg-surface)] transition-all mb-4" style={{ borderColor: 'var(--border)' }}>
        <button onClick={() => setOpen(!open)} className="w-full px-5 py-4 sm:px-6 sm:py-5 flex items-center justify-between hover:bg-[var(--bg-hover)] transition-colors text-left cursor-pointer border-none outline-none bg-transparent">
          <div className="flex items-center gap-4 flex-1 min-w-0">
            {avatarUrl ? (
              <div className="w-12 h-12 rounded-full overflow-hidden border-2 border-[var(--bg-elevated)] shrink-0 bg-black">
                <img src={avatarUrl} alt="Avatar" className="w-full h-full object-cover opacity-90" />
              </div>
            ) : (
              <div className="w-12 h-12 rounded-full flex items-center justify-center border-2 border-[var(--bg-elevated)] shrink-0 bg-[var(--primary-muted)] text-[var(--primary)] font-bold text-lg">
                {getInitials(sub.mitra)}
              </div>
            )}
            
            <div className="flex-1 min-w-0 pr-2">
              <div className="flex items-center gap-2 mb-1">
                <span className="font-bold text-[14px] text-[var(--text-primary)] truncate">{sub.mitra}</span>
                <span className="px-2 py-0.5 rounded text-[9px] font-bold uppercase tracking-wider border" style={{ backgroundColor: tierMeta.bg, color: tierMeta.color, borderColor: tierMeta.color }}>
                  {tierMeta.label}
                </span>
              </div>
              <div className="flex items-center gap-3 text-[11px] text-[var(--text-muted)] font-medium">
                <span className="truncate">"{titleLabel}"</span>
                <span className="w-1 h-1 rounded-full bg-[var(--border)] shrink-0" />
                <span className="flex items-center gap-1 shrink-0 font-mono font-bold">
                  <MapPin size={10} className={Number(sub.gpsDistM) <= 15 ? "text-emerald-500" : "text-amber-500"} />
                  <span className={Number(sub.gpsDistM) > 15 ? "text-amber-500" : ""}>{sub.gpsDistM}m</span>
                </span>
              </div>
            </div>
          </div>
          {open ? <ChevronUp size={20} className="text-[var(--text-muted)] shrink-0" /> : <ChevronDown size={20} className="text-[var(--text-muted)] shrink-0" />}
        </button>

        {open && (
          <div className="border-t border-[var(--border)] bg-[var(--bg-base)] flex flex-col pt-4 pb-6 px-5 gap-5">
            {photoCount > 0 && (
              <div>
                <div className="text-[10px] font-bold text-[var(--text-muted)] uppercase tracking-widest mb-2 flex items-center gap-1.5">
                  <Camera size={14} /> Eviden Visual ({photoCount})
                </div>
                <div className="flex gap-3 overflow-x-auto pb-2 snap-x" style={{ scrollbarWidth: 'thin' }}>
                  {actualPhotos.map((photoName: string, pIdx: number) => {
                    const imgUrl = `https://picsum.photos/seed/${photoName.replace('.jpg', '')}/600/400`;
                    return (
                      <div key={pIdx} onClick={() => setLightbox(imgUrl)} className="w-[180px] h-[120px] shrink-0 rounded-xl overflow-hidden bg-[var(--bg-surface)] border border-[var(--border)] snap-start shadow-sm relative group cursor-pointer">
                        <img src={imgUrl} alt={photoName} className="w-full h-full object-cover opacity-90 group-hover:scale-105 transition-transform duration-500" />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent flex items-end p-2"><span className="text-[9px] font-mono text-white truncate">{photoName}</span></div>
                      </div>
                    )
                  })}
                  {sub.video && (
                    <div className="w-[180px] h-[120px] shrink-0 rounded-xl bg-emerald-500/10 border border-emerald-500/30 flex flex-col items-center justify-center text-emerald-500 shadow-sm cursor-pointer">
                      <PlayCircle size={28} className="mb-2 opacity-80" />
                      <span className="text-[10px] font-bold uppercase tracking-wider">Video MP4</span>
                    </div>
                  )}
                </div>
              </div>
            )}

            {sub.tier === 'FIELD' && (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                <div className="bg-[var(--bg-surface)] p-4 rounded-xl border border-[var(--border)] shadow-sm">
                  <div className="text-[9px] font-bold text-[var(--text-muted)] uppercase tracking-widest mb-2">Tingkat Keparahan</div>
                  <div className="font-bold text-[14px] text-[var(--text-primary)]">Level {sub.keparahan || sub.severity || '-'}/5</div>
                </div>
                <div className="bg-[var(--bg-surface)] p-4 rounded-xl border border-[var(--border)] shadow-sm">
                  <div className="text-[9px] font-bold text-[var(--text-muted)] uppercase tracking-widest mb-2">Estimasi Luasan</div>
                  <div className="font-bold text-[14px] text-[var(--text-primary)]">{sub.estimasiLuas || sub.estimate || '-'}</div>
                </div>
                
                {(sub.gejala || sub.symptoms) && (
                  <div className="bg-[var(--bg-surface)] p-4 rounded-xl border border-[var(--border)] shadow-sm md:col-span-2">
                    <div className="text-[9px] font-bold text-[var(--text-muted)] uppercase tracking-widest mb-2">Gejala Teramati</div>
                    {Array.isArray(sub.gejala) ? (
                      <div className="flex flex-wrap gap-2 mt-1">
                        {sub.gejala.map((g: string) => (
                          <span key={g} className="text-[11px] font-semibold text-[var(--text-secondary)] bg-[var(--bg-base)] border border-[var(--border)] px-2.5 py-1.5 rounded-md shadow-sm">✓ {g}</span>
                        ))}
                      </div>
                    ) : (
                      <div className="text-[13px] text-[var(--text-secondary)] leading-relaxed italic">"{sub.symptoms}"</div>
                    )}
                  </div>
                )}

                <div className="bg-[var(--bg-surface)] p-4 rounded-xl border border-[var(--border)] shadow-sm md:col-span-2">
                  <div className="text-[9px] font-bold text-[var(--text-muted)] uppercase tracking-widest mb-2">Catatan Lapangan</div>
                  <div className="text-[13px] text-[var(--text-secondary)] italic leading-relaxed">"{sub.catatanTambahan || sub.note}"</div>
                </div>
              </div>
            )}

            {sub.tier === 'QUICK' && (
               <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                 <div className="bg-[var(--bg-surface)] p-4 rounded-xl border border-[var(--border)] shadow-sm">
                   <div className="text-[9px] font-bold text-[var(--text-muted)] uppercase tracking-widest mb-2">Kondisi Umum</div>
                   <div className="font-bold text-[14px] text-[var(--text-primary)]">{sub.kondisi || sub.diagnosis}</div>
                 </div>
                 <div className="bg-[var(--bg-surface)] p-4 rounded-xl border border-[var(--border)] shadow-sm">
                   <div className="text-[9px] font-bold text-[var(--text-muted)] uppercase tracking-widest mb-2">Keterangan Singkat</div>
                   <div className="font-medium text-[13px] text-[var(--text-secondary)] italic">"{sub.catatanSingkat || sub.note}"</div>
                 </div>
               </div>
            )}

            {sub.tier === 'EXPERT' && (
               <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  <div className="bg-[var(--bg-surface)] p-4 rounded-xl border border-[var(--border)] shadow-sm">
                    <div className="text-[9px] font-bold text-[var(--text-muted)] uppercase tracking-widest mb-2">Diagnosis Definitif</div>
                    <div className="font-bold text-[14px] text-[var(--text-primary)]">{sub.diagnosisPrimer || sub.diagnosis}</div>
                  </div>
                  <div className="bg-amber-500/5 p-4 rounded-xl border border-amber-500/20 shadow-sm">
                    <div className="text-[9px] font-bold text-amber-500 uppercase tracking-widest mb-2">Urgensi & Objek</div>
                    <div className="font-bold text-[14px] text-amber-500">{sub.urgensi || sub.severity || '-'} • {sub.estimasiPohon || sub.estimate || '-'}</div>
                  </div>
                  
                  <div className="bg-[var(--bg-surface)] p-4 rounded-xl border border-[var(--border)] shadow-sm md:col-span-2">
                    <div className="text-[9px] font-bold text-[var(--text-muted)] uppercase tracking-widest mb-2">Gejala Fisik Forensik</div>
                    <div className="text-[13px] text-[var(--text-secondary)] leading-relaxed italic">
                      "{sub.expertSymptoms || sub.symptoms}"
                    </div>
                  </div>

                  <div className="bg-emerald-500/5 p-4 rounded-xl border border-emerald-500/20 shadow-sm md:col-span-2">
                    <div className="text-[9px] font-bold text-emerald-500 uppercase tracking-widest mb-2">Rekomendasi Ahli</div>
                    <div className="text-[13px] font-bold text-emerald-600 dark:text-emerald-400 leading-relaxed">
                      {sub.rekomendasiTindakan || sub.note || '-'}
                    </div>
                  </div>
               </div>
            )}
          </div>
        )}
      </div>
    </>
  )
}

// ─── Component Utama: Modal Tengah ───
export function TaskDetailDrawer({ taskId, onClose }: TaskDetailDrawerProps) {
  const detail = taskId ? TASK_DETAILS[taskId] : null
  const isOpen = !!detail
  const [expandedDrone, setExpandedDrone] = useState(true)
  const [lightbox, setLightbox] = useState<string | null>(null)

  useEffect(() => {
    if (isOpen) document.body.style.overflow = 'hidden'
    else document.body.style.overflow = ''
    return () => { document.body.style.overflow = '' }
  }, [isOpen])

  // Tekan ESC untuk menutup modal utama
  useEffect(() => {
    const handler = (e: KeyboardEvent) => { if (e.key === 'Escape' && !lightbox) onClose() }
    window.addEventListener('keydown', handler)
    return () => window.removeEventListener('keydown', handler)
  }, [onClose, lightbox])

  if (!detail) return null;
  const isCompleted = detail.status === 'COMPLETED'

  // PERBAIKAN: Mengamankan data AI Drone dengan fallback per-properti (Bulletproof fallback)
  // Ini menghindari error visual jika `detail.dronePrediction` berupa object kosong `{}`
  const droneData = {
    label: detail.dronePrediction?.label || 'Pemindaian Udara Selesai',
    confidence: detail.dronePrediction?.confidence || 85,
    notes: detail.dronePrediction?.notes || 'Pemindaian otomatis selesai, temuan anomali sedang menunggu verifikasi lapangan.'
  };

  const dronePhotos = [
    `https://picsum.photos/seed/drone_1_${detail.id}/800/600`,
    `https://picsum.photos/seed/drone_2_${detail.id}/800/600`,
    `https://picsum.photos/seed/drone_3_${detail.id}/800/600`
  ]

  return (
    <>
      {lightbox && (
        <div className="fixed inset-0 z-[120] flex items-center justify-center bg-black/90 backdrop-blur-sm" onClick={() => setLightbox(null)}>
          <div className="relative max-w-5xl w-full mx-4" onClick={e => e.stopPropagation()}>
            <img src={lightbox} alt="Enlarged" className="w-full h-auto max-h-[85vh] object-contain rounded-xl shadow-2xl" />
            <button onClick={() => setLightbox(null)} className="absolute -top-12 right-0 text-white hover:text-emerald-400 p-2 font-bold tracking-wider">TUTUP (ESC)</button>
          </div>
        </div>
      )}

      <div 
        className={`fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm transition-all duration-300 ${isOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'}`} 
        onClick={onClose}
      >
        <div 
          className={`w-full max-w-4xl max-h-[90vh] flex flex-col bg-[var(--bg-surface)] border border-[var(--border)] shadow-2xl rounded-2xl overflow-hidden transition-transform duration-300 ease-out ${isOpen ? 'scale-100' : 'scale-95'}`}
          onClick={e => e.stopPropagation()}
        >
          {/* Header */}
          <div className="px-6 py-5 border-b border-[var(--border)] flex-shrink-0 bg-[var(--bg-elevated)] flex justify-between items-start gap-4">
            <div className="min-w-0">
              <div className="flex items-center gap-2 mb-1.5">
                <span className="text-[11px] font-mono text-[var(--text-muted)] bg-[var(--bg-base)] px-2 py-0.5 rounded border border-[var(--border)] shadow-sm">{detail.id}</span>
                <span className={`px-2.5 py-0.5 rounded text-[9px] font-bold uppercase tracking-widest border shadow-sm ${
                  isCompleted ? 'bg-emerald-500/10 text-emerald-500 border-emerald-500/20' : 'bg-amber-500/10 text-amber-500 border-amber-500/20'
                }`}>
                  {getStatusLabel(detail.status)}
                </span>
              </div>
              <h2 className="text-[18px] font-bold text-[var(--text-primary)] leading-snug">{detail.title}</h2>
            </div>
            <button onClick={onClose} className="p-2 rounded-lg bg-[var(--bg-base)] border border-[var(--border)] text-[var(--text-muted)] hover:text-white transition-colors cursor-pointer shrink-0">
              <X size={16} />
            </button>
          </div>

          {/* Top Stats Grid */}
          <div className="grid grid-cols-3 gap-px bg-[var(--border)] shrink-0 border-b border-[var(--border)]">
            <div className="bg-[var(--bg-surface)] px-6 py-3">
              <p className="text-[9px] font-bold text-[var(--text-muted)] uppercase tracking-widest mb-1">Blok Area</p>
              <p className="text-[13px] font-bold text-[var(--text-primary)] truncate">{detail.block}</p>
            </div>
            <div className="bg-[var(--bg-surface)] px-6 py-3">
              <p className="text-[9px] font-bold text-[var(--text-muted)] uppercase tracking-widest mb-1">Koordinat</p>
              <p className="font-mono text-[12px] font-bold text-[var(--text-primary)] truncate">{detail.coordinates}</p>
            </div>
            <div className="bg-[var(--bg-surface)] px-6 py-3">
              <p className="text-[9px] font-bold text-[var(--text-muted)] uppercase tracking-widest mb-1">Reward</p>
              <p className="text-[14px] font-bold text-emerald-500 flex items-center gap-1"><Zap size={14}/>{detail.reward} Points</p>
            </div>
          </div>

          {/* Main Scrollable Content */}
          <div className="flex-1 overflow-y-auto p-6 bg-[var(--bg-base)] flex flex-col gap-6">
            
            {/* PERBAIKAN: Menambahkan 'shrink-0' agar elemen tidak tertimpa/hilang karena flex behavior */}
            {/* AI Drone Evidence */}
            <div className="shrink-0 rounded-2xl overflow-hidden shadow-sm border border-[var(--border)] bg-[var(--bg-surface)]">
              <button onClick={() => setExpandedDrone(!expandedDrone)} className="w-full px-6 py-4 flex items-center justify-between hover:bg-[var(--bg-hover)] transition-colors text-left border-none outline-none bg-transparent cursor-pointer">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 rounded-xl bg-blue-500/10 flex items-center justify-center border border-blue-500/20 text-blue-500 shrink-0">
                    <Cpu size={20} />
                  </div>
                  <div>
                    <div className="text-[10px] font-bold text-[var(--primary)] uppercase tracking-widest flex items-center gap-1.5 mb-1">Deteksi Awal AI Drone</div>
                    <div className="text-[14px] font-bold text-[var(--text-primary)] flex items-center gap-2">
                      {droneData.label}
                      <span className="px-2 py-0.5 text-[9px] font-mono bg-[var(--bg-elevated)] text-emerald-500 rounded border border-[var(--border)] shadow-sm">Conf: {droneData.confidence}%</span>
                    </div>
                  </div>
                </div>
                {expandedDrone ? <ChevronUp size={18} className="text-[var(--text-muted)]" /> : <ChevronDown size={18} className="text-[var(--text-muted)]" />}
              </button>

              {expandedDrone && (
                <div className="border-t border-[var(--border)] bg-[var(--bg-base)] flex flex-col pt-4 pb-2 px-6 gap-4">
                  <div>
                    <div className="text-[10px] font-bold text-[var(--text-muted)] uppercase tracking-widest mb-3 flex items-center gap-1.5">
                      <Camera size={14} /> Frame Tangkapan Udara ({dronePhotos.length})
                    </div>
                    <div className="flex gap-4 overflow-x-auto pb-2 snap-x" style={{ scrollbarWidth: 'thin' }}>
                      {dronePhotos.map((url, idx) => (
                        <div key={idx} onClick={() => setLightbox(url)} className="w-[200px] h-[130px] shrink-0 rounded-xl overflow-hidden bg-[var(--bg-surface)] border border-[var(--border)] snap-start shadow-sm relative group cursor-pointer">
                          <img src={url} alt="Drone" className="w-full h-full object-cover opacity-90 group-hover:scale-105 transition-transform duration-500" />
                          <div className="absolute inset-0 bg-black/20 opacity-0 group-hover:opacity-100 flex items-center justify-center transition-opacity"><Search size={24} className="text-white drop-shadow-md"/></div>
                        </div>
                      ))}
                    </div>
                  </div>
                  <div className="py-4 border-t border-[var(--border-subtle)] flex gap-3 items-start mt-2">
                    <Activity size={18} className="text-[var(--text-muted)] shrink-0 mt-0.5" />
                    <div className="text-sm text-[var(--text-secondary)] leading-relaxed font-medium">
                      {droneData.notes}
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Submissions */}
            <div className="shrink-0 flex flex-col">
              <p className="text-[11px] font-bold text-[var(--text-muted)] uppercase tracking-widest mb-3 ml-1 flex items-center gap-2">
                <User size={14}/> Laporan Investigasi Lapangan ({detail.submissions?.length || 0})
              </p>
              <div className="flex flex-col gap-4">
                {detail.submissions?.map((sub: any, i: number) => (
                  <SubmissionCard key={i} sub={sub} idx={i} />
                ))}
                {(!detail.submissions || detail.submissions.length === 0) && (
                  <div className="p-6 text-center text-sm text-[var(--text-muted)] border border-[var(--border)] rounded-2xl bg-[var(--bg-surface)]">
                    Belum ada laporan dari mitra lapangan untuk task ini.
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Footer */}
          <div className="px-6 py-4 border-t border-[var(--border)] bg-[var(--bg-surface)] shrink-0 flex items-center justify-between">
            {isCompleted && detail.contract?.tokenMinted ? (
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-full bg-emerald-500/10 flex items-center justify-center border border-emerald-500/20">
                  <ShieldCheck size={16} className="text-emerald-500" />
                </div>
                <div>
                  <p className="text-[12px] font-bold text-emerald-500">Poin Telah Dicairkan</p>
                  <p className="font-mono text-[10px] text-[var(--text-muted)] mt-0.5">TX: {detail.contract.txHash}</p>
                </div>
              </div>
            ) : (
               <div className="flex items-center gap-3">
                 <div className="w-9 h-9 rounded-full bg-amber-500/10 flex items-center justify-center border border-amber-500/20">
                   <AlertTriangle size={16} className="text-amber-500" />
                 </div>
                 <div>
                   <p className="text-[12px] font-bold text-amber-500">Menunggu Keputusan Verifier</p>
                   <p className="font-mono text-[10px] text-[var(--text-muted)] mt-0.5">Reward sedang ditahan</p>
                 </div>
               </div>
            )}
            <button onClick={onClose} className="px-6 py-2.5 rounded-lg border border-[var(--border)] text-[var(--text-secondary)] font-bold text-xs hover:bg-[var(--bg-hover)] transition-colors cursor-pointer bg-[var(--bg-elevated)]">
              Tutup Panel
            </button>
          </div>
          
        </div>
      </div>
    </>
  )
}