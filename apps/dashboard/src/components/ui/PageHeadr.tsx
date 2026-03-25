
// === File: apps/dashboard/src/components/ui/PageHeader.tsx ===
import React from 'react'

interface PageHeaderProps {
  title: string
  subtitle: string
  icon?: React.ElementType
  rightContent?: React.ReactNode
}

export function PageHeader({ title, subtitle, icon: Icon, rightContent }: PageHeaderProps) {
  return (
    <header
      className="flex items-center justify-between px-8 py-4 sticky top-0 z-20 shadow-sm"
      style={{ background: 'var(--bg-surface)', borderBottom: '1px solid var(--border)' }}
    >
      <div>
        <div className="flex items-center gap-2 mb-1">
          {Icon && <Icon size={18} style={{ color: 'var(--primary)' }} />}
          <h1 style={{ fontFamily: 'var(--font-sans)', fontSize: 20, fontWeight: 700, color: 'var(--text-primary)', lineHeight: 1, letterSpacing: '-0.02em' }}>
            {title}
          </h1>
        </div>
        <p style={{ fontFamily: 'var(--font-sans)', fontSize: 12, color: 'var(--text-muted)', marginTop: 4 }}>
          {subtitle}
        </p>
      </div>
      {rightContent && <div className="flex items-center gap-3">{rightContent}</div>}
    </header>
  )
}
