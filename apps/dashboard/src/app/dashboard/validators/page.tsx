'use client'

import { useState } from 'react'
import { UserPlus, Search, Zap, TrendingUp, Award, CheckCircle2, Users, Eye, Image as ImageIcon } from 'lucide-react'
import { MitraDetailModal } from '@/components/dashboard/mitra-detail-modal'

export const VALIDATORS = [
  { id: 'M-001', name: 'Pak Surya',       type: 'Internal', status: 'active', totalTasks: 347, tokenBalance: 42300, estate: 'Kapuas Barat',   avatar: 'https://images.unsplash.com/photo-1560250097-0b93528c311a?auto=format&fit=crop&q=80&w=150' },
  { id: 'M-002', name: 'Bu Dewi',         type: 'Internal', status: 'active', totalTasks: 128, tokenBalance: 14890, estate: 'KB & KT',        avatar: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&q=80&w=150' },
  { id: 'M-003', name: 'Agus Mulyono',    type: 'Eksternal',status: 'active', totalTasks: 95,  tokenBalance: 8200,  estate: 'Kapuas Timur',   avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?auto=format&fit=crop&q=80&w=150' },
  { id: 'M-004', name: 'Wahyu Santoso',   type: 'Eksternal',status: 'active', totalTasks: 23,  tokenBalance: 1150,  estate: 'Kapuas Barat',   avatar: 'https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?auto=format&fit=crop&q=80&w=150' },
  { id: 'M-005', name: 'Fitri Handayani', type: 'Eksternal',status: 'active', totalTasks: 11,  tokenBalance: 520,   estate: 'Mentaya',        avatar: 'https://images.unsplash.com/photo-1580489944761-15a19d654956?auto=format&fit=crop&q=80&w=150' },
]

export function TypeBadge({ type }: { type: string }) {
  if (type === 'Internal') {
    return (
      <span style={{ fontFamily: 'var(--font-sans)', fontSize: 10, fontWeight: 700, letterSpacing: '0.06em', color: 'var(--primary)', background: 'var(--primary-muted)', border: `1px solid var(--primary-border)`, borderRadius: 4, padding: '2px 7px', whiteSpace: 'nowrap' }}>
        INTERNAL (KARYAWAN)
      </span>
    )
  }
  return (
    <span style={{ fontFamily: 'var(--font-sans)', fontSize: 10, fontWeight: 700, letterSpacing: '0.06em', color: 'var(--text-secondary)', background: 'var(--bg-elevated)', border: `1px solid var(--border)`, borderRadius: 4, padding: '2px 7px', whiteSpace: 'nowrap' }}>
        EKSTERNAL (MITRA)
    </span>
  )
}

export default function ValidatorsPage() {
  const [search, setSearch] = useState('')
  const [selectedMitra, setSelectedMitra] = useState<string | null>(null)
  const [showAdd, setShowAdd] = useState(false)

  const filtered = VALIDATORS.filter(v =>
    !search || v.name.toLowerCase().includes(search.toLowerCase()) || v.id.toLowerCase().includes(search.toLowerCase())
  )

  const active   = VALIDATORS.filter(v => v.status === 'active').length
  const internalCount = VALIDATORS.filter(v => v.type === 'Internal').length
  const totalTok = VALIDATORS.reduce((s, v) => s + v.tokenBalance, 0)

  return (
    <div style={{ minHeight: '100vh', background: 'var(--bg-base)' }}>

      {/* Header */}
      <header
        className="flex items-center justify-between px-8 py-4 sticky top-0 z-10"
        style={{ background: 'var(--bg-surface)', borderBottom: '1px solid var(--border)' }}
      >
        <div>
          <h1 style={{ fontFamily: 'var(--font-sans)', fontSize: 20, fontWeight: 700, color: 'var(--text-primary)', lineHeight: 1, letterSpacing: '-0.02em' }}>
            Mitra Lapangan
          </h1>
          <p style={{ fontFamily: 'var(--font-sans)', fontSize: 11, color: 'var(--text-muted)', marginTop: 4 }}>
            {active} aktif dari {VALIDATORS.length} terdaftar
          </p>
        </div>
        <button
          onClick={() => setShowAdd(true)}
          style={{
            display: 'flex', alignItems: 'center', gap: 8, padding: '9px 18px',
            borderRadius: 6, background: 'var(--primary)', border: 'none',
            color: 'var(--text-inverse)', fontFamily: 'var(--font-sans)', fontSize: 12,
            fontWeight: 700, cursor: 'pointer', letterSpacing: '0.04em',
          }}
        >
          <UserPlus size={13} /> DAFTARKAN MITRA
        </button>
      </header>

      <div className="px-8 py-6">

        {/* Stats mini row */}
        <div className="grid grid-cols-3 gap-3 mb-6">
          {[
            { icon: Users,      label: 'Validator Aktif',      value: active,              color: 'var(--primary)' },
            { icon: Award,      label: 'Pegawai Internal',     value: internalCount,       color: 'var(--info)' },
            { icon: Zap,        label: 'Total Poin Beredar',   value: totalTok.toLocaleString(), color: 'var(--warning)' },
          ].map((s) => (
            <div
              key={s.label}
              className="flex items-center gap-3 px-4 py-3 rounded-lg border shadow-sm"
              style={{ background: 'var(--bg-surface)', borderColor: 'var(--border)' }}
            >
              <s.icon size={16} style={{ color: s.color, flexShrink: 0 }} />
              <div>
                <div style={{ fontFamily: 'var(--font-mono)', fontSize: 18, fontWeight: 700, color: s.color, lineHeight: 1 }}>
                  {s.value}
                </div>
                <div style={{ fontFamily: 'var(--font-sans)', fontSize: 10, color: 'var(--text-muted)', marginTop: 2 }}>
                  {s.label}
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Search */}
        <div
          className="flex items-center gap-2 px-3 py-2 rounded mb-4 max-w-sm"
          style={{ background: 'var(--bg-surface)', border: '1px solid var(--border)' }}
        >
          <Search size={13} style={{ color: 'var(--text-muted)', flexShrink: 0 }} />
          <input
            type="text"
            placeholder="Cari validator..."
            value={search}
            onChange={e => setSearch(e.target.value)}
            style={{
              background: 'transparent', border: 'none', outline: 'none',
              fontFamily: 'var(--font-sans)', fontSize: 13, color: 'var(--text-primary)', width: '100%',
            }}
          />
        </div>

        {/* Table */}
        <div className="rounded-lg overflow-hidden border shadow-sm" style={{ background: 'var(--bg-surface)', borderColor: 'var(--border)' }}>
          {/* Head */}
          <div
            className="grid px-5 py-3"
            style={{
              gridTemplateColumns: '80px 220px 140px 100px 100px 120px 100px',
              borderBottom: '1px solid var(--border)',
              background: 'var(--bg-elevated)',
            }}
          >
            {['ID', 'Profil', 'Tipe Mitra', 'Status', 'Total Task', 'Poin Internal', 'Aksi'].map(h => (
              <div key={h} style={{ fontFamily: 'var(--font-sans)', fontSize: 10, fontWeight: 700, letterSpacing: '0.08em', textTransform: 'uppercase', color: 'var(--text-muted)' }}>
                {h}
              </div>
            ))}
          </div>

          {filtered.map((v, i) => {
            const isActive = v.status === 'active'
            return (
              <div
                key={v.id}
                className="grid px-5 py-3 items-center hover:bg-[var(--bg-hover)] transition-colors"
                style={{
                  gridTemplateColumns: '80px 220px 140px 100px 100px 120px 100px',
                  borderBottom: i < filtered.length - 1 ? '1px solid var(--border-subtle)' : 'none',
                  opacity: isActive ? 1 : 0.5,
                }}
              >
                <span style={{ fontFamily: 'var(--font-mono)', fontSize: 11, color: 'var(--text-muted)' }}>{v.id}</span>
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-full overflow-hidden shrink-0 border border-[var(--border)]">
                    <img src={v.avatar} alt="Avatar" className="w-full h-full object-cover" />
                  </div>
                  <div>
                    <div style={{ fontFamily: 'var(--font-sans)', fontSize: 13, fontWeight: 600, color: 'var(--text-primary)' }}>{v.name}</div>
                    <div style={{ fontFamily: 'var(--font-sans)', fontSize: 10, color: 'var(--text-muted)', marginTop: 1 }}>{v.estate}</div>
                  </div>
                </div>
                <div>
                  <TypeBadge type={v.type} />
                </div>
                <span
                  style={{
                    fontFamily: 'var(--font-sans)', fontSize: 10, fontWeight: 700, letterSpacing: '0.06em',
                    color: isActive ? 'var(--primary)' : 'var(--text-muted)',
                    background: isActive ? 'var(--primary-muted)' : 'var(--bg-elevated)',
                    border: `1px solid ${isActive ? 'var(--primary-border)' : 'var(--border)'}`,
                    borderRadius: 4, padding: '2px 7px', display: 'inline-block',
                  }}
                >
                  {isActive ? 'AKTIF' : 'NONAKTIF'}
                </span>
                <span style={{ fontFamily: 'var(--font-mono)', fontSize: 13, fontWeight: 700, color: 'var(--text-primary)' }}>
                  {v.totalTasks}
                </span>
                <div className="flex items-center gap-1" style={{ fontFamily: 'var(--font-mono)', fontSize: 13, fontWeight: 700, color: 'var(--accent)' }}>
                  <Zap size={11} />{v.tokenBalance.toLocaleString()}
                </div>
                <div className="flex items-center gap-1">
                  <button
                    onClick={() => setSelectedMitra(v.id)}
                    className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg border shadow-sm transition-colors hover:bg-[var(--bg-elevated)]"
                    style={{ background: 'var(--bg-base)', borderColor: 'var(--border)', fontFamily: 'var(--font-sans)', fontSize: 11, fontWeight: 600, color: 'var(--info)', cursor: 'pointer' }}
                  >
                    <Eye size={12} /> Profil
                  </button>
                </div>
              </div>
            )
          })}
        </div>
      </div>

      {/* Profile Modal */}
      {selectedMitra && (
        <MitraDetailModal mitraId={selectedMitra} onClose={() => setSelectedMitra(null)} />
      )}
    </div>
  )
}
