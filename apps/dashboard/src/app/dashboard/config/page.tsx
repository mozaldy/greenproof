'use client'

import { useState } from 'react'
import {
  Settings,
  Zap,
  Shield,
  Cpu,
  Eye,
  Lock,
  Unlock,
  Clock,
  AlertTriangle,
} from 'lucide-react'

// ─── Reward settings ────────────────────────────────────────────────────────

const REWARD_CONFIG = [
  { type: 'Kondisi Umum Area',    defaultReward: 40,  criticalReward: null },
  { type: 'Hitung Pohon',        defaultReward: 50,  criticalReward: null },
  { type: 'Kualitas Pelepah',    defaultReward: 60,  criticalReward: null },
  { type: 'Health Diagnosis',    defaultReward: 100, criticalReward: 150 },
  { type: 'Anomali Drainase',    defaultReward: 80,  criticalReward: 120 },
  { type: 'Anomali Semi-Kritikal', defaultReward: 120, criticalReward: 150 },
  { type: 'Deteksi Ganoderma/BSR', defaultReward: 150, criticalReward: 200 },
  { type: 'Estimasi Serangan Hama', defaultReward: 120, criticalReward: 200 },
]

// ─── Seal access logs ───────────────────────────────────────────────────────

const ACCESS_LOGS = [
  { date: '15 Mar 2025, 08:01', service: 'AI GreenProof Service', taskId: 'TK-2847', photos: 5, purpose: 'Training' },
  { date: '14 Mar 2025, 16:22', service: 'AI GreenProof Service', taskId: 'TK-2844', photos: 3, purpose: 'Inference' },
  { date: '13 Mar 2025, 09:15', service: 'AI GreenProof Service', taskId: 'TK-2839', photos: 4, purpose: 'Training' },
  { date: '12 Mar 2025, 14:30', service: 'AI GreenProof Service', taskId: 'TK-2835', photos: 2, purpose: 'Inference' },
  { date: '11 Mar 2025, 10:45', service: 'AI GreenProof Service', taskId: 'TK-2830', photos: 6, purpose: 'Training' },
]

// ─── Page ────────────────────────────────────────────────────────────────────

export default function ConfigPage() {
  const [aiMode, setAiMode] = useState<'A' | 'B'>('B')
  const [permissions, setPermissions] = useState({
    readPhotos: true,
    fineTuning: true,
  })

  return (
    <div style={{ minHeight: '100vh', background: 'var(--bg-base)' }}>

      {/* Header */}
      <header
        className="flex items-center justify-between px-8 py-5 sticky top-0 z-10"
        style={{ background: 'var(--bg-surface)', borderBottom: '1px solid var(--border)' }}
      >
        <div>
          <div className="flex items-center gap-2 mb-1">
            <Settings size={16} style={{ color: 'var(--text-muted)' }} />
            <h1 style={{ fontFamily: 'var(--font-sans)', fontSize: 20, fontWeight: 700, color: 'var(--text-primary)', lineHeight: 1, letterSpacing: '-0.02em' }}>
              Konfigurasi
            </h1>
          </div>
          <p style={{ fontFamily: 'var(--font-sans)', fontSize: 11, color: 'var(--text-muted)' }}>
            Pengaturan reward, model AI, dan akses data
          </p>
        </div>
      </header>

      <div className="px-8 py-6 max-w-5xl">

        {/* ── Section 1: Reward Settings ────────────────────── */}
        <div className="rounded-lg overflow-hidden mb-6" style={{ background: 'var(--bg-surface)', border: '1px solid var(--border)' }}>
          <div className="px-5 py-3 flex items-center gap-2" style={{ borderBottom: '1px solid var(--border)', background: 'var(--bg-elevated)' }}>
            <Zap size={14} style={{ color: 'var(--accent)' }} />
            <h2 style={{ fontFamily: 'var(--font-sans)', fontSize: 14, fontWeight: 700, color: 'var(--text-primary)' }}>
              Pengaturan Reward per Tipe Task
            </h2>
          </div>
          <div>
            {/* Table head */}
            <div
              className="grid px-5 py-2"
              style={{
                gridTemplateColumns: '1fr 120px 120px 100px',
                borderBottom: '1px solid var(--border)',
              }}
            >
              {['Tipe Task', 'Reward Default', 'Reward Kritikal'].map(h => (
                <div key={h} style={{ fontFamily: 'var(--font-sans)', fontSize: 10, fontWeight: 700, letterSpacing: '0.08em', textTransform: 'uppercase' as const, color: 'var(--text-muted)' }}>
                  {h}
                </div>
              ))}
            </div>
            {/* Table rows */}
            {REWARD_CONFIG.map((r, i) => (
              <div
                key={r.type}
                className="grid px-5 py-3 items-center"
                style={{
                  gridTemplateColumns: '1fr 120px 120px 100px',
                  borderBottom: i < REWARD_CONFIG.length - 1 ? '1px solid var(--border-subtle)' : 'none',
                }}
              >
                <span style={{ fontFamily: 'var(--font-sans)', fontSize: 13, fontWeight: 500, color: 'var(--text-primary)' }}>
                  {r.type}
                </span>
                <span className="flex items-center gap-1" style={{ fontFamily: 'var(--font-mono)', fontSize: 13, fontWeight: 700, color: 'var(--accent)' }}>
                  <Zap size={10} />{r.defaultReward} poin
                </span>
                <span style={{ fontFamily: 'var(--font-mono)', fontSize: 13, fontWeight: 700, color: r.criticalReward ? 'var(--danger)' : 'var(--text-muted)' }}>
                  {r.criticalReward ? (
                    <span className="flex items-center gap-1"><Zap size={10} />{r.criticalReward} poin</span>
                  ) : '—'}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* ── Section 2: AI Model Configuration ────────────── */}
        <div className="rounded-lg overflow-hidden mb-6" style={{ background: 'var(--bg-surface)', border: '1px solid var(--border)' }}>
          <div className="px-5 py-3 flex items-center gap-2" style={{ borderBottom: '1px solid var(--border)', background: 'var(--bg-elevated)' }}>
            <Cpu size={14} style={{ color: 'var(--primary)' }} />
            <h2 style={{ fontFamily: 'var(--font-sans)', fontSize: 14, fontWeight: 700, color: 'var(--text-primary)' }}>
              Konfigurasi Model AI
            </h2>
          </div>
          <div className="p-5">
            {/* Mode selection */}
            <div className="mb-5">
              <div style={{ fontFamily: 'var(--font-sans)', fontSize: 10, fontWeight: 700, letterSpacing: '0.08em', textTransform: 'uppercase' as const, color: 'var(--text-muted)', marginBottom: 8 }}>
                Mode Aktif
              </div>
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

            {/* Permissions */}
            <div className="mb-5">
              <div style={{ fontFamily: 'var(--font-sans)', fontSize: 10, fontWeight: 700, letterSpacing: '0.08em', textTransform: 'uppercase' as const, color: 'var(--text-muted)', marginBottom: 8 }}>
                Izin yang Diberikan
              </div>
              <div className="flex flex-col gap-2">
                {[
                  { key: 'readPhotos' as const, label: 'AI GreenProof dapat membaca foto validasi untuk training', icon: Eye },
                  { key: 'fineTuning' as const, label: 'Fine-tuning regional (Kalimantan Tengah)', icon: Cpu },
                ].map(p => (
                  <button
                    key={p.key}
                    onClick={() => setPermissions(prev => ({ ...prev, [p.key]: !prev[p.key] }))}
                    className="flex items-center gap-3 px-4 py-3 rounded-lg text-left"
                    style={{
                      background: 'var(--bg-elevated)',
                      border: `1px solid ${permissions[p.key] ? 'var(--primary-border)' : 'var(--border)'}`,
                      cursor: 'pointer',
                    }}
                  >
                    <div className="w-5 h-5 rounded flex items-center justify-center" style={{ background: permissions[p.key] ? 'var(--primary)' : 'var(--bg-surface)', border: `1px solid ${permissions[p.key] ? 'var(--primary)' : 'var(--border)'}` }}>
                      {permissions[p.key] && <span style={{ color: 'var(--text-inverse)', fontSize: 11 }}>✓</span>}
                    </div>
                    <p.icon size={13} style={{ color: permissions[p.key] ? 'var(--primary)' : 'var(--text-muted)' }} />
                    <span style={{ fontFamily: 'var(--font-sans)', fontSize: 12, color: permissions[p.key] ? 'var(--text-primary)' : 'var(--text-muted)' }}>
                      {p.label}
                    </span>
                  </button>
                ))}
              </div>
            </div>

            {/* Revoke button */}
            <div className="flex gap-2">
              <button
                className="flex items-center gap-2 px-4 py-2 rounded-lg"
                style={{
                  background: 'var(--danger-muted)',
                  border: '1px solid rgba(224,92,92,0.3)',
                  color: 'var(--danger)',
                  fontFamily: 'var(--font-sans)',
                  fontSize: 12,
                  fontWeight: 600,
                  cursor: 'pointer',
                }}
              >
                <Lock size={12} />
                Cabut Akses AI GreenProof
              </button>
            </div>
          </div>
        </div>

        {/* ── Section 3: Seal Access Logs ───────────────────── */}
        <div className="rounded-lg overflow-hidden" style={{ background: 'var(--bg-surface)', border: '1px solid var(--border)' }}>
          <div className="px-5 py-3 flex items-center justify-between" style={{ borderBottom: '1px solid var(--border)', background: 'var(--bg-elevated)' }}>
            <div className="flex items-center gap-2">
              <Shield size={14} style={{ color: 'var(--info)' }} />
              <h2 style={{ fontFamily: 'var(--font-sans)', fontSize: 14, fontWeight: 700, color: 'var(--text-primary)' }}>
                Log Akses Data (Seal)
              </h2>
            </div>
            <button
              className="flex items-center gap-1.5 px-3 py-1.5 rounded"
              style={{
                background: 'var(--bg-surface)',
                border: '1px solid var(--border)',
                fontFamily: 'var(--font-sans)',
                fontSize: 11,
                color: 'var(--text-secondary)',
                cursor: 'pointer',
              }}
            >
              <Eye size={10} />
              Lihat Semua Log
            </button>
          </div>
          <div>
            {/* Table head */}
            <div
              className="grid px-5 py-2"
              style={{
                gridTemplateColumns: '200px 180px 100px 60px 100px',
                borderBottom: '1px solid var(--border)',
              }}
            >
              {['Waktu', 'Service', 'Task', 'Foto', 'Tujuan'].map(h => (
                <div key={h} style={{ fontFamily: 'var(--font-sans)', fontSize: 10, fontWeight: 700, letterSpacing: '0.08em', textTransform: 'uppercase' as const, color: 'var(--text-muted)' }}>
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
                <span className="flex items-center gap-1.5" style={{ fontFamily: 'var(--font-mono)', fontSize: 11, color: 'var(--text-muted)' }}>
                  <Clock size={10} />{log.date}
                </span>
                <span style={{ fontFamily: 'var(--font-sans)', fontSize: 11, color: 'var(--text-secondary)' }}>
                  {log.service}
                </span>
                <span style={{ fontFamily: 'var(--font-mono)', fontSize: 11, color: 'var(--text-muted)' }}>
                  {log.taskId}
                </span>
                <span style={{ fontFamily: 'var(--font-mono)', fontSize: 11, color: 'var(--text-primary)' }}>
                  {log.photos}
                </span>
                <span
                  className="inline-flex items-center gap-1 px-2 py-0.5 rounded w-fit"
                  style={{
                    fontFamily: 'var(--font-sans)',
                    fontSize: 10,
                    fontWeight: 600,
                    color: log.purpose === 'Training' ? 'var(--primary)' : 'var(--info)',
                    background: log.purpose === 'Training' ? 'var(--primary-muted)' : 'var(--info-muted)',
                  }}
                >
                  {log.purpose}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}
