import React from 'react'

interface ToggleProps {
  label: string
  desc: string
  on?: boolean
  onChange?: () => void
}

export function Toggle({ label, desc, on = false, onChange }: ToggleProps) {
  return (
    <div className="flex items-start justify-between py-3 border-b border-[var(--border-subtle)] last:border-0 last:pb-0">
      <div className="pr-8">
        <div style={{ fontFamily: 'var(--font-sans)', fontSize: 13, fontWeight: 600, color: 'var(--text-primary)' }}>{label}</div>
        <div style={{ fontFamily: 'var(--font-sans)', fontSize: 11, color: 'var(--text-muted)', marginTop: 2, lineHeight: 1.4 }}>{desc}</div>
      </div>
      <button 
        onClick={onChange}
        className="w-10 h-5 rounded-full relative shrink-0 cursor-pointer outline-none" 
        style={{ background: on ? 'var(--primary)' : 'var(--bg-elevated)', border: `1px solid ${on ? 'var(--primary)' : 'var(--border)'}`, transition: '0.2s' }}
      >
        <div className="absolute top-[1px] bottom-[1px] w-4 rounded-full bg-white shadow-sm" style={{ left: on ? 'calc(100% - 18px)' : '2px', transition: '0.2s' }} />
      </button>
    </div>
  )
}