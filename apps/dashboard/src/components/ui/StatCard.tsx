// === File: apps/dashboard/src/components/ui/StatCard.tsx ===
import React from 'react'

interface StatCardProps {
  label: string
  value: string | number
  sub?: string
  icon: React.ElementType
  color: string
}

export function StatCard({ label, value, sub, icon: Icon, color }: StatCardProps) {
  return (
    <div className="rounded-lg px-4 py-3 shadow-sm" style={{ background: 'var(--bg-surface)', border: '1px solid var(--border)' }}>
      <div className="flex items-center justify-between mb-2">
        <span style={{ fontFamily: 'var(--font-sans)', fontSize: 10, fontWeight: 600, color: 'var(--text-muted)', letterSpacing: '0.06em', textTransform: 'uppercase' }}>
          {label}
        </span>
        <Icon size={14} style={{ color }} />
      </div>
      <div style={{ fontFamily: 'var(--font-mono)', fontSize: 24, fontWeight: 700, color: color, lineHeight: 1 }}>
        {value}
      </div>
      {sub && (
        <div style={{ fontFamily: 'var(--font-sans)', fontSize: 10, color: 'var(--text-muted)', marginTop: 4 }}>
          {sub}
        </div>
      )}
    </div>
  )
}