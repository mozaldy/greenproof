'use client'

import { useState } from 'react'
import { BookOpen, Search, Leaf, Bug, Droplets, BookMarked, ArrowRight, X, AlertTriangle, BookPlus } from 'lucide-react'
import type { KbItem } from '@/types'

const KB_ITEMS: KbItem[] = [
  { id: 'KB-01', title: 'Panduan Deteksi Ganoderma (BSR)', category: 'Penyakit Jamur', icon: Leaf, color: '#ef4444', desc: 'Ciri-ciri badan buah, perubahan warna daun, dan metode diagnosis.' },
  { id: 'KB-02', title: 'Modul Defisiensi Magnesium', category: 'Nutrisi', icon: Droplets, color: '#eab308', desc: 'Klorosis pada pelepah bawah vs pelepah atas. Perbedaan dengan penyakit tajuk.' },
  { id: 'KB-03', title: 'Serangan Ulat Api (Nettle Caterpillar)', category: 'Hama', icon: Bug, color: '#ef4444', desc: 'Identifikasi pola gigitan pada daun dan cara estimasi tingkat serangan.' },
  { id: 'KB-04', title: 'Waterlogging & Parit Tersumbat', category: 'Fisik & Lingkungan', icon: Droplets, color: '#3b82f6', desc: 'Dampak kelebihan air pada perakaran dan pertumbuhan pucuk lambat.' },
  { id: 'KB-05', title: 'Penyakit Tajuk (Crown Disease)', category: 'Sindrom genetik', icon: Leaf, color: '#8b5cf6', desc: 'Bentuk pelepah melengkung ke dalam, daun tidak mekar sempurna pada bibit muda.' },
  { id: 'KB-06', title: 'Kumbang Tanduk (Oryctes rhinoceros)', category: 'Hama', icon: Bug, color: '#f97316', desc: 'Pola guntingan huruf V pada daun muda. Kerusakan fatal pada titik tumbuh.' },
  { id: 'KB-08', title: 'SOP Investigasi Sabotase Pohon (Injeksi Kimia)', category: 'Vandalisme & Konflik', icon: AlertTriangle, color: '#dc2626', desc: 'Pedoman membedakan kematian tajuk alami vs kematian mendadak akibat injeksi zat kimia (herbisida mematikan) oleh oknum.', 
    content: (
      <div className="flex flex-col gap-6 text-[var(--text-secondary)] text-sm leading-relaxed" style={{ fontFamily: 'var(--font-sans)' }}>
        <p>Kasus kematian tajuk yang mendadak, masif, dan sering muncul di area perbatasan blok (misalnya berbatasan dengan area warga, eks-klaim, atau jalan poros) memerlukan investigasi forensik khusus untuk mengesampingkan faktor penyakit alami. AI Drone seringkali mengklasifikasikan ini sebagai <em>Lightning Strike</em> (Tersambar Petir) atau <em>Ganoderma</em> stadium akhir.</p>
        
        <div className="p-5 rounded-xl border shadow-sm mb-6" style={{ background: 'var(--danger-muted)', borderColor: 'var(--danger)', opacity: 0.9 }}>
          <h4 className="font-bold mb-3 uppercase text-xs tracking-wider flex items-center gap-2" style={{ color: 'var(--danger)' }}>
            <AlertTriangle size={16} /> Karakteristik Vandalisme Eksternal:
          </h4>
          <div className="flex flex-col md:flex-row gap-6">
            <div className="flex-1">
              <ul className="list-disc pl-5 space-y-3 text-[var(--danger)] mix-blend-color-burn font-medium">
                <li><strong>Pola Linier Akses Masuk:</strong> Pohon mati berjajar rapi mengikuti alur akses pikul/pasar, berbeda dengan 100% penyakit alami (menyebar sentrifugal).</li>
                <li><strong>Kematian Ekstrem Cepat Tanpa Fase Klorosis:</strong> Dalam tempo &lt; 2 minggu (sebelum jadwal panen berikutnya), daun menghitam total secara mendadak.</li>
                <li><strong>Luka Bor Injeksi (Drill Holes):</strong> Pada pangkal (0.5m dari piringan), terdapat lubang ±5mm-10mm dengan sudut serong 45&deg;.</li>
                <li><strong>Bau Kimia:</strong> Terdapat bau Paraquat/Glifosat sistemik tajam di areal luka tusuk.</li>
              </ul>
            </div>
            <div className="w-full md:w-64 shrink-0 flex flex-col gap-2">
               <img src="/images/sop-drillhole.jpg" alt="Luka Bor Tanda Injeksi Herbisisda" className="w-full h-32 object-cover rounded-lg border border-[var(--danger)] opacity-80" />
               <span className="text-[10px] uppercase font-bold text-[var(--danger)] mix-blend-color-burn text-center">Fig 1. Bukti Luka Bor pada Pangkal (Close-up)</span>
            </div>
          </div>
        </div>

        <h4 className="font-bold text-[15px] mb-3" style={{ color: 'var(--text-primary)' }}>Panduan Penanganan & Eskalasi Insiden (SOP-SEC-04):</h4>
        
        <div className="flex gap-4 mb-4">
           <img src="/images/sop-panorama.webp" alt="Panorama Kematian Sabotase" className="w-full h-40 object-cover rounded-xl border border-[var(--border)] opacity-90 shadow-sm" />
        </div>
        
        <ol className="list-decimal pl-5 space-y-3" style={{ color: 'var(--text-secondary)' }}>
          <li><strong>Amankan TKP:</strong> Jangan sentuh benda mati (botol bekas paten racun). Ambil koordinat GPS deviasi &lt; 3m.</li>
          <li><strong>Dokumentasi Bukti Makro & Mikro (Crucial):</strong> Ambil foto <em>extreme close-up</em> di lubang injeksi dan foto <em>panoramik</em> memperlihatkan kelurusan garis kematian antar pokok.</li>
          <li><strong>Eskalasi Lintas Divisi (Red Flag):</strong> Tetapkan status KRITIS. Lepaskan assign dari Agronomi asisten blok, dan lakukan <em>bypass</em> langsung ke <strong>Departemen Keamanan (Pam Swakarsa)</strong>.</li>
          <li><strong>Sampling Jaringan Patologi Forensik:</strong> Potong sampel jaringan di sekitar lubang. Uji tokso-lab akan jadi BAP polisi.</li>
        </ol>

        <div className="grid grid-cols-2 gap-4 mt-6">
           <div className="p-4 rounded-xl border flex items-start gap-4" style={{ background: 'var(--bg-elevated)', borderColor: 'var(--border)' }}>
             <Leaf size={24} className="text-[#10b981] mt-1 shrink-0" />
             <div>
               <div className="text-[11px] font-bold text-[var(--text-muted)] uppercase mb-1">Penyakit Jamur BSR</div>
               <div className="text-[12px] text-[var(--text-primary)] font-semibold">Berfase Klorosis (3+ bulan), akar hancur dulu, menyebar sentrifugal (radial) di kelembaban tinggi.</div>
             </div>
           </div>
           <div className="p-4 rounded-xl border flex items-start gap-4" style={{ background: 'var(--danger-muted)', borderColor: 'var(--danger)', opacity: 0.9 }}>
             <AlertTriangle size={24} className="text-[var(--danger)] mt-1 shrink-0" />
             <div>
               <div className="text-[11px] font-bold text-[var(--danger)] uppercase mb-1 mix-blend-color-burn">Sabotase Injeksi</div>
               <div className="text-[12px] text-[var(--danger)] font-semibold mix-blend-color-burn">Mati dadakan (1-2 mgg), tajuk sengklek kaku, ada lubang mekanik dan tidak peduli lingkungan (musim/tanah).</div>
             </div>
           </div>
        </div>

        <div className="p-5 rounded-xl border italic font-bold mt-4 shadow-inner" style={{ background: 'var(--bg-elevated)', borderColor: 'var(--border)', color: 'var(--text-primary)' }}>
          "Jamur patogen tidak bisa mengebor batang sawit dengan mata bor 5mm. Insting auditor agronomi harus tajam membedakan patologi alam vs patologi sosial." 
          <div className="text-xs font-normal mt-2 text-[var(--text-muted)]">— Dikutip dari Evaluasi Task VRD-008 (Kematian Tajuk Merata Areal Batas Desa)</div>
        </div>
      </div>
    )
  },
  { id: 'KB-07', title: 'Deteksi Ganoderma Standar (VRD-003)', category: 'Dataset Referensi', icon: BookMarked, color: '#10b981', desc: 'Preseden dari Labeled Data VRD-003. Menjadi standar emas untuk deteksi badan buah pada baris tanaman.' },
]

export default function KnowledgeBasePage() {
  const [activeKb, setActiveKb] = useState<KbItem | null>(null)

  return (
    <div className="flex flex-col h-screen relative" style={{ background: 'var(--bg-base)' }}>
      {/* Header */}
      <header className="px-8 py-5 shrink-0 relative z-10" style={{ background: 'var(--bg-surface)', borderBottom: '1px solid var(--border)' }}>
        <div className="flex items-center justify-between">
          <div>
            <h1 className="flex items-center gap-2" style={{ fontFamily: 'var(--font-sans)', fontSize: 20, fontWeight: 700, color: 'var(--text-primary)', letterSpacing: '-0.02em' }}>
              <BookOpen size={20} style={{ color: 'var(--primary)' }} />
              Knowledge Base Agronomi
            </h1>
            <p style={{ fontFamily: 'var(--font-sans)', fontSize: 13, color: 'var(--text-muted)', marginTop: 4 }}>
              Referensi standar perusahaan untuk memastikan konsistensi dalam memberikan verdict (labeling).
            </p>
          </div>
          <div className="flex items-center gap-3">
            <button className="flex items-center gap-2 px-4 py-2 rounded-lg transition-transform hover:scale-105 shadow-md flex-row-reverse" style={{ background: 'var(--primary)', border: 'none', color: 'var(--text-inverse)', fontFamily: 'var(--font-sans)', fontSize: 13, fontWeight: 700, cursor: 'pointer' }}>
              Tambah Standard Reference / Dokumen Baru <BookPlus size={16} />
            </button>
            <button className="flex items-center gap-2 px-4 py-2 rounded-lg transition-transform hover:scale-105 shadow-sm border" style={{ background: 'var(--bg-base)', borderColor: 'var(--border)', color: 'var(--text-primary)', fontFamily: 'var(--font-sans)', fontSize: 13, fontWeight: 700, cursor: 'pointer' }}>
              <BookMarked size={14} /> Bookmark Saya
            </button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <div className="p-8 flex-1 overflow-y-auto z-0">
        {/* Search */}
        <div className="flex items-center gap-2 px-4 py-3 rounded-xl mb-8 max-w-2xl shadow-sm focus-within:ring-2 ring-[var(--primary)] transition-shadow" style={{ background: 'var(--bg-surface)', border: '1px solid var(--border)' }}>
          <Search size={16} style={{ color: 'var(--text-muted)' }} />
          <input type="text" placeholder="Cari referensi penyakit, hama, atau SOP internal perusahaan..." style={{ background: 'transparent', border: 'none', outline: 'none', color: 'var(--text-primary)', fontSize: 14, fontFamily: 'var(--font-sans)', width: '100%' }} />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {KB_ITEMS.map(item => {
            const Icon = item.icon
            return (
              <div 
                key={item.id} 
                onClick={() => setActiveKb(item)}
                className="flex flex-col rounded-xl overflow-hidden hover:-translate-y-1.5 hover:shadow-xl transition-all cursor-pointer group" 
                style={{ background: 'var(--bg-surface)', border: '1px solid var(--border)', boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.05), 0 2px 4px -1px rgba(0, 0, 0, 0.03)' }}
              >
                <div className="p-6 flex-1 flex flex-col">
                  <div className="flex items-center justify-between mb-5">
                    <span className="px-2.5 py-1 rounded" style={{ background: 'var(--bg-base)', border: '1px solid var(--border)', fontFamily: 'var(--font-sans)', fontSize: 10, fontWeight: 800, color: 'var(--text-secondary)', textTransform: 'uppercase', letterSpacing: '0.04em' }}>
                      {item.category}
                    </span>
                    <div className="w-9 h-9 rounded-full flex items-center justify-center transition-transform group-hover:scale-110" style={{ background: `${item.color}15`, color: item.color }}>
                      <Icon size={16} />
                    </div>
                  </div>
                  <h3 style={{ fontFamily: 'var(--font-sans)', fontSize: 16, fontWeight: 800, color: 'var(--text-primary)', marginBottom: 12, lineHeight: 1.3 }}>
                    {item.title}
                  </h3>
                  <p className="flex-1" style={{ fontFamily: 'var(--font-sans)', fontSize: 13, color: 'var(--text-muted)', lineHeight: 1.6 }}>
                    {item.desc}
                  </p>
                </div>
                <div className="px-6 py-4 flex items-center justify-between mt-auto" style={{ background: 'var(--bg-elevated)', borderTop: '1px solid var(--border)' }}>
                  <span style={{ fontFamily: 'var(--font-mono)', fontSize: 11, fontWeight: 700, color: 'var(--text-muted)' }}>{item.id}</span>
                  <div className="flex items-center gap-1.5 text-[var(--primary)] text-xs font-bold uppercase tracking-wider group-hover:translate-x-1 transition-transform">
                    Buka Pedoman <ArrowRight size={14} />
                  </div>
                </div>
              </div>
            )
          })}
        </div>
      </div>

      {/* Modal / Overlay for KB Document Viewer */}
      {activeKb && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-8">
          <div className="absolute inset-0 bg-black bg-opacity-60 backdrop-blur-sm" onClick={() => setActiveKb(null)} />
          <div 
            className="relative w-full max-w-4xl h-full max-h-[90vh] rounded-2xl flex flex-col shadow-2xl overflow-hidden animate-in fade-in zoom-in-95 duration-200"
            style={{ background: 'var(--bg-base)', border: '1px solid var(--border)' }}
          >
            {/* Modal Header */}
            <div className="px-6 py-5 border-b flex items-center justify-between bg-[var(--bg-surface)] shrink-0" style={{ borderColor: 'var(--border)' }}>
              <div className="flex items-center gap-4">
                <div className="w-10 h-10 rounded-full flex items-center justify-center shadow-inner" style={{ background: `${activeKb.color}15`, color: activeKb.color }}>
                  <activeKb.icon size={20} />
                </div>
                <div>
                  <div className="flex items-center gap-2 mb-1">
                    <span className="font-mono text-[10px] font-bold px-2 py-0.5 rounded border uppercase" style={{ background: 'var(--bg-elevated)', color: 'var(--text-muted)', borderColor: 'var(--border)' }}>{activeKb.id}</span>
                    <span className="font-sans text-[10px] font-bold px-2 py-0.5 rounded border uppercase" style={{ background: 'var(--bg-elevated)', color: activeKb.color, borderColor: activeKb.color }}>{activeKb.category}</span>
                  </div>
                  <h2 className="text-lg font-bold text-[var(--text-primary)] leading-none">{activeKb.title}</h2>
                </div>
              </div>
              <button 
                onClick={() => setActiveKb(null)}
                className="p-2 rounded-full hover:bg-[var(--bg-hover)] text-[var(--text-muted)] transition-colors"
              >
                <X size={20} />
              </button>
            </div>

            {/* Modal Content Rich Text Body */}
            <div className="flex-1 overflow-y-auto p-6 md:p-10 bg-[var(--bg-base)]">
              {activeKb.content ? (
                <div className="prose prose-sm max-w-none">
                  {activeKb.content}
                </div>
              ) : (
                <div className="flex flex-col items-center justify-center h-full text-center p-10 opacity-70">
                  <div className="w-16 h-16 rounded-full flex items-center justify-center mb-4" style={{ background: 'var(--bg-elevated)', color: 'var(--text-muted)' }}>
                    <BookOpen size={32} />
                  </div>
                  <h3 className="text-lg font-bold text-[var(--text-primary)] mb-2">Dokumen Belum Terdigitalisasi Penuh</h3>
                  <p className="text-sm text-[var(--text-secondary)] max-w-md mx-auto leading-relaxed">
                    SOP {activeKb.id} belum diunggah dalam format rich-text ke dalam basis data digital. Silakan hubungi admin R&D Agronomi untuk mengunggah dokumen referensi asli.
                  </p>
                </div>
              )}
            </div>

            {/* Modal Footer */}
            <div className="px-6 py-4 border-t bg-[var(--bg-surface)] shrink-0 flex items-center justify-between" style={{ borderColor: 'var(--border)' }}>
              <span className="text-xs text-[var(--text-muted)] font-medium">Terakhir diperbarui: 22 Mar 2025</span>
              <button 
                onClick={() => setActiveKb(null)}
                className="px-6 py-2.5 rounded-lg border shadow-sm font-bold text-sm transition-colors hover:bg-[var(--bg-hover)]"
                style={{ background: 'var(--bg-base)', borderColor: 'var(--border)', color: 'var(--text-primary)' }}
              >
                Tutup Pedoman
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
