import React from 'react'

interface BadgeProps {
  children: React.ReactNode
  color: string
  bg: string
  border?: string
  size?: 'sm' | 'md'
  icon?: React.ElementType
}

export function Badge({ children, color, bg, border, size = 'sm', icon: Icon }: BadgeProps) {
  return (
    <span
      className={`inline-flex items-center gap-1.5 rounded font-bold tracking-widest uppercase w-fit ${
        size === 'sm' ? 'px-1.5 py-0.5 text-[9px]' : 'px-2.5 py-1 text-[10px]'
      }`}
      style={{
        background: bg,
        color: color,
        border: border ? `1px solid ${border}` : 'none',
      }}
    >
      {Icon && <Icon size={size === 'sm' ? 10 : 12} strokeWidth={3} />}
      {children}
    </span>
  )
}