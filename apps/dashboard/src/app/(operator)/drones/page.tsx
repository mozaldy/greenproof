'use client'

import { useState } from 'react'
import { Cpu, Plus, Signal, Battery, Box, Map, CheckCircle2, ChevronRight, PlaySquare } from 'lucide-react'

const DRONES = [
  { id: 'DRN-X101', name: 'Alpha Scout', type: 'DJI Matrice 300 RTK', status: 'ACTIVE', battery: 84, signal: 'Kuat', estate: 'Kapuas Barat', model: 'GP-Vision-v2.1', lastUpdate: 'Live' },
  { id: 'DRN-X102', name: 'Beta Observer', type: 'DJI Mavic 3 Multispectral', status: 'CHARGING', battery: 100, signal: '-', estate: 'Basecamp Utama', model: 'GP-Vision-v2.1', lastUpdate: '2 jam lalu' },
  { id: 'DRN-X104', name: 'Delta Mapper', type: 'DJI Matrice 350 RTK', status: 'ACTIVE', battery: 42, signal: 'Sedang', estate: 'Kapuas Timur', model: 'GP-Vision-v2.1', lastUpdate: 'Live' },
  { id: 'DRN-X105', name: 'Echo Patrol', type: 'Autel Evo Max 4T', status: 'MAINTENANCE', battery: 0, signal: '-', estate: 'Workshop', model: 'GP-NDVI-Beta', lastUpdate: '2 hari lalu' },
]

export default function DroneManagementPage() {
  const [showRegModal, setShowRegModal] = useState(false)

  const activeDrones = DRONES.filter(d => d.status === 'ACTIVE').length

  return (
    <div className="flex flex-col h-screen overflow-hidden" style={{ background: 'var(--bg-base)' }}>
      {/* ── Header ─────────────────────────────────────────── */}
      <header className="px-8 py-5 shrink-0 flex items-center justify-between" style={{ background: 'var(--bg-surface)', borderBottom: '1px solid var(--border)' }}>
        <div>
          <h1 className="flex items-center gap-2" style={{ fontFamily: 'var(--font-sans)', fontSize: 20, fontWeight: 700, color: 'var(--text-primary)', letterSpacing: '-0.02em' }}>
            <Cpu size={20} style={{ color: 'var(--primary)' }} /> Armada Drone
          </h1>
          <p style={{ fontFamily: 'var(--font-sans)', fontSize: 13, color: 'var(--text-muted)', marginTop: 4 }}>
            Manajemen unit registrasi, monitor telemetri lokasi, dan konfigurasi Model AI Inference.
          </p>
        </div>
        <button 
          onClick={() => setShowRegModal(true)}
          className="flex items-center gap-2 px-4 py-2 rounded-lg" 
          style={{ background: 'var(--primary)', border: 'none', color: 'var(--text-inverse)', fontFamily: 'var(--font-sans)', fontSize: 13, fontWeight: 700, cursor: 'pointer', letterSpacing: '0.04em' }}
        >
          <Plus size={16} /> REGISTRASI DRONE BARU
        </button>
      </header>

      {/* ── Main Workspace ─────────────────────────────────── */}
      <div className="p-8 flex-1 overflow-y-auto grid grid-cols-1 lg:grid-cols-3 gap-8 content-start">
        
        {/* Left Col: KPI & Models */}
        <div className="flex flex-col gap-6">
          <div className="grid grid-cols-2 gap-4">
            <div className="rounded-xl p-5 border shadow-sm" style={{ background: 'var(--bg-surface)', borderColor: 'var(--border)' }}>
              <div style={{ fontFamily: 'var(--font-sans)', fontSize: 11, fontWeight: 700, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.04em' }}>Unit Sedang Mengudara</div>
              <div style={{ fontFamily: 'var(--font-mono)', fontSize: 28, fontWeight: 700, color: 'var(--primary)', marginTop: 8, lineHeight: 1 }}>{activeDrones}</div>
            </div>
            <div className="rounded-xl p-5 border shadow-sm" style={{ background: 'var(--bg-surface)', borderColor: 'var(--border)' }}>
              <div style={{ fontFamily: 'var(--font-sans)', fontSize: 11, fontWeight: 700, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.04em' }}>Total Armada Terdaftar</div>
              <div style={{ fontFamily: 'var(--font-mono)', fontSize: 28, fontWeight: 700, color: 'var(--text-primary)', marginTop: 8, lineHeight: 1 }}>{DRONES.length}</div>
            </div>
          </div>

          <div className="rounded-xl overflow-hidden border shadow-sm" style={{ background: 'var(--bg-surface)', borderColor: 'var(--border)' }}>
            <div className="px-5 py-4" style={{ borderBottom: '1px solid var(--border)', background: 'var(--bg-elevated)' }}>
              <h3 style={{ fontFamily: 'var(--font-sans)', fontSize: 14, fontWeight: 700, color: 'var(--text-primary)' }}>AI Inference Models</h3>
            </div>
            <div className="p-5 flex flex-col gap-4">
              <div className="flex flex-col gap-2 p-3 rounded-lg" style={{ background: 'var(--primary-muted)', border: '1px solid var(--primary-border)' }}>
                <div className="flex items-center justify-between">
                  <span style={{ fontFamily: 'var(--font-sans)', fontSize: 13, fontWeight: 700, color: 'var(--primary)' }}>GP-Vision-v2.1</span>
                  <span className="px-2 py-0.5 rounded text-[10px] font-bold" style={{ background: 'var(--primary)', color: '#fff' }}>STABLE</span>
                </div>
                <div style={{ fontFamily: 'var(--font-sans)', fontSize: 11, color: 'var(--text-secondary)' }}>Model defisiensi dan hama standar. Digunakan oleh 3 drone.</div>
              </div>
              <div className="flex flex-col gap-2 p-3 rounded-lg" style={{ background: 'var(--bg-elevated)', border: '1px solid var(--border)' }}>
                <div className="flex items-center justify-between">
                  <span style={{ fontFamily: 'var(--font-sans)', fontSize: 13, fontWeight: 700, color: 'var(--text-primary)' }}>GP-NDVI-Beta</span>
                  <span className="px-2 py-0.5 rounded text-[10px] font-bold" style={{ background: 'var(--bg-active)', color: 'var(--text-muted)' }}>EXPERIMENTAL</span>
                </div>
                <div style={{ fontFamily: 'var(--font-sans)', fontSize: 11, color: 'var(--text-secondary)' }}>Model analisis NDVI spektral untuk air dan biomass.</div>
              </div>
            </div>
          </div>
        </div>

        {/* Right Col: Fleet List Area */}
        <div className="lg:col-span-2 rounded-xl overflow-hidden border shadow-sm flex flex-col" style={{ background: 'var(--bg-surface)', borderColor: 'var(--border)' }}>
          <div className="px-6 py-4 flex items-center justify-between" style={{ borderBottom: '1px solid var(--border)', background: 'var(--bg-elevated)' }}>
            <h3 style={{ fontFamily: 'var(--font-sans)', fontSize: 14, fontWeight: 700, color: 'var(--text-primary)' }}>Status Armada & Lokasi Terkini</h3>
          </div>
          <div className="flex-1 overflow-y-auto">
            {DRONES.map((drone, i) => {
              const isActive = drone.status === 'ACTIVE'
              return (
                <div key={drone.id} className="flex items-center px-6 py-4 hover:bg-[var(--bg-hover)] transition-colors" style={{ borderBottom: i < DRONES.length - 1 ? '1px solid var(--border)' : 'none' }}>
                  
                  {/* Icon & Name */}
                  <div className="flex items-center gap-4 w-1/3 min-w-0">
                    <div className="relative w-10 h-10 rounded-lg flex items-center justify-center shrink-0" style={{ background: isActive ? 'var(--primary-muted)' : 'var(--bg-elevated)', border: `1px solid ${isActive ? 'var(--primary-border)' : 'var(--border)'}` }}>
                      {isActive ? <PlaySquare size={16} className="text-[var(--primary)]" /> : <Box size={16} className="text-[var(--text-muted)]" />}
                      {isActive && <span className="absolute -top-1 -right-1 w-3 h-3 rounded-full bg-[var(--primary)] border-2 border-[var(--bg-surface)]" />}
                    </div>
                    <div className="min-w-0">
                      <div style={{ fontFamily: 'var(--font-sans)', fontSize: 14, fontWeight: 600, color: 'var(--text-primary)', whiteSpace: 'nowrap', textOverflow: 'ellipsis', overflow: 'hidden' }}>{drone.name}</div>
                      <div className="flex items-center gap-2 mt-1">
                        <span style={{ fontFamily: 'var(--font-mono)', fontSize: 10, color: 'var(--text-muted)' }}>{drone.id}</span>
                        <span style={{ fontFamily: 'var(--font-sans)', fontSize: 10, color: 'var(--text-secondary)' }}>{drone.type}</span>
                      </div>
                    </div>
                  </div>

                  {/* Vitals */}
                  <div className="w-1/4 flex flex-col gap-2">
                    <div className="flex items-center gap-2">
                      <Battery size={14} style={{ color: drone.battery > 50 ? '#10b981' : drone.battery > 20 ? '#eab308' : '#ef4444' }} />
                      <div className="w-20 h-1.5 rounded-full bg-[var(--bg-elevated)] overflow-hidden">
                        <div className="h-full" style={{ width: `${drone.battery}%`, background: drone.battery > 50 ? '#10b981' : drone.battery > 20 ? '#eab308' : '#ef4444' }} />
                      </div>
                      <span style={{ fontFamily: 'var(--font-mono)', fontSize: 10, color: 'var(--text-muted)' }}>{drone.battery}%</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Signal size={14} style={{ color: isActive ? '#10b981' : 'var(--text-muted)' }} />
                      <span style={{ fontFamily: 'var(--font-sans)', fontSize: 11, color: isActive ? '#10b981' : 'var(--text-muted)', fontWeight: 600 }}>Signal {drone.signal}</span>
                    </div>
                  </div>

                  {/* Location & AI */}
                  <div className="flex-1 flex flex-col gap-1">
                    <div className="flex items-center gap-1.5" style={{ fontFamily: 'var(--font-sans)', fontSize: 12, fontWeight: 600, color: isActive ? 'var(--text-primary)' : 'var(--text-secondary)' }}>
                      <Map size={13} style={{ color: 'var(--primary)' }} /> {drone.estate}
                    </div>
                    <div style={{ fontFamily: 'var(--font-sans)', fontSize: 11, color: 'var(--text-muted)', display: 'flex', alignItems: 'center', gap: 4 }}>
                       <Cpu size={12} /> {drone.model} • <span style={{ fontFamily: 'var(--font-mono)', fontSize: 9 }}>{drone.lastUpdate}</span>
                    </div>
                  </div>

                  {/* Action */}
                  <button className="w-8 h-8 rounded shrink-0 flex items-center justify-center hover:bg-[var(--bg-elevated)] transition-colors border border-transparent hover:border-[var(--border)]" style={{ color: 'var(--text-muted)' }}>
                    <ChevronRight size={18} />
                  </button>

                </div>
              )
            })}
          </div>
        </div>
      </div>

      {/* Registration Modal Overlay Placeholder */}
      {showRegModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center" style={{ background: 'rgba(0,0,0,0.6)' }} onClick={() => setShowRegModal(false)}>
          <div className="w-full max-w-md rounded-xl p-6" style={{ background: 'var(--bg-surface)', border: '1px solid var(--border)' }} onClick={e => e.stopPropagation()}>
            <h2 style={{ fontFamily: 'var(--font-sans)', fontSize: 18, fontWeight: 700, color: 'var(--text-primary)', marginBottom: 16 }}>Registrasi Drone Baru</h2>
            
            <div className="flex flex-col gap-4">
              <div>
                <label style={{ fontFamily: 'var(--font-sans)', fontSize: 12, fontWeight: 600, color: 'var(--text-primary)', display: 'block', marginBottom: 4 }}>ID Registrasi (Serial Number)</label>
                <input type="text" className="w-full px-3 py-2 rounded-lg" style={{ background: 'var(--bg-base)', border: '1px solid var(--border)', color: 'var(--text-primary)', fontFamily: 'var(--font-mono)', fontSize: 13 }} placeholder="Contoh: DRN-Z999" />
              </div>
              <div>
                <label style={{ fontFamily: 'var(--font-sans)', fontSize: 12, fontWeight: 600, color: 'var(--text-primary)', display: 'block', marginBottom: 4 }}>Tipe / Merk Drone</label>
                <select className="w-full px-3 py-2 rounded-lg" style={{ background: 'var(--bg-base)', border: '1px solid var(--border)', color: 'var(--text-primary)', fontFamily: 'var(--font-sans)', fontSize: 13, outline: 'none' }}>
                  <option>DJI Matrice 350 RTK</option>
                  <option>DJI Mavic 3 Multispectral</option>
                  <option>Autel Evo Max 4T</option>
                </select>
              </div>
              <div>
                <label style={{ fontFamily: 'var(--font-sans)', fontSize: 12, fontWeight: 600, color: 'var(--text-primary)', display: 'block', marginBottom: 4 }}>Model Inference Bawaan</label>
                <select className="w-full px-3 py-2 rounded-lg" style={{ background: 'var(--bg-base)', border: '1px solid var(--border)', color: 'var(--text-primary)', fontFamily: 'var(--font-sans)', fontSize: 13, outline: 'none' }}>
                  <option>GP-Vision-v2.1 (STABLE)</option>
                  <option>GP-NDVI-Beta (EXPERIMENTAL)</option>
                </select>
              </div>
            </div>

            <div className="flex justify-end gap-3 mt-8 pt-4" style={{ borderTop: '1px solid var(--border)' }}>
              <button onClick={() => setShowRegModal(false)} className="px-4 py-2 rounded-lg" style={{ background: 'var(--bg-elevated)', border: '1px solid var(--border)', color: 'var(--text-secondary)', fontFamily: 'var(--font-sans)', fontSize: 13, fontWeight: 600, cursor: 'pointer' }}>Batal</button>
              <button onClick={() => setShowRegModal(false)} className="flex items-center gap-2 px-4 py-2 rounded-lg" style={{ background: 'var(--primary)', border: 'none', color: 'var(--text-inverse)', fontFamily: 'var(--font-sans)', fontSize: 13, fontWeight: 700, cursor: 'pointer' }}>
                <CheckCircle2 size={14} /> Daftarkan
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
