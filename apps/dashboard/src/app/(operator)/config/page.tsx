'use client'

import { useState } from 'react'
import { Settings, Zap, Shield, Cpu, Eye, Lock, Clock, CheckCircle2 } from 'lucide-react'
import { PageHeader } from '@/components/ui/page-header'

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

  return (
    <div style={{ minHeight: '100vh', background: 'var(--bg-base)' }}>
      <PageHeader 
        title="Konfigurasi Sistem" 
        subtitle="Pengaturan reward mitra, preferensi model AI, dan transparansi akses data" 
        icon={Settings} 
      />

      <div className="px-8 py-6 max-w-5xl flex flex-col gap-8">

        {/* ── Section 1: Reward Settings ────────────────────── */}
        <section className="rounded-xl overflow-hidden border border-[var(--border)] bg-[var(--bg-surface)] shadow-sm">
          <div className="px-6 py-4 flex items-center gap-2 border-b border-[var(--border)] bg-[var(--bg-elevated)]">
            <Zap size={16} className="text-[var(--accent)]" />
            <h2 className="font-sans text-[15px] font-bold text-[var(--text-primary)]">Pengaturan Reward per Tipe Task</h2>
          </div>
          <div>
            <div className="grid px-6 py-3 border-b border-[var(--border)] bg-[var(--bg-base)]" style={{ gridTemplateColumns: '1fr 140px 140px 100px' }}>
              {['Tipe Task', 'Reward Default', 'Reward Kritikal'].map(h => (
                <div key={h} className="font-sans text-[10px] font-bold tracking-widest uppercase text-[var(--text-muted)]">
                  {h}
                </div>
              ))}
            </div>
            <div className="divide-y divide-[var(--border-subtle)]">
              {REWARD_CONFIG.map((r) => (
                <div
                  key={r.type}
                  className="grid px-6 py-3.5 items-center hover:bg-[var(--bg-hover)] transition-colors"
                  style={{ gridTemplateColumns: '1fr 140px 140px 100px' }}
                >
                  <span className="font-sans text-[13px] font-semibold text-[var(--text-primary)]">{r.type}</span>
                  <span className="flex items-center gap-1.5 font-mono text-[13px] font-bold text-[var(--accent)]">
                    <Zap size={12} />{r.defaultReward} poin
                  </span>
                  <span className="font-mono text-[13px] font-bold" style={{ color: r.criticalReward ? 'var(--danger)' : 'var(--text-muted)' }}>
                    {r.criticalReward ? (
                      <span className="flex items-center gap-1.5"><Zap size={12} />{r.criticalReward} poin</span>
                    ) : '—'}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </section>
        
        {/* ── Section 2: AI Model Configuration ────────────── */}
        <section className="rounded-xl overflow-hidden border border-[var(--border)] bg-[var(--bg-surface)] shadow-sm">
          <div className="px-6 py-4 flex items-center gap-2 border-b border-[var(--border)] bg-[var(--bg-elevated)]">
            <Cpu size={16} className="text-[var(--primary)]" />
            <h2 className="font-sans text-[15px] font-bold text-[var(--text-primary)]">Konfigurasi Model AI</h2>
          </div>
          
          <div className="p-6 flex flex-col gap-6">
            <div>
              <div className="font-sans text-[10px] font-bold tracking-widest uppercase text-[var(--text-muted)] mb-3">Model Aktif Saat Ini</div>
              <div className="flex flex-col sm:flex-row gap-4">
                {[
                  { key: 'A' as const, label: 'Mode A — Model Sendiri', desc: 'Gunakan model AI (Inference) murni milik perusahaan sendiri, independen dari jaringan pusat.' },
                  { key: 'B' as const, label: 'Mode B — Model GreenProof', desc: 'Gunakan model AI bersama dari GreenProof yang telah di-training dengan jutaan dataset komunal.' },
                ].map(m => {
                  const isActive = aiMode === m.key
                  return (
                    <button
                      key={m.key}
                      onClick={() => setAiMode(m.key)}
                      className="flex-1 p-5 rounded-xl text-left transition-all border cursor-pointer group"
                      style={{
                        background: isActive ? 'var(--primary-muted)' : 'var(--bg-elevated)',
                        borderColor: isActive ? 'var(--primary)' : 'var(--border)',
                      }}
                    >
                      <div className="flex items-center gap-3 mb-2">
                        <div className={`w-4 h-4 rounded-full border-2 flex items-center justify-center shrink-0 ${isActive ? 'border-[var(--primary)]' : 'border-[var(--text-muted)]'}`}>
                          {isActive && <div className="w-2 h-2 rounded-full bg-[var(--primary)]" />}
                        </div>
                        <span className={`font-sans text-[14px] font-bold ${isActive ? 'text-[var(--primary)]' : 'text-[var(--text-secondary)] group-hover:text-[var(--text-primary)]'}`}>
                          {m.label}
                        </span>
                      </div>
                      <p className="font-sans text-[12px] text-[var(--text-muted)] pl-7 leading-relaxed">
                        {m.desc}
                      </p>
                    </button>
                  )
                })}
              </div>
            </div>

            <div>
              <div className="font-sans text-[10px] font-bold tracking-widest uppercase text-[var(--text-muted)] mb-3">Status Izin Akses Data</div>
              
              {/* Diubah dari Toggle interaktif menjadi Info Card informatif */}
              <div className="flex flex-col gap-0 border border-[var(--border)] rounded-xl bg-[var(--bg-base)] overflow-hidden">
                 
                 {/* Item 1 */}
                 <div className="p-4 sm:p-5 flex items-start gap-4 border-b border-[var(--border-subtle)]">
                    <div className="mt-0.5">
                      <div className="flex items-center gap-1.5 px-2.5 py-1 rounded bg-emerald-500/10 border border-emerald-500/20 text-emerald-500">
                        <CheckCircle2 size={12} strokeWidth={3} />
                        <span className="text-[9px] font-bold tracking-widest uppercase">Diizinkan</span>
                      </div>
                    </div>
                    <div>
                      <div className="font-sans text-[13px] font-bold text-[var(--text-primary)] mb-1">
                        AI GreenProof dapat membaca foto validasi untuk *Continuous Training*
                      </div>
                      <div className="font-sans text-[12px] text-[var(--text-muted)] leading-relaxed">
                        Memberikan hak akses bagi jaringan komputasi GreenProof untuk memproses dataset foto anomali yang telah diverifikasi (Labeled Data). Digunakan murni untuk meningkatkan akurasi Computer Vision pada *batch update* berikutnya.
                      </div>
                    </div>
                 </div>

                 {/* Item 2 */}
                 <div className="p-4 sm:p-5 flex items-start gap-4">
                    <div className="mt-0.5">
                      <div className="flex items-center gap-1.5 px-2.5 py-1 rounded bg-emerald-500/10 border border-emerald-500/20 text-emerald-500">
                        <CheckCircle2 size={12} strokeWidth={3} />
                        <span className="text-[9px] font-bold tracking-widest uppercase">Diizinkan</span>
                      </div>
                    </div>
                    <div>
                      <div className="font-sans text-[13px] font-bold text-[var(--text-primary)] mb-1">
                        Fine-tuning regional aktif (Kalimantan Tengah)
                      </div>
                      <div className="font-sans text-[12px] text-[var(--text-muted)] leading-relaxed">
                        Sistem secara otomatis menyesuaikan bobot probabilitas model AI terhadap pola hama endemik dan topografi spesifik di area estate Anda.
                      </div>
                    </div>
                 </div>

              </div>
            </div>

            <div className="flex gap-2 pt-2">
              <button className="flex items-center gap-2 px-5 py-2.5 rounded-lg bg-[var(--danger-muted)] border border-[rgba(239,68,68,0.2)] hover:bg-[rgba(239,68,68,0.15)] transition-colors text-[var(--danger)] font-sans text-xs font-bold cursor-pointer shadow-sm">
                <Lock size={14} /> Cabut Akses AI GreenProof Secara Sepihak
              </button>
            </div>
          </div>
        </section>

        {/* ── Section 3: Seal Access Logs ───────────────────── */}
        <section className="rounded-xl overflow-hidden border border-[var(--border)] bg-[var(--bg-surface)] shadow-sm">
          <div className="px-6 py-4 flex items-center justify-between border-b border-[var(--border)] bg-[var(--bg-elevated)]">
            <div className="flex items-center gap-2">
              <Shield size={16} className="text-[var(--info)]" />
              <h2 className="font-sans text-[15px] font-bold text-[var(--text-primary)]">Log Akses Pihak Ketiga (Sistem Seal)</h2>
            </div>
            <button className="flex items-center gap-1.5 px-4 py-2 rounded-lg bg-[var(--bg-base)] hover:bg-[var(--bg-hover)] border border-[var(--border)] font-sans text-xs font-semibold text-[var(--text-secondary)] hover:text-[var(--text-primary)] transition-colors cursor-pointer">
              <Eye size={14} /> Lihat Semua Log
            </button>
          </div>
          
          <div className="overflow-x-auto">
            <div className="min-w-[800px]">
              <div className="grid px-6 py-3 border-b border-[var(--border)] bg-[var(--bg-base)]" style={{ gridTemplateColumns: '180px 200px 100px 80px 120px' }}>
                {['Waktu Akses', 'Aktor / Servis', 'Tugas Terkait', 'Data Dibaca', 'Tujuan'].map(h => (
                  <div key={h} className="font-sans text-[10px] font-bold tracking-widest uppercase text-[var(--text-muted)]">
                    {h}
                  </div>
                ))}
              </div>
              <div className="divide-y divide-[var(--border-subtle)]">
                {ACCESS_LOGS.map((log, i) => (
                  <div
                    key={i}
                    className="grid px-6 py-4 items-center hover:bg-[var(--bg-hover)] transition-colors"
                    style={{ gridTemplateColumns: '180px 200px 100px 80px 120px' }}
                  >
                    <span className="flex items-center gap-2 font-mono text-[12px] text-[var(--text-muted)]">
                      <Clock size={12} className="text-[var(--text-secondary)]" />{log.date}
                    </span>
                    <span className="font-sans text-[13px] font-semibold text-[var(--text-primary)]">{log.service}</span>
                    <span className="font-mono text-[12px] text-[var(--text-secondary)] bg-[var(--bg-elevated)] px-2 py-0.5 rounded border border-[var(--border)] w-fit">{log.taskId}</span>
                    <span className="font-mono text-[13px] font-bold text-[var(--text-primary)]">{log.photos} Foto</span>
                    <div>
                      <span
                        className="inline-flex items-center justify-center px-2.5 py-1 rounded font-sans text-[10px] font-bold tracking-wider uppercase border"
                        style={{
                          color: log.purpose === 'Training' ? 'var(--primary)' : 'var(--info)',
                          backgroundColor: log.purpose === 'Training' ? 'var(--primary-muted)' : 'var(--info-muted)',
                          borderColor: log.purpose === 'Training' ? 'var(--primary-border)' : 'rgba(96,165,250,0.2)'
                        }}
                      >
                        {log.purpose}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>

      </div>
    </div>
  )
}