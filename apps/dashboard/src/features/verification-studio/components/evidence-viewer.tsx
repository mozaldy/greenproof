import { useState } from 'react'
import { MapPin, CheckCircle2, Cpu, ChevronUp, ChevronDown, Activity, User, Camera, FileCheck, CheckSquare } from 'lucide-react'
import { Badge } from '@/components/ui/badge'
import { TIER_META } from '@/lib/constants'
import { VerifierCase } from '@/types'

interface Props {
  activeCase: VerifierCase
  showForm: boolean
  onOpenForm: () => void
}

export function EvidenceViewer({ activeCase, showForm, onOpenForm }: Props) {
  const [expandedDrone, setExpandedDrone] = useState(true)
  const [expandedSubs, setExpandedSubs] = useState<Record<string, boolean>>({})

  const toggleSub = (id: string) => setExpandedSubs(p => ({ ...p, [id]: !p[id] }))

  return (
    <div className={`flex-1 overflow-y-auto p-4 md:p-8 transition-all duration-300 ${showForm ? 'mr-[420px]' : ''}`} style={{ background: 'var(--bg-base)' }}>
      <div className="max-w-5xl mx-auto flex flex-col gap-6">
        
        {/* Header Info */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-[var(--bg-surface)] border border-[var(--border)] shadow-sm">
              <MapPin size={14} className="text-[var(--primary)]" />
              <span className="text-sm font-bold text-[var(--text-primary)] tracking-wide">
                {activeCase.blockCtx.estate} — Blok {activeCase.block}
              </span>
            </div>
          </div>
          {activeCase.verdictPhase === 'GRADED' && (
            <div className="px-3 py-1.5 rounded bg-[#10b981]/10 text-[#10b981] font-bold text-sm flex items-center gap-2 border border-[#10b981]/20 shadow-sm">
              <CheckCircle2 size={16} /> DATA TERVERIFIKASI
            </div>
          )}
        </div>

        {/* ── Drone Aerial Evidence ── */}
        <div className="rounded-xl overflow-hidden shadow-sm border bg-[var(--bg-surface)] transition-all" style={{ borderColor: 'var(--border)' }}>
          <button onClick={() => setExpandedDrone(!expandedDrone)} className="w-full px-5 py-4 flex items-center justify-between hover:bg-[var(--bg-hover)] transition-colors text-left cursor-pointer border-none outline-none bg-transparent">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded bg-black overflow-hidden shadow-inner shrink-0">
                <img src={activeCase.caseId === 'VRD-001' ? 'https://picsum.photos/seed/drone1/100/100' : 'https://picsum.photos/seed/drone2/100/100'} alt="Drone" className="w-full h-full object-cover opacity-80" />
              </div>
              <div>
                <div className="text-[10px] font-bold text-[var(--primary)] uppercase tracking-widest flex items-center gap-1.5 mb-1">
                  <Cpu size={12} /> Deteksi Awal AI Drone
                </div>
                <div className="text-[15px] font-bold text-[var(--text-primary)] flex items-center gap-3">
                  {activeCase.dronePrediction.label}
                  <span className="px-2 py-0.5 text-[10px] font-mono bg-[var(--bg-elevated)] text-[#10b981] rounded border border-[var(--border)]">
                    Conf: {activeCase.dronePrediction.confidence}%
                  </span>
                </div>
              </div>
            </div>
            {expandedDrone ? <ChevronUp size={20} className="text-[var(--text-muted)]" /> : <ChevronDown size={20} className="text-[var(--text-muted)]" />}
          </button>

          {expandedDrone && (
            <div className="border-t border-[var(--border)] bg-[var(--bg-base)]">
              <div className="h-[280px] w-full relative">
                <img src={activeCase.caseId === 'VRD-001' ? 'https://picsum.photos/seed/drone1/800/400' : 'https://picsum.photos/seed/drone2/800/400'} alt="Survey" className="w-full h-full object-cover" />
              </div>
              <div className="px-5 py-4 flex gap-3 items-start">
                <Activity size={18} className="text-[var(--text-muted)] shrink-0 mt-0.5" />
                <div className="text-sm text-[var(--text-secondary)] leading-relaxed">
                  <span className="font-semibold text-[var(--text-primary)]">Log Analisis Sistem:</span> {activeCase.dronePrediction.notes}
                </div>
              </div>
            </div>
          )}
        </div>

        {/* ── Human Field Submissions ── */}
        <div>
          <div className="text-sm font-bold text-[var(--text-muted)] uppercase tracking-widest flex items-center gap-2 mb-4 pl-1">
            <User size={16} /> Laporan Investigasi Lapangan ({activeCase.submissions.length})
          </div>
          
          <div className="flex flex-col gap-3">
            {activeCase.submissions.map((sub, i) => {
              const isExpanded = !!expandedSubs[sub.id];
              const tierMeta = TIER_META[sub.tier]
              
              const photos = [
                (activeCase.taskId === 'TK-2849' && i === 1) ? 'https://picsum.photos/seed/wahyu/400/300' : `https://picsum.photos/seed/${sub.id}/400/300`,
                `https://picsum.photos/seed/${sub.id}_2/400/300`,
                `https://picsum.photos/seed/${sub.id}_3/400/300`,
              ];
              const photoCount = Array.isArray(sub.photos) ? sub.photos.length : sub.photos

              return (
                <div key={sub.id} className="rounded-xl border shadow-sm overflow-hidden bg-[var(--bg-surface)] transition-all" style={{ borderColor: 'var(--border)' }}>
                  <button onClick={() => toggleSub(sub.id)} className="w-full px-4 py-3 sm:px-5 sm:py-4 flex items-center justify-between hover:bg-[var(--bg-hover)] transition-colors text-left cursor-pointer border-none outline-none bg-transparent">
                    <div className="flex items-center gap-3 sm:gap-4 flex-1 min-w-0">
                      <div className="w-12 h-12 sm:w-14 sm:h-14 rounded bg-black overflow-hidden shadow-inner shrink-0 relative">
                        <img src={photos[0]} alt="Thumb" className="w-full h-full object-cover opacity-90" />
                        {!isExpanded && (
                          <div className="absolute inset-0 bg-black/30 flex justify-center items-center">
                            <span className="text-white text-[10px] sm:text-xs font-bold font-mono">+{photoCount}</span>
                          </div>
                        )}
                      </div>
                      
                      <div className="flex-1 min-w-0 pr-2">
                        <div className="flex items-center gap-2 sm:gap-3 mb-1">
                          <span className="font-bold text-[13px] sm:text-[15px] text-[var(--text-primary)] truncate">{sub.mitra}</span>
                          <Badge bg={tierMeta.bg} color={tierMeta.color} border={tierMeta.color}>{tierMeta.label}</Badge>
                        </div>
                        <div className="flex items-center gap-3 sm:gap-4 text-[11px] sm:text-xs text-[var(--text-muted)]">
                          <span className="font-semibold text-[var(--text-secondary)] truncate">"{sub.diagnosisPrimer || sub.kondisi || sub.catatanSingkat || 'Tinjauan Umum'}"</span>
                          <span className="hidden sm:inline-block w-1 h-1 rounded-full bg-[var(--border)] shrink-0" />
                          <span className="flex items-center gap-1 shrink-0 font-mono">
                            <MapPin size={10} className={Number(sub.gpsDistM) <= 15 ? "text-[#10b981]" : "text-[var(--danger)]"} />
                            <span className={Number(sub.gpsDistM) > 15 ? "text-[var(--danger)]" : ""}>{sub.gpsDistM}m</span>
                          </span>
                        </div>
                      </div>
                    </div>
                    {isExpanded ? <ChevronUp size={20} className="text-[var(--text-muted)] shrink-0" /> : <ChevronDown size={20} className="text-[var(--text-muted)] shrink-0" />}
                  </button>

                  {isExpanded && (
                    <div className="border-t border-[var(--border)] bg-[var(--bg-base)] flex flex-col pt-2">
                      <div className="px-4 py-3 sm:px-5">
                        <div className="text-[10px] font-bold text-[var(--text-muted)] uppercase tracking-widest mb-2 flex items-center gap-1">
                          <Camera size={12} /> Galeri Eviden Visual ({photoCount})
                        </div>
                        <div className="flex gap-3 overflow-x-auto pb-2 snap-x">
                          {photos.map((pUrl, pIdx) => (
                            <div key={pIdx} className="w-[200px] h-[140px] sm:w-[280px] sm:h-[180px] shrink-0 rounded-lg overflow-hidden bg-black border border-[var(--border)] snap-start">
                               <img src={pUrl} alt="Visual" className="w-full h-full object-cover opacity-90" />
                            </div>
                          ))}
                        </div>
                      </div>

                      {/* Detail Information */}
                      <div className="px-4 sm:px-5 py-4 mb-2 bg-[var(--bg-surface)] border-y border-[var(--border)] flex flex-col gap-4">
                        
                        {/* EXPERT (Forensic Analysis) */}
                        {sub.tier === 'EXPERT' && (
                          <div className="flex flex-col gap-4">
                            <div className="inline-block px-2 py-1 rounded w-fit border border-[#10b981]/30 bg-[#10b981]/10 text-[#10b981] font-bold text-[10px] uppercase tracking-wide">
                              Expert Forensic Form ✓
                            </div>
                            <div className="grid grid-cols-2 gap-4">
                              <div>
                                <div className="text-[10px] font-bold text-[var(--text-muted)] uppercase tracking-wider mb-1">Diagnosis Definitif</div>
                                <div className="font-bold text-sm text-[var(--text-primary)] flex items-center gap-2">
                                  {sub.diagnosisPrimer || sub.diagnosis}
                                </div>
                              </div>
                              <div>
                                <div className="text-[10px] font-bold text-[var(--text-muted)] uppercase tracking-wider mb-1">Estimasi Objek</div>
                                <div className="font-bold text-sm text-[var(--text-primary)]">{sub.estimasiPohon || sub.estimate || '-'}</div>
                              </div>
                            </div>
                            
                            <div className="grid grid-cols-2 gap-4 p-3 bg-[var(--bg-elevated)] rounded-lg border border-[var(--primary-border)]/20 shadow-sm">
                              <div>
                                <div className="text-[10px] font-bold text-[var(--text-muted)] uppercase tracking-wider mb-1">Urgensi Penanganan</div>
                                {/* FIX TERHADAP ERROR TYPING ADA DI BAWAH INI */}
                                <div className="font-bold text-[13px] text-[var(--danger)]">{sub.urgensi || '-'}</div>
                              </div>
                              <div>
                                <div className="text-[10px] font-bold text-[var(--text-muted)] uppercase tracking-wider mb-1">Rekomendasi Ahli</div>
                                <div className="font-bold text-[13px] text-[var(--primary)]">{sub.rekomendasiTindakan || sub.note || '-'}</div>
                              </div>
                            </div>

                            <div>
                              <div className="text-[10px] font-bold text-[var(--text-muted)] uppercase tracking-wider mb-1">Gejala Fisik Teramati</div>
                              <div className="text-[12px] sm:text-[13px] text-[var(--text-secondary)] leading-relaxed bg-[var(--bg-base)] p-3 rounded-lg border border-[var(--border)] italic">
                                "{sub.expertSymptoms || sub.symptoms}"
                              </div>
                            </div>
                          </div>
                        )}

                        {/* FIELD (Standard Report) */}
                        {sub.tier === 'FIELD' && (
                          <div className="flex flex-col gap-4">
                            <div className="inline-block px-2 py-1 rounded w-fit border border-[#6366f1]/30 bg-[#6366f1]/10 text-[#6366f1] font-bold text-[10px] uppercase tracking-wide">
                              Laporan Standar
                            </div>
                            <div>
                              <div className="text-[10px] font-bold text-[var(--text-muted)] uppercase tracking-wider mb-1">Gejala Teramati</div>
                              {sub.gejala && (
                                <div className="flex flex-wrap gap-1.5 mt-1">
                                  {sub.gejala.map(g => (
                                    <span key={g} className="text-[10px] text-[var(--text-secondary)] bg-[var(--bg-base)] border border-[var(--border)] px-1.5 py-0.5 rounded shadow-sm">✓ {g}</span>
                                  ))}
                                </div>
                              )}
                            </div>
                            <div className="grid grid-cols-2 gap-4">
                              <div>
                                <div className="text-[10px] font-bold text-[var(--text-muted)] uppercase tracking-wider mb-1">Tingkat Keparahan</div>
                                <div className="font-bold text-sm text-[var(--text-primary)]">Level {sub.keparahan}/5</div>
                              </div>
                              <div>
                                <div className="text-[10px] font-bold text-[var(--text-muted)] uppercase tracking-wider mb-1">Estimasi Luasan</div>
                                <div className="font-bold text-sm text-[var(--text-primary)]">{sub.estimasiLuas || '-'}</div>
                              </div>
                            </div>
                            <div>
                              <div className="text-[10px] font-bold text-[var(--text-muted)] uppercase tracking-wider mb-1">Catatan Tambahan</div>
                              <div className="text-[12px] sm:text-[13px] text-[var(--text-secondary)] leading-relaxed bg-[var(--bg-base)] p-3 rounded-lg border border-[var(--border)]">
                                "{sub.catatanTambahan}"
                              </div>
                            </div>
                          </div>
                        )}

                        {/* QUICK (Basic Report) */}
                        {sub.tier === 'QUICK' && (
                          <div className="flex flex-col gap-4">
                            <div className="inline-block px-2 py-1 rounded w-fit border border-[#6b7280]/30 bg-[#6b7280]/10 text-[var(--text-muted)] font-bold text-[10px] uppercase tracking-wide">
                              Observasi Cepat (Basic)
                            </div>
                            <div>
                              <div className="text-[10px] font-bold text-[var(--text-muted)] uppercase tracking-wider mb-1">Kondisi Umum</div>
                              <div className="font-bold text-sm text-[var(--text-primary)]">
                                {sub.kondisi}
                              </div>
                            </div>
                            <div>
                              <div className="text-[10px] font-bold text-[var(--text-muted)] uppercase tracking-wider mb-1">Keterangan Singkat</div>
                              <div className="text-[12px] sm:text-[13px] text-[var(--text-secondary)] leading-relaxed bg-[var(--bg-base)] p-3 rounded-lg border border-[var(--border)] shadow-inner">
                                "{sub.catatanSingkat}"
                              </div>
                            </div>
                          </div>
                        )}
                      </div>
                    </div>
                  )}
                </div>
              )
            })}
          </div>
        </div>

        {/* Floating Actions */}
        {!showForm && activeCase.verdictPhase === 'PENDING' && (
          <div className="absolute bottom-6 right-6 sm:bottom-8 sm:right-8 z-20">
            <button onClick={onOpenForm} className="px-5 py-3 sm:px-6 sm:py-4 rounded-full shadow-2xl flex items-center gap-2 sm:gap-3 transition-transform hover:scale-105 border cursor-pointer" style={{ background: 'var(--primary)', color: 'var(--text-inverse)', borderColor: 'var(--primary-border)' }}>
              <FileCheck size={18} className="sm:w-5 sm:h-5" />
              <span className="font-bold text-xs sm:text-sm tracking-wide uppercase">Lakukan Verifikasi Data</span>
            </button>
          </div>
        )}
        {!showForm && activeCase.verdictPhase === 'GRADED' && (
           <div className="absolute bottom-6 right-6 sm:bottom-8 sm:right-8 z-20">
            <button onClick={onOpenForm} className="px-5 py-3 sm:px-6 sm:py-4 rounded-full flex items-center gap-2 sm:gap-3 transition-colors border shadow-lg cursor-pointer" style={{ background: 'var(--bg-surface)', color: 'var(--text-primary)', borderColor: 'var(--border)' }}>
              <CheckSquare size={18} className="sm:w-5 sm:h-5 text-[#10b981]" />
              <span className="font-bold text-xs sm:text-sm tracking-wide uppercase text-opacity-80">Lihat Hasil Verifikasi</span>
            </button>
          </div>
        )}
      </div>
    </div>
  )
}