'use client'

import { useState } from 'react'
import { Download, Filter, Search, CheckCircle2, AlertTriangle, Send, Shield, Zap, Camera, Eye, MapPin } from 'lucide-react'

const AUDIT_LOG = [
  { id: 'AL-047', time: '15 Mar, 08:01', event: 'POIN_DISTRIBUTED',  task: 'TK-2847', detail: '150 poin didistribusikan ke Pak Surya',          actor: 'System', estate: 'KB', icon: Zap, color: 'var(--accent)' },
  { id: 'AL-046', time: '15 Mar, 07:58', event: 'QC_PASS',           task: 'TK-2847', detail: 'LLM Quality Gate — LULUS (94%)',                actor: 'AI GreenProof',  estate: 'KB', icon: Shield, color: 'var(--primary)' },
  { id: 'AL-045', time: '15 Mar, 07:53', event: 'SUBMISSION_RECEIVED', task: 'TK-2847', detail: 'Submission dari Pak Surya (L3) — 5 foto + video', actor: 'Pak Surya', estate: 'KB', icon: Camera, color: 'var(--info)' },
  { id: 'AL-044', time: '15 Mar, 07:00', event: 'TASK_PUBLISHED',    task: 'TK-2847', detail: 'Task Deteksi Ganoderma diterbitkan — KB-C3',    actor: 'Andi (Operator)', estate: 'KB', icon: Send, color: 'var(--primary)' },
  { id: 'AL-043', time: '14 Mar, 16:22', event: 'AI_ACCESS',         task: 'TK-2844', detail: 'AI GreenProof — 3 foto (Inference)',             actor: 'AI GreenProof',  estate: 'MT', icon: Eye, color: 'var(--warning)' },
  { id: 'AL-042', time: '14 Mar, 15:30', event: 'FLAGGED',           task: 'TK-2849', detail: 'Task di-flag — disagreement antar mitra',       actor: 'LLM Quality Gate', estate: 'KB', icon: AlertTriangle, color: 'var(--danger)' },
  { id: 'AL-041', time: '14 Mar, 14:20', event: 'SUBMISSION_RECEIVED', task: 'TK-2849', detail: 'Submission dari Wahyu Santoso (L1) — 2 foto',  actor: 'Wahyu Santoso', estate: 'KB', icon: Camera, color: 'var(--info)' },
  { id: 'AL-040', time: '14 Mar, 12:47', event: 'SUBMISSION_RECEIVED', task: 'TK-2849', detail: 'Submission dari Agus Mulyono (L2) — 4 foto',   actor: 'Agus Mulyono', estate: 'KB', icon: Camera, color: 'var(--info)' },
  { id: 'AL-039', time: '14 Mar, 11:00', event: 'TASK_PUBLISHED',    task: 'TK-2849', detail: 'Task Kondisi Umum Area diterbitkan — KB-D2',    actor: 'Andi (Operator)', estate: 'KB', icon: Send, color: 'var(--primary)' },
  { id: 'AL-038', time: '14 Mar, 10:50', event: 'TASK_PUBLISHED',    task: 'TK-2850', detail: 'Task Anomali Drainase diterbitkan — KT-B1',     actor: 'Andi (Operator)', estate: 'KT', icon: Send, color: 'var(--primary)' },
  { id: 'AL-037', time: '14 Mar, 10:15', event: 'POIN_DISTRIBUTED',  task: 'TK-2848', detail: '50 poin didistribusikan ke Bu Dewi',               actor: 'System', estate: 'KB', icon: Zap, color: 'var(--accent)' },
  { id: 'AL-036', time: '14 Mar, 09:30', event: 'QC_PASS',           task: 'TK-2848', detail: 'LLM Quality Gate — LULUS (88%)',                actor: 'AI GreenProof',  estate: 'KB', icon: Shield, color: 'var(--primary)' },
  { id: 'AL-035', time: '14 Mar, 08:15', event: 'SUBMISSION_RECEIVED', task: 'TK-2848', detail: 'Submission dari Bu Dewi (L2) — 3 foto',        actor: 'Bu Dewi', estate: 'KB', icon: Camera, color: 'var(--info)' },
  { id: 'AL-034', time: '13 Mar, 14:00', event: 'VERDICT_SUBMITTED', task: 'TK-2846', detail: 'Verdict agronomis — Kondisi Normal',            actor: 'Siti Rahayu',    estate: 'KB', icon: CheckCircle2, color: 'var(--primary)' },
  { id: 'AL-033', time: '13 Mar, 11:30', event: 'TASK_PUBLISHED',    task: 'TK-2846', detail: 'Task Survei Kondisi diterbitkan — KB-E2',       actor: 'Andi (Operator)', estate: 'KB', icon: Send, color: 'var(--primary)' },
]

const EVENT_TYPES = ['Semua', 'TASK_PUBLISHED', 'SUBMISSION_RECEIVED', 'QC_PASS', 'FLAGGED', 'POIN_DISTRIBUTED', 'AI_ACCESS', 'VERDICT_SUBMITTED']
const ESTATE_FILTER = ['Semua', 'KB', 'KT', 'MT']

const EVENT_LABELS: Record<string, string> = {
  TASK_PUBLISHED: 'Task Published',
  SUBMISSION_RECEIVED: 'Submission',
  QC_PASS: 'QC Pass',
  FLAGGED: 'Flagged',
  POIN_DISTRIBUTED: 'Poin Distributed',
  AI_ACCESS: 'AI Access',
  VERDICT_SUBMITTED: 'Verdict',
}

export default function AuditPage() {
  const [search, setSearch] = useState('')
  const [eventFilter, setEventFilter] = useState('Semua')
  const [estateFilter, setEstateFilter] = useState('Semua')

  const filtered = AUDIT_LOG.filter(l => {
    const matchSearch = !search || l.detail.toLowerCase().includes(search.toLowerCase()) || l.task.toLowerCase().includes(search.toLowerCase())
    const matchEvent = eventFilter === 'Semua' || l.event === eventFilter
    const matchEstate = estateFilter === 'Semua' || l.estate === estateFilter
    return matchSearch && matchEvent && matchEstate
  })

  const handleExport = () => {
    const csv = [
      'ID,Waktu,Event,Task,Detail,Aktor,Estate',
      ...filtered.map(l => `${l.id},"${l.time}",${l.event},${l.task},"${l.detail}",${l.actor},${l.estate}`)
    ].join('\n')
    const blob = new Blob([csv], { type: 'text/csv' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = 'audit_log.csv'
    a.click()
  }

  return (
    <div className="flex flex-col min-h-screen bg-[var(--bg-base)]">

      {/* Header */}
      <header className="flex items-center justify-between px-8 py-5 sticky top-0 z-10 bg-[var(--bg-surface)] border-b border-[var(--border)] shadow-sm">
        <div>
          <h1 className="font-sans text-xl font-bold text-[var(--text-primary)] tracking-tight">
            Audit Log Sistem
          </h1>
          <p className="font-sans text-xs text-[var(--text-muted)] mt-1 font-medium">
            {filtered.length} entri aktivitas terekam.
          </p>
        </div>
        <button
          onClick={handleExport}
          className="flex items-center gap-2 px-4 py-2.5 rounded-lg bg-[var(--bg-elevated)] border border-[var(--border)] hover:bg-[var(--bg-hover)] hover:border-[var(--border-strong)] transition-all cursor-pointer shadow-sm text-xs font-bold text-[var(--text-secondary)] hover:text-[var(--text-primary)]"
        >
          <Download size={14} /> Export CSV
        </button>
      </header>

      <div className="p-8 flex flex-col gap-6 max-w-[1200px] w-full">

        {/* Filters */}
        <div className="flex flex-col xl:flex-row items-start xl:items-center gap-4">
          <div className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-[var(--bg-surface)] border border-[var(--border)] shadow-sm focus-within:border-[var(--primary)] transition-colors w-full xl:w-80 shrink-0">
            <Search size={16} className="text-[var(--text-muted)] shrink-0" />
            <input
              type="text"
              placeholder="Cari ID Task, event, atau detail..."
              value={search}
              onChange={e => setSearch(e.target.value)}
              className="bg-transparent border-none outline-none font-sans text-[13px] text-[var(--text-primary)] w-full placeholder:text-[var(--text-muted)]"
            />
          </div>

          <div className="flex flex-wrap items-center gap-2">
            <div className="flex items-center gap-1.5 px-3 py-2 bg-[var(--bg-surface)] border border-[var(--border)] rounded-xl shadow-sm mr-2">
               <Filter size={14} className="text-[var(--text-muted)]" />
               <span className="text-[10px] font-bold text-[var(--text-muted)] uppercase tracking-wider">Event:</span>
            </div>
            {EVENT_TYPES.map(e => (
              <button
                key={e}
                onClick={() => setEventFilter(e)}
                className={`px-4 py-2 rounded-full text-[11px] font-bold tracking-wide uppercase transition-all cursor-pointer border shadow-sm ${
                  eventFilter === e 
                    ? 'bg-[var(--primary-muted)] text-[var(--primary)] border-[var(--primary-border)]' 
                    : 'bg-[var(--bg-surface)] text-[var(--text-muted)] border-[var(--border)] hover:bg-[var(--bg-hover)]'
                }`}
              >
                {e === 'Semua' ? 'Semua' : EVENT_LABELS[e] ?? e}
              </button>
            ))}
          </div>
        </div>
        
        {/* Estate Filter */}
        <div className="flex flex-wrap items-center gap-2">
            <div className="flex items-center gap-1.5 px-3 py-2 bg-[var(--bg-surface)] border border-[var(--border)] rounded-xl shadow-sm mr-2">
               <MapPin size={14} className="text-[var(--text-muted)]" />
               <span className="text-[10px] font-bold text-[var(--text-muted)] uppercase tracking-wider">Estate:</span>
            </div>
            {ESTATE_FILTER.map(e => (
              <button
                key={e}
                onClick={() => setEstateFilter(e)}
                className={`px-4 py-2 rounded-full text-[11px] font-bold tracking-wide transition-all cursor-pointer border shadow-sm ${
                  estateFilter === e 
                    ? 'bg-[var(--info-muted)] text-[var(--info)] border-[rgba(96,165,250,0.3)]' 
                    : 'bg-[var(--bg-surface)] text-[var(--text-muted)] border-[var(--border)] hover:bg-[var(--bg-hover)]'
                }`}
              >
                {e}
              </button>
            ))}
        </div>

        {/* Timeline Container */}
        <div className="rounded-2xl overflow-hidden bg-[var(--bg-surface)] border border-[var(--border)] shadow-sm">
          <div className="flex flex-col">
            {filtered.map((entry, i) => {
              const Icon = entry.icon
              return (
                <div key={entry.id} className="flex px-6 py-5 gap-5 hover:bg-[var(--bg-elevated)] transition-colors group relative" style={{ borderBottom: i < filtered.length - 1 ? '1px solid var(--border-subtle)' : 'none' }}>
                  {/* Timeline Line (Background) */}
                  {i < filtered.length - 1 && (
                    <div className="absolute left-[39px] top-[44px] bottom-[-20px] w-px bg-[var(--border-subtle)] group-hover:bg-[var(--border)] transition-colors z-0" />
                  )}
                  
                  {/* Timeline Dot/Icon */}
                  <div className="flex flex-col items-center relative z-10 shrink-0 pt-0.5">
                    <div 
                      className="w-8 h-8 rounded-full flex items-center justify-center shrink-0 border" 
                      style={{ 
                        backgroundColor: `color-mix(in srgb, ${entry.color} 15%, transparent)`, 
                        borderColor: `color-mix(in srgb, ${entry.color} 30%, transparent)`,
                        color: entry.color 
                      }}
                    >
                      <Icon size={14} strokeWidth={2.5} />
                    </div>
                  </div>

                  {/* Content */}
                  <div className="flex-1 min-w-0">
                    <div className="flex flex-wrap items-center gap-2.5 mb-2">
                      <span className="font-mono text-[11px] text-[var(--text-muted)] bg-[var(--bg-base)] px-2 py-0.5 rounded border border-[var(--border)] shrink-0">
                        {entry.time}
                      </span>
                      <span 
                        className="px-2.5 py-0.5 rounded-md font-sans text-[10px] font-bold tracking-widest uppercase border shrink-0" 
                        style={{ 
                          color: entry.color, 
                          backgroundColor: `color-mix(in srgb, ${entry.color} 10%, transparent)`,
                          borderColor: `color-mix(in srgb, ${entry.color} 20%, transparent)`
                        }}
                      >
                        {EVENT_LABELS[entry.event] ?? entry.event}
                      </span>
                      <span className="font-mono text-[11px] font-bold text-[var(--text-secondary)] shrink-0">
                        {entry.task}
                      </span>
                      <span className="px-2 py-0.5 rounded-md font-sans text-[10px] font-bold text-[var(--text-muted)] bg-[var(--bg-elevated)] border border-[var(--border)] shrink-0 flex items-center gap-1">
                        <MapPin size={10} /> {entry.estate}
                      </span>
                    </div>
                    
                    <p className="font-sans text-[13px] text-[var(--text-primary)] font-medium leading-relaxed m-0 mb-2">
                      {entry.detail}
                    </p>
                    
                    <div className="font-sans text-[11px] font-semibold text-[var(--text-muted)] flex items-center gap-1.5">
                      <span className="w-1.5 h-1.5 rounded-full bg-[var(--text-muted)] opacity-50" />
                      Oleh: <span className="text-[var(--text-secondary)]">{entry.actor}</span>
                    </div>
                  </div>
                </div>
              )
            })}

            {filtered.length === 0 && (
              <div className="p-16 text-center flex flex-col items-center justify-center gap-3">
                <Search size={32} className="text-[var(--border-strong)]" />
                <p className="font-sans text-sm font-medium text-[var(--text-muted)]">
                  Tidak ada log aktivitas yang cocok dengan filter saat ini.
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}