'use client'

import { useState } from 'react'
import { Database, Filter, Search, Download, CheckCircle2, FileText, Calendar, ChevronDown, ChevronUp, Cpu, Eye, MapPin } from 'lucide-react'

const MOCK_HISTORY = [
  { id: 'VRD-008', task: 'TK-2999', title: 'Kematian Tajuk Merata Areal Batas Desa', estate: 'Kapuas Barat', block: 'KB-A1 (Batas)', label: 'Sabotase (Injeksi Herbisida)', date: '21 Mar 2025, 06:15', aiCorrect: false, 
    dronePred: 'Lightning Strike / Ganoderma (Conf: 45%)', humanNote: 'Ditemukan lubang bor tajam 5mm di pangkal pokok dengan bau praquat menyengat. Kematian pohon terjadi mendadak & terpolarisasi linier. Ini vandalisme sengaja pencurian umbut.' },
  { id: 'VRD-003', task: 'TK-2847', title: 'Deteksi Ganoderma', estate: 'Kapuas Barat', block: 'KB-C3', label: 'Ganoderma boninense (BSR)', date: '15 Mar 2025, 08:45', aiCorrect: true, 
    dronePred: 'Suspected Ganoderma (Conf: 73%)', humanNote: 'Ditemukan badan buah di pohon baris ke-7.' },
  { id: 'VRD-004', task: 'TK-2850', title: 'Anomali Drainase', estate: 'Kapuas Timur', block: 'KT-B1', label: 'Waterlogging damage', date: '15 Mar 2025, 14:20', aiCorrect: false, 
    dronePred: 'Defisiensi Nitrogen (Conf: 45%)', humanNote: 'Pelepah menguning karena genangan air yang tidak surut lebih dari 3 hari. Air berbau belerang.' },
  { id: 'VRD-005', task: 'TK-2852', title: 'Kualitas Pelepah', estate: 'Mentaya', block: 'MT-C2', label: 'Normal / Sehat', date: '14 Mar 2025, 16:10', aiCorrect: false, 
    dronePred: 'Crown Disease (Conf: 60%)', humanNote: 'Hanya pelepah tua yang mengering normal, struktur tajuk utama hijau sehat.' },
  { id: 'VRD-006', task: 'TK-2811', title: 'Bercak Daun Bibitan', estate: 'Kapuas Barat', block: 'KB-E1 Nursery', label: 'Curvularia leaf spot', date: '13 Mar 2025, 09:12', aiCorrect: true, 
    dronePred: 'Curvularia Sp. (Conf: 82%)', humanNote: 'Bercak oval dengan halo kuning pada bibit muda PN.' },
]

export default function HistoryPage() {
  const [expandedRow, setExpandedRow] = useState<string | null>(null)

  const toggleRow = (id: string) => {
    setExpandedRow(prev => prev === id ? null : id)
  }

  return (
    <div className="flex flex-col h-screen" style={{ background: 'var(--bg-base)' }}>
      {/* Header */}
      <header className="px-8 py-5 shrink-0" style={{ background: 'var(--bg-surface)', borderBottom: '1px solid var(--border)' }}>
        <div className="flex items-center justify-between">
          <div>
            <h1 className="flex items-center gap-2" style={{ fontFamily: 'var(--font-sans)', fontSize: 20, fontWeight: 700, color: 'var(--text-primary)', letterSpacing: '-0.02em' }}>
              <Database size={20} style={{ color: 'var(--primary)' }} />
              Riwayat Labeled Data
            </h1>
            <p style={{ fontFamily: 'var(--font-sans)', fontSize: 13, color: 'var(--text-muted)', marginTop: 4 }}>
              Kumpulan data forensik definitif yang telah diseleksi oleh Verifier. Data ini 100% anonymized dan siap untuk training AI.
            </p>
          </div>
          <button className="flex items-center gap-2 px-4 py-2 rounded-lg transition-colors hover:bg-[var(--bg-hover)]" style={{ background: 'var(--bg-elevated)', border: '1px solid var(--border)', color: 'var(--primary)', fontFamily: 'var(--font-sans)', fontSize: 13, fontWeight: 600, cursor: 'pointer' }}>
            <Download size={14} /> Ekspor Dataset JSON
          </button>
        </div>
      </header>

      {/* Main Content */}
      <div className="p-8 flex-1 overflow-y-auto">
        
        {/* Toolbar */}
        <div className="flex items-center gap-4 mb-6">
          <div className="flex items-center gap-2 px-4 py-2.5 rounded-xl flex-1 max-w-md shadow-sm focus-within:ring-2 ring-[var(--primary)] transition-all" style={{ background: 'var(--bg-surface)', border: '1px solid var(--border)' }}>
            <Search size={16} style={{ color: 'var(--text-muted)' }} />
            <input type="text" placeholder="Cari Label Target, ID Kasus, atau Task..." style={{ background: 'transparent', border: 'none', outline: 'none', color: 'var(--text-primary)', fontSize: 13, fontFamily: 'var(--font-sans)', width: '100%' }} />
          </div>
          <button className="flex items-center gap-2 px-4 py-2.5 rounded-xl shadow-sm transition-colors hover:bg-[var(--bg-hover)]" style={{ background: 'var(--bg-surface)', border: '1px solid var(--border)', color: 'var(--text-secondary)', fontFamily: 'var(--font-sans)', fontSize: 13, cursor: 'pointer' }}>
            <Filter size={14} /> Filter Label
          </button>
          <button className="flex items-center gap-2 px-4 py-2.5 rounded-xl shadow-sm transition-colors hover:bg-[var(--bg-hover)]" style={{ background: 'var(--bg-surface)', border: '1px solid var(--border)', color: 'var(--text-secondary)', fontFamily: 'var(--font-sans)', fontSize: 13, cursor: 'pointer' }}>
            <Calendar size={14} /> Bulan Ini
          </button>
        </div>

        {/* Table/List */}
        <div className="flex flex-col gap-3">
          {MOCK_HISTORY.map((row) => {
            const isExpanded = expandedRow === row.id

            return (
              <div key={row.id} className="rounded-xl overflow-hidden shadow-sm transition-all border" style={{ background: 'var(--bg-surface)', borderColor: isExpanded ? 'var(--primary-border)' : 'var(--border)' }}>
                {/* Minimalist Summary Row (Click to expand) */}
                <div 
                  className={`grid items-center px-6 py-4 cursor-pointer transition-colors ${isExpanded ? 'bg-[var(--primary-muted)] bg-opacity-30' : 'hover:bg-[var(--bg-hover)]'}`} 
                  style={{ gridTemplateColumns: 'minmax(100px, 1fr) minmax(200px, 2fr) minmax(150px, 1.5fr) minmax(250px, 2fr) auto' }}
                  onClick={() => toggleRow(row.id)}
                >
                  {/* ID */}
                  <div>
                    <span className="font-mono text-xs font-bold text-[var(--text-primary)]">{row.id}</span>
                  </div>
                  
                  {/* Task & Estate */}
                  <div>
                    <div className="font-bold text-[14px] text-[var(--text-primary)] mb-1 truncate pr-4">{row.title}</div>
                    <div className="flex items-center gap-2 font-mono text-[11px] text-[var(--text-muted)]">
                      <span className="bg-[var(--bg-base)] px-1.5 py-0.5 rounded border border-[var(--border)]">{row.task}</span>
                      <span className="flex items-center gap-1 font-sans"><MapPin size={10} /> {row.block}</span>
                    </div>
                  </div>

                  {/* Date & Accuracy */}
                  <div className="flex flex-col gap-1 items-start">
                    <span className="font-mono text-[11px] text-[var(--text-secondary)]">{row.date}</span>
                    {row.aiCorrect ? (
                      <span className="flex items-center gap-1.5 px-2 py-0.5 rounded border border-[#10b981] border-opacity-30 bg-[#10b981] bg-opacity-10 text-[#10b981] font-sans text-[10px] font-bold uppercase tracking-wide">
                        <CheckCircle2 size={10} /> Prediksi AI Akurat
                      </span>
                    ) : (
                      <span className="flex items-center gap-1.5 px-2 py-0.5 rounded border border-[#ef4444] border-opacity-30 bg-[#ef4444] bg-opacity-10 text-[#ef4444] font-sans text-[10px] font-bold uppercase tracking-wide">
                        <FileText size={10} /> Dikoreksi Verifier
                      </span>
                    )}
                  </div>

                  {/* Final Ground Truth Label */}
                  <div>
                    <span className="px-3 py-1.5 rounded-lg border border-[var(--primary-border)] bg-[var(--primary-muted)] text-[var(--primary)] text-[13px] font-bold tracking-wide shadow-sm">
                      {row.label}
                    </span>
                  </div>

                  {/* Chevron */}
                  <div className="flex justify-end text-[var(--text-muted)] w-8">
                    {isExpanded ? <ChevronUp size={20} /> : <ChevronDown size={20} />}
                  </div>
                </div>

                {/* Expanded Detail Panel */}
                {isExpanded && (
                  <div className="border-t border-[var(--border)] bg-[var(--bg-elevated)] p-6">
                    <div className="max-w-5xl flex flex-col gap-6">
                      
                      {/* Photo Gallery of Ground Truth */}
                      <div>
                        <h4 className="text-[11px] font-bold text-[var(--text-muted)] uppercase tracking-widest flex items-center gap-2 mb-3">
                          <Eye size={14} /> Eviden Visual Tersortir (Data Training)
                        </h4>
                        <div className="flex gap-4 overflow-x-auto pb-2" style={{ scrollbarWidth: 'thin' }}>
                           <div className="shrink-0 w-[240px] sm:w-[280px] h-[160px] sm:h-[180px] rounded-xl border shadow-sm overflow-hidden bg-black relative">
                              <img src={`https://picsum.photos/seed/${row.id}_a/400/300`} className="w-full h-full object-cover opacity-90" alt="Bukti 1" />
                              <div className="absolute bottom-0 left-0 right-0 bg-black/60 backdrop-blur-sm p-2 text-[10px] font-mono text-white tracking-widest uppercase">Tag: Anomali Makro</div>
                           </div>
                           <div className="shrink-0 w-[240px] sm:w-[280px] h-[160px] sm:h-[180px] rounded-xl border shadow-sm overflow-hidden bg-black relative">
                              <img src={`https://picsum.photos/seed/${row.id}_b/400/300`} className="w-full h-full object-cover opacity-90" alt="Bukti 2" />
                              <div className="absolute bottom-0 left-0 right-0 bg-black/60 backdrop-blur-sm p-2 text-[10px] font-mono text-white tracking-widest uppercase">Tag: Gejala Mikro</div>
                           </div>
                           <div className="shrink-0 w-[240px] sm:w-[280px] h-[160px] sm:h-[180px] rounded-xl border shadow-sm overflow-hidden bg-black relative">
                              <img src={`https://picsum.photos/seed/${row.id}_c/400/300`} className="w-full h-full object-cover opacity-90 grayscale-[30%]" alt="Context" />
                              <div className="absolute bottom-0 left-0 right-0 bg-black/60 backdrop-blur-sm p-2 text-[10px] font-mono text-white tracking-widest uppercase">Tag: Konteks Lingkungan</div>
                           </div>
                        </div>
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        {/* Verifier Reasoning */}
                        <div className="flex flex-col gap-3">
                          <h4 className="text-[11px] font-bold text-[var(--text-muted)] uppercase tracking-widest flex items-center gap-2">
                            <FileText size={14} /> Anotasi Penjelasan Verifier
                          </h4>
                          <div className="bg-[var(--bg-surface)] p-5 rounded-xl border border-[var(--border)] shadow-sm text-[13px] text-[var(--text-secondary)] leading-relaxed italic h-full">
                            "{row.humanNote}"
                          </div>
                        </div>

                        {/* Model Diagnostic Compare */}
                        <div className="flex flex-col gap-3">
                           <h4 className="text-[11px] font-bold text-[var(--text-muted)] uppercase tracking-widest flex items-center gap-2">
                            <Cpu size={14} /> Evaluasi Kinerja Mesin
                          </h4>
                          <div className="bg-[var(--bg-surface)] p-5 rounded-xl border border-[var(--border)] shadow-sm flex flex-col gap-3 h-full">
                            <div className="flex justify-between items-center text-[12px] sm:text-[13px] py-1 border-b border-dashed border-[var(--border)]">
                              <span className="font-bold text-[var(--text-muted)]">Klasifikasi Awal AI:</span>
                              <span className="font-mono text-[var(--danger)] bg-[var(--danger-muted)] bg-opacity-10 px-2 py-0.5 rounded font-bold ml-2 text-right">{row.dronePred}</span>
                            </div>
                            <div className="flex justify-between items-center text-[12px] sm:text-[13px] py-1">
                              <span className="font-bold text-[var(--text-muted)]">Koreksi Ground Truth:</span>
                              <span className="font-mono text-[var(--primary)] bg-[var(--primary-muted)] bg-opacity-20 px-2 py-0.5 rounded font-bold ml-2 text-right">{row.label}</span>
                            </div>
                            <div className="mt-auto pt-3 border-t border-[var(--border)] text-[11px] text-[var(--text-muted)] leading-relaxed flex items-start gap-2">
                              <span className="w-1.5 h-1.5 rounded-full bg-[var(--primary)] mt-1 shrink-0" />
                              <span>Dataset Labeled ini secara otomatis direlasikan ke ML Engineer pipeline untuk melakukan retraining bobot probabilitas model di <strong>{row.block}</strong>.</span>
                            </div>
                          </div>
                        </div>
                      </div>

                    </div>
                  </div>
                )}
              </div>
            )
          })}
        </div>

      </div>
    </div>
  )
}
