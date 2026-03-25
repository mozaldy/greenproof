'use client'

import { useState } from 'react'
import { X, AlertTriangle, UserPlus, Search, Zap, Award, CheckCircle2, Users } from 'lucide-react'
import { MitraDetailModal } from '@/components/dashboard/mitra-detail-modal'
import { VALIDATORS } from '@/lib/mock-data'

function TypeBadge({ type }: { type: string }) {
  if (type === 'Internal') {
    return (
      <span className="font-sans text-[10px] font-bold tracking-[0.06em] text-[var(--primary)] bg-[var(--primary-muted)] border border-[var(--primary-border)] rounded px-2.5 py-1 whitespace-nowrap">
        INTERNAL (KARYAWAN)
      </span>
    )
  }
  return (
    <span className="font-sans text-[10px] font-bold tracking-[0.06em] text-[var(--text-secondary)] bg-[var(--bg-elevated)] border border-[var(--border)] rounded px-2.5 py-1 whitespace-nowrap">
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

  const active = VALIDATORS.filter(v => v.status === 'active').length
  const internalCount = VALIDATORS.filter(v => v.type === 'Internal').length
  const totalTok = VALIDATORS.reduce((s, v) => s + v.tokenBalance, 0)

  // Layout grid disesuaikan (Kolom Aksi dihapus, ruang ekstra dibagi ke kolom lain)
  const tableGridCols = '70px minmax(200px, 1fr) 120px 160px 90px 80px 120px'

  return (
    <div className="flex flex-col min-h-screen bg-[var(--bg-base)]">
      <header className="flex items-center justify-between px-8 py-5 sticky top-0 z-10 bg-[var(--bg-surface)] border-b border-[var(--border)] shadow-sm">
        <div>
          <h1 className="font-sans text-xl font-bold text-[var(--text-primary)] tracking-tight">Mitra Lapangan</h1>
          <p className="font-sans text-xs text-[var(--text-muted)] mt-1 font-medium">{active} aktif dari {VALIDATORS.length} terdaftar</p>
        </div>
        <button onClick={() => setShowAdd(true)} className="flex items-center gap-2 px-5 py-2.5 rounded-lg bg-[var(--primary)] text-white font-sans text-xs font-bold uppercase tracking-wider cursor-pointer hover:bg-emerald-500 transition-colors shadow-sm">
          <UserPlus size={16} /> Daftarkan Mitra
        </button>
      </header>

      <div className="p-8 flex flex-col gap-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {[
            { icon: Users, label: 'Validator Aktif', value: active, color: 'var(--primary)', bg: 'var(--primary-muted)', border: 'var(--primary-border)' },
            { icon: Award, label: 'Pegawai Internal', value: internalCount, color: 'var(--info)', bg: 'var(--info-muted)', border: 'rgba(96,165,250,0.2)' },
            { icon: Zap, label: 'Total Poin Beredar', value: totalTok.toLocaleString(), color: 'var(--warning)', bg: 'var(--warning-muted)', border: 'rgba(251,191,36,0.2)' },
          ].map((s) => (
            <div key={s.label} className="flex items-center gap-4 px-5 py-4 rounded-xl border shadow-sm bg-[var(--bg-surface)] hover:border-[var(--border-strong)] transition-colors" style={{ borderColor: 'var(--border)' }}>
              <div className="w-12 h-12 rounded-lg flex items-center justify-center shrink-0" style={{ backgroundColor: s.bg, border: `1px solid ${s.border}` }}>
                <s.icon size={20} style={{ color: s.color }} />
              </div>
              <div>
                <div className="font-mono text-2xl font-bold leading-none mb-1" style={{ color: s.color }}>{s.value}</div>
                <div className="font-sans text-[11px] font-bold uppercase tracking-wider text-[var(--text-muted)]">{s.label}</div>
              </div>
            </div>
          ))}
        </div>

        <div className="flex items-center gap-2 px-4 py-2.5 rounded-xl max-w-sm bg-[var(--bg-surface)] border border-[var(--border)] shadow-sm focus-within:border-[var(--primary)] transition-colors">
          <Search size={16} className="text-[var(--text-muted)] shrink-0" />
          <input type="text" placeholder="Cari ID atau nama validator..." value={search} onChange={e => setSearch(e.target.value)} className="bg-transparent border-none outline-none font-sans text-[13px] text-[var(--text-primary)] w-full placeholder:text-[var(--text-muted)]" />
        </div>

        <div className="rounded-xl border border-[var(--border)] bg-[var(--bg-surface)] shadow-sm overflow-hidden flex flex-col">
          <div className="overflow-x-auto">
            <div className="min-w-[950px]">
              <div className="grid gap-4 px-6 py-4 border-b border-[var(--border)] bg-[var(--bg-elevated)]" style={{ gridTemplateColumns: tableGridCols }}>
                {/* Header Kolom "Aksi" Dihapus */}
                {['ID', 'Profil Mitra', 'Alamat Wallet', 'Tipe', 'Status', 'Task', 'Poin'].map(h => (
                  <div key={h} className="font-sans text-[10px] font-bold tracking-widest uppercase text-[var(--text-muted)]">{h}</div>
                ))}
              </div>

              <div className="divide-y divide-[var(--border-subtle)]">
                {filtered.map((v) => {
                  const isActive = v.status === 'active'
                  return (
                    <div 
                      key={v.id} 
                      onClick={() => setSelectedMitra(v.id)} 
                      className="grid gap-4 px-6 py-4 items-center hover:bg-[var(--bg-hover)] transition-colors cursor-pointer" 
                      style={{ gridTemplateColumns: tableGridCols, opacity: isActive ? 1 : 0.6 }}
                    >
                      <span className="font-mono text-xs text-[var(--text-muted)]">{v.id}</span>
                      
                      <div className="flex items-center gap-3 min-w-0 pr-4">
                        <img src={v.avatar} alt={v.name} className="w-10 h-10 rounded-full border border-[var(--border)] object-cover shrink-0" />
                        <div className="min-w-0">
                          <div className="font-sans text-[14px] font-bold text-[var(--text-primary)] truncate">{v.name}</div>
                          <div className="font-sans text-[11px] text-[var(--text-muted)] mt-0.5 truncate">{v.estate}</div>
                        </div>
                      </div>
                      
                      <div>
                        <span className="font-mono text-[11px] text-blue-400 bg-blue-500/10 px-2 py-1 rounded border border-blue-500/20">{v.walletAddress}</span>
                      </div>

                      <div><TypeBadge type={v.type} /></div>
                      
                      <div>
                        <span className={`font-sans text-[10px] font-bold tracking-wider uppercase px-2.5 py-1 rounded border ${isActive ? 'text-[var(--primary)] bg-[var(--primary-muted)] border-[var(--primary-border)]' : 'text-[var(--text-muted)] bg-[var(--bg-elevated)] border-[var(--border)]'}`}>
                          {isActive ? 'Aktif' : 'Nonaktif'}
                        </span>
                      </div>
                      
                      <span className="font-mono text-[14px] font-bold text-[var(--text-primary)] pl-1">{v.totalTasks}</span>
                      
                      <div className="flex items-center gap-1.5 font-mono text-[13px] font-bold text-[var(--accent)]">
                        <Zap size={14} />{v.tokenBalance.toLocaleString()}
                      </div>
                    </div>
                  )
                })}
                {filtered.length === 0 && <div className="p-8 text-center text-sm text-[var(--text-muted)]">Tidak ada validator yang ditemukan.</div>}
              </div>
            </div>
          </div>
        </div>
      </div>

      {selectedMitra && <MitraDetailModal mitraId={selectedMitra} onClose={() => setSelectedMitra(null)} />}

      {showAdd && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-200" onClick={() => setShowAdd(false)}>
          <div className="w-full max-w-md rounded-2xl bg-[var(--bg-surface)] border border-[var(--border)] shadow-2xl overflow-hidden flex flex-col max-h-[90vh]" onClick={e => e.stopPropagation()}>
            <div className="px-6 py-5 border-b border-[var(--border)] bg-[var(--bg-elevated)] flex justify-between items-center shrink-0">
              <div>
                <h2 className="font-sans text-lg font-bold text-[var(--text-primary)] flex items-center gap-2"><UserPlus size={18} className="text-[var(--primary)]" /> Registrasi Mitra Baru</h2>
                <p className="text-[11px] text-[var(--text-muted)] mt-1">Tambahkan alamat dompet (zkLogin) ke dalam Whitelist</p>
              </div>
              <button onClick={() => setShowAdd(false)} className="p-2 rounded-lg text-[var(--text-muted)] hover:bg-[var(--bg-hover)] hover:text-[var(--text-primary)] transition-colors"><X size={20} /></button>
            </div>

            <div className="p-6 flex flex-col gap-5 overflow-y-auto">
              <div>
                <label className="text-[10px] font-bold text-[var(--text-secondary)] uppercase tracking-widest mb-2 block">Alamat Wallet (Sui Address) <span className="text-[var(--danger)]">*</span></label>
                <input type="text" placeholder="0x..." className="w-full px-4 py-3 rounded-xl bg-[var(--bg-base)] border border-[var(--border)] font-mono text-[13px] text-[var(--text-primary)] outline-none focus:border-[var(--primary)] transition-colors placeholder:text-[var(--text-muted)]" />
                <p className="text-[10px] text-[var(--warning)] mt-2 flex items-center gap-1.5 p-2 rounded bg-[var(--warning-muted)] border border-amber-500/20 font-medium">
                  <AlertTriangle size={12} className="shrink-0" /> Minta mitra untuk login di Aplikasi Mobile terlebih dahulu untuk mendapatkan alamat ini.
                </p>
              </div>

              <div>
                <label className="text-[10px] font-bold text-[var(--text-secondary)] uppercase tracking-widest mb-2 block">Nama Lengkap <span className="text-[var(--danger)]">*</span></label>
                <input type="text" placeholder="Sesuai KTP atau Nama Kontrak" className="w-full px-4 py-3 rounded-xl bg-[var(--bg-base)] border border-[var(--border)] font-sans text-[13px] text-[var(--text-primary)] outline-none focus:border-[var(--primary)] transition-colors placeholder:text-[var(--text-muted)]" />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-[10px] font-bold text-[var(--text-secondary)] uppercase tracking-widest mb-2 block">Tipe Mitra</label>
                  <select className="w-full px-4 py-3 rounded-xl bg-[var(--bg-base)] border border-[var(--border)] font-sans text-[13px] text-[var(--text-primary)] outline-none focus:border-[var(--primary)] cursor-pointer">
                    <option>Internal (Karyawan)</option>
                    <option>Eksternal (Kontrak)</option>
                  </select>
                </div>
                <div>
                  <label className="text-[10px] font-bold text-[var(--text-secondary)] uppercase tracking-widest mb-2 block">Lokasi Tugas Khusus</label>
                  <select className="w-full px-4 py-3 rounded-xl bg-[var(--bg-base)] border border-[var(--border)] font-sans text-[13px] text-[var(--text-primary)] outline-none focus:border-[var(--primary)] cursor-pointer">
                    <option>Kapuas Barat</option>
                    <option>Kapuas Timur</option>
                    <option>Mentaya</option>
                  </select>
                </div>
              </div>
            </div>

            <div className="px-6 py-4 border-t border-[var(--border)] bg-[var(--bg-surface)] flex justify-end gap-3 shrink-0">
              <button onClick={() => setShowAdd(false)} className="px-5 py-2.5 rounded-lg text-[13px] font-bold text-[var(--text-secondary)] hover:bg-[var(--bg-hover)] transition-colors border border-transparent hover:border-[var(--border)] cursor-pointer">Batal</button>
              <button onClick={() => { alert("Transaksi 'add_validator' berhasil dieksekusi ke Blockchain SUI!"); setShowAdd(false); }} className="px-6 py-2.5 rounded-lg bg-[var(--primary)] text-white text-[13px] font-bold flex items-center gap-2 hover:bg-emerald-500 transition-all shadow-md active:scale-95 cursor-pointer">Simpan & Whitelist</button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}