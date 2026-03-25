import { ElementType } from 'react'
import { FileEdit, Clock, Send, CheckCircle2, AlertTriangle, Leaf, Sprout, Bug, Droplets, TrendingUp, Waves } from 'lucide-react'
import { SubmissionTier, Priority } from '@/types'

export const SEVERITY_META: Record<string, { color: string; bg: string; label: string }> = {
  critical: { color: '#ef4444', bg: 'rgba(239,68,68,0.12)',  label: 'KRITIS' },
  high:     { color: '#f97316', bg: 'rgba(249,115,22,0.12)',  label: 'TINGGI' },
  medium:   { color: '#eab308', bg: 'rgba(234,179,8,0.12)',   label: 'SEDANG' },
  low:      { color: '#6b7280', bg: 'rgba(107,114,128,0.12)', label: 'RENDAH' },
}

export const DRONE_STATUS: Record<string, { color: string; bg: string; dot: string; label: string }> = {
  FLYING:   { color: '#10b981', bg: 'rgba(16,185,129,0.12)', dot: '#10b981', label: 'Terbang' },
  CHARGING: { color: '#eab308', bg: 'rgba(234,179,8,0.12)',  dot: '#eab308', label: 'Charging' },
  STANDBY:  { color: '#6366f1', bg: 'rgba(99,102,241,0.12)', dot: '#6366f1', label: 'Standby' },
  OFFLINE:  { color: '#6b7280', bg: 'rgba(107,114,128,0.1)', dot: '#6b7280', label: 'Offline' },
}

export const NODE_STATUS: Record<string, { color: string; label: string }> = {
  healthy:  { color: '#10b981', label: 'Operasional' },
  degraded: { color: '#eab308', label: 'Degraded' },
  offline:  { color: '#ef4444', label: 'Offline' },
}

export const TASK_STATUS_META: Record<string, { label: string; color: string; bg: string; icon: ElementType }> = {
  DRAFT:            { label: 'Draft',       color: 'var(--text-secondary)', bg: 'var(--bg-elevated)',   icon: FileEdit },
  PENDING_APPROVAL: { label: 'Menunggu',    color: 'var(--warning)',        bg: 'var(--warning-muted)', icon: Clock },
  PUBLISHED:        { label: 'Published',   color: 'var(--primary)',        bg: 'var(--primary-muted)', icon: Send },
  IN_PROGRESS:      { label: 'Berjalan',    color: 'var(--info)',           bg: 'var(--info-muted)',    icon: Clock },
  COMPLETED:        { label: 'Selesai',     color: 'var(--accent)',         bg: 'var(--accent-muted)',  icon: CheckCircle2 },
  FLAGGED:          { label: 'Flagged',     color: 'var(--danger)',         bg: 'var(--danger-muted)',  icon: AlertTriangle },
  EXPIRED:          { label: 'Expired',     color: 'var(--text-muted)',     bg: 'var(--bg-elevated)',   icon: Clock },
  CANCELLED:        { label: 'Dibatalkan',  color: 'var(--text-muted)',     bg: 'var(--bg-elevated)',   icon: Clock },
}

export const TASK_TYPE_META: Record<string, { label: string; color: string }> = {
  TREE_COUNT:       { label: 'Hitung Pohon',  color: 'var(--text-secondary)' },
  AREA_CONDITION:   { label: 'Kondisi Area',  color: 'var(--text-secondary)' },
  HEALTH_DIAGNOSIS: { label: 'Diagnosis',     color: 'var(--info)' },
  ANOMALY_SEMI:     { label: 'Anomali',       color: 'var(--warning)' },
  ANOMALY_CRITICAL: { label: 'Kritis',        color: 'var(--danger)' },
}

export const ANOMALY_META: Record<string, { label: string; icon: ElementType; color: string }> = {
  GANODERMA_SUSPECT:  { label: 'Ganoderma Suspect',  icon: Leaf,       color: 'var(--danger)' },
  NUTRIENT_DEFICIENCY:{ label: 'Def. Nutrisi',       icon: Sprout,     color: 'var(--warning)' },
  PEST_ATTACK:        { label: 'Serangan Hama',      icon: Bug,        color: 'var(--accent)' },
  WATER_STRESS:       { label: 'Water Stress',       icon: Droplets,   color: 'var(--info)' },
  ABNORMAL_GROWTH:    { label: 'Pertumbuhan Abnorm.', icon: TrendingUp, color: 'var(--warning)' },
  OTHER:              { label: 'Lainnya',            icon: Waves,      color: 'var(--text-muted)' },
}

export const TIER_META: Record<SubmissionTier, { label: string; color: string; bg: string; desc: string }> = {
  QUICK:  { label: 'Quick Observation',  color: '#6b7280', bg: 'rgba(107,114,128,0.12)', desc: 'Tipe A' },
  FIELD:  { label: 'Field Report',       color: '#6366f1', bg: 'rgba(99,102,241,0.12)',  desc: 'Tipe B' },
  EXPERT: { label: 'Expert Assessment',  color: '#10b981', bg: 'rgba(16,185,129,0.12)',  desc: 'Tipe C' },
}

export const PRIORITY_META: Record<Priority, { color: string; bg: string }> = {
  TINGGI: { color: '#ef4444', bg: 'rgba(239,68,68,0.12)' },
  SEDANG: { color: '#eab308', bg: 'rgba(234,179,8,0.12)' },
  RENDAH: { color: '#6b7280', bg: 'rgba(107,114,128,0.12)' },
}

export const LABEL_OPTIONS = [
  'Ganoderma boninense (BSR)', 'Defisiensi Magnesium', 'Defisiensi Boron',
  'Crown Disease', 'Nettle caterpillar infestation', 'Oryctes',
  'Waterlogging damage', 'Mechanical injury', 'Normal / Sehat', 'Lainnya'
]

export const TASK_LEVEL_MAP: Record<string, number> = {
  TREE_COUNT: 1, AREA_CONDITION: 1, HEALTH_DIAGNOSIS: 2, ANOMALY_SEMI: 2, ANOMALY_CRITICAL: 3,
}