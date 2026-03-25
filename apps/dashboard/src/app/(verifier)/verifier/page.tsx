'use client'

import { useState } from 'react'
import { Cpu, ChevronDown, ListTodo, CheckCircle2 } from 'lucide-react'

import { MOCK_CASES } from '@/lib/mock-data'
import { PRIORITY_META } from '@/lib/constants'
import type { VerifierCase } from '@/types'
import { Badge } from '@/components/ui/badge'

import { EvidenceViewer } from '@/features/verification-studio/components/evidence-viewer'
import { GradingStudio } from '@/features/verification-studio/components/grading-studio'

export default function VerifierPage() {
  const [cases, setCases] = useState<VerifierCase[]>(MOCK_CASES)
  const [activeCaseId, setActiveCaseId] = useState<string>(MOCK_CASES.find(c => c.verdictPhase === 'PENDING')?.caseId ?? MOCK_CASES[0].caseId)
  const [showQueue, setShowQueue] = useState(false)
  const [showForm, setShowForm] = useState(false)
  
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

  return (
    <div className="flex flex-col h-screen overflow-hidden" style={{ background: 'var(--bg-base)' }}>
      {/* Top Controller Header */}
      <header className="flex items-center justify-between px-8 py-3 shrink-0 shadow-sm relative z-30" style={{ background: 'var(--bg-surface)', borderBottom: '1px solid var(--border)' }}>
        <div className="flex items-center gap-6">
          <h1 className="flex items-center gap-2 font-sans text-lg font-bold text-[var(--text-primary)]">
            <Cpu size={18} className="text-[var(--primary)]" /> AI Labeling Studio
          </h1>
          <div className="w-px h-6 bg-[var(--border)]" />
          
          <div className="relative">
            <button onClick={() => setShowQueue(!showQueue)} className="flex items-center gap-3 px-4 py-2 rounded-lg border hover:bg-[var(--bg-hover)] transition-colors cursor-pointer bg-[var(--bg-base)] border-[var(--border)]">
              <ListTodo size={14} className="text-[var(--text-muted)]" />
              <div className="text-left">
                <div className="font-sans text-[10px] text-[var(--text-muted)] font-semibold">Tugas Terpilih</div>
                <div className="font-mono text-[13px] font-bold text-[var(--text-primary)]">{activeCase.caseId} <span className="font-sans font-medium text-xs text-[var(--text-secondary)]">— {activeCase.taskTitle}</span></div>
              </div>
              <ChevronDown size={14} className="text-[var(--text-muted)] ml-2" />
            </button>

            {showQueue && (
              <>
                <div className="fixed inset-0 z-40" onClick={() => setShowQueue(false)} />
                <div className="absolute top-full left-0 mt-2 w-[450px] rounded-xl shadow-xl overflow-hidden border z-50 bg-[var(--bg-surface)] border-[var(--border)]">
                  <div className="px-4 py-3 border-b bg-[var(--bg-elevated)] border-[var(--border)] flex justify-between items-center">
                    <span className="text-xs font-bold text-[var(--text-muted)] uppercase tracking-wider">Antrean Verifikasi</span>
                    <span className="text-xs font-bold text-[#ef4444] bg-[#ef4444]/10 px-2 py-0.5 rounded">{pending.length} Menunggu</span>
                  </div>
                  <div className="max-h-[60vh] overflow-y-auto">
                    {cases.map(c => {
                      const isGraded = c.verdictPhase === 'GRADED'
                      const priorityMeta = PRIORITY_META[c.priority as keyof typeof PRIORITY_META]
                      return (
                        <button key={c.caseId} onClick={() => { setActiveCaseId(c.caseId); setShowQueue(false); setShowForm(false); }} className="w-full text-left px-4 py-3 border-b border-[var(--border)] hover:bg-[var(--bg-hover)] transition-colors flex flex-col gap-1 cursor-pointer bg-transparent">
                          <div className="flex items-center justify-between">
                            <span className="font-mono text-[11px] font-bold" style={{ color: isGraded ? '#10b981' : 'var(--text-primary)' }}>{c.caseId}</span>
                            {isGraded ? <CheckCircle2 size={14} className="text-[#10b981]" /> : <Badge bg={priorityMeta.bg} color={priorityMeta.color}>{c.priority}</Badge>}
                          </div>
                          <div className="font-sans text-[13px] text-[var(--text-secondary)] font-medium">{c.taskTitle}</div>
                        </button>
                      )
                    })}
                  </div>
                </div>
              </>
            )}
          </div>
        </div>

        <div className="flex items-center gap-2 px-3 py-1.5 rounded-lg border bg-[var(--bg-base)] border-[var(--border)]">
          <CheckCircle2 size={14} className="text-[#10b981]" />
          <span className="font-sans text-xs font-bold text-[var(--text-primary)]">{graded.length + 246} Data Terverifikasi</span>
        </div>
      </header>

      {/* ── Main Workspace ────────────────────────────────────────── */}
      <div className="flex flex-1 overflow-hidden relative">
        <EvidenceViewer 
          activeCase={activeCase} 
          showForm={showForm} 
          onOpenForm={() => setShowForm(true)} 
        />
        
        <GradingStudio 
          activeCase={activeCase} 
          showForm={showForm} 
          onCloseForm={() => setShowForm(false)}
          onUpdateVerdict={handleVerdictDataUpdate}
          onUpdateGrade={handleGradeUpdate}
          onSubmit={submitGrade}
        />
      </div>
    </div>
  )
}