import { useState } from 'react'
import { MapPin, CheckCircle2, Cpu, ChevronUp, ChevronDown, Activity, User, Camera, FileCheck, CheckSquare, Search } from 'lucide-react'
import { Badge } from '@/components/ui/badge'
import { TIER_META } from '@/lib/constants'
import { VALIDATORS } from '@/lib/mock-data'
import { VerifierCase } from '@/types'

interface Props {
  activeCase: VerifierCase
  showForm: boolean
  onOpenForm: () => void
}

export function EvidenceViewer({ activeCase, showForm, onOpenForm }: Props) {
  const [expandedDrone, setExpandedDrone] = useState(true)
  const [expandedSubs, setExpandedSubs] = useState<Record<string, boolean>>({})
  const [lightbox, setLightbox] = useState<string | null>(null)

  const toggleSub = (id: string) => setExpandedSubs(p => ({ ...p, [id]: !p[id] }))

  const getAvatarUrl = (mitraName: string) => {
    const validator = VALIDATORS.find(v => v.name === mitraName);
    return validator ? validator.avatar : null;
  }

  const getInitials = (name: string) => {
    return name.split(' ').map(n => n[0]).join('').substring(0, 2).toUpperCase();
  }

  // Generate multi-images untuk Drone (Simulasi beberapa frame tangkapan)
  const dronePhotos = [
    `/images/drone-aerial-1.webp`,
    `/images/drone-aerial-2.jpg`,
    `/images/drone-aerial-3.jpg`,
  ]

  return (
    <>
      {lightbox && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/90 backdrop-blur-sm" onClick={() => setLightbox(null)}>
          <div className="relative max-w-5xl w-full mx-4" onClick={e => e.stopPropagation()}>
            <img src={lightbox} alt="Enlarged" className="w-full h-auto max-h-[85vh] object-contain rounded-xl" />
            <button onClick={() => setLightbox(null)} className="absolute -top-12 right-0 text-white hover:text-emerald-400 p-2 font-semibold">
              Tutup (Esc)
            </button>
          </div>
        </div>
      )}

      <div className="flex-1 overflow-y-auto p-4 md:p-8 transition-all duration-300" style={{ background: 'var(--bg-base)' }}>
        <div className="max-w-5xl mx-auto flex flex-col gap-8">
          
          {/* ── HEADER KONTEN & TOMBOL ACTION ── */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-[var(--border-subtle)] pb-5">
            <div className="flex items-center gap-3">
              <div className="flex items-center gap-2 px-4 py-2 rounded-xl bg-[var(--bg-surface)] border border-[var(--border)] shadow-sm">
                <MapPin size={16} className="text-[var(--primary)]" />
                <span className="text-[15px] font-bold text-[var(--text-primary)] tracking-wide">
                  {activeCase.blockCtx.estate} — Blok {activeCase.block}
                </span>
              </div>
            </div>
            
            {!showForm && (
              <div className="flex items-center gap-3">
                {activeCase.verdictPhase === 'PENDING' ? (
                  <button onClick={onOpenForm} className="px-6 py-3 rounded-xl flex items-center gap-2 transition-all hover:-translate-y-0.5 border cursor-pointer shadow-md bg-[var(--primary)] text-white border-[var(--primary-border)] hover:bg-emerald-500">
                    <FileCheck size={16} />
                    <span className="font-bold text-[13px] tracking-wide uppercase">Lakukan Verifikasi</span>
                  </button>
                ) : (
                  <div className="flex items-center gap-3">
                    <div className="px-4 py-2.5 rounded-xl bg-emerald-500/10 text-emerald-500 font-bold text-[13px] flex items-center gap-2 border border-emerald-500/20 shadow-sm">
                      <CheckCircle2 size={18} /> TERVERIFIKASI
                    </div>
                    <button onClick={onOpenForm} className="px-5 py-2.5 rounded-xl flex items-center gap-2 transition-colors border shadow-sm cursor-pointer bg-[var(--bg-surface)] text-[var(--text-primary)] border-[var(--border)] hover:bg-[var(--bg-hover)]">
                      <CheckSquare size={16} className="text-emerald-500" />
                      <span className="font-bold text-[13px] tracking-wide uppercase">Lihat Keputusan</span>
                    </button>
                  </div>
                )}
              </div>
            )}
          </div>

          {/* ── Drone Aerial Evidence (Multi-Image) ── */}
          <div className="rounded-2xl overflow-hidden shadow-sm border bg-[var(--bg-surface)] transition-all" style={{ borderColor: 'var(--border)' }}>
            <button onClick={() => setExpandedDrone(!expandedDrone)} className="w-full px-6 py-5 flex items-center justify-between hover:bg-[var(--bg-hover)] transition-colors text-left cursor-pointer border-none outline-none bg-transparent">
              <div className="flex items-center gap-5">
                <div className="w-14 h-14 rounded-xl bg-blue-500/10 flex items-center justify-center border border-blue-500/20 shrink-0 text-blue-500">
                  <Cpu size={24} />
                </div>
                <div>
                  <div className="text-[10px] font-bold text-[var(--primary)] uppercase tracking-widest flex items-center gap-1.5 mb-1.5">
                     Deteksi Awal Sistem (AI Drone)
                  </div>
                  <div className="text-[16px] font-bold text-[var(--text-primary)] flex items-center gap-3">
                    {activeCase.dronePrediction.label}
                    <span className="px-2 py-0.5 text-[10px] font-mono bg-[var(--bg-elevated)] text-emerald-500 rounded border border-[var(--border)]">
                      Conf: {activeCase.dronePrediction.confidence}%
                    </span>
                  </div>
                </div>
              </div>
              {expandedDrone ? <ChevronUp size={20} className="text-[var(--text-muted)]" /> : <ChevronDown size={20} className="text-[var(--text-muted)]" />}
            </button>

            {expandedDrone && (
              <div className="border-t border-[var(--border)] bg-[var(--bg-base)] flex flex-col pt-4 pb-2 px-6 gap-4">
                <div>
                  <div className="text-[10px] font-bold text-[var(--text-muted)] uppercase tracking-widest mb-3 flex items-center gap-1.5">
                    <Camera size={14} /> Frame Tangkapan Udara ({dronePhotos.length})
                  </div>
                  <div className="flex gap-4 overflow-x-auto pb-2 snap-x" style={{ scrollbarWidth: 'thin' }}>
                    {dronePhotos.map((url, idx) => (
                      <div 
                        key={idx} 
                        onClick={() => setLightbox(url)}
                        className="w-[240px] h-[140px] sm:w-[280px] sm:h-[160px] shrink-0 rounded-xl overflow-hidden bg-black border border-[var(--border)] snap-start shadow-sm relative group cursor-pointer"
                      >
                        <img src={url} alt={`Drone Frame ${idx}`} className="w-full h-full object-cover opacity-90 group-hover:scale-105 transition-transform duration-500" />
                        <div className="absolute inset-0 bg-black/20 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                          <Search size={24} className="text-white drop-shadow-md" />
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
                
                <div className="py-4 border-t border-[var(--border-subtle)] flex gap-3 items-start mt-2">
                  <Activity size={18} className="text-[var(--text-muted)] shrink-0 mt-0.5" />
                  <div className="text-sm text-[var(--text-secondary)] leading-relaxed font-medium">
                    <span className="font-bold text-[var(--text-primary)]">Log Analisis Sistem:</span> {activeCase.dronePrediction.notes}
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* ── Human Field Submissions ── */}
          <div>
            <div className="text-[11px] font-bold text-[var(--text-muted)] uppercase tracking-widest flex items-center gap-2 mb-4 pl-1">
              <User size={16} /> Laporan Investigasi Lapangan ({activeCase.submissions.length})
            </div>
            
            <div className="flex flex-col gap-4">
              {activeCase.submissions.map((sub, i) => {
                const isExpanded = expandedSubs[sub.id] ?? true; 
                const tierMeta = TIER_META[sub.tier];
                
                const actualPhotos = typeof sub.photos === 'number' ? [] : (sub.photos as string[]);
                const photoCount = actualPhotos.length;
                const avatarUrl = getAvatarUrl(sub.mitra);
                const titleLabel = sub.diagnosisPrimer || sub.diagnosis || sub.kondisi || 'Observasi Lapangan';

                return (
                  <div key={sub.id} className="rounded-2xl border shadow-sm overflow-hidden bg-[var(--bg-surface)] transition-all" style={{ borderColor: 'var(--border)' }}>
                    <button onClick={() => toggleSub(sub.id)} className="w-full px-5 py-4 sm:px-6 sm:py-5 flex items-center justify-between hover:bg-[var(--bg-hover)] transition-colors text-left cursor-pointer border-none outline-none bg-transparent">
                      <div className="flex items-center gap-4 flex-1 min-w-0">
                        {avatarUrl ? (
                          <div className="w-14 h-14 rounded-full overflow-hidden border-2 border-[var(--bg-elevated)] shrink-0 bg-black">
                            <img src={avatarUrl} alt="Avatar" className="w-full h-full object-cover opacity-90" />
                          </div>
                        ) : (
                          <div className="w-14 h-14 rounded-full flex items-center justify-center border-2 border-[var(--bg-elevated)] shrink-0 bg-[var(--primary-muted)] text-[var(--primary)] font-bold text-lg">
                            {getInitials(sub.mitra)}
                          </div>
                        )}
                        
                        <div className="flex-1 min-w-0 pr-2">
                          <div className="flex items-center gap-3 mb-1.5">
                            <span className="font-bold text-[16px] text-[var(--text-primary)] truncate">{sub.mitra}</span>
                            <span className="px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider border" style={{ backgroundColor: tierMeta.bg, color: tierMeta.color, borderColor: tierMeta.color }}>
                              {tierMeta.label}
                            </span>
                          </div>
                          <div className="flex items-center gap-4 text-[12px] text-[var(--text-muted)] font-medium">
                            <span className="truncate">"{titleLabel}"</span>
                            <span className="w-1 h-1 rounded-full bg-[var(--border)] shrink-0" />
                            <span className="flex items-center gap-1 shrink-0 font-mono font-bold">
                              <MapPin size={12} className={Number(sub.gpsDistM) <= 15 ? "text-emerald-500" : "text-amber-500"} />
                              <span className={Number(sub.gpsDistM) > 15 ? "text-amber-500" : ""}>{sub.gpsDistM}m</span>
                            </span>
                          </div>
                        </div>
                      </div>
                      {isExpanded ? <ChevronUp size={24} className="text-[var(--text-muted)] shrink-0" /> : <ChevronDown size={24} className="text-[var(--text-muted)] shrink-0" />}
                    </button>

                    {isExpanded && (
                      <div className="border-t border-[var(--border)] bg-[var(--bg-base)] flex flex-col pt-4 pb-6 px-6 gap-6">
                        
                        {/* Galeri Gambar */}
                        {photoCount > 0 && (
                          <div>
                            <div className="text-[10px] font-bold text-[var(--text-muted)] uppercase tracking-widest mb-3 flex items-center gap-1.5">
                              <Camera size={14} /> Eviden Visual ({photoCount})
                            </div>
                            <div className="flex gap-4 overflow-x-auto pb-2 snap-x" style={{ scrollbarWidth: 'thin' }}>
                              {actualPhotos.map((photoName, pIdx) => {
                                const imgUrl = `/images/field-evidence.jpg`;
                                return (
                                  <div 
                                    key={pIdx} 
                                    onClick={() => setLightbox(imgUrl)}
                                    className="w-[240px] h-[160px] sm:w-[300px] sm:h-[190px] shrink-0 rounded-xl overflow-hidden bg-[var(--bg-surface)] border border-[var(--border)] snap-start shadow-sm relative group cursor-pointer"
                                  >
                                    <img src={imgUrl} alt={photoName} className="w-full h-full object-cover opacity-90 group-hover:scale-105 transition-transform duration-500" />
                                    <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-100 flex flex-col justify-end p-3 transition-opacity">
                                      <span className="text-[10px] font-mono text-white drop-shadow-md truncate">{photoName}</span>
                                    </div>
                                    <div className="absolute inset-0 bg-black/20 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                                      <Search size={24} className="text-white drop-shadow-md" />
                                    </div>
                                  </div>
                                )
                              })}
                            </div>
                          </div>
                        )}

                        {/* Info Laporan Konsisten berdasarkan Tier */}
                        {sub.tier === 'FIELD' && (
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div className="bg-[var(--bg-surface)] p-4 rounded-xl border border-[var(--border)] shadow-sm">
                              <div className="text-[10px] font-bold text-[var(--text-muted)] uppercase tracking-widest mb-2">Tingkat Keparahan</div>
                              <div className="font-bold text-[15px] text-[var(--text-primary)]">Level {sub.keparahan || sub.severity}/5</div>
                            </div>
                            <div className="bg-[var(--bg-surface)] p-4 rounded-xl border border-[var(--border)] shadow-sm">
                              <div className="text-[10px] font-bold text-[var(--text-muted)] uppercase tracking-widest mb-2">Estimasi Luasan</div>
                              <div className="font-bold text-[15px] text-[var(--text-primary)]">{sub.estimasiLuas || sub.estimate || '-'}</div>
                            </div>
                            
                            {(sub.gejala || sub.symptoms) && (
                              <div className="bg-[var(--bg-surface)] p-4 rounded-xl border border-[var(--border)] shadow-sm md:col-span-2">
                                <div className="text-[10px] font-bold text-[var(--text-muted)] uppercase tracking-widest mb-2">Gejala Teramati</div>
                                {Array.isArray(sub.gejala) ? (
                                  <div className="flex flex-wrap gap-2 mt-1">
                                    {sub.gejala.map(g => (
                                      <span key={g} className="text-[11px] font-semibold text-[var(--text-secondary)] bg-[var(--bg-base)] border border-[var(--border)] px-2.5 py-1.5 rounded-md shadow-sm">✓ {g}</span>
                                    ))}
                                  </div>
                                ) : (
                                  <div className="text-[13px] text-[var(--text-secondary)] leading-relaxed italic">"{sub.symptoms}"</div>
                                )}
                              </div>
                            )}

                            <div className="bg-[var(--bg-surface)] p-4 rounded-xl border border-[var(--border)] shadow-sm md:col-span-2">
                              <div className="text-[10px] font-bold text-[var(--text-muted)] uppercase tracking-widest mb-2">Catatan Lapangan</div>
                              <div className="text-[13px] text-[var(--text-secondary)] leading-relaxed italic">
                                "{sub.catatanTambahan || sub.note}"
                              </div>
                            </div>
                          </div>
                        )}

                        {sub.tier === 'QUICK' && (
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div className="bg-[var(--bg-surface)] p-4 rounded-xl border border-[var(--border)] shadow-sm">
                              <div className="text-[10px] font-bold text-[var(--text-muted)] uppercase tracking-widest mb-2">Kondisi Umum</div>
                              <div className="font-bold text-[15px] text-[var(--text-primary)]">{sub.kondisi || sub.diagnosis}</div>
                            </div>
                            <div className="bg-[var(--bg-surface)] p-4 rounded-xl border border-[var(--border)] shadow-sm">
                              <div className="text-[10px] font-bold text-[var(--text-muted)] uppercase tracking-widest mb-2">Keterangan Singkat</div>
                              <div className="font-medium text-[13px] text-[var(--text-secondary)] italic">"{sub.catatanSingkat || sub.note}"</div>
                            </div>
                          </div>
                        )}

                        {sub.tier === 'EXPERT' && (
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                              <div className="bg-[var(--bg-surface)] p-4 rounded-xl border border-[var(--border)] shadow-sm">
                                <div className="text-[10px] font-bold text-[var(--text-muted)] uppercase tracking-widest mb-2">Diagnosis Definitif</div>
                                <div className="font-bold text-[15px] text-[var(--text-primary)]">{sub.diagnosisPrimer || sub.diagnosis}</div>
                              </div>
                              <div className="bg-amber-500/5 p-4 rounded-xl border border-amber-500/20 shadow-sm">
                                <div className="text-[10px] font-bold text-amber-500 uppercase tracking-widest mb-2">Urgensi & Objek</div>
                                <div className="font-bold text-[15px] text-amber-500">{sub.urgensi || sub.severity || '-'} • {sub.estimasiPohon || sub.estimate || '-'}</div>
                              </div>
                              
                              <div className="bg-[var(--bg-surface)] p-4 rounded-xl border border-[var(--border)] shadow-sm md:col-span-2">
                                <div className="text-[10px] font-bold text-[var(--text-muted)] uppercase tracking-widest mb-2">Gejala Fisik Forensik</div>
                                <div className="text-[13px] text-[var(--text-secondary)] leading-relaxed italic">
                                  "{sub.expertSymptoms || sub.symptoms}"
                                </div>
                              </div>

                              <div className="bg-emerald-500/5 p-4 rounded-xl border border-emerald-500/20 shadow-sm md:col-span-2">
                                <div className="text-[10px] font-bold text-emerald-500 uppercase tracking-widest mb-2">Rekomendasi Ahli</div>
                                <div className="text-[13px] font-bold text-emerald-600 dark:text-emerald-400 leading-relaxed">
                                  {sub.rekomendasiTindakan || sub.note || '-'}
                                </div>
                              </div>
                          </div>
                        )}
                      </div>
                    )}
                  </div>
                )
              })}
            </div>
          </div>
        </div>
      </div>
    </>
  )
}