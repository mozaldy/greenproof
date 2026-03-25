'use client'

import { useState } from 'react'
import { Cpu, Plus, Signal, Battery, Box, Map as MapIcon, CheckCircle2, ChevronRight, PlaySquare, X, ArrowLeft, PlaneTakeoff, Settings2, Calendar } from 'lucide-react'

const DRONES = [
  { id: 'DRN-X101', name: 'Alpha Scout', type: 'DJI Matrice 300 RTK', status: 'ACTIVE', battery: 84, signal: 'Kuat', estate: 'Kapuas Barat', model: 'GP-Vision-v2.1', lastUpdate: 'Live' },
  { id: 'DRN-X102', name: 'Beta Observer', type: 'DJI Mavic 3 Multispectral', status: 'CHARGING', battery: 100, signal: '-', estate: 'Basecamp Utama', model: 'GP-Vision-v2.1', lastUpdate: '2 jam lalu' },
  { id: 'DRN-X104', name: 'Delta Mapper', type: 'DJI Matrice 350 RTK', status: 'ACTIVE', battery: 42, signal: 'Sedang', estate: 'Kapuas Timur', model: 'GP-Vision-v2.1', lastUpdate: 'Live' },
  { id: 'DRN-X105', name: 'Echo Patrol', type: 'Autel Evo Max 4T', status: 'MAINTENANCE', battery: 0, signal: '-', estate: 'Workshop', model: 'GP-NDVI-Beta', lastUpdate: '2 hari lalu' },
]

type ModalMode = 'select' | 'self_register' | 'greenproof_service'

export default function DroneManagementPage() {
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [modalMode, setModalMode] = useState<ModalMode>('select')

  const activeDrones = DRONES.filter(d => d.status === 'ACTIVE').length

  const openModal = () => {
    setModalMode('select')
    setIsModalOpen(true)
  }

  const closeModal = () => {
    setIsModalOpen(false)
  }

  return (
    <div className="flex flex-col h-screen overflow-hidden bg-[var(--bg-base)]">
      {/* ── Header ─────────────────────────────────────────── */}
      <header className="px-8 py-5 shrink-0 flex items-center justify-between bg-[var(--bg-surface)] border-b border-[var(--border)] shadow-sm relative z-10">
        <div>
          <h1 className="flex items-center gap-2 font-sans text-xl font-bold text-[var(--text-primary)] tracking-tight">
            <Cpu size={20} className="text-[var(--primary)]" /> Armada Drone
          </h1>
          <p className="font-sans text-xs font-medium text-[var(--text-muted)] mt-1.5">
            Manajemen unit registrasi, monitor telemetri lokasi, dan konfigurasi Model AI Inference.
          </p>
        </div>
        <button 
          onClick={openModal}
          className="flex items-center gap-2 px-5 py-2.5 rounded-lg bg-[var(--primary)] text-white font-sans text-xs font-bold uppercase tracking-wider cursor-pointer hover:bg-emerald-500 transition-colors shadow-sm"
        >
          <Plus size={16} /> Tambah Armada
        </button>
      </header>

      {/* ── Main Workspace ─────────────────────────────────── */}
      <div className="p-8 flex-1 overflow-y-auto grid grid-cols-1 lg:grid-cols-3 gap-6 lg:gap-8 content-start">
        
        {/* Left Col: KPI & Models */}
        <div className="flex flex-col gap-6">
          <div className="grid grid-cols-2 gap-4">
            <div className="rounded-2xl p-5 border shadow-sm bg-[var(--bg-surface)] hover:border-[var(--primary-border)] transition-colors" style={{ borderColor: 'var(--border)' }}>
              <div className="font-sans text-[10px] font-bold text-[var(--text-muted)] uppercase tracking-widest mb-1">Unit Sedang Mengudara</div>
              <div className="font-mono text-3xl font-black text-[var(--primary)] tracking-tight">{activeDrones}</div>
            </div>
            <div className="rounded-2xl p-5 border shadow-sm bg-[var(--bg-surface)] hover:border-[var(--border-strong)] transition-colors" style={{ borderColor: 'var(--border)' }}>
              <div className="font-sans text-[10px] font-bold text-[var(--text-muted)] uppercase tracking-widest mb-1">Total Armada Terdaftar</div>
              <div className="font-mono text-3xl font-black text-[var(--text-primary)] tracking-tight">{DRONES.length}</div>
            </div>
          </div>

          <div className="rounded-2xl overflow-hidden border shadow-sm bg-[var(--bg-surface)]" style={{ borderColor: 'var(--border)' }}>
            <div className="px-6 py-4 border-b bg-[var(--bg-elevated)]" style={{ borderColor: 'var(--border)' }}>
              <h3 className="font-sans text-sm font-bold text-[var(--text-primary)]">AI Inference Models</h3>
            </div>
            <div className="p-5 flex flex-col gap-4">
              <div className="flex flex-col gap-2 p-4 rounded-xl bg-[var(--primary-muted)] border border-[var(--primary-border)]">
                <div className="flex items-center justify-between">
                  <span className="font-sans text-[13px] font-bold text-[var(--primary)]">GP-Vision-v2.1</span>
                  <span className="px-2 py-0.5 rounded text-[9px] tracking-wider uppercase font-bold bg-[var(--primary)] text-white shadow-sm">STABLE</span>
                </div>
                <div className="font-sans text-[11px] font-medium text-[var(--text-secondary)] leading-relaxed">Model defisiensi dan hama standar. Digunakan oleh 3 drone.</div>
              </div>
              <div className="flex flex-col gap-2 p-4 rounded-xl bg-[var(--bg-elevated)] border border-[var(--border)]">
                <div className="flex items-center justify-between">
                  <span className="font-sans text-[13px] font-bold text-[var(--text-primary)]">GP-NDVI-Beta</span>
                  <span className="px-2 py-0.5 rounded text-[9px] tracking-wider uppercase font-bold bg-[var(--bg-base)] text-[var(--text-muted)] border border-[var(--border)]">EXPERIMENTAL</span>
                </div>
                <div className="font-sans text-[11px] font-medium text-[var(--text-secondary)] leading-relaxed">Model analisis NDVI spektral untuk genangan air dan biomass.</div>
              </div>
            </div>
          </div>
        </div>

        {/* Right Col: Fleet List Area */}
        <div className="lg:col-span-2 rounded-2xl overflow-hidden border shadow-sm flex flex-col bg-[var(--bg-surface)]" style={{ borderColor: 'var(--border)' }}>
          <div className="px-6 py-5 flex items-center justify-between border-b bg-[var(--bg-elevated)]" style={{ borderColor: 'var(--border)' }}>
            <h3 className="font-sans text-[14px] font-bold text-[var(--text-primary)]">Status Armada & Lokasi Terkini</h3>
          </div>
          <div className="flex-1 overflow-y-auto">
            {DRONES.map((drone, i) => {
              const isActive = drone.status === 'ACTIVE'
              return (
                <div key={drone.id} className="flex items-center px-6 py-4 hover:bg-[var(--bg-hover)] transition-colors group cursor-pointer" style={{ borderBottom: i < DRONES.length - 1 ? '1px solid var(--border-subtle)' : 'none' }}>
                  
                  {/* Icon & Name */}
                  <div className="flex items-center gap-4 w-1/3 min-w-0">
                    <div className={`relative w-11 h-11 rounded-xl flex items-center justify-center shrink-0 border shadow-sm ${isActive ? 'bg-[var(--primary-muted)] border-[var(--primary-border)]' : 'bg-[var(--bg-elevated)] border-[var(--border)]'}`}>
                      {isActive ? <PlaySquare size={18} className="text-[var(--primary)]" /> : <Box size={18} className="text-[var(--text-muted)]" />}
                      {isActive && <span className="absolute -top-1 -right-1 w-3 h-3 rounded-full bg-[var(--primary)] border-2 border-[var(--bg-surface)]" />}
                    </div>
                    <div className="min-w-0">
                      <div className="font-sans text-[14px] font-bold text-[var(--text-primary)] truncate">{drone.name}</div>
                      <div className="flex items-center gap-2 mt-0.5">
                        <span className="font-mono text-[10px] font-semibold text-[var(--text-muted)]">{drone.id}</span>
                        <span className="font-sans text-[10px] font-medium text-[var(--text-secondary)] truncate">{drone.type}</span>
                      </div>
                    </div>
                  </div>

                  {/* Vitals */}
                  <div className="w-1/4 flex flex-col gap-2.5">
                    <div className="flex items-center gap-2.5">
                      <Battery size={14} style={{ color: drone.battery > 50 ? '#10b981' : drone.battery > 20 ? '#eab308' : '#ef4444' }} />
                      <div className="w-24 h-1.5 rounded-full bg-[var(--bg-elevated)] overflow-hidden shadow-inner">
                        <div className="h-full rounded-full" style={{ width: `${drone.battery}%`, background: drone.battery > 50 ? '#10b981' : drone.battery > 20 ? '#eab308' : '#ef4444' }} />
                      </div>
                      <span className="font-mono text-[10px] font-bold text-[var(--text-muted)] w-8">{drone.battery}%</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Signal size={14} style={{ color: isActive ? '#10b981' : 'var(--text-muted)' }} />
                      <span className={`font-sans text-[11px] font-bold ${isActive ? 'text-[#10b981]' : 'text-[var(--text-muted)]'}`}>Signal {drone.signal}</span>
                    </div>
                  </div>

                  {/* Location & AI */}
                  <div className="flex-1 flex flex-col gap-1.5">
                    <div className={`flex items-center gap-1.5 font-sans text-[12px] font-bold ${isActive ? 'text-[var(--text-primary)]' : 'text-[var(--text-secondary)]'}`}>
                      <MapIcon size={14} className="text-[var(--primary)]" /> {drone.estate}
                    </div>
                    <div className="font-sans text-[10px] font-semibold text-[var(--text-muted)] flex items-center gap-2">
                       <Cpu size={12} className="opacity-70" /> {drone.model} <span className="font-mono opacity-50">• {drone.lastUpdate}</span>
                    </div>
                  </div>

                </div>
              )
            })}
          </div>
        </div>
      </div>

      {/* ── MODAL TAMBAH ARMADA ── */}
      {isModalOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-200" onClick={closeModal}>
          <div 
            className="w-full max-w-lg rounded-2xl bg-[var(--bg-surface)] border border-[var(--border)] shadow-2xl overflow-hidden flex flex-col transition-all" 
            onClick={e => e.stopPropagation()}
          >
            {/* Header Dinamis berdasarkan State */}
            <div className="px-6 py-5 border-b border-[var(--border)] bg-[var(--bg-elevated)] flex justify-between items-center shrink-0">
              <div className="flex items-center gap-3">
                {modalMode !== 'select' && (
                  <button onClick={() => setModalMode('select')} className="p-1.5 -ml-2 rounded-lg text-[var(--text-muted)] hover:bg-[var(--bg-hover)] hover:text-[var(--text-primary)] transition-colors">
                    <ArrowLeft size={18} />
                  </button>
                )}
                <div>
                  <h2 className="font-sans text-lg font-bold text-[var(--text-primary)]">
                    {modalMode === 'select' ? 'Opsi Tambah Armada' : modalMode === 'greenproof_service' ? 'Sewa Layanan Drone AI' : 'Registrasi Drone Perusahaan'}
                  </h2>
                  <p className="text-[11px] text-[var(--text-muted)] mt-1 font-medium">
                    {modalMode === 'select' ? 'Pilih metode penyediaan armada untuk area operasi.' : modalMode === 'greenproof_service' ? 'Pesan layanan pilot dan drone dari GreenProof' : 'Daftarkan perangkat milik internal perusahaan'}
                  </p>
                </div>
              </div>
              <button onClick={closeModal} className="p-2 rounded-lg text-[var(--text-muted)] hover:bg-[var(--bg-hover)] hover:text-[var(--text-primary)] transition-colors">
                <X size={20} />
              </button>
            </div>

            {/* Isi Modal Dinamis */}
            <div className="p-6">
              
              {/* === MODE: SELECT === */}
              {modalMode === 'select' && (
                <div className="flex flex-col gap-4">
                  {/* Opsi 1: GreenProof Service */}
                  <button 
                    onClick={() => setModalMode('greenproof_service')}
                    className="flex items-start gap-5 p-5 rounded-2xl border border-emerald-500/20 bg-emerald-500/5 hover:bg-emerald-500/10 hover:border-emerald-500/40 transition-all text-left group cursor-pointer"
                  >
                    <div className="w-12 h-12 rounded-xl bg-emerald-500/20 text-emerald-500 flex items-center justify-center shrink-0 group-hover:scale-110 transition-transform">
                      <PlaneTakeoff size={24} />
                    </div>
                    <div>
                      <h3 className="font-sans text-[15px] font-bold text-[var(--text-primary)] mb-1">Gunakan Layanan GreenProof</h3>
                      <p className="font-sans text-[12px] text-[var(--text-secondary)] leading-relaxed">
                        Tidak punya armada? Sewa Drone + Pilot tersertifikasi dari GreenProof yang langsung terintegrasi dengan AI Model.
                      </p>
                    </div>
                  </button>

                  {/* Opsi 2: Register Own Drone */}
                  <button 
                    onClick={() => setModalMode('self_register')}
                    className="flex items-start gap-5 p-5 rounded-2xl border border-[var(--border)] bg-[var(--bg-base)] hover:bg-[var(--bg-elevated)] hover:border-[var(--border-strong)] transition-all text-left group cursor-pointer"
                  >
                    <div className="w-12 h-12 rounded-xl bg-[var(--bg-surface)] border border-[var(--border-strong)] text-[var(--text-primary)] flex items-center justify-center shrink-0 group-hover:scale-110 transition-transform">
                      <Settings2 size={24} />
                    </div>
                    <div>
                      <h3 className="font-sans text-[15px] font-bold text-[var(--text-primary)] mb-1">Registrasi Drone Internal</h3>
                      <p className="font-sans text-[12px] text-[var(--text-secondary)] leading-relaxed">
                        Hubungkan drone milik perusahaan ke dalam sistem GreenProof untuk dipantau di Command Center.
                      </p>
                    </div>
                  </button>
                </div>
              )}

              {/* === MODE: GREENPROOF SERVICE === */}
              {modalMode === 'greenproof_service' && (
                <div className="flex flex-col gap-5 animate-in slide-in-from-right-4 duration-300">
                  <div className="flex flex-col gap-2">
                    <label className="text-[10px] font-bold text-[var(--text-secondary)] uppercase tracking-widest px-1">Lokasi Survey (Estate)</label>
                    <select className="w-full px-4 py-3 rounded-xl bg-[var(--bg-base)] border border-[var(--border)] font-sans text-[13px] text-[var(--text-primary)] outline-none focus:border-emerald-500 transition-colors cursor-pointer appearance-none">
                      <option>Kapuas Barat (4.200 ha)</option>
                      <option>Kapuas Timur (4.800 ha)</option>
                      <option>Mentaya (3.400 ha)</option>
                    </select>
                  </div>
                  
                  <div className="grid grid-cols-2 gap-4">
                    <div className="flex flex-col gap-2">
                      <label className="text-[10px] font-bold text-[var(--text-secondary)] uppercase tracking-widest px-1">Target Luasan (Ha)</label>
                      <input type="number" placeholder="Contoh: 500" className="w-full px-4 py-3 rounded-xl bg-[var(--bg-base)] border border-[var(--border)] font-mono text-[13px] text-[var(--text-primary)] outline-none focus:border-emerald-500 transition-colors placeholder:text-[var(--text-muted)]" />
                    </div>
                    <div className="flex flex-col gap-2">
                      <label className="text-[10px] font-bold text-[var(--text-secondary)] uppercase tracking-widest px-1">Jadwal Penerbangan</label>
                      <div className="relative">
                        <input type="date" className="w-full pl-10 pr-4 py-3 rounded-xl bg-[var(--bg-base)] border border-[var(--border)] font-sans text-[13px] text-[var(--text-primary)] outline-none focus:border-emerald-500 transition-colors appearance-none" />
                        <Calendar size={14} className="absolute left-4 top-1/2 -translate-y-1/2 text-[var(--text-muted)]" />
                      </div>
                    </div>
                  </div>

                  <div className="flex flex-col gap-2">
                     <label className="text-[10px] font-bold text-[var(--text-secondary)] uppercase tracking-widest px-1">Catatan Tambahan (Opsional)</label>
                     <textarea rows={3} placeholder="Instruksi fokus pencarian anomali..." className="w-full px-4 py-3 rounded-xl bg-[var(--bg-base)] border border-[var(--border)] font-sans text-[13px] text-[var(--text-primary)] outline-none focus:border-emerald-500 transition-colors placeholder:text-[var(--text-muted)] resize-none" />
                  </div>

                  <button 
                    onClick={() => {
                      alert("Permintaan layanan (Request) berhasil dikirim ke tim operasional GreenProof!");
                      closeModal();
                    }}
                    className="mt-2 w-full py-3.5 rounded-xl bg-emerald-500 text-white font-bold text-[13px] uppercase tracking-wide hover:bg-emerald-600 transition-colors shadow-lg active:scale-[0.98]"
                  >
                    Kirim Permintaan Layanan
                  </button>
                </div>
              )}

              {/* === MODE: SELF REGISTER === */}
              {modalMode === 'self_register' && (
                <div className="flex flex-col gap-5 animate-in slide-in-from-right-4 duration-300">
                  <div className="flex flex-col gap-2">
                    <label className="text-[10px] font-bold text-[var(--text-secondary)] uppercase tracking-widest px-1">Serial Number / ID Controller</label>
                    <input type="text" placeholder="Contoh: DRN-Z999" className="w-full px-4 py-3 rounded-xl bg-[var(--bg-base)] border border-[var(--border)] font-mono text-[13px] text-[var(--text-primary)] outline-none focus:border-[var(--primary)] transition-colors placeholder:text-[var(--text-muted)]" />
                  </div>

                  <div className="flex flex-col gap-2">
                    <label className="text-[10px] font-bold text-[var(--text-secondary)] uppercase tracking-widest px-1">Model Perangkat</label>
                    <select className="w-full px-4 py-3 rounded-xl bg-[var(--bg-base)] border border-[var(--border)] font-sans text-[13px] text-[var(--text-primary)] outline-none focus:border-[var(--primary)] transition-colors cursor-pointer appearance-none">
                      <option>DJI Matrice 350 RTK</option>
                      <option>DJI Mavic 3 Multispectral</option>
                      <option>Autel Evo Max 4T</option>
                    </select>
                  </div>

                  <div className="flex flex-col gap-2">
                    <label className="text-[10px] font-bold text-[var(--text-secondary)] uppercase tracking-widest px-1">Hubungkan Model AI (Inference)</label>
                    <select className="w-full px-4 py-3 rounded-xl bg-[var(--bg-base)] border border-[var(--border)] font-sans text-[13px] text-[var(--text-primary)] outline-none focus:border-[var(--primary)] transition-colors cursor-pointer appearance-none">
                      <option>GP-Vision-v2.1 (STABLE)</option>
                      <option>GP-NDVI-Beta (EXPERIMENTAL)</option>
                    </select>
                  </div>

                  <button 
                    onClick={() => {
                      alert("Armada internal berhasil didaftarkan dan terhubung ke Command Center!");
                      closeModal();
                    }}
                    className="mt-2 w-full py-3.5 rounded-xl bg-[var(--primary)] text-white font-bold text-[13px] uppercase tracking-wide hover:bg-emerald-500 transition-colors shadow-lg active:scale-[0.98]"
                  >
                    Daftarkan Unit Drone
                  </button>
                </div>
              )}

            </div>
          </div>
        </div>
      )}
    </div>
  )
}