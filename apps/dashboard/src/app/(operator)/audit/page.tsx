'use client'

import { useState } from 'react'
import { Download, Filter, Search, CheckCircle2, AlertTriangle, Send, Shield, Zap, Camera, Eye } from 'lucide-react'

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
    <div style={{ minHeight: '100vh', background: 'var(--bg-base)' }}>

      {/* Header */}
      <header className="flex items-center justify-between px-8 py-4 sticky top-0 z-10" style={{ background: 'var(--bg-surface)', borderBottom: '1px solid var(--border)' }}>
        <div>
          <h1 style={{ fontFamily: 'var(--font-sans)', fontSize: 20, fontWeight: 700, color: 'var(--text-primary)', lineHeight: 1, letterSpacing: '-0.02em' }}>
            Audit Log
          </h1>
          <p style={{ fontFamily: 'var(--font-sans)', fontSize: 12, color: 'var(--text-muted)', marginTop: 4 }}>
            {filtered.length} entri ditemukan
          </p>
        </div>
        <button
          onClick={handleExport}
          className="flex items-center gap-2 px-4 py-2 rounded-lg"
          style={{ background: 'var(--bg-elevated)', border: '1px solid var(--border)', fontFamily: 'var(--font-sans)', fontSize: 12, fontWeight: 600, color: 'var(--text-secondary)', cursor: 'pointer' }}
        >
          <Download size={13} /> Export CSV
        </button>
      </header>

      <div className="px-8 py-6">

        {/* Filters */}
        <div className="flex items-center gap-3 mb-5 flex-wrap">
          <div className="flex items-center gap-2 px-3 py-2 rounded-lg" style={{ background: 'var(--bg-surface)', border: '1px solid var(--border)', flex: 1, minWidth: 200, maxWidth: 320 }}>
            <Search size={14} style={{ color: 'var(--text-muted)' }} />
            <input
              placeholder="Cari log..."
              value={search}
              onChange={e => setSearch(e.target.value)}
              style={{ background: 'transparent', border: 'none', outline: 'none', fontFamily: 'var(--font-sans)', fontSize: 13, color: 'var(--text-primary)', width: '100%' }}
            />
          </div>

          <div className="flex items-center gap-1.5">
            <Filter size={12} style={{ color: 'var(--text-muted)' }} />
            {EVENT_TYPES.map(e => (
              <button
                key={e}
                onClick={() => setEventFilter(e)}
                className="px-2.5 py-1 rounded"
                style={{
                  background: eventFilter === e ? 'var(--primary-muted)' : 'var(--bg-elevated)',
                  border: `1px solid ${eventFilter === e ? 'var(--primary-border)' : 'var(--border)'}`,
                  fontFamily: 'var(--font-sans)', fontSize: 10, fontWeight: 600,
                  color: eventFilter === e ? 'var(--primary)' : 'var(--text-muted)',
                  cursor: 'pointer',
                }}
              >
                {e === 'Semua' ? 'Semua' : EVENT_LABELS[e] ?? e}
              </button>
            ))}
          </div>

          <div className="flex items-center gap-1.5">
            {ESTATE_FILTER.map(e => (
              <button
                key={e}
                onClick={() => setEstateFilter(e)}
                className="px-2.5 py-1 rounded"
                style={{
                  background: estateFilter === e ? 'var(--info-muted)' : 'var(--bg-elevated)',
                  border: `1px solid ${estateFilter === e ? 'rgba(92,168,224,0.3)' : 'var(--border)'}`,
                  fontFamily: 'var(--font-sans)', fontSize: 10, fontWeight: 600,
                  color: estateFilter === e ? 'var(--info)' : 'var(--text-muted)',
                  cursor: 'pointer',
                }}
              >
                {e}
              </button>
            ))}
          </div>
        </div>

        {/* Timeline */}
        <div className="rounded-lg overflow-hidden" style={{ background: 'var(--bg-surface)', border: '1px solid var(--border)' }}>
          {filtered.map((entry, i) => {
            const Icon = entry.icon
            return (
              <div key={entry.id} className="flex px-5 py-4 gap-4" style={{ borderBottom: i < filtered.length - 1 ? '1px solid var(--border-subtle)' : 'none' }}>
                {/* Timeline dot + line */}
                <div className="flex flex-col items-center" style={{ width: 28 }}>
                  <div className="w-7 h-7 rounded-full flex items-center justify-center shrink-0" style={{ background: `${entry.color}22`, border: `1px solid ${entry.color}44` }}>
                    <Icon size={12} style={{ color: entry.color }} />
                  </div>
                  {i < filtered.length - 1 && <div className="flex-1 w-px mt-1" style={{ background: 'var(--border)' }} />}
                </div>

                {/* Content */}
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1">
                    <span style={{ fontFamily: 'var(--font-mono)', fontSize: 10, color: 'var(--text-muted)' }}>{entry.time}</span>
                    <span className="px-1.5 py-0.5 rounded" style={{ fontFamily: 'var(--font-sans)', fontSize: 8, fontWeight: 700, letterSpacing: '0.06em', color: entry.color, background: `${entry.color}18` }}>
                      {EVENT_LABELS[entry.event] ?? entry.event}
                    </span>
                    <span style={{ fontFamily: 'var(--font-mono)', fontSize: 10, color: 'var(--text-muted)' }}>{entry.task}</span>
                    <span className="px-1 py-0.5 rounded" style={{ fontFamily: 'var(--font-mono)', fontSize: 8, fontWeight: 700, color: 'var(--text-muted)', background: 'var(--bg-elevated)' }}>
                      {entry.estate}
                    </span>
                  </div>
                  <p style={{ fontFamily: 'var(--font-sans)', fontSize: 12, color: 'var(--text-primary)', margin: 0 }}>
                    {entry.detail}
                  </p>
                  <div style={{ fontFamily: 'var(--font-sans)', fontSize: 10, color: 'var(--text-muted)', marginTop: 2 }}>
                    oleh {entry.actor}
                  </div>
                </div>
              </div>
            )
          })}

          {filtered.length === 0 && (
            <div className="p-12 text-center">
              <p style={{ fontFamily: 'var(--font-sans)', fontSize: 14, color: 'var(--text-muted)' }}>
                Tidak ada log yang cocok dengan filter.
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
