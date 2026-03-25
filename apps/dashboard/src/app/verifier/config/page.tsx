'use client'

import { Settings, Save, Bell, Shield, User } from 'lucide-react'

export default function ConfigPage() {
  return (
    <div className="flex flex-col h-screen" style={{ background: 'var(--bg-base)' }}>
      <header className="px-8 py-5 shrink-0" style={{ background: 'var(--bg-surface)', borderBottom: '1px solid var(--border)' }}>
        <h1 className="flex items-center gap-2" style={{ fontFamily: 'var(--font-sans)', fontSize: 20, fontWeight: 700, color: 'var(--text-primary)', letterSpacing: '-0.02em' }}>
          <Settings size={20} style={{ color: 'var(--primary)' }} />
          Pengaturan Verifier
        </h1>
        <p style={{ fontFamily: 'var(--font-sans)', fontSize: 13, color: 'var(--text-muted)', marginTop: 4 }}>
          Preferensi tata letak Workspace AI Studio dan notifikasi eskalasi.
        </p>
      </header>

      <div className="p-8 flex-1 overflow-y-auto max-w-3xl">
        <div className="flex flex-col gap-6">
          <Section title="Profil Reviewer" icon={User}>
            <div className="flex items-center gap-4 mb-4">
              <div className="w-16 h-16 rounded-full flex items-center justify-center shrink-0" style={{ background: 'var(--primary-muted)', border: '2px solid var(--primary)' }}>
                <span style={{ fontFamily: 'var(--font-sans)', fontSize: 20, color: 'var(--primary)', fontWeight: 700 }}>SR</span>
              </div>
              <div>
                <div style={{ fontFamily: 'var(--font-sans)', fontSize: 16, fontWeight: 700, color: 'var(--text-primary)' }}>Siti Rahayu</div>
                <div style={{ fontFamily: 'var(--font-sans)', fontSize: 13, color: 'var(--text-secondary)' }}>Senior Agronomist (NIP: 892110)</div>
              </div>
            </div>
          </Section>

          <Section title="Preferensi AI Studio" icon={Settings}>
            <Toggle label="Auto-select task berikutnya" desc="Beralih secara otomatis ke task pending selanjutnya setelah submit Ground Truth Label." />
            <Toggle label="Tampilkan foto resolusi penuh (High-Res)" desc="Menggunakan lebih banyak bandwidth tapi mempermudah deteksi visual anomali." on={true} />
            <Toggle label="Notifikasi Desktop" desc="Beritahu saya jika ada antrean task berstatus TINGGI (Critical)." on={true} />
          </Section>

          <Section title="Sistem Labeled Data" icon={Shield}>
            <Toggle label="Otomatis commit ke Model Repo" desc="Data yang dilabeli langsung di-push ke repository model AI untuk retraining sprint malam hari." on={true} />
            <Toggle label="Tampilkan batas toleransi skor Mitra" desc="Di borang evaluasi, tampilkan bayangan abu-abu penanda batas nilai wajar rata-rata." />
          </Section>

          <div className="mt-4">
            <button className="flex items-center gap-2 px-6 py-2.5 rounded-lg" style={{ background: 'var(--primary)', border: 'none', color: 'var(--text-inverse)', fontFamily: 'var(--font-sans)', fontSize: 13, fontWeight: 700, cursor: 'pointer' }}>
              <Save size={14} /> Simpan Pengaturan
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}

function Section({ title, icon: Icon, children }: any) {
  return (
    <div className="rounded-xl p-6" style={{ background: 'var(--bg-surface)', border: '1px solid var(--border)' }}>
      <h3 style={{ fontFamily: 'var(--font-sans)', fontSize: 14, fontWeight: 700, color: 'var(--text-primary)', marginBottom: 20, display: 'flex', alignItems: 'center', gap: 6, borderBottom: '1px solid var(--border)', paddingBottom: 12 }}>
        <Icon size={16} style={{ color: 'var(--text-muted)' }} /> {title}
      </h3>
      <div>{children}</div>
    </div>
  )
}

function Toggle({ label, desc, on = false }: any) {
  return (
    <div className="flex items-start justify-between py-3 border-b border-[var(--border-subtle)] last:border-0 last:pb-0">
      <div className="pr-8">
        <div style={{ fontFamily: 'var(--font-sans)', fontSize: 13, fontWeight: 600, color: 'var(--text-primary)' }}>{label}</div>
        <div style={{ fontFamily: 'var(--font-sans)', fontSize: 11, color: 'var(--text-muted)', marginTop: 2, lineHeight: 1.4 }}>{desc}</div>
      </div>
      <div className="w-10 h-5 rounded-full relative shrink-0" style={{ background: on ? 'var(--primary)' : 'var(--bg-elevated)', border: `1px solid ${on ? 'var(--primary)' : 'var(--border)'}`, transition: '0.2s' }}>
        <div className="absolute top-0.5 bottom-0.5 w-4 rounded-full bg-white shadow-sm" style={{ left: on ? 'calc(100% - 18px)' : '2px', transition: '0.2s' }} />
      </div>
    </div>
  )
}
