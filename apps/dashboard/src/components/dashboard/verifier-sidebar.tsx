'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import {
  ShieldCheck,
  BookOpen,
  Database,
  LineChart,
  Settings,
} from 'lucide-react'

const NAV = [
  { href: '/verifier',         icon: ShieldCheck, label: 'Antrean Kasus',  sub: 'Review & Verdict' },
  { href: '/verifier/history', icon: Database,    label: 'Riwayat Labeled', sub: 'Data Training AI' },
  { href: '/verifier/kb',      icon: BookOpen,    label: 'Knowledge Base', sub: 'Referensi Agronomi' },
  { href: '/verifier/config',  icon: Settings,    label: 'Pengaturan',     sub: 'Preferensi' },
]

export function VerifierSidebar() {
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
      <div className="flex items-center gap-3 px-5 py-5" style={{ borderBottom: '1px solid var(--border)' }}>
        <div className="relative flex items-center justify-center w-8 h-8 rounded shrink-0" style={{ background: 'var(--bg-elevated)', border: '1px solid var(--border)' }}>
          <ShieldCheck size={16} style={{ color: 'var(--primary)' }} />
        </div>
        <div>
          <div style={{ fontFamily: 'var(--font-sans)', fontSize: 15, fontWeight: 700, color: 'var(--text-primary)', lineHeight: 1, letterSpacing: '-0.02em' }}>
            Green<span style={{ color: 'var(--primary)' }}>Proof</span>
          </div>
          <div style={{ fontFamily: 'var(--font-sans)', fontSize: 10, color: 'var(--text-muted)', letterSpacing: '0.02em', marginTop: 3, fontWeight: 500 }}>
            Dashboard Verifier
          </div>
        </div>
      </div>

      {/* ── Role description ─────────────────────────────── */}
      <div className="mx-3 my-3 px-3 py-2.5 rounded-lg" style={{ background: 'var(--bg-elevated)', border: '1px dashed var(--border)' }}>
        <div style={{ fontFamily: 'var(--font-sans)', fontSize: 10, fontWeight: 600, color: 'var(--text-muted)', letterSpacing: '0.08em', textTransform: 'uppercase' }}>
          Role Aktif
        </div>
        <div style={{ fontFamily: 'var(--font-sans)', fontSize: 13, fontWeight: 700, color: 'var(--primary)', marginTop: 2 }}>
          Agronomis / Reviewer
        </div>
        <div style={{ fontFamily: 'var(--font-sans)', fontSize: 9, color: 'var(--text-muted)', marginTop: 4, lineHeight: 1.4 }}>
          Validasi data lapangan,<br/>berikan verdict, latih AI.
        </div>
      </div>

      {/* ── Nav ──────────────────────────────────────────── */}
      <nav className="flex-1 px-2 py-1 overflow-y-auto">
        {NAV.map(({ href, icon: Icon, label, sub }) => {
          const active = href === '/verifier' ? path === href : path.startsWith(href)
          return (
            <Link key={href} href={href} className="flex items-center gap-3 px-3 py-2.5 rounded-lg mb-0.5 group transition-all"
              style={{ background: active ? 'var(--bg-active)' : 'transparent', border: active ? '1px solid var(--border-strong)' : '1px solid transparent', textDecoration: 'none' }}>
              <Icon size={15} style={{ color: active ? 'var(--primary)' : 'var(--text-muted)', flexShrink: 0 }} />
              <div>
                <div style={{ fontFamily: 'var(--font-sans)', fontSize: 13, fontWeight: active ? 600 : 500, color: active ? 'var(--text-primary)' : 'var(--text-secondary)', letterSpacing: '-0.01em', lineHeight: 1 }}>
                  {label}
                </div>
                <div style={{ fontFamily: 'var(--font-sans)', fontSize: 10, color: 'var(--text-muted)', letterSpacing: '0.02em', marginTop: 2 }}>
                  {sub}
                </div>
              </div>
              {active && <div className="ml-auto w-1 h-6 rounded-full" style={{ background: 'var(--primary)' }} />}
            </Link>
          )
        })}
      </nav>

      {/* ── User profile ─────────────────────────────────── */}
      <div className="px-3 py-3" style={{ borderTop: '1px solid var(--border)' }}>
        <div className="flex items-center gap-3 px-2 py-2 rounded-lg" style={{ background: 'var(--bg-elevated)' }}>
          <div className="w-7 h-7 rounded-full flex items-center justify-center shrink-0" style={{ background: 'var(--primary-muted)', border: '1px solid var(--primary-border)' }}>
            <span style={{ fontFamily: 'var(--font-sans)', fontSize: 11, color: 'var(--primary)', fontWeight: 700 }}>SR</span>
          </div>
          <div className="min-w-0">
            <div style={{ fontFamily: 'var(--font-sans)', fontSize: 12, fontWeight: 600, color: 'var(--text-primary)', lineHeight: 1 }}>Siti Rahayu</div>
            <div style={{ fontFamily: 'var(--font-sans)', fontSize: 10, color: 'var(--accent)', letterSpacing: '0.04em', marginTop: 2, fontWeight: 600 }}>AGRONOMIS</div>
          </div>
        </div>
      </div>
    </aside>
  )
}
