import { X, FileCheck, Award, Database, CheckCircle2 } from 'lucide-react'
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

  return (
    <div
      className={`absolute top-0 right-0 w-full sm:w-[420px] h-full shadow-2xl border-l z-30 flex flex-col transition-transform duration-300 ease-in-out ${showForm ? 'translate-x-0' : 'translate-x-full'}`}
      style={{ background: 'var(--bg-surface)', borderColor: 'var(--border)' }}
    >
      <div className="px-6 py-5 border-b flex items-center justify-between shadow-sm relative z-10" style={{ borderColor: 'var(--border)', background: 'var(--bg-surface)' }}>
        <div className="flex items-center gap-3">
          <FileCheck size={18} className="text-[var(--primary)]" />
          <span className="font-bold text-[13px] text-[var(--text-primary)] uppercase tracking-widest">Formulir Verifikasi Akhir</span>
        </div>
        <button onClick={onCloseForm} className="p-1.5 rounded-md hover:bg-[var(--bg-hover)] text-[var(--text-muted)] transition-colors cursor-pointer border-none bg-transparent">
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
          <select
            className="w-full px-3 py-2.5 sm:px-4 sm:py-3 rounded-lg border text-sm font-bold bg-[var(--bg-base)] cursor-pointer"
            style={{ borderColor: 'var(--border)', color: 'var(--text-primary)', outline: 'none' }}
            value={activeCase.verdictData?.finalLabel || ''}
            onChange={e => onUpdateVerdict({ finalLabel: e.target.value })}
            disabled={activeCase.verdictPhase === 'GRADED'}
          >
            <option value="">-- Tetapkan Klasifikasi Definitif --</option>
            {LABEL_OPTIONS.map(l => <option key={l} value={l}>{l}</option>)}
          </select>
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
            className="w-full px-3 py-2.5 sm:px-4 sm:py-3 rounded-lg border text-sm bg-[var(--bg-base)]"
            style={{ borderColor: 'var(--border)', color: 'var(--text-primary)', outline: 'none', resize: 'vertical', minHeight: 100 }}
            placeholder="Rasionalitas keputusan ini..."
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
            disabled={!activeCase.verdictData?.finalLabel || !activeCase.verdictData?.reasoningNotes}
            className="w-full py-3.5 sm:py-4 rounded-xl flex justify-center items-center gap-2 transition-all shadow-md bg-[var(--accent)] text-white border-none font-bold text-xs uppercase cursor-pointer disabled:opacity-50"
          >
            <Database size={16} /> AKTIVASI REKAM & DISTRIBUSI
          </button>
        ) : (
          <div className="w-full py-3.5 rounded-xl flex justify-center items-center gap-2 border bg-[#10b981]/10 border-[#10b981]/30 text-[#10b981] font-bold text-xs uppercase">
            <CheckCircle2 size={16} /> HASIL TERVERIFIKASI
          </div>
        )}
      </div>
    </div>
  )
}