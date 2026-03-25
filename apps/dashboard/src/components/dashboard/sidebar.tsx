'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import {
  LayoutDashboard,
  ClipboardList,
  Cpu,
  Users,
  ShieldCheck,
  KeyRound,
  BarChart3,
  FileText,
} from 'lucide-react'

const NAV = [
  { href: '/dashboard',           icon: LayoutDashboard, label: 'Komando',    sub: 'Overview'       },
  { href: '/dashboard/tasks',     icon: ClipboardList,   label: 'Tasks',      sub: 'Manajemen Task' },
  { href: '/dashboard/drones',    icon: Cpu,             label: 'Manajemen Drone', sub: 'Armada & AI Model' },
  { href: '/dashboard/validators',icon: Users,           label: 'Validator',  sub: 'Mitra Lapangan' },
  { href: '/dashboard/audit',     icon: FileText,        label: 'Audit Log',  sub: 'Riwayat Sistem' },
  { href: '/dashboard/config',    icon: KeyRound,        label: 'Konfigurasi', sub: 'Pengaturan'    },
]

export function Sidebar() {
  const path = usePathname()

  return (
    <aside
      className="flex flex-col h-screen sticky top-0 shrink-0"
      style={{
        width: 'var(--sidebar-width)',
        background: 'var(--bg-surface)',
        borderRight: '1px solid var(--border)',
      }}
    >
      {/* ── Logo ─────────────────────────────────────────── */}
      <div
        className="flex items-center gap-3 px-5 py-5"
        style={{ borderBottom: '1px solid var(--border)' }}
      >
        <div
          className="relative flex items-center justify-center w-8 h-8 rounded shrink-0"
          style={{ background: 'var(--primary-muted)', border: '1px solid var(--primary-border)' }}
        >
          <LeafIcon />
        </div>
        <div>
          <div style={{ fontFamily: 'var(--font-sans)', fontSize: 15, fontWeight: 700, color: 'var(--text-primary)', lineHeight: 1, letterSpacing: '-0.02em' }}>
            Green<span style={{ color: 'var(--primary)' }}>Proof</span>
          </div>
          <div style={{ fontFamily: 'var(--font-sans)', fontSize: 10, color: 'var(--text-muted)', letterSpacing: '0.02em', marginTop: 3, fontWeight: 500 }}>
            Dashboard Operator
          </div>
        </div>
      </div>

      {/* ── Company badge ────────────────────────────────── */}
      <div
        className="mx-3 my-3 px-3 py-2.5 rounded-lg"
        style={{ background: 'var(--bg-elevated)', border: '1px solid var(--border)' }}
      >
        <div style={{ fontFamily: 'var(--font-sans)', fontSize: 10, fontWeight: 600, color: 'var(--text-muted)', letterSpacing: '0.08em', textTransform: 'uppercase' }}>
          Perusahaan
        </div>
        <div style={{ fontFamily: 'var(--font-sans)', fontSize: 13, fontWeight: 700, color: 'var(--text-primary)', marginTop: 2 }}>
          PT Nusantara Agro Lestari
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginTop: 4 }}>
          <span
            style={{
              fontFamily: 'var(--font-sans)',
              fontSize: 9,
              fontWeight: 700,
              letterSpacing: '0.08em',
              textTransform: 'uppercase',
              color: 'var(--accent)',
              background: 'var(--accent-muted)',
              border: '1px solid rgba(251,191,36,0.25)',
              borderRadius: 4,
              padding: '2px 6px',
            }}
          >
            GROWTH
          </span>
          <span style={{ fontFamily: 'var(--font-mono)', fontSize: 9, color: 'var(--text-muted)' }}>
            3 estate aktif
          </span>
        </div>
      </div>

      {/* ── Nav ──────────────────────────────────────────── */}
      <nav className="flex-1 px-2 py-1 overflow-y-auto">
        {NAV.map(({ href, icon: Icon, label, sub }) => {
          const active = href === '/dashboard' ? path === href : path.startsWith(href)
          return (
            <Link
              key={href}
              href={href}
              className="flex items-center gap-3 px-3 py-2.5 rounded-lg mb-0.5 group transition-all"
              style={{
                background: active ? 'var(--bg-active)' : 'transparent',
                border: active ? '1px solid var(--border-strong)' : '1px solid transparent',
                textDecoration: 'none',
              }}
            >
              <Icon
                size={15}
                style={{ color: active ? 'var(--primary)' : 'var(--text-muted)', flexShrink: 0 }}
              />
              <div>
                <div
                  style={{
                    fontFamily: 'var(--font-sans)',
                    fontSize: 13,
                    fontWeight: active ? 600 : 500,
                    color: active ? 'var(--text-primary)' : 'var(--text-secondary)',
                    letterSpacing: '-0.01em',
                    lineHeight: 1,
                  }}
                >
                  {label}
                </div>
                <div
                  style={{
                    fontFamily: 'var(--font-sans)',
                    fontSize: 10,
                    color: 'var(--text-muted)',
                    letterSpacing: '0.02em',
                    marginTop: 2,
                  }}
                >
                  {sub}
                </div>
              </div>
              {active && (
                <div
                  className="ml-auto w-1 h-6 rounded-full"
                  style={{ background: 'var(--primary)' }}
                />
              )}
            </Link>
          )
        })}
      </nav>

      {/* ── User profile ─────────────────────────────────── */}
      <div
        className="px-3 py-3"
        style={{ borderTop: '1px solid var(--border)' }}
      >
        <div className="flex items-center gap-3 px-2 py-2 rounded-lg" style={{ background: 'var(--bg-elevated)' }}>
          <div
            className="w-7 h-7 rounded-full flex items-center justify-center shrink-0"
            style={{ background: 'var(--primary-muted)', border: '1px solid var(--primary-border)' }}
          >
            <span style={{ fontFamily: 'var(--font-sans)', fontSize: 11, color: 'var(--primary)', fontWeight: 700 }}>
              AH
            </span>
          </div>
          <div className="min-w-0">
            <div style={{ fontFamily: 'var(--font-sans)', fontSize: 12, fontWeight: 600, color: 'var(--text-primary)', lineHeight: 1 }}>
              Ahmad Hakim
            </div>
            <div style={{ fontFamily: 'var(--font-sans)', fontSize: 10, color: 'var(--accent)', letterSpacing: '0.04em', marginTop: 2, fontWeight: 600 }}>
              OPERATOR
            </div>
          </div>
        </div>
      </div>
    </aside>
  )
}

function LeafIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
      <path
        d="M3 13 C3 13 4 7 8 5 C12 3 13 3 13 3 C13 3 13 4 11 8 C9 12 3 13 3 13Z"
        fill="var(--primary)"
        opacity="0.9"
      />
      <path d="M3 13 L8 8" stroke="var(--bg-surface)" strokeWidth="1" strokeLinecap="round" />
    </svg>
  )
}
