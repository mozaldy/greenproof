'use client'

import { useState } from 'react'
import {
  X,
  MapPin,
  Zap,
  Send,
} from 'lucide-react'

// ─── Types ──────────────────────────────────────────────────────────────────

interface Props {
  anomalyIndex: number
  block: string
  coordinates: string
  anomalyType: string
  confidence: number
  onClose: () => void
  onPublish: (taskData: TaskFormData) => void
}

export interface TaskFormData {
  block: string
  coordinates: string
  taskType: string
  reward: number
  note?: string
}

const TASK_TYPES = [
  'Kondisi Umum',
  'Hitung Pohon',
  'Health Diagnosis',
  'Anomali Drainase',
  'Anomali Semi-Kritikal',
  'Deteksi Ganoderma/BSR',
  'Estimasi Serangan Hama',
]


// ─── Component ──────────────────────────────────────────────────────────────

export function CreateTaskModal({ anomalyIndex, block, coordinates, anomalyType, confidence, onClose, onPublish }: Props) {
  const [taskType, setTaskType] = useState(TASK_TYPES[0])
  const [reward,   setReward]   = useState(60)
  const [note,     setNote]     = useState('')
  const [published, setPublished] = useState(false)

  const handleSubmit = () => {
    if(!block || !coordinates) return
    onPublish({ block, coordinates, taskType, reward, note })
    setPublished(true)
    setTimeout(onClose, 1500)
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center" style={{ background: 'rgba(0,0,0,0.55)' }} onClick={onClose}>
      <div
        className="rounded-xl overflow-hidden"
        style={{ width: 480, maxWidth: '90vw', background: 'var(--bg-surface)', border: '1px solid var(--border)' }}
        onClick={e => e.stopPropagation()}
      >
        {/* Header */}
        <div className="px-5 py-4 flex items-center justify-between" style={{ borderBottom: '1px solid var(--border)', background: 'var(--bg-elevated)' }}>
          <div>
            <h2 style={{ fontFamily: 'var(--font-sans)', fontSize: 16, fontWeight: 700, color: 'var(--text-primary)', letterSpacing: '-0.02em' }}>
              Buat Task dari Anomali #{anomalyIndex}
            </h2>
            <div className="flex items-center gap-3 mt-1">
              <span className="flex items-center gap-1" style={{ fontFamily: 'var(--font-mono)', fontSize: 10, color: 'var(--text-muted)' }}>
                <MapPin size={9} /> {block}
              </span>
              <span style={{ fontFamily: 'var(--font-sans)', fontSize: 10, color: 'var(--text-muted)' }}>
                {anomalyType} · {(confidence * 100).toFixed(0)}% AI
              </span>
            </div>
          </div>
          <button onClick={onClose} className="p-1.5 rounded-lg" style={{ background: 'var(--bg-surface)', border: '1px solid var(--border)', cursor: 'pointer', color: 'var(--text-muted)' }}>
            <X size={16} />
          </button>
        </div>

        {published ? (
          <div className="p-8 text-center">
            <div className="w-12 h-12 rounded-full flex items-center justify-center mx-auto mb-3" style={{ background: 'var(--primary-muted)' }}>
              <Send size={20} style={{ color: 'var(--primary)' }} />
            </div>
            <p style={{ fontFamily: 'var(--font-sans)', fontSize: 16, fontWeight: 700, color: 'var(--primary)' }}>Task Diterbitkan!</p>
            <p style={{ fontFamily: 'var(--font-sans)', fontSize: 12, color: 'var(--text-muted)', marginTop: 4 }}>
              Task berhasil dipublish ke blok {block}
            </p>
          </div>
        ) : (
          <div className="p-5 flex flex-col gap-4">
            {/* Blok & Coordinates */}
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label style={{ fontFamily: 'var(--font-sans)', fontSize: 10, fontWeight: 700, letterSpacing: '0.08em', textTransform: 'uppercase' as const, color: 'var(--text-muted)', display: 'block', marginBottom: 4 }}>Blok</label>
                <div className="px-3 py-2 rounded-lg" style={{ background: 'var(--bg-elevated)', border: '1px solid var(--border)', fontFamily: 'var(--font-mono)', fontSize: 12, color: 'var(--text-primary)' }}>
                  {block}
                </div>
              </div>
              <div>
                <label style={{ fontFamily: 'var(--font-sans)', fontSize: 10, fontWeight: 700, letterSpacing: '0.08em', textTransform: 'uppercase' as const, color: 'var(--text-muted)', display: 'block', marginBottom: 4 }}>Koordinat</label>
                <div className="px-3 py-2 rounded-lg" style={{ background: 'var(--bg-elevated)', border: '1px solid var(--border)', fontFamily: 'var(--font-mono)', fontSize: 12, color: 'var(--text-muted)' }}>
                  {coordinates}
                </div>
              </div>
            </div>

            {/* Tipe Task */}
            <div>
              <label style={{ fontFamily: 'var(--font-sans)', fontSize: 10, fontWeight: 700, letterSpacing: '0.08em', textTransform: 'uppercase' as const, color: 'var(--text-muted)', display: 'block', marginBottom: 4 }}>Tipe Task</label>
              <select
                value={taskType}
                onChange={e => setTaskType(e.target.value)}
                className="w-full px-3 py-2 rounded-lg"
                style={{ background: 'var(--bg-elevated)', border: '1px solid var(--border)', fontFamily: 'var(--font-sans)', fontSize: 12, color: 'var(--text-primary)', outline: 'none' }}
              >
                {TASK_TYPES.map(t => <option key={t} value={t}>{t}</option>)}
              </select>
            </div>

            {/* Reward */}
            <div>
              <label style={{ fontFamily: 'var(--font-sans)', fontSize: 10, fontWeight: 700, letterSpacing: '0.08em', textTransform: 'uppercase' as const, color: 'var(--text-muted)', display: 'block', marginBottom: 4 }}>Reward Poin</label>
              <div className="flex items-center gap-2">
                <input
                  type="number"
                  value={reward}
                  onChange={e => setReward(Number(e.target.value))}
                  className="w-full px-3 py-2 rounded-lg"
                  style={{ background: 'var(--bg-elevated)', border: '1px solid var(--border)', fontFamily: 'var(--font-mono)', fontSize: 12, color: 'var(--accent)', outline: 'none' }}
                />
                <Zap size={14} style={{ color: 'var(--accent)', flexShrink: 0 }} />
              </div>
            </div>

            {/* Catatan */}
            <div>
              <label style={{ fontFamily: 'var(--font-sans)', fontSize: 10, fontWeight: 700, letterSpacing: '0.08em', textTransform: 'uppercase' as const, color: 'var(--text-muted)', display: 'block', marginBottom: 4 }}>Catatan untuk Mitra</label>
              <textarea
                value={note}
                onChange={e => setNote(e.target.value)}
                rows={3}
                placeholder="Instruksi tambahan untuk mitra lapangan..."
                className="w-full px-3 py-2 rounded-lg resize-none"
                style={{ background: 'var(--bg-elevated)', border: '1px solid var(--border)', fontFamily: 'var(--font-sans)', fontSize: 12, color: 'var(--text-primary)', outline: 'none' }}
              />
            </div>

            {/* Buttons */}
            <div className="flex justify-end gap-3 pt-2">
              <button
                onClick={onClose}
                className="px-4 py-2 rounded-lg"
                style={{ background: 'var(--bg-elevated)', border: '1px solid var(--border)', fontFamily: 'var(--font-sans)', fontSize: 12, fontWeight: 600, color: 'var(--text-secondary)', cursor: 'pointer' }}
              >
                Batal
              </button>
              <button
                onClick={handleSubmit}
                className="flex items-center gap-2 px-5 py-2 rounded-lg"
                style={{ background: 'var(--primary)', fontFamily: 'var(--font-sans)', fontSize: 12, fontWeight: 700, color: 'var(--text-inverse)', cursor: 'pointer', border: 'none' }}
              >
                <Send size={12} /> Terbitkan Task
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
