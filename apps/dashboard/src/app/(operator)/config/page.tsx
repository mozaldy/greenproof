'use client'

import { useState } from 'react'
import { Settings, Zap, Shield, Cpu, Eye, Lock, Clock } from 'lucide-react'
import { PageHeader } from '@/components/ui/page-header'
import { Toggle } from '@/components/ui/toggle'

const REWARD_CONFIG = [
  { type: 'Kondisi Umum Area',    defaultReward: 40,  criticalReward: null },
  { type: 'Hitung Pohon',         defaultReward: 50,  criticalReward: null },
  { type: 'Kualitas Pelepah',     defaultReward: 60,  criticalReward: null },
  { type: 'Health Diagnosis',     defaultReward: 100, criticalReward: 150 },
  { type: 'Anomali Drainase',     defaultReward: 80,  criticalReward: 120 },
  { type: 'Anomali Semi-Kritikal', defaultReward: 120, criticalReward: 150 },
  { type: 'Deteksi Ganoderma/BSR', defaultReward: 150, criticalReward: 200 },
  { type: 'Estimasi Serangan Hama', defaultReward: 120, criticalReward: 200 },
]

const ACCESS_LOGS = [
  { date: '15 Mar 2025, 08:01', service: 'AI GreenProof Service', taskId: 'TK-2847', photos: 5, purpose: 'Training' },
  { date: '14 Mar 2025, 16:22', service: 'AI GreenProof Service', taskId: 'TK-2844', photos: 3, purpose: 'Inference' },
  { date: '13 Mar 2025, 09:15', service: 'AI GreenProof Service', taskId: 'TK-2839', photos: 4, purpose: 'Training' },
  { date: '12 Mar 2025, 14:30', service: 'AI GreenProof Service', taskId: 'TK-2835', photos: 2, purpose: 'Inference' },
  { date: '11 Mar 2025, 10:45', service: 'AI GreenProof Service', taskId: 'TK-2830', photos: 6, purpose: 'Training' },
]

export default function ConfigPage() {
  const [aiMode, setAiMode] = useState<'A' | 'B'>('B')
  const [permissions, setPermissions] = useState({ readPhotos: true, fineTuning: true })

  return (
    <div style={{ minHeight: '100vh', background: 'var(--bg-base)' }}>
      <PageHeader 
        title="Konfigurasi" 
        subtitle="Pengaturan reward, model AI, dan akses data" 
        icon={Settings} 
      />

      <div className="px-8 py-6 max-w-5xl flex flex-col gap-6">

        {/* ── Section 1: Reward Settings ────────────────────── */}
        <section className="rounded-lg overflow-hidden border border-[var(--border)] bg-[var(--bg-surface)]">
          <div className="px-5 py-3 flex items-center gap-2 border-b border-[var(--border)] bg-[var(--bg-elevated)]">
            <Zap size={14} className="text-[var(--accent)]" />
            <h2 className="font-sans text-sm font-bold text-[var(--text-primary)]">Pengaturan Reward per Tipe Task</h2>
          </div>
          <div>
            <div className="grid px-5 py-2 border-b border-[var(--border)]" style={{ gridTemplateColumns: '1fr 120px 120px 100px' }}>
              {['Tipe Task', 'Reward Default', 'Reward Kritikal'].map(h => (
                <div key={h} className="font-sans text-[10px] font-bold tracking-widest uppercase text-[var(--text-muted)]">
                  {h}
                </div>
              ))}
            </div>
            {REWARD_CONFIG.map((r, i) => (
              <div
                key={r.type}
                className="grid px-5 py-3 items-center"
                style={{
                  gridTemplateColumns: '1fr 120px 120px 100px',
                  borderBottom: i < REWARD_CONFIG.length - 1 ? '1px solid var(--border-subtle)' : 'none',
                }}
              >
                <span className="font-sans text-[13px] font-medium text-[var(--text-primary)]">{r.type}</span>
                <span className="flex items-center gap-1 font-mono text-[13px] font-bold text-[var(--accent)]">
                  <Zap size={10} />{r.defaultReward} poin
                </span>
                <span className="font-mono text-[13px] font-bold" style={{ color: r.criticalReward ? 'var(--danger)' : 'var(--text-muted)' }}>
                  {r.criticalReward ? (
                    <span className="flex items-center gap-1"><Zap size={10} />{r.criticalReward} poin</span>
                  ) : '—'}
                </span>
              </div>
            ))}
          </div>
        </section>
        
        {/* ── Section 2: AI Model Configuration ────────────── */}
        <section className="rounded-lg overflow-hidden border border-[var(--border)] bg-[var(--bg-surface)]">
          <div className="px-5 py-3 flex items-center gap-2 border-b border-[var(--border)] bg-[var(--bg-elevated)]">
            <Cpu size={14} className="text-[var(--primary)]" />
            <h2 className="font-sans text-sm font-bold text-[var(--text-primary)]">Konfigurasi Model AI</h2>
          </div>
          
          <div className="p-5 flex flex-col gap-5">
            <div>
              <div className="font-sans text-[10px] font-bold tracking-widest uppercase text-[var(--text-muted)] mb-2">Mode Aktif</div>
              <div className="flex gap-3">
                {[
                  { key: 'A' as const, label: 'Mode A — Model Sendiri', desc: 'Gunakan model AI milik perusahaan sendiri' },
                  { key: 'B' as const, label: 'Mode B — Model GreenProof', desc: 'Gunakan model AI bersama dari GreenProof' },
                ].map(m => (
                  <button
                    key={m.key}
                    onClick={() => setAiMode(m.key)}
                    className="flex-1 p-4 rounded-lg text-left"
                    style={{
                      background: aiMode === m.key ? 'var(--primary-muted)' : 'var(--bg-elevated)',
                      border: `1px solid ${aiMode === m.key ? 'var(--primary-border)' : 'var(--border)'}`,
                      cursor: 'pointer',
                    }}
                  >
                    <div className="flex items-center gap-2 mb-1">
                      <div className="w-3 h-3 rounded-full" style={{ border: `2px solid ${aiMode === m.key ? 'var(--primary)' : 'var(--text-muted)'}`, background: aiMode === m.key ? 'var(--primary)' : 'transparent' }} />
                      <span style={{ fontFamily: 'var(--font-sans)', fontSize: 13, fontWeight: 600, color: aiMode === m.key ? 'var(--primary)' : 'var(--text-secondary)' }}>
                        {m.label}
                      </span>
                    </div>
                    <p style={{ fontFamily: 'var(--font-sans)', fontSize: 11, color: 'var(--text-muted)', marginLeft: 20 }}>
                      {m.desc}
                    </p>
                  </button>
                ))}
              </div>
            </div>

            <div>
              <div className="font-sans text-[10px] font-bold tracking-widest uppercase text-[var(--text-muted)] mb-2">Izin yang Diberikan</div>
              <div className="flex flex-col border border-[var(--border)] rounded-lg bg-[var(--bg-base)] px-4">
                 <Toggle 
                   label="AI GreenProof dapat membaca foto validasi untuk training" 
                   desc="Digunakan untuk meningkatkan akurasi Computer Vision."
                   on={permissions.readPhotos} 
                   onChange={() => setPermissions(p => ({...p, readPhotos: !p.readPhotos}))} 
                 />
                 <Toggle 
                   label="Fine-tuning regional (Kalimantan Tengah)" 
                   desc="Menyesuaikan bobot model dengan topografi lokal."
                   on={permissions.fineTuning} 
                   onChange={() => setPermissions(p => ({...p, fineTuning: !p.fineTuning}))} 
                 />
              </div>
            </div>

            <div className="flex gap-2">
              <button className="flex items-center gap-2 px-4 py-2 rounded-lg bg-[var(--danger-muted)] border border-[rgba(224,92,92,0.3)] text-[var(--danger)] font-sans text-xs font-semibold cursor-pointer">
                <Lock size={12} /> Cabut Akses AI GreenProof
              </button>
            </div>
          </div>
        </section>

        {/* ── Section 3: Seal Access Logs ───────────────────── */}
        <section className="rounded-lg overflow-hidden border border-[var(--border)] bg-[var(--bg-surface)]">
          <div className="px-5 py-3 flex items-center justify-between border-b border-[var(--border)] bg-[var(--bg-elevated)]">
            <div className="flex items-center gap-2">
              <Shield size={14} className="text-[var(--info)]" />
              <h2 className="font-sans text-sm font-bold text-[var(--text-primary)]">Log Akses Data (Seal)</h2>
            </div>
            <button className="flex items-center gap-1.5 px-3 py-1.5 rounded bg-[var(--bg-surface)] border border-[var(--border)] font-sans text-[11px] text-[var(--text-secondary)] cursor-pointer">
              <Eye size={10} /> Lihat Semua Log
            </button>
          </div>
          <div>
            <div className="grid px-5 py-2 border-b border-[var(--border)]" style={{ gridTemplateColumns: '200px 180px 100px 60px 100px' }}>
              {['Waktu', 'Service', 'Task', 'Foto', 'Tujuan'].map(h => (
                <div key={h} className="font-sans text-[10px] font-bold tracking-widest uppercase text-[var(--text-muted)]">
                  {h}
                </div>
              ))}
            </div>
            {ACCESS_LOGS.map((log, i) => (
              <div
                key={i}
                className="grid px-5 py-3 items-center"
                style={{
                  gridTemplateColumns: '200px 180px 100px 60px 100px',
                  borderBottom: i < ACCESS_LOGS.length - 1 ? '1px solid var(--border-subtle)' : 'none',
                }}
              >
                <span className="flex items-center gap-1.5 font-mono text-[11px] text-[var(--text-muted)]">
                  <Clock size={10} />{log.date}
                </span>
                <span className="font-sans text-[11px] text-[var(--text-secondary)]">{log.service}</span>
                <span className="font-mono text-[11px] text-[var(--text-muted)]">{log.taskId}</span>
                <span className="font-mono text-[11px] text-[var(--text-primary)]">{log.photos}</span>
                <span
                  className="inline-flex items-center gap-1 px-2 py-0.5 rounded w-fit font-sans text-[10px] font-semibold"
                  style={{
                    color: log.purpose === 'Training' ? 'var(--primary)' : 'var(--info)',
                    background: log.purpose === 'Training' ? 'var(--primary-muted)' : 'var(--info-muted)',
                  }}
                >
                  {log.purpose}
                </span>
              </div>
            ))}
          </div>
        </section>

      </div>
    </div>
  )
}