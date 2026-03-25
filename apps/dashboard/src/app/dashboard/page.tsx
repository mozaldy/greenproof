// === File: apps/dashboard/src/app/dashboard/page.tsx ===
'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import dynamic from 'next/dynamic'
import {
  AlertTriangle, CheckCircle2, ChevronRight, Cpu, Database, Globe,
  Radio, Server, ScanLine, Wind, Layers, Zap, Clock
} from 'lucide-react'
import { StatCard } from '@/components/ui/StatCard'
import { Badge } from '@/components/ui/Badge'
import { LiveDot } from '@/components/ui/LiveDot'
import { BatteryIcon } from '@/components/dashboard/icons' // Assume battery icon is extracted
import { DRONE_FLEET, ANOMALY_FEED, SYSTEM_NODES, ESTATES, SEVERITY, DRONE_STATUS, NODE_STATUS } from '@/lib/mock-data' // Move constants to a separate file

const DroneCommandMap = dynamic(
  () => import('@/components/dashboard/map-overview').then(m => m.MapOverview),
  { ssr: false }
)

export default function CommandCenterPage() {
  const [time, setTime] = useState(new Date())
  const [selectedOverlay, setSelectedOverlay] = useState<'task' | 'coverage' | 'validator'>('task')

  useEffect(() => {
    const t = setInterval(() => setTime(new Date()), 1000)
    return () => clearInterval(t)
  }, [])

  const timeStr = time.toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit', second: '2-digit' })
  const dateStr = time.toLocaleDateString('id-ID', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' })
  
  const sysLabel = SYSTEM_NODES.some(n => n.status === 'degraded') ? 'DEGRADED' : 'OPERATIONAL'
  const sysColor = sysLabel === 'OPERATIONAL' ? '#10b981' : '#eab308'

  return (
    <div style={{ minHeight: '100vh', background: 'var(--bg-base)', display: 'flex', flexDirection: 'column' }}>
      
      {/* ── Sticky Header ─────────────────────────────────────────── */}
      <header className="px-6 py-3 sticky top-0 z-20 flex items-center justify-between gap-6" style={{ background: 'var(--bg-surface)', borderBottom: '1px solid var(--border)' }}>
        <div>
          <div className="flex items-center gap-2">
            <ScanLine size={16} style={{ color: 'var(--primary)' }} />
            <h1 style={{ fontFamily: 'var(--font-sans)', fontSize: 16, fontWeight: 700, color: 'var(--text-primary)', letterSpacing: '-0.02em' }}>
              Drone Fleet Command Center
            </h1>
            <Badge color="#10b981" bg="rgba(16,185,129,0.12)" border="rgba(16,185,129,0.3)">LIVE</Badge>
          </div>
          <p style={{ fontFamily: 'var(--font-sans)', fontSize: 10, color: 'var(--text-muted)', marginTop: 2 }}>
            PT Nusantara Agro Lestari — {dateStr}
          </p>
        </div>

        <div className="flex items-center gap-2">
          <Clock size={13} style={{ color: 'var(--text-muted)' }} />
          <span style={{ fontFamily: 'var(--font-mono)', fontSize: 18, fontWeight: 700, color: 'var(--text-primary)' }}>{timeStr}</span>
        </div>

        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2 px-3 py-1.5 rounded-lg border shadow-sm" style={{ background: `${sysColor}15`, borderColor: `${sysColor}44` }}>
            <LiveDot color={sysColor} />
            <span style={{ fontFamily: 'var(--font-mono)', fontSize: 10, fontWeight: 700, color: sysColor, letterSpacing: '0.08em' }}>SYSTEM {sysLabel}</span>
          </div>
        </div>
      </header>

      {/* ── KPI Strip ─────────────────────────────────────────────── */}
      <div className="px-6 py-3 grid grid-cols-6 gap-3 border-b border-[var(--border)]">
        <StatCard label="Drone Aktif" value="3/6" sub="dari 6 armada" color="#10b981" icon={Wind} />
        <StatCard label="Coverage Hari Ini" value="5,842 ha" sub="dari 12.400 ha total" color="#6366f1" icon={Layers} />
        <StatCard label="Anomali Terdeteksi" value="31" sub="sejak 00:00 WIB" color="#f97316" icon={ScanLine} />
        <StatCard label="Alert Kritis" value="2" sub="butuh tindak segera" color="#ef4444" icon={AlertTriangle} />
        <StatCard label="Terverifikasi" value="7" sub="task selesai hari ini" color="var(--primary)" icon={CheckCircle2} />
        <StatCard label="Poin Didistribusikan" value="2,340" sub="ke mitra lapangan" color="#eab308" icon={Zap} />
      </div>

      {/* ── Main Grid ─────────────────────────────────────────────── */}
      <div className="flex-1 grid grid-cols-[1fr_340px] min-h-0">
        
        {/* LEFT: Map */}
        <div className="flex flex-col border-r border-[var(--border)]">
           {/* Map Implementation (unchanged logic, removed for brevity) */}
           <div className="flex-1 relative min-h-0"><DroneCommandMap /></div>
        </div>

        {/* RIGHT: Monitoring panels */}
        <div className="flex flex-col overflow-y-auto bg-[var(--bg-base)]">
          {/* Fleet Status */}
          <section className="border-b border-[var(--border)]">
            <div className="px-4 py-2.5 flex items-center justify-between bg-[var(--bg-surface)] border-b border-[var(--border)]">
              <div className="flex items-center gap-2 font-bold text-xs"><Wind size={13} className="text-[var(--primary)]" /> Armada Drone</div>
            </div>
            <div className="p-3 flex flex-col gap-1.5">
              {DRONE_FLEET.map(drone => {
                const st = DRONE_STATUS[drone.status]
                return (
                  <div key={drone.id} className="rounded-lg px-3 py-2.5 bg-[var(--bg-surface)] border border-[var(--border)]">
                    <div className="flex items-center justify-between mb-1">
                      <div className="flex items-center gap-2">
                        <span className="font-mono text-[11px] font-bold">{drone.id}</span>
                        <Badge bg={st.bg} color={st.color}>{st.label}</Badge>
                      </div>
                      <div className="flex items-center gap-1 font-mono text-[10px]">
                        <BatteryIcon pct={drone.battery} /> {drone.battery}%
                      </div>
                    </div>
                    {/* Drone metrics ... */}
                  </div>
                )
              })}
            </div>
          </section>

          {/* Anomaly Feed */}
          <section>
            <div className="px-4 py-2.5 flex items-center justify-between bg-[var(--bg-surface)] border-b border-[var(--border)]">
               <div className="flex items-center gap-2 font-bold text-xs"><AlertTriangle size={13} color="#f97316" /> Live Alert Feed</div>
            </div>
            <div className="divide-y divide-[var(--border-subtle)]">
              {ANOMALY_FEED.map(a => {
                const sv = SEVERITY[a.severity]
                return (
                  <div key={a.id} className={`px-4 py-2.5 flex items-start gap-3 relative ${a.fresh ? 'bg-opacity-5' : ''}`} style={{ backgroundColor: a.fresh ? sv.color : 'transparent' }}>
                    <div className="shrink-0 mt-0.5 w-1.5 h-1.5 rounded-full" style={{ background: sv.color }} />
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-1.5 mb-0.5">
                        <span className="text-[11px] font-semibold">{a.type}</span>
                        <Badge bg={sv.bg} color={sv.color}>{sv.label}</Badge>
                      </div>
                      <div className="flex items-center gap-2 font-mono text-[9px] text-[var(--text-muted)]">
                        {a.block} · conf {a.conf}% · <Link href="/dashboard/tasks" className="text-[var(--primary)] no-underline">{a.taskId}</Link>
                      </div>
                    </div>
                    <div className="font-mono text-[9px] text-[var(--text-muted)]">{a.ts}</div>
                  </div>
                )
              })}
            </div>
          </section>

        </div>
      </div>
    </div>
  )
}