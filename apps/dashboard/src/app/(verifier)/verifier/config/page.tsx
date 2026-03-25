'use client'

import { useState } from 'react'
import { Settings, Save, Shield, User, MonitorPlay } from 'lucide-react'
import { PageHeader } from '@/components/ui/page-header'
import { Toggle } from '@/components/ui/toggle'

export default function VerifierConfigPage() {
  const [prefs, setPrefs] = useState({
    autoSelectTask: false,
    highResPhotos: true,
    desktopNotif: true,
    autoCommit: true,
    showTolerance: false
  })

  const handleToggle = (key: keyof typeof prefs) => {
    setPrefs(prev => ({ ...prev, [key]: !prev[key] }))
  }

  return (
    <div className="flex flex-col min-h-screen bg-[var(--bg-base)]">
      
      <PageHeader 
        title="Pengaturan Verifier" 
        subtitle="Preferensi tata letak Workspace AI Studio dan notifikasi eskalasi." 
        icon={Settings} 
      />

      <div className="p-8 flex-1 overflow-y-auto max-w-4xl flex flex-col gap-6">
        
        {/* ── Profil Reviewer ── */}
        <section className="rounded-lg overflow-hidden border border-[var(--border)] bg-[var(--bg-surface)] shadow-sm">
          <div className="px-5 py-3 flex items-center gap-2 border-b border-[var(--border)] bg-[var(--bg-elevated)]">
            <User size={14} className="text-[var(--primary)]" />
            <h2 className="font-sans text-sm font-bold text-[var(--text-primary)]">Profil Reviewer</h2>
          </div>
          <div className="p-5 flex items-center gap-4">
            <div className="w-16 h-16 rounded-full flex items-center justify-center shrink-0" style={{ background: 'var(--primary-muted)', border: '2px solid var(--primary)' }}>
              <span className="font-sans text-xl text-[var(--primary)] font-bold">SR</span>
            </div>
            <div>
              <div className="font-sans text-base font-bold text-[var(--text-primary)]">Siti Rahayu</div>
              <div className="font-sans text-[13px] text-[var(--text-secondary)] mt-0.5">Senior Agronomist (NIP: 892110)</div>
            </div>
          </div>
        </section>

        {/* ── Preferensi AI Studio ── */}
        <section className="rounded-lg overflow-hidden border border-[var(--border)] bg-[var(--bg-surface)] shadow-sm">
          <div className="px-5 py-3 flex items-center gap-2 border-b border-[var(--border)] bg-[var(--bg-elevated)]">
            <MonitorPlay size={14} className="text-[var(--primary)]" />
            <h2 className="font-sans text-sm font-bold text-[var(--text-primary)]">Preferensi AI Studio</h2>
          </div>
          <div className="p-5">
            <div className="flex flex-col border border-[var(--border)] rounded-lg bg-[var(--bg-base)] px-4">
              <Toggle 
                label="Auto-select task berikutnya" 
                desc="Beralih secara otomatis ke task pending selanjutnya setelah submit Ground Truth Label." 
                on={prefs.autoSelectTask}
                onChange={() => handleToggle('autoSelectTask')}
              />
              <Toggle 
                label="Tampilkan foto resolusi penuh (High-Res)" 
                desc="Menggunakan lebih banyak bandwidth tapi mempermudah deteksi visual anomali." 
                on={prefs.highResPhotos}
                onChange={() => handleToggle('highResPhotos')}
              />
              <Toggle 
                label="Notifikasi Desktop" 
                desc="Beritahu saya jika ada antrean task berstatus TINGGI (Critical)." 
                on={prefs.desktopNotif}
                onChange={() => handleToggle('desktopNotif')}
              />
            </div>
          </div>
        </section>

        {/* ── Sistem Labeled Data ── */}
        <section className="rounded-lg overflow-hidden border border-[var(--border)] bg-[var(--bg-surface)] shadow-sm">
          <div className="px-5 py-3 flex items-center gap-2 border-b border-[var(--border)] bg-[var(--bg-elevated)]">
            <Shield size={14} className="text-[var(--primary)]" />
            <h2 className="font-sans text-sm font-bold text-[var(--text-primary)]">Sistem Labeled Data</h2>
          </div>
          <div className="p-5">
            <div className="flex flex-col border border-[var(--border)] rounded-lg bg-[var(--bg-base)] px-4">
              <Toggle 
                label="Otomatis commit ke Model Repo" 
                desc="Data yang dilabeli langsung di-push ke repository model AI untuk retraining sprint malam hari." 
                on={prefs.autoCommit}
                onChange={() => handleToggle('autoCommit')}
              />
              <Toggle 
                label="Tampilkan batas toleransi skor Mitra" 
                desc="Di borang evaluasi, tampilkan bayangan abu-abu penanda batas nilai wajar rata-rata." 
                on={prefs.showTolerance}
                onChange={() => handleToggle('showTolerance')}
              />
            </div>
          </div>
        </section>

        {/* ── Action Button ── */}
        <div className="mt-2">
          <button className="flex items-center gap-2 px-6 py-2.5 rounded-lg bg-[var(--primary)] text-white font-sans text-[13px] font-bold cursor-pointer border-none transition-transform active:scale-95 shadow-md hover:bg-emerald-500">
            <Save size={14} /> Simpan Pengaturan
          </button>
        </div>

      </div>
    </div>
  )
}