'use client'

import { useState } from 'react'
import Link from 'next/link'
import { TaskDetailDrawer } from '@/components/modals/task-detail-modal'
import { CreateTaskModal } from '@/components/modals/create-task-modal'
import { PageHeader } from '@/components/ui/page-header'
import { Badge } from '@/components/ui/badge'
import { Plus, Search, Filter, Zap, Cpu, Eye, MoreHorizontal } from 'lucide-react'

import { ALL_TASKS, ALL_STATUSES } from '@/lib/mock-data'
import { TASK_STATUS_META, TASK_TYPE_META } from '@/lib/constants'

export default function TasksPage() {
  const [search, setSearch] = useState('')
  const [statusFilter, setStatusFilter] = useState('Semua')
  const [page, setPage] = useState(0)
  const [selectedTask, setSelectedTask] = useState<string | null>(null)
  
  const [isCreateOpen, setIsCreateOpen] = useState(false)

  const PAGE_SIZE = 8

  const filtered = ALL_TASKS.filter(t => (
    (!search || t.title.toLowerCase().includes(search.toLowerCase()) || t.id.toLowerCase().includes(search.toLowerCase())) &&
    (statusFilter === 'Semua' || t.status === statusFilter)
  ))

  const paginated = filtered.slice(page * PAGE_SIZE, (page + 1) * PAGE_SIZE)

  return (
    <div style={{ minHeight: '100vh', background: 'var(--bg-base)' }}>

      <PageHeader
        title="Manajemen Task"
        subtitle={`${filtered.length} task ditemukan`}
        rightContent={
          <>
            <Link href="/simulator" className="flex items-center gap-2 px-3 py-2 rounded border text-xs font-semibold no-underline transition-colors" style={{ background: 'var(--bg-elevated)', borderColor: 'var(--border)', color: 'var(--accent)' }}>
              <Cpu size={13} /> Buat via Simulator
            </Link>
            
            <button
              onClick={() => setIsCreateOpen(true)} 
              className="flex items-center gap-2 px-4 py-2 rounded text-xs font-bold text-white border-none cursor-pointer transition-transform active:scale-95" 
              style={{ background: 'var(--primary)' }}
            >
              <Plus size={13} /> BUAT TASK BARU
            </button>
          </>
        }
      />

      <div className="px-8 py-6">
        {/* ── Filters ──────────────────────────────────────────── */}
        <div className="flex items-center gap-3 mb-4">
          <div className="flex items-center gap-2 px-3 py-2 rounded flex-1 max-w-sm bg-[var(--bg-surface)] border border-[var(--border)]">
            <Search size={13} className="text-[var(--text-muted)] shrink-0" />
            <input
              type="text"
              placeholder="Cari task atau ID..."
              value={search}
              onChange={(e) => { setSearch(e.target.value); setPage(0) }}
              className="bg-transparent border-none outline-none text-[13px] text-[var(--text-primary)] w-full"
            />
          </div>

          <div className="flex items-center gap-1.5">
            <Filter size={12} className="text-[var(--text-muted)]" />
            {ALL_STATUSES.map((s) => (
              <button
                key={s}
                onClick={() => { setStatusFilter(s); setPage(0) }}
                className={`px-3 py-1 text-[11px] font-medium rounded border cursor-pointer ${
                  statusFilter === s ? 'bg-[var(--primary-muted)] text-[var(--primary)] border-[var(--primary-border)]' : 'bg-[var(--bg-surface)] text-[var(--text-muted)] border-[var(--border)]'
                }`}
              >
                {s === 'Semua' ? 'Semua' : TASK_STATUS_META[s]?.label ?? s}
              </button>
            ))}
          </div>
        </div>

        {/* ── Table ──────────────────────────────────────────────── */}
        <div className="rounded-lg overflow-hidden bg-[var(--bg-surface)] border border-[var(--border)] shadow-sm">
          <div className="grid px-4 py-3 bg-[var(--bg-elevated)] border-b border-[var(--border)] text-[10px] font-bold text-[var(--text-muted)] uppercase tracking-wider" style={{ gridTemplateColumns: '80px 1fr 130px 120px 80px 100px 50px' }}>
            {['ID', 'Judul', 'Status', 'Tipe', 'Reward', 'Estate', ''].map(h => <div key={h}>{h}</div>)}
          </div>

          {paginated.map((task, i) => {
            const status = TASK_STATUS_META[task.status] || TASK_STATUS_META['DRAFT']
            const type = TASK_TYPE_META[task.type] || TASK_TYPE_META['AREA_CONDITION']

            return (
              <div key={task.id} onClick={() => setSelectedTask(task.id)} className="grid px-4 py-3 items-center hover:bg-[var(--bg-hover)] transition-colors cursor-pointer border-b border-[var(--border-subtle)] last:border-b-0" style={{ gridTemplateColumns: '80px 1fr 130px 120px 80px 100px 50px' }}>
                <span className="font-mono text-[11px] text-[var(--text-muted)]">{task.id}</span>
                <div className="pr-4 min-w-0">
                  <div className="text-[13px] font-semibold text-[var(--text-primary)] truncate">{task.title}</div>
                  <div className="text-[10px] text-[var(--text-muted)] mt-0.5">{task.created} · {task.claims}/{task.max} klaim</div>
                </div>
                <div>
                  <Badge bg={status.bg} color={status.color} icon={status.icon} size="md">{status.label}</Badge>
                </div>
                <span className="text-[11px] font-semibold" style={{ color: type.color }}>{type.label}</span>
                <div className="flex items-center gap-1 font-mono text-[12px] font-bold text-[var(--accent)]">
                  <Zap size={10} />{task.reward}
                </div>
                <span className="text-[11px] text-[var(--text-muted)]">{task.estate}</span>
                <div className="flex items-center gap-1">
                  <button className="p-1 rounded bg-[var(--bg-elevated)] border border-[var(--border)] cursor-pointer text-[var(--text-muted)]"><Eye size={11} /></button>
                  <button className="p-1 rounded bg-[var(--bg-elevated)] border border-[var(--border)] cursor-pointer text-[var(--text-muted)]"><MoreHorizontal size={11} /></button>
                </div>
              </div>
            )
          })}
        </div>
      </div>

      <TaskDetailDrawer taskId={selectedTask} onClose={() => setSelectedTask(null)} />

      {isCreateOpen && (
        <CreateTaskModal
          onClose={() => setIsCreateOpen(false)}
          onPublish={(data) => {
            console.log('Task Manual Dibuat:', data)
            setIsCreateOpen(false)
          }}
        />
      )}
    </div>
  )
}