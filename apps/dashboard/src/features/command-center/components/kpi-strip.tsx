import { Wind, Layers, ScanLine, AlertTriangle, CheckCircle2, Zap } from 'lucide-react'
import { StatCard } from '@/components/ui/stat-card'
import { DASHBOARD_STATS, ANOMALY_FEED } from '@/lib/mock-data'

export function KpiStrip() {
  const criticalAlerts = ANOMALY_FEED.filter(a => a.severity === 'critical').length

  return (
    <div className="px-6 py-3 grid grid-cols-6 gap-3 border-b border-[var(--border)] bg-[var(--bg-base)]">
      <StatCard label="Drone Aktif" value={`${DASHBOARD_STATS.ACTIVE_DRONES}/6`} sub="dari 6 armada" color="#10b981" icon={Wind} />
      <StatCard label="Coverage Hari Ini" value={`${DASHBOARD_STATS.TOTAL_COVERAGE_HA.toLocaleString()} ha`} sub="dari 12.400 ha total" color="#6366f1" icon={Layers} />
      <StatCard label="Anomali Terdeteksi" value={DASHBOARD_STATS.TOTAL_ANOMALIES} sub="sejak 00:00 WIB" color="#f97316" icon={ScanLine} />
      <StatCard label="Alert Kritis" value={criticalAlerts} sub="butuh tindak segera" color="#ef4444" icon={AlertTriangle} />
      <StatCard label="Terverifikasi" value={DASHBOARD_STATS.VERIFIED_TODAY} sub="task selesai hari ini" color="var(--primary)" icon={CheckCircle2} />
      <StatCard label="Poin Didistribusikan" value={DASHBOARD_STATS.POIN_TODAY.toLocaleString()} sub="ke mitra lapangan" color="#eab308" icon={Zap} />
    </div>
  )
}