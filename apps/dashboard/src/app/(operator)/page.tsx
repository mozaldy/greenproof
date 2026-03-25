'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import dynamic from 'next/dynamic'
import { AlertTriangle, CheckCircle2, ScanLine, Wind, Layers, Zap, Clock } from 'lucide-react'
import { PageHeader } from '@/components/ui/page-header'
import { StatCard } from '@/components/ui/stat-card'
import { Badge } from '@/components/ui/badge'
import { LiveDot } from '@/components/ui/live-dot'
import { DRONE_FLEET, ANOMALY_FEED, SYSTEM_NODES, DASHBOARD_STATS } from '@/lib/mock-data'
import { DRONE_STATUS, SEVERITY_META } from '@/lib/constants'
import { TokenTreasuryWidget } from '@/components/dashboard/token-treasury-widget'
import { KpiStrip } from '@/features/command-center/components/kpi-strip'

const DroneCommandMap = dynamic(() => import('@/components/dashboard/map-overview').then(m => m.MapOverview), { ssr: false })

export default function CommandCenterPage() {
  const [timeStr, setTimeStr] = useState('')

  useEffect(() => {
    const t = setInterval(() => setTimeStr(new Date().toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit', second: '2-digit' })), 1000)
    return () => clearInterval(t)
  }, [])

  const sysLabel = SYSTEM_NODES.some(n => n.status === 'degraded') ? 'DEGRADED' : 'OPERATIONAL'
  const sysColor = sysLabel === 'OPERATIONAL' ? '#10b981' : '#eab308'

  return (
    <div className="flex flex-col min-h-screen bg-[var(--bg-base)]">
      
      <PageHeader 
        title="Drone Fleet Command Center"
        subtitle={`PT Nusantara Agro Lestari — ${new Date().toLocaleDateString('id-ID', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' })}`}
        icon={ScanLine}
        rightContent={
          <>
            <div className="flex items-center gap-2 mr-4">
              <Clock size={13} className="text-[var(--text-muted)]" />
              <span className="font-mono text-lg font-bold text-[var(--text-primary)]">{timeStr}</span>
            </div>
            <div className="flex items-center gap-2 px-3 py-1.5 rounded-lg border shadow-sm" style={{ background: `${sysColor}15`, borderColor: `${sysColor}44` }}>
              <LiveDot color={sysColor} />
              <span className="font-mono text-[10px] font-bold tracking-widest uppercase" style={{ color: sysColor }}>SYSTEM {sysLabel}</span>
            </div>
            <Link href="/dashboard/drone-scanner" className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-[var(--primary)] text-white font-sans text-[11px] font-bold no-underline">
              <ScanLine size={12} /> Scanner
            </Link>
          </>
        }
      />

      {/* KPI Strip */}
      <KpiStrip />

      {/* ── TREASURY WIDGET ── */}
      <div className="px-6 py-4 border-b border-[var(--border)] bg-[var(--bg-base)]">
        <TokenTreasuryWidget />
      </div>

      <div className="flex-1 grid grid-cols-[1fr_340px] min-h-0">
        
        {/* LEFT: Map */}
        <div className="flex flex-col border-r border-[var(--border)] relative min-h-0">
           <DroneCommandMap />
        </div>

        {/* RIGHT: Monitoring Panels */}
        <div className="flex flex-col overflow-y-auto bg-[var(--bg-base)]">
          <section className="border-b border-[var(--border)]">
            <div className="px-4 py-2.5 flex items-center justify-between bg-[var(--bg-surface)] border-b border-[var(--border)]">
              <div className="flex items-center gap-2 font-bold text-xs text-[var(--text-primary)]"><Wind size={13} className="text-[var(--primary)]" /> Armada Drone</div>
            </div>
            <div className="p-3 flex flex-col gap-1.5">
              {DRONE_FLEET.map(drone => {
                const st = DRONE_STATUS[drone.status]
                return (
                  <div key={drone.id} className="rounded-lg px-3 py-2.5 bg-[var(--bg-surface)] border border-[var(--border)]">
                    <div className="flex items-center justify-between mb-1">
                      <div className="flex items-center gap-2">
                        <span className="font-mono text-[11px] font-bold text-[var(--text-primary)]">{drone.id}</span>
                        <Badge bg={st.bg} color={st.color}>{st.label}</Badge>
                      </div>
                    </div>
                    <div className="font-sans text-[10px] text-[var(--text-muted)] mt-1">Blok {drone.block || '-'} • Alt: {drone.altitude || 0}m</div>
                  </div>
                )
              })}
            </div>
          </section>

          <section>
            <div className="px-4 py-2.5 flex items-center justify-between bg-[var(--bg-surface)] border-b border-[var(--border)]">
               <div className="flex items-center gap-2 font-bold text-xs text-[var(--text-primary)]"><AlertTriangle size={13} color="#f97316" /> Live Alert Feed</div>
            </div>
            <div className="divide-y divide-[var(--border-subtle)]">
              {ANOMALY_FEED.map(a => {
                const sv = SEVERITY_META[a.severity]
                return (
                  <div key={a.id} className="px-4 py-2.5 flex items-start gap-3 relative" style={{ backgroundColor: a.fresh ? `${sv.color}08` : 'transparent' }}>
                    <div className="shrink-0 mt-0.5 w-1.5 h-1.5 rounded-full" style={{ background: sv.color }} />
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-1.5 mb-0.5">
                        <span className="text-[11px] font-semibold text-[var(--text-primary)]">{a.type}</span>
                        <Badge bg={sv.bg} color={sv.color}>{sv.label}</Badge>
                      </div>
                      <div className="font-mono text-[9px] text-[var(--text-muted)]">
                        {a.block} · conf {a.conf}%
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