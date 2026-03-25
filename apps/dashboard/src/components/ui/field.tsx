import React from 'react'

interface FieldProps {
  label: string
  placeholder: string
  value: string
  onChange: (v: string) => void
  mono?: boolean
  type?: string
}

export function Field({ label, placeholder, value, onChange, mono = false, type = "text" }: FieldProps) {
  return (
    <div>
      <label style={{ display: 'block', fontFamily: 'var(--font-sans)', fontSize: 10, fontWeight: 700, letterSpacing: '0.08em', textTransform: 'uppercase', color: 'var(--text-muted)', marginBottom: 6 }}>
        {label}
      </label>
      <input
        type={type}
        placeholder={placeholder}
        value={value}
        onChange={e => onChange(e.target.value)}
        className="w-full rounded-md outline-none transition-colors"
        style={{
          background: 'var(--bg-base)', border: '1px solid var(--border)', padding: '8px 12px',
          fontFamily: mono ? 'var(--font-mono)' : 'var(--font-sans)', fontSize: mono ? 12 : 13, color: 'var(--text-primary)',
        }}
        onFocus={e => (e.target.style.borderColor = 'var(--primary-border)')}
        onBlur={e => (e.target.style.borderColor = 'var(--border)')}
      />
    </div>
  )
}