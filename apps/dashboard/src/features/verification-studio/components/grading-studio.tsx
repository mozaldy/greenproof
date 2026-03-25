import { useState } from 'react'
import { X, FileCheck, Award, Database, CheckCircle2, ChevronDown } from 'lucide-react'
import { LABEL_OPTIONS } from '@/lib/constants'
import { VerifierCase } from '@/types'

interface RatingButtonProps {
  label: string
  value: number
  currentVal: number
  onClick: () => void
  colorClass: string
}

interface GradingStudioProps {
  activeCase: VerifierCase
  showForm: boolean
  onCloseForm: () => void
  onUpdateVerdict: (patch: Partial<NonNullable<VerifierCase['verdictData']>>) => void
  onUpdateGrade: (subId: string, type: 'imageScore' | 'analysisScore', val: number) => void
  onSubmit: () => void
}

export function GradingStudio({ activeCase, showForm, onCloseForm, onUpdateVerdict, onUpdateGrade, onSubmit }: GradingStudioProps) {
  
  // State untuk mengontrol Dropdown Custom
  const [isDropdownOpen, setIsDropdownOpen] = useState(false)
  
  // State untuk "memaksa" mode Custom (Lainnya) tetap aktif meskipun input masih kosong
  const [forceCustomMode, setForceCustomMode] = useState(false)

  const RatingButton = ({ label, value, currentVal, onClick, colorClass }: RatingButtonProps) => {
    const active = currentVal === value
    return (
      <button 
        onClick={onClick}
        className={`flex-1 py-1.5 sm:py-2 px-1 sm:px-2 rounded border text-[9px] sm:text-[10px] font-bold tracking-wide transition-all uppercase cursor-pointer ${active ? colorClass : 'bg-[var(--bg-base)] border-[var(--border)] text-[var(--text-muted)] hover:bg-[var(--bg-hover)]'}`}
      >
        {label}
      </button>
    )
  }

  const currentFinalLabel = activeCase.verdictData?.finalLabel || ''
  
  // Deteksi apakah label saat ini bukan dari opsi bawaan (artinya user mengetik sendiri)
  const isCustomLabelValue = currentFinalLabel !== '' && !LABEL_OPTIONS.includes(currentFinalLabel)
  
  // Mode "Lainnya" aktif jika user sudah mengetik teks custom, ATAU user baru saja klik tombol "Lainnya"
  const showCustomInput = isCustomLabelValue || forceCustomMode

  // Teks yang ditampilkan pada tombol Dropdown
  const displayLabel = showCustomInput 
    ? "Lainnya (Diagnosis Kustom)" 
    : (currentFinalLabel || "-- Pilih Klasifikasi Definitif --")

  const handleSelectOption = (opt: string) => {
    setIsDropdownOpen(false)
    if (opt === 'Lainnya') {
      setForceCustomMode(true)
      onUpdateVerdict({ finalLabel: '' }) // Kosongkan label agar user bisa mengetik
    } else {
      setForceCustomMode(false)
      onUpdateVerdict({ finalLabel: opt })
    }
  }

  const handleCustomInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    onUpdateVerdict({ finalLabel: e.target.value })
  }

  return (
    <div
      className={`absolute top-0 right-0 w-full sm:w-[480px] h-full shadow-2xl border-l z-40 flex flex-col transition-transform duration-300 ease-in-out ${showForm ? 'translate-x-0' : 'translate-x-full'}`}
      style={{ background: 'var(--bg-surface)', borderColor: 'var(--border)' }}
    >
      <div className="px-6 py-5 border-b flex items-center justify-between shadow-sm relative z-10" style={{ borderColor: 'var(--border)', background: 'var(--bg-surface)' }}>
        <div className="flex items-center gap-3">
          <FileCheck size={18} className="text-[var(--primary)]" />
          <span className="font-bold text-[13px] text-[var(--text-primary)] uppercase tracking-widest">Formulir Verifikasi Akhir</span>
        </div>
        <button onClick={onCloseForm} className="p-1.5 rounded-md hover:bg-[var(--bg-hover)] text-[var(--text-muted)] hover:text-[var(--text-primary)] transition-colors cursor-pointer border-none bg-transparent">
          <X size={18} />
        </button>
      </div>

      <div className="flex-1 overflow-y-auto p-4 sm:p-6 flex flex-col gap-6 sm:gap-8 bg-[var(--bg-elevated)]">
        
        {/* 1. Final Label (Dengan Custom Dropdown) */}
        <div className="bg-[var(--bg-surface)] p-4 sm:p-5 rounded-xl border border-[var(--border)] shadow-sm">
          <label className="text-[10px] sm:text-[11px] font-bold text-[var(--text-secondary)] uppercase tracking-wider mb-2 sm:mb-3 flex items-center gap-2">
            <span className="flex items-center justify-center w-5 h-5 rounded-full bg-[var(--primary-muted)] text-[var(--primary)] text-[10px]">1</span>
            Ketetapan Ground Truth
          </label>
          
          <div className="flex flex-col gap-3 relative">
            
            {/* Custom Select Button */}
            <div 
              onClick={() => activeCase.verdictPhase !== 'GRADED' && setIsDropdownOpen(!isDropdownOpen)}
              className={`w-full px-4 py-3 rounded-xl border flex items-center justify-between transition-colors ${
                isDropdownOpen ? 'border-[var(--primary)] ring-1 ring-[var(--primary)]' : 'border-[var(--border)]'
              } bg-[var(--bg-base)] ${activeCase.verdictPhase === 'GRADED' ? 'cursor-not-allowed opacity-70' : 'cursor-pointer'}`}
            >
              <span className={`text-[13px] font-bold ${currentFinalLabel || showCustomInput ? 'text-[var(--text-primary)]' : 'text-[var(--text-muted)]'}`}>
                {displayLabel}
              </span>
              <ChevronDown size={16} className={`text-[var(--text-muted)] transition-transform duration-200 ${isDropdownOpen ? 'rotate-180' : ''}`} />
            </div>

            {/* Custom Dropdown Menu */}
            {isDropdownOpen && (
              <>
                <div className="fixed inset-0 z-40" onClick={() => setIsDropdownOpen(false)} />
                <div className="absolute top-[52px] left-0 w-full max-h-64 overflow-y-auto bg-[var(--bg-surface)] border border-[var(--border-strong)] rounded-xl shadow-xl z-50 py-1 animate-in fade-in zoom-in-95 duration-100">
                  {LABEL_OPTIONS.map(opt => (
                    <div 
                      key={opt} 
                      onClick={() => handleSelectOption(opt)} 
                      className={`px-4 py-3 cursor-pointer text-[13px] font-semibold transition-colors ${
                        currentFinalLabel === opt ? 'bg-[var(--primary-muted)] text-[var(--primary)]' : 'text-[var(--text-primary)] hover:bg-[var(--bg-hover)]'
                      }`}
                    >
                      {opt}
                    </div>
                  ))}
                  <div 
                    onClick={() => handleSelectOption('Lainnya')} 
                    className="px-4 py-3 cursor-pointer text-[13px] font-semibold text-[var(--info)] hover:bg-[var(--bg-hover)] border-t border-[var(--border-subtle)] transition-colors"
                  >
                    Lainnya (Diagnosis Kustom)
                  </div>
                </div>
              </>
            )}

            {/* Input Tambahan Jika "Lainnya" Aktif */}
            {showCustomInput && (
              <div className="animate-in fade-in slide-in-from-top-2 duration-300">
                 <input 
                   type="text" 
                   className="w-full px-4 py-3 rounded-xl border text-[13px] bg-[var(--bg-base)] placeholder:text-[var(--text-muted)] focus:border-[var(--primary)] transition-colors outline-none font-semibold"
                   style={{ borderColor: 'var(--border)', color: 'var(--text-primary)' }}
                   placeholder="Ketik diagnosis definitif secara manual..."
                   value={currentFinalLabel}
                   onChange={handleCustomInput}
                   disabled={activeCase.verdictPhase === 'GRADED'}
                   autoFocus
                 />
              </div>
            )}
          </div>
        </div>

        {/* 2. Mitra Grading */}
        <div className="bg-[var(--bg-surface)] p-4 sm:p-5 rounded-xl border border-[var(--border)] shadow-sm">
          <label className="text-[10px] sm:text-[11px] font-bold text-[var(--text-secondary)] uppercase tracking-wider mb-3 sm:mb-4 flex items-center gap-2">
            <span className="flex items-center justify-center w-5 h-5 rounded-full bg-[var(--primary-muted)] text-[var(--primary)] text-[10px]">2</span>
            Penilaian Kualitas Eviden
          </label>
          
          <div className="flex flex-col gap-5 sm:gap-6">
            {activeCase.submissions.map((sub, i) => {
              const vData = activeCase.verdictData;
              const grade = vData?.grades.find(g => g.submissionId === sub.id) || { imageScore: 0, analysisScore: 0 }
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
                        <RatingButton label="Kurang Jelas" value={30} currentVal={mockImg} onClick={() => onUpdateGrade(sub.id, 'imageScore', 30)} colorClass="bg-[#ef4444]/10 text-[#ef4444] border-[#ef4444]/40" />
                        <RatingButton label="Diterima" value={60} currentVal={mockImg} onClick={() => onUpdateGrade(sub.id, 'imageScore', 60)} colorClass="bg-[#eab308]/10 text-[#eab308] border-[#eab308]/40" />
                        <RatingButton label="Resolutif" value={90} currentVal={mockImg} onClick={() => onUpdateGrade(sub.id, 'imageScore', 90)} colorClass="bg-[#10b981]/10 text-[#10b981] border-[#10b981]/40" />
                      </div>
                    </div>
                    <div>
                      <div className="text-[9px] sm:text-[10px] text-[var(--text-muted)] font-bold uppercase tracking-wide mb-1.5 sm:mb-2">Presisi Analisa</div>
                      <div className="flex flex-wrap gap-1.5 sm:gap-2">
                        <RatingButton label="Tdk Relevan" value={30} currentVal={mockAna} onClick={() => onUpdateGrade(sub.id, 'analysisScore', 30)} colorClass="bg-[#ef4444]/10 text-[#ef4444] border-[#ef4444]/40" />
                        <RatingButton label="Sebagian Tepat" value={60} currentVal={mockAna} onClick={() => onUpdateGrade(sub.id, 'analysisScore', 60)} colorClass="bg-[#eab308]/10 text-[#eab308] border-[#eab308]/40" />
                        <RatingButton label="Akurat" value={90} currentVal={mockAna} onClick={() => onUpdateGrade(sub.id, 'analysisScore', 90)} colorClass="bg-[#10b981]/10 text-[#10b981] border-[#10b981]/40" />
                      </div>
                    </div>
                  </div>
                </div>
              )
            })}
          </div>
        </div>

        {/* 3. Reasoning */}
        <div className="bg-[var(--bg-surface)] p-4 sm:p-5 rounded-xl border border-[var(--border)] shadow-sm">
          <label className="text-[10px] sm:text-[11px] font-bold text-[var(--text-secondary)] uppercase tracking-wider mb-2 sm:mb-3 flex items-center gap-2">
            <span className="flex items-center justify-center w-5 h-5 rounded-full bg-[var(--primary-muted)] text-[var(--primary)] text-[10px]">3</span> Anotasi Penjelasan
          </label>
          <textarea 
            className="w-full px-4 py-3 rounded-xl border text-[13px] bg-[var(--bg-base)] focus:border-[var(--primary)] transition-colors"
            style={{ borderColor: 'var(--border)', color: 'var(--text-primary)', outline: 'none', resize: 'vertical', minHeight: 120 }}
            placeholder="Tuliskan rasionalitas keputusan agronomi Anda di sini untuk keperluan Quality Control (QC)..."
            value={activeCase.verdictData?.reasoningNotes || ''}
            onChange={e => onUpdateVerdict({ reasoningNotes: e.target.value })}
            disabled={activeCase.verdictPhase === 'GRADED'}
          />
        </div>
      </div>

      <div className="p-4 sm:p-5 border-t bg-[var(--bg-surface)] relative z-10" style={{ borderColor: 'var(--border)' }}>
        {activeCase.verdictPhase === 'PENDING' ? (
          <button 
            onClick={onSubmit}
            disabled={!currentFinalLabel || !activeCase.verdictData?.reasoningNotes}
            className="w-full py-4 rounded-xl flex justify-center items-center gap-2 transition-all shadow-md bg-[var(--accent)] text-white border-none font-bold text-[13px] uppercase cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed hover:bg-yellow-500"
          >
            <Database size={16} /> AKTIVASI REKAM & DISTRIBUSI
          </button>
        ) : (
          <div className="w-full py-4 rounded-xl flex justify-center items-center gap-2 border bg-emerald-500/10 border-emerald-500/30 text-emerald-500 font-bold text-[13px] uppercase">
            <CheckCircle2 size={16} strokeWidth={2.5} /> HASIL TERVERIFIKASI
          </div>
        )}
      </div>
    </div>
  )
}