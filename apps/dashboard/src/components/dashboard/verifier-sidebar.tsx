'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { ShieldCheck, BookOpen, Database, Settings } from 'lucide-react'

const NAV = [
  { href: '/verifier',         icon: ShieldCheck, label: 'Antrean Kasus',  sub: 'Review & Verdict' },
  { href: '/verifier/history', icon: Database,    label: 'Riwayat Labeled', sub: 'Data Training AI' },
  { href: '/verifier/kb',      icon: BookOpen,    label: 'Knowledge Base', sub: 'Referensi Agronomi' },
  { href: '/verifier/config',  icon: Settings,    label: 'Pengaturan',     sub: 'Preferensi' },
]

export function VerifierSidebar() {
  const path = usePathname()

  return (
    <aside className="flex flex-col h-screen sticky top-0 shrink-0" style={{ width: 'var(--sidebar-width)', background: 'var(--bg-surface)', borderRight: '1px solid var(--border)' }}>
      <div className="flex items-center gap-3 px-5 py-5" style={{ borderBottom: '1px solid var(--border)' }}>
        <div className="relative flex items-center justify-center w-8 h-8 rounded shrink-0 bg-[var(--bg-elevated)] border border-[var(--border)]">
          <ShieldCheck size={16} className="text-[var(--primary)]" />
        </div>
        <div>
          <div className="font-sans text-[15px] font-bold text-[var(--text-primary)] leading-none tracking-tight">Green<span className="text-[var(--primary)]">Proof</span></div>
          <div className="font-sans text-[10px] text-[var(--text-muted)] tracking-wide mt-1 font-medium">Dashboard Verifier</div>
        </div>
      </div>

      <nav className="flex-1 px-2 py-3 overflow-y-auto">
        {NAV.map(({ href, icon: Icon, label, sub }) => {
          const active = href === '/verifier' ? path === href : path.startsWith(href)
          return (
            <Link key={href} href={href} className="flex items-center gap-3 px-3 py-2.5 rounded-lg mb-0.5 group transition-all no-underline"
              style={{ background: active ? 'var(--bg-active)' : 'transparent', border: active ? '1px solid var(--border-strong)' : '1px solid transparent' }}>
              <Icon size={15} className="shrink-0" style={{ color: active ? 'var(--primary)' : 'var(--text-muted)' }} />
              <div>
                <div className="font-sans text-[13px] leading-none tracking-tight" style={{ fontWeight: active ? 600 : 500, color: active ? 'var(--text-primary)' : 'var(--text-secondary)' }}>{label}</div>
                <div className="font-sans text-[10px] tracking-wide mt-1" style={{ color: 'var(--text-muted)' }}>{sub}</div>
              </div>
              {active && <div className="ml-auto w-1 h-6 rounded-full bg-[var(--primary)]" />}
            </Link>
          )
        })}
      </nav>
    </aside>
  )
}