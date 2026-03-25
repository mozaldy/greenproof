'use client'

import { useState } from 'react'
import {
  Cpu, MapPin, Camera, CheckCircle2, AlertTriangle, User, Database, ChevronDown, ChevronUp, ListTodo, SlidersHorizontal, Activity, BadgeInfo, X, ChevronRight, FileCheck, CheckSquare, Award
} from 'lucide-react'
import {
  MOCK_CASES, TIER_META, PRIORITY_META, LABEL_OPTIONS,
  type VerifierCase
} from '@/lib/verdict-data'

export default function VerifierPage() {
  const [cases, setCases] = useState(MOCK_CASES)
  const [activeCaseId, setActiveCaseId] = useState<string>(MOCK_CASES.find(c => c.verdictPhase === 'PENDING')?.caseId ?? MOCK_CASES[0].caseId)
  const [showQueue, setShowQueue] = useState(false)
  const [showForm, setShowForm] = useState(false)
  
  // Expand states for scalable minimalist UI
  const [expandedDrone, setExpandedDrone] = useState(true)
  const [expandedSubs, setExpandedSubs] = useState<Record<string, boolean>>({})

  const toggleSub = (id: string) => setExpandedSubs(p => ({ ...p, [id]: !p[id] }))

  const activeCase = cases.find(c => c.caseId === activeCaseId)!
  const pending = cases.filter(c => c.verdictPhase === 'PENDING')
  const graded = cases.filter(c => c.verdictPhase === 'GRADED')

  const handleVerdictDataUpdate = (patch: Partial<NonNullable<VerifierCase['verdictData']>>) => {
    setCases(cs => cs.map(c => {
      if (c.caseId !== activeCaseId) return c
      const current = c.verdictData ?? { finalLabel: '', replacesDroneAi: false, grades: c.submissions.map(s => ({ submissionId: s.id, mitraName: s.mitra, imageScore: 0, analysisScore: 0, reliable: false })), reasoningNotes: '', gradedAt: '' }
      return { ...c, verdictData: { ...current, ...patch } }
    }))
  }

  const handleGradeUpdate = (subId: string, type: 'imageScore' | 'analysisScore', val: number) => {
    setCases(cs => cs.map(c => {
      if (c.caseId !== activeCaseId) return c
      const vData = c.verdictData ?? { finalLabel: '', replacesDroneAi: false, grades: c.submissions.map(s => ({ submissionId: s.id, mitraName: s.mitra, imageScore: 0, analysisScore: 0, reliable: false })), reasoningNotes: '', gradedAt: '' }
      const grades = [...vData.grades]
      const idx = grades.findIndex(g => g.submissionId === subId)
      if (idx === -1) {
        grades.push({ submissionId: subId, mitraName: c.submissions.find(s=>s.id === subId)!.mitra, imageScore: 0, analysisScore: 0, reliable: false, [type]: val })
      } else {
        grades[idx] = { ...grades[idx], [type]: val }
      }
      return { ...c, verdictData: { ...vData, grades } }
    }))
  }

  const submitGrade = () => {
    setCases(cs => cs.map(c => c.caseId === activeCaseId ? { ...c, verdictPhase: 'GRADED', verdictData: { ...c.verdictData!, gradedAt: new Date().toLocaleString('id-ID') } } : c))
    setShowForm(false)
  }

  // Helper for discrete rating buttons
  const RatingButton = ({ label, value, currentVal, onClick, colorClass }: any) => {
    const active = currentVal === value
    return (
      <button 
        onClick={onClick}
        className={`flex-1 py-1.5 sm:py-2 px-1 sm:px-2 rounded border text-[9px] sm:text-[10px] font-bold tracking-wide transition-all uppercase ${active ? colorClass : 'bg-[var(--bg-base)] border-[var(--border)] text-[var(--text-muted)] hover:bg-[var(--bg-hover)]'}`}
      >
        {label}
      </button>
    )
  }

  return (
    <div className="flex flex-col h-screen overflow-hidden" style={{ background: 'var(--bg-base)' }}>
      {/* ── Top Header ──────────────────────────────────────────── */}
      <header className="flex items-center justify-between px-8 py-3 shrink-0 shadow-sm relative z-30" style={{ background: 'var(--bg-surface)', borderBottom: '1px solid var(--border)' }}>
        <div className="flex items-center gap-6">
          <div>
            <h1 className="flex items-center gap-2" style={{ fontFamily: 'var(--font-sans)', fontSize: 18, fontWeight: 700, color: 'var(--text-primary)', letterSpacing: '-0.02em' }}>
              <Cpu size={18} style={{ color: 'var(--primary)' }} />
              AI Labeling Studio
            </h1>
          </div>
          <div className="w-px h-6 bg-[var(--border)]" />
          
          {/* Queue Selector Dropdown */}
          <div className="relative">
            <button 
              onClick={() => setShowQueue(!showQueue)}
              className="flex items-center gap-3 px-4 py-2 rounded-lg border hover:bg-[var(--bg-hover)] transition-colors" 
              style={{ background: 'var(--bg-base)', borderColor: 'var(--border)' }}
            >
              <ListTodo size={14} className="text-[var(--text-muted)]" />
              <div className="text-left">
                <div style={{ fontFamily: 'var(--font-sans)', fontSize: 10, color: 'var(--text-muted)', fontWeight: 600 }}>Tugas Terpilih</div>
                <div style={{ fontFamily: 'var(--font-mono)', fontSize: 13, fontWeight: 700, color: 'var(--text-primary)' }}>{activeCase.caseId} <span className="font-sans font-medium text-xs text-[var(--text-secondary)]">— {activeCase.taskTitle}</span></div>
              </div>
              <ChevronDown size={14} className="text-[var(--text-muted)] ml-2" />
            </button>

            {showQueue && (
              <>
                <div className="fixed inset-0 z-40" onClick={() => setShowQueue(false)} />
                <div className="absolute top-full left-0 mt-2 w-[450px] rounded-xl shadow-xl overflow-hidden border z-50" style={{ background: 'var(--bg-surface)', borderColor: 'var(--border)' }}>
                  <div className="px-4 py-3 border-b bg-[var(--bg-elevated)] border-[var(--border)] flex justify-between items-center">
                    <span className="text-xs font-bold text-[var(--text-muted)] uppercase tracking-wider">Antrean Verifikasi</span>
                    <span className="text-xs font-bold text-[#ef4444] bg-[#ef4444] bg-opacity-10 px-2 py-0.5 rounded">{pending.length} Menunggu</span>
                  </div>
                  <div className="max-h-[60vh] overflow-y-auto">
                    {cases.map(c => {
                      const isGraded = c.verdictPhase === 'GRADED'
                      return (
                        <button
                          key={c.caseId}
                          onClick={() => { 
                            setActiveCaseId(c.caseId); 
                            setShowQueue(false); 
                            setShowForm(false);
                            setExpandedSubs({}); // Reset expansions on case change
                            setExpandedDrone(true);
                          }}
                          className="w-full text-left px-4 py-3 border-b border-[var(--border)] hover:bg-[var(--bg-hover)] transition-colors flex flex-col gap-1"
                        >
                          <div className="flex items-center justify-between">
                            <span style={{ fontFamily: 'var(--font-mono)', fontSize: 11, color: isGraded ? '#10b981' : 'var(--text-primary)', fontWeight: 700 }}>{c.caseId}</span>
                            {isGraded ? <CheckCircle2 size={14} className="text-[#10b981]" /> : <span className="px-1.5 py-0.5 rounded text-[8px] font-bold" style={{ background: PRIORITY_META[c.priority].bg, color: PRIORITY_META[c.priority].color }}>{c.priority}</span>}
                          </div>
                          <div style={{ fontFamily: 'var(--font-sans)', fontSize: 13, color: 'var(--text-secondary)', fontWeight: 500 }}>{c.taskTitle}</div>
                        </button>
                      )
                    })}
                  </div>
                </div>
              </>
            )}
          </div>
        </div>

        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2 px-3 py-1.5 rounded-lg border bg-[var(--bg-base)] border-[var(--border)]">
            <CheckCircle2 size={14} className="text-[#10b981]" />
            <span style={{ fontFamily: 'var(--font-sans)', fontSize: 12, fontWeight: 700, color: 'var(--text-primary)' }}>{graded.length + 246} Data Terverifikasi</span>
          </div>
        </div>
      </header>

      {/* ── Main Workspace ────────────────────────────────────────── */}
      <div className="flex flex-1 overflow-hidden relative">
        
        {/* LEFT PANEL: The Evidence Viewer (Full width if form hidden, 70% if open) */}
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
                <div className="px-3 py-1.5 rounded bg-[#10b981] bg-opacity-10 text-[#10b981] font-bold text-sm flex items-center gap-2 border border-[#10b981] border-opacity-20 shadow-sm">
                  <CheckCircle2 size={16} /> DATA TERVERIFIKASI
                </div>
              )}
            </div>

            {/* ── Drone Aerial Evidence (Expandable) ── */}
            <div className="rounded-xl overflow-hidden shadow-sm border bg-[var(--bg-surface)] transition-all" style={{ borderColor: 'var(--border)' }}>
              {/* Collapsed Header */}
              <button 
                onClick={() => setExpandedDrone(!expandedDrone)}
                className="w-full px-5 py-4 flex items-center justify-between hover:bg-[var(--bg-hover)] transition-colors text-left"
              >
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 rounded bg-black overflow-hidden shadow-inner shrink-0">
                    <img src={activeCase.caseId === 'VRD-001' ? 'https://picsum.photos/seed/drone1/100/100' : 'https://picsum.photos/seed/drone2/100/100'} alt="Drone Thumb" className="w-full h-full object-cover opacity-80" />
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

              {/* Expanded Content */}
              {expandedDrone && (
                <div className="border-t border-[var(--border)] bg-[var(--bg-base)]">
                  <div className="h-[280px] w-full relative">
                    <img 
                      src={activeCase.caseId === 'VRD-001' ? 'https://picsum.photos/seed/drone1/800/400' : 'https://picsum.photos/seed/drone2/800/400'} 
                      alt="Drone Survey" 
                      className="w-full h-full object-cover" 
                    />
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

            {/* ── Human Field Submissions (List of Expandable Minimalist Cards) ── */}
            <div>
              <div className="text-sm font-bold text-[var(--text-muted)] uppercase tracking-widest flex items-center gap-2 mb-4 pl-1">
                <User size={16} /> Laporan Investigasi Lapangan ({activeCase.submissions.length})
              </div>
              
              <div className="flex flex-col gap-3">
                {activeCase.submissions.map((sub, i) => {
                  const isExpanded = !!expandedSubs[sub.id];
                  
                  // Mock multiple photos
                  const photos = [
                    (activeCase.taskId === 'TK-2849' && i === 1) ? 'https://picsum.photos/seed/wahyu field/400/300' 
                    : (activeCase.taskId === 'TK-2849' && i === 0) ? 'https://picsum.photos/seed/agus blur/400/300'
                    : `https://picsum.photos/seed/${sub.id}/400/300`,
                    `https://picsum.photos/seed/${sub.id}_2/400/300`,
                    `https://picsum.photos/seed/${sub.id}_3/400/300`,
                  ];

                  return (
                    <div key={sub.id} className="rounded-xl border shadow-sm overflow-hidden bg-[var(--bg-surface)] transition-all" style={{ borderColor: 'var(--border)' }}>
                      
                      {/* Collapsed Header / Trigger */}
                      <button 
                        onClick={() => toggleSub(sub.id)}
                        className="w-full px-4 py-3 sm:px-5 sm:py-4 flex items-center justify-between hover:bg-[var(--bg-hover)] transition-colors text-left"
                      >
                        <div className="flex items-center gap-3 sm:gap-4 flex-1 min-w-0">
                          {/* Mini Thumbnail */}
                          <div className="w-12 h-12 sm:w-14 sm:h-14 rounded bg-black overflow-hidden shadow-inner shrink-0 relative">
                            <img 
                              src={photos[0]} 
                              alt="Thumb" 
                              className="w-full h-full object-cover opacity-90"
                              style={{ filter: (activeCase.taskId === 'TK-2849' && i === 0) ? 'blur(2px)' : 'none' }}
                            />
                            {!isExpanded && (
                              <div className="absolute inset-0 bg-black bg-opacity-30 flex justify-center items-center">
                                <span className="text-white text-[10px] sm:text-xs font-bold font-mono">+{sub.photos}</span>
                              </div>
                            )}
                          </div>
                          
                          {/* Core Summary Info */}
                          <div className="flex-1 min-w-0 pr-2">
                            <div className="flex items-center gap-2 sm:gap-3 mb-1">
                              <span className="font-bold text-[13px] sm:text-[15px] text-[var(--text-primary)] truncate">{sub.mitra}</span>
                              <span className="px-1.5 sm:px-2 py-0.5 rounded text-[8px] sm:text-[9px] font-bold uppercase tracking-wider border whitespace-nowrap" style={{ background: TIER_META[sub.tier].bg, color: TIER_META[sub.tier].color, borderColor: TIER_META[sub.tier].color }}>
                                {TIER_META[sub.tier].label}
                              </span>
                            </div>
                            <div className="flex items-center gap-3 sm:gap-4 text-[11px] sm:text-xs text-[var(--text-muted)]">
                              <span className="font-semibold text-[var(--text-secondary)] truncate">
                                "{sub.diagnosisPrimer || sub.kondisi || sub.diagnosisPrimer || 'Tinjauan Umum'}"
                              </span>
                              <span className="hidden sm:inline-block w-1 h-1 rounded-full bg-[var(--border)] shrink-0" />
                              <span className="flex items-center gap-1 shrink-0 font-mono">
                                <MapPin size={10} className={sub.gpsDistM <= 15 ? "text-[#10b981]" : "text-[var(--danger)]"} />
                                <span className={sub.gpsDistM > 15 ? "text-[var(--danger)]" : ""}>{sub.gpsDistM}m</span>
                              </span>
                              <span className="hidden sm:flex items-center gap-1 shrink-0 font-mono">
                                {sub.time.split(', ')[1]}
                              </span>
                            </div>
                          </div>
                        </div>
                        {isExpanded ? <ChevronUp size={20} className="text-[var(--text-muted)] shrink-0" /> : <ChevronDown size={20} className="text-[var(--text-muted)] shrink-0" />}
                      </button>

                      {/* Expanded Content Area */}
                      {isExpanded && (
                        <div className="border-t border-[var(--border)] bg-[var(--bg-base)] flex flex-col pt-2">
                          
                          {/* Photo Gallery (Expandable format) */}
                          <div className="px-4 py-3 sm:px-5">
                            <div className="text-[10px] font-bold text-[var(--text-muted)] uppercase tracking-widest mb-2 flex items-center gap-1">
                              <Camera size={12} /> Galeri Eviden Visual ({sub.photos})
                            </div>
                            <div className="flex gap-3 overflow-x-auto pb-2 snap-x" style={{ scrollbarWidth: 'thin' }}>
                              {photos.map((pUrl, pIdx) => (
                                <div key={pIdx} className="w-[200px] h-[140px] sm:w-[280px] sm:h-[180px] shrink-0 rounded-lg overflow-hidden bg-black border border-[var(--border)] snap-start">
                                   <img 
                                      src={pUrl}
                                      alt="Detail Visual"
                                      className="w-full h-full object-cover opacity-90"
                                      style={{ filter: (activeCase.taskId === 'TK-2849' && i === 0) ? 'blur(2px)' : 'none' }}
                                    />
                                </div>
                              ))}
                            </div>
                          </div>

                          {/* Detail Information */}
                          <div className="px-4 sm:px-5 py-4 mb-2 bg-[var(--bg-surface)] border-y border-[var(--border)] flex flex-col gap-4">
                            
                            {/* EXPERT (Forensic Analysis) */}
                            {sub.tier === 'EXPERT' && (
                              <div className="flex flex-col gap-4">
                                <div className="inline-block px-2 py-1 rounded w-fit border border-[#10b981] border-opacity-30 bg-[#10b981] bg-opacity-10 text-[#10b981] font-bold text-[10px] uppercase tracking-wide">
                                  Expert Forensic Form ✓
                                </div>
                                <div className="grid grid-cols-2 gap-4">
                                  <div>
                                    <div className="text-[10px] font-bold text-[var(--text-muted)] uppercase tracking-wider mb-1">Diagnosis Definitif</div>
                                    <div className="font-bold text-sm text-[var(--text-primary)] flex items-center gap-2">
                                      {sub.diagnosisPrimer}
                                    </div>
                                  </div>
                                  <div>
                                    <div className="text-[10px] font-bold text-[var(--text-muted)] uppercase tracking-wider mb-1">Estimasi Objek</div>
                                    <div className="font-bold text-sm text-[var(--text-primary)]">{sub.estimasiPohon || '-'}</div>
                                  </div>
                                </div>
                                
                                <div className="grid grid-cols-2 gap-4 p-3 bg-[var(--bg-elevated)] rounded-lg border border-[var(--primary-border)] border-opacity-20 shadow-sm">
                                  <div>
                                    <div className="text-[10px] font-bold text-[var(--text-muted)] uppercase tracking-wider mb-1">Urgensi Penanganan</div>
                                    <div className="font-bold text-[13px] text-[var(--danger)]">{sub.urgensi || '-'}</div>
                                  </div>
                                  <div>
                                    <div className="text-[10px] font-bold text-[var(--text-muted)] uppercase tracking-wider mb-1">Rekomendasi Ahli</div>
                                    <div className="font-bold text-[13px] text-[var(--primary)]">{sub.rekomendasiTindakan || '-'}</div>
                                  </div>
                                </div>

                                <div>
                                  <div className="text-[10px] font-bold text-[var(--text-muted)] uppercase tracking-wider mb-1">Gejala Fisik Teramati</div>
                                  <div className="text-[12px] sm:text-[13px] text-[var(--text-secondary)] leading-relaxed bg-[var(--bg-base)] p-3 rounded-lg border border-[var(--border)] italic">
                                    "{sub.expertSymptoms}"
                                  </div>
                                </div>
                              </div>
                            )}

                            {/* FIELD (Standard Report) */}
                            {sub.tier === 'FIELD' && (
                              <div className="flex flex-col gap-4">
                                <div className="inline-block px-2 py-1 rounded w-fit border border-[#6366f1] border-opacity-30 bg-[#6366f1] bg-opacity-10 text-[#6366f1] font-bold text-[10px] uppercase tracking-wide">
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
                                <div className="inline-block px-2 py-1 rounded w-fit border border-[#6b7280] border-opacity-30 bg-[#6b7280] bg-opacity-10 text-[var(--text-muted)] font-bold text-[10px] uppercase tracking-wide">
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
            
          </div>
        </div>

        {/* Floating Action to open Form (Visible only when form is hidden) */}
        {!showForm && activeCase.verdictPhase === 'PENDING' && (
          <div className="absolute bottom-6 right-6 sm:bottom-8 sm:right-8 z-20">
            <button 
              onClick={() => setShowForm(true)}
              className="px-5 py-3 sm:px-6 sm:py-4 rounded-full shadow-2xl flex items-center gap-2 sm:gap-3 transition-transform hover:scale-105 active:scale-95 border"
              style={{ background: 'var(--primary)', color: 'var(--text-inverse)', borderColor: 'var(--primary-border)' }}
            >
              <FileCheck size={18} className="sm:w-5 sm:h-5" />
              <span className="font-bold text-xs sm:text-sm tracking-wide uppercase">Lakukan Verifikasi Data</span>
            </button>
          </div>
        )}
        
        {!showForm && activeCase.verdictPhase === 'GRADED' && (
           <div className="absolute bottom-6 right-6 sm:bottom-8 sm:right-8 z-20">
            <button 
              onClick={() => setShowForm(true)}
              className="px-5 py-3 sm:px-6 sm:py-4 rounded-full flex items-center gap-2 sm:gap-3 transition-colors border shadow-lg"
              style={{ background: 'var(--bg-surface)', color: 'var(--text-primary)', borderColor: 'var(--border)' }}
            >
              <CheckSquare size={18} className="sm:w-5 sm:h-5 text-[#10b981]" />
              <span className="font-bold text-xs sm:text-sm tracking-wide uppercase text-opacity-80">Lihat Hasil Verifikasi</span>
            </button>
          </div>
        )}

        {/* RIGHT PANEL: Grading Studio Drawer */}
        <div 
          className={`absolute top-0 right-[-420px] w-full sm:w-[420px] h-full shadow-2xl border-l z-30 flex flex-col transition-transform duration-300 ease-in-out ${showForm ? '-translate-x-full sm:-translate-x-[420px]' : ''}`} 
          style={{ background: 'var(--bg-surface)', borderColor: 'var(--border)' }}
        >
          {/* Header */}
          <div className="px-6 py-5 border-b flex items-center justify-between shadow-sm relative z-10" style={{ borderColor: 'var(--border)', background: 'var(--bg-surface)' }}>
            <div className="flex items-center gap-3">
              <FileCheck size={18} className="text-[var(--primary)]" />
              <span className="font-bold text-[13px] text-[var(--text-primary)] uppercase tracking-widest">Formulir Verifikasi Akhir</span>
            </div>
            <button onClick={() => setShowForm(false)} className="p-1.5 rounded-md hover:bg-[var(--bg-hover)] text-[var(--text-muted)] transition-colors">
              <X size={16} />
            </button>
          </div>

          <div className="flex-1 overflow-y-auto p-4 sm:p-6 flex flex-col gap-6 sm:gap-8 bg-[var(--bg-elevated)]">
            
            {/* 1. Final Label */}
            <div className="bg-[var(--bg-surface)] p-4 sm:p-5 rounded-xl border border-[var(--border)] shadow-sm">
              <label className="text-[10px] sm:text-[11px] font-bold text-[var(--text-secondary)] uppercase tracking-wider mb-2 sm:mb-3 flex items-center gap-2">
                <span className="flex items-center justify-center w-5 h-5 rounded-full bg-[var(--primary-muted)] text-[var(--primary)] text-[10px]">1</span>
                Ketetapan Ground Truth
              </label>
              <p className="text-[11px] sm:text-xs text-[var(--text-muted)] mb-3 leading-relaxed">
                Tentukan label final yang paling mencerminkan kondisi riil di lapangan berdasarkan analisis bukti yang disajikan. Label ini akan digunakan untuk proses sentral pelatihan algoritma.
              </p>
              <select
                className="w-full px-3 py-2.5 sm:px-4 sm:py-3 rounded-lg border text-sm font-bold bg-[var(--bg-base)]"
                style={{ borderColor: 'var(--border)', color: 'var(--text-primary)', outline: 'none' }}
                value={activeCase.verdictData?.finalLabel || ''}
                onChange={e => handleVerdictDataUpdate({ finalLabel: e.target.value })}
                disabled={activeCase.verdictPhase === 'GRADED'}
              >
                <option value="">-- Tetapkan Klasifikasi Definitif --</option>
                {LABEL_OPTIONS.map(l => <option key={l} value={l}>{l}</option>)}
              </select>
            </div>

            {/* 3. Mitra Grading */}
            <div className="bg-[var(--bg-surface)] p-4 sm:p-5 rounded-xl border border-[var(--border)] shadow-sm">
              <label className="text-[10px] sm:text-[11px] font-bold text-[var(--text-secondary)] uppercase tracking-wider mb-3 sm:mb-4 flex items-center gap-2">
                <span className="flex items-center justify-center w-5 h-5 rounded-full bg-[var(--primary-muted)] text-[var(--primary)] text-[10px]">2</span>
                Penilaian Kualitas Eviden
              </label>
              <p className="text-[11px] sm:text-xs text-[var(--text-muted)] mb-4 sm:mb-5 leading-relaxed">
                Asesmen kualitas pengumpulan data oleh partisipan lapangan. Nilai yang Anda berikan akan menentukan kompensasi akhir dan metrik kinerja mitra.
              </p>
              
              <div className="flex flex-col gap-5 sm:gap-6">
                {activeCase.submissions.map((sub, i) => {
                  const vData = activeCase.verdictData;
                  const grade = vData?.grades.find(g => g.submissionId === sub.id) || { imageScore: 0, analysisScore: 0 }
                  
                  // Prep mock data for the pills
                  const mockImg = grade.imageScore || ((activeCase.caseId === 'VRD-001' && i === 1) ? 90 : (activeCase.caseId === 'VRD-001' && i === 0) ? 30 : 80);
                  const mockAna = grade.analysisScore || ((activeCase.caseId === 'VRD-001' && i === 0) ? 90 : (activeCase.caseId === 'VRD-001' && i === 1) ? 30 : 80);

                  return (
                    <div key={sub.id} className="pt-4 border-t border-[var(--border)] first:pt-0 first:border-0 relative">
                      <div className="font-bold text-xs sm:text-[13px] text-[var(--text-primary)] mb-3 flex items-center gap-2">
                        <Award size={14} className="text-[var(--accent)]" /> {sub.mitra}
                      </div>
                      
                      <div className="flex flex-col gap-4 pl-5 sm:pl-6">
                        <div>
                          <div className="text-[9px] sm:text-[10px] text-[var(--text-muted)] font-bold uppercase tracking-wide mb-1.5 sm:mb-2">Integritas Gambar</div>
                          <div className="flex flex-wrap gap-1.5 sm:gap-2">
                            <RatingButton 
                              label="Kurang Jelas" value={30} currentVal={mockImg}
                              onClick={() => handleGradeUpdate(sub.id, 'imageScore', 30)}
                              colorClass="bg-[#ef4444] bg-opacity-10 text-[#ef4444] border-[#ef4444] border-opacity-40" 
                            />
                            <RatingButton 
                              label="Diterima" value={60} currentVal={mockImg}
                              onClick={() => handleGradeUpdate(sub.id, 'imageScore', 60)}
                              colorClass="bg-[#eab308] bg-opacity-10 text-[#eab308] border-[#eab308] border-opacity-40" 
                            />
                            <RatingButton 
                              label="Sangat Resolutif" value={90} currentVal={mockImg}
                              onClick={() => handleGradeUpdate(sub.id, 'imageScore', 90)}
                              colorClass="bg-[#10b981] bg-opacity-10 text-[#10b981] border-[#10b981] border-opacity-40" 
                            />
                          </div>
                        </div>

                        <div>
                          <div className="text-[9px] sm:text-[10px] text-[var(--text-muted)] font-bold uppercase tracking-wide mb-1.5 sm:mb-2">Presisi Analisa</div>
                          <div className="flex flex-wrap gap-1.5 sm:gap-2">
                            <RatingButton 
                              label="Tdk Relevan" value={30} currentVal={mockAna}
                              onClick={() => handleGradeUpdate(sub.id, 'analysisScore', 30)}
                              colorClass="bg-[#ef4444] bg-opacity-10 text-[#ef4444] border-[#ef4444] border-opacity-40" 
                            />
                            <RatingButton 
                              label="Sebagian Tepat" value={60} currentVal={mockAna}
                              onClick={() => handleGradeUpdate(sub.id, 'analysisScore', 60)}
                              colorClass="bg-[#eab308] bg-opacity-10 text-[#eab308] border-[#eab308] border-opacity-40" 
                            />
                            <RatingButton 
                              label="Sangat Akurat" value={90} currentVal={mockAna}
                              onClick={() => handleGradeUpdate(sub.id, 'analysisScore', 90)}
                              colorClass="bg-[#10b981] bg-opacity-10 text-[#10b981] border-[#10b981] border-opacity-40" 
                            />
                          </div>
                        </div>
                      </div>
                    </div>
                  )
                })}
              </div>
            </div>

            {/* 4. Reasoning Notes */}
            <div className="bg-[var(--bg-surface)] p-4 sm:p-5 rounded-xl border border-[var(--border)] shadow-sm">
              <label className="text-[10px] sm:text-[11px] font-bold text-[var(--text-secondary)] uppercase tracking-wider mb-2 sm:mb-3 flex items-center gap-2">
                <span className="flex items-center justify-center w-5 h-5 rounded-full bg-[var(--primary-muted)] text-[var(--primary)] text-[10px]">3</span>
                Anotasi Penjelasan
              </label>
              <p className="text-[11px] sm:text-xs text-[var(--text-muted)] mb-3 leading-relaxed">
                Sertakan rasionalisasi ringkas di balik keputusan klasifikasi Anda.
              </p>
              <textarea 
                className="w-full px-3 py-2.5 sm:px-4 sm:py-3 rounded-lg border text-sm bg-[var(--bg-base)]"
                style={{ borderColor: 'var(--border)', color: 'var(--text-primary)', outline: 'none', resize: 'vertical', minHeight: 100, lineHeight: 1.6 }}
                placeholder="Rasionalitas keputusan ini diambil berdasarkan..."
                value={activeCase.verdictData?.reasoningNotes || ''}
                onChange={e => handleVerdictDataUpdate({ reasoningNotes: e.target.value })}
                disabled={activeCase.verdictPhase === 'GRADED'}
              />
            </div>
          </div>

          {/* Footer Action */}
          <div className="p-4 sm:p-5 border-t bg-[var(--bg-surface)] shadow-[0_-4px_10px_rgba(0,0,0,0.02)] relative z-10" style={{ borderColor: 'var(--border)' }}>
            {activeCase.verdictPhase === 'PENDING' ? (
              <button 
                onClick={submitGrade}
                disabled={!activeCase.verdictData?.finalLabel || !activeCase.verdictData?.reasoningNotes}
                className="w-full py-3.5 sm:py-4 rounded-xl flex justify-center items-center gap-2 transition-all shadow-md hover:shadow-lg disabled:opacity-50 disabled:shadow-none bg-[var(--accent)] hover:bg-emerald-600 text-white border-none font-bold text-xs sm:text-sm tracking-wide uppercase"
                style={{ cursor: (!activeCase.verdictData?.finalLabel || !activeCase.verdictData?.reasoningNotes) ? 'not-allowed' : 'pointer' }}
              >
                <Database size={16} />
                AKTIVASI REKAM & DISTRIBUSI REWARD
              </button>
            ) : (
              <div className="w-full py-3.5 sm:py-4 rounded-xl flex justify-center items-center gap-2 border bg-[#10b981] bg-opacity-10 border-[#10b981] border-opacity-30 text-[#10b981] font-bold text-xs sm:text-sm tracking-wide">
                <CheckCircle2 size={16} /> HASIL TELAH DIVERIFIKASI
              </div>
            )}
          </div>

        </div>

      </div>
    </div>
  )
}
