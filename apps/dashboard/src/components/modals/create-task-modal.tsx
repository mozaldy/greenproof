'use client'

import { useState } from 'react'
import { X, MapPin, Zap, Send, ClipboardList } from 'lucide-react'
import { Field } from '@/components/ui/field'

interface TaskPublishData {
  block: string
  coordinates: string
  taskType: string
  reward: number
  note?: string
}

interface CreateTaskModalProps {
  anomalyIndex?: number
  block?: string
  coordinates?: string
  anomalyType?: string
  confidence?: number
  onClose: () => void
  onPublish: (taskData: TaskPublishData) => void
}

const TASK_TYPES = ['Kondisi Umum', 'Hitung Pohon', 'Health Diagnosis', 'Anomali Drainase', 'Deteksi Ganoderma/BSR']

export function CreateTaskModal({ 
  anomalyIndex, 
  block: initialBlock = '', 
  coordinates: initialCoords = '', 
  anomalyType, 
  confidence, 
  onClose, 
  onPublish 
}: CreateTaskModalProps) {
  const [taskType, setTaskType] = useState(TASK_TYPES[0])
  const [reward, setReward] = useState(60)
  const [note, setNote] = useState('')
  
  const [block, setBlock] = useState(initialBlock)
  const [coordinates, setCoordinates] = useState(initialCoords)
  const [published, setPublished] = useState(false)

  const isManual = anomalyIndex === undefined

  const handleSubmit = () => {
    if(!block || !coordinates) return
    onPublish({ block, coordinates, taskType, reward, note })
    setPublished(true)
    setTimeout(onClose, 1500)
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm" onClick={onClose}>
      <div className="rounded-xl overflow-hidden w-[480px] max-w-[90vw] bg-[var(--bg-surface)] border border-[var(--border)] shadow-2xl" onClick={e => e.stopPropagation()}>
        
        <div className="px-5 py-4 flex items-center justify-between bg-[var(--bg-elevated)] border-b border-[var(--border)]">
          <div>
            <h2 className="font-sans text-base font-bold text-[var(--text-primary)] flex items-center gap-2">
              {!isManual ? (
                `Buat Task dari Anomali #${anomalyIndex}`
              ) : (
                <><ClipboardList size={16} className="text-[var(--primary)]"/> Buat Task Baru</>
              )}
            </h2>
            {!isManual ? (
              <div className="flex items-center gap-3 mt-1 text-[10px] text-[var(--text-muted)]">
                <span className="flex items-center gap-1 font-mono"><MapPin size={10} /> {block}</span>
                <span>{anomalyType} · {confidence ? (confidence * 100).toFixed(0) : 0}% AI</span>
              </div>
            ) : (
              <div className="mt-1 text-[10px] text-[var(--text-muted)]">
                Buat penugasan manual untuk mitra lapangan
              </div>
            )}
          </div>
          <button onClick={onClose} className="p-1.5 rounded-lg bg-[var(--bg-surface)] border border-[var(--border)] text-[var(--text-muted)] cursor-pointer hover:text-white transition-colors">
            <X size={16} />
          </button>
        </div>

        {published ? (
          <div className="p-8 text-center animate-in zoom-in duration-300">
            <div className="w-12 h-12 rounded-full flex items-center justify-center mx-auto mb-3 bg-[var(--primary-muted)]">
              <Send size={20} className="text-[var(--primary)]" />
            </div>
            <p className="text-base font-bold text-[var(--primary)]">Task Diterbitkan!</p>
          </div>
        ) : (
          <div className="p-5 flex flex-col gap-4">
            <div className="grid grid-cols-2 gap-3">
              <Field label="Blok" placeholder="Contoh: KB-A1" value={block} onChange={setBlock} mono />
              <Field label="Koordinat" placeholder="-2.123, 114.123" value={coordinates} onChange={setCoordinates} mono />
            </div>

            <div>
              <label className="text-[10px] font-bold text-[var(--text-muted)] uppercase tracking-widest mb-1.5 block">Tipe Task</label>
              <select value={taskType} onChange={e => setTaskType(e.target.value)} className="w-full px-3 py-2 rounded-lg bg-[var(--bg-elevated)] border border-[var(--border)] text-[12px] text-[var(--text-primary)] outline-none cursor-pointer">
                {TASK_TYPES.map(t => <option key={t} value={t}>{t}</option>)}
              </select>
            </div>

            <div>
              <label className="text-[10px] font-bold text-[var(--text-muted)] uppercase tracking-widest mb-1.5 block">Reward Poin</label>
              <div className="flex items-center gap-2">
                <input
                  type="number"
                  value={reward}
                  onChange={e => setReward(Number(e.target.value))}
                  className="w-full px-3 py-2 rounded-lg bg-[var(--bg-elevated)] border border-[var(--border)] font-mono text-[12px] text-[var(--accent)] outline-none"
                />
                <Zap size={14} className="text-[var(--accent)] shrink-0" />
              </div>
            </div>

            <div>
              <label className="text-[10px] font-bold text-[var(--text-muted)] uppercase tracking-widest mb-1.5 block">Catatan untuk Mitra</label>
              <textarea
                value={note}
                onChange={e => setNote(e.target.value)}
                rows={2}
                placeholder="Instruksi tambahan..."
                className="w-full px-3 py-2 rounded-lg resize-none bg-[var(--bg-elevated)] border border-[var(--border)] font-sans text-[12px] text-[var(--text-primary)] outline-none"
              />
            </div>

            <div className="flex justify-end gap-3 pt-4 border-t border-[var(--border)] mt-2">
              <button onClick={onClose} className="px-4 py-2 rounded-lg bg-[var(--bg-elevated)] border border-[var(--border)] text-[12px] font-semibold text-[var(--text-secondary)] cursor-pointer hover:bg-[var(--bg-hover)]">
                Batal
              </button>
              <button onClick={handleSubmit} disabled={!block || !coordinates} className="flex items-center gap-2 px-5 py-2 rounded-lg bg-[var(--primary)] text-white text-[12px] font-bold cursor-pointer border-none hover:bg-emerald-500 disabled:opacity-50">
                <Send size={12} /> Terbitkan Task
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}