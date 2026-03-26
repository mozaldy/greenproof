'use client'

import { useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { Camera, ChevronLeft, Zap, ShieldAlert, Send, CheckCircle2 } from 'lucide-react'

type ReportTier = 'QUICK' | 'EXPERT'

export default function SubmitReportPage({ params }: { params: { id: string } }) {
  const router = useRouter()
  const [tier, setTier] = useState<ReportTier>('QUICK')
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isSuccess, setIsSuccess] = useState(false)

  const [expertDiagnosis, setExpertDiagnosis] = useState('')
  const [expertSymptoms, setExpertSymptoms] = useState('')
  const [expertSeverity, setExpertSeverity] = useState('')
  const [expertObjects, setExpertObjects] = useState('')
  const [expertNotes, setExpertNotes] = useState('')

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)
    // Simulate network delay
    setTimeout(() => {
      setIsSubmitting(false)
      setIsSuccess(true)
      setTimeout(() => {
        router.push('/')
      }, 2000)
    }, 1500)
  }

  if (isSuccess) {
    return (
      <div className="min-h-screen bg-background flex flex-col items-center justify-center p-6 text-center animate-in fade-in zoom-in duration-500">
        <div className="w-24 h-24 rounded-full bg-primary/20 flex items-center justify-center mb-6">
          <CheckCircle2 size={48} className="text-primary" />
        </div>
        <h1 className="text-2xl font-bold text-foreground mb-2">Laporan Terkirim!</h1>
        <p className="text-muted-foreground mb-8">
          Sistem akan segera menugaskan Verifier <em>Quality Gate</em> untuk mengevaluasi data Anda.
        </p>
        <div className="px-4 py-2 bg-secondary rounded-lg font-mono text-sm text-primary font-bold">
          (+{tier === 'EXPERT' ? '150' : '40'} Poin)
        </div>
      </div>
    )
  }

  return (
    <main className="flex flex-col min-h-screen bg-background pb-32">
      {/* Header */}
      <header className="px-4 py-4 bg-background border-b border-border flex items-center justify-between sticky top-0 z-50 shadow-sm">
        <Link 
          href={`/tasks/${params.id}`}
          className="w-10 h-10 rounded-full bg-secondary flex items-center justify-center text-foreground hover:bg-secondary/80 transition-colors"
        >
          <ChevronLeft size={20} />
        </Link>
        <div className="text-center">
          <div className="font-bold text-sm">Form Investigasi</div>
          <div className="text-[10px] font-mono text-muted-foreground">{params.id}</div>
        </div>
        <div className="w-10" />
      </header>

      {/* Camera Viewfinder Mock */}
      <div className="p-4">
         <div className="relative aspect-[4/3] bg-black rounded-2xl overflow-hidden border border-border shadow-inner group">
           <img src="/images/camera-preview.avif" alt="Live Camera Preview" className="w-full h-full object-cover opacity-60" />
           <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
             {/* Reticle focus lines */}
             <div className="w-32 h-32 border border-white/30 relative">
               <div className="absolute top-0 left-0 w-3 h-3 border-t-2 border-l-2 border-primary -translate-x-1 -translate-y-1" />
               <div className="absolute top-0 right-0 w-3 h-3 border-t-2 border-r-2 border-primary translate-x-1 -translate-y-1" />
               <div className="absolute bottom-0 left-0 w-3 h-3 border-b-2 border-l-2 border-primary -translate-x-1 translate-y-1" />
               <div className="absolute bottom-0 right-0 w-3 h-3 border-b-2 border-r-2 border-primary translate-x-1 translate-y-1" />
             </div>
           </div>
           
           <div className="absolute bottom-4 left-0 right-0 flex justify-center">
             <button className="w-16 h-16 rounded-full border-4 border-white/50 bg-white/20 backdrop-blur-sm flex items-center justify-center active:scale-95 transition-transform group-hover:bg-white/40">
               <div className="w-12 h-12 bg-white rounded-full flex items-center justify-center">
                 <Camera size={20} className="text-black" />
               </div>
             </button>
           </div>
           <div className="absolute top-4 right-4 bg-black/60 backdrop-blur px-2 py-1 rounded text-[10px] font-mono text-primary border border-primary/30">
             GPS LOCK: <span className="text-white">ON</span>
           </div>
         </div>
      </div>

      <form onSubmit={handleSubmit} className="flex-1 flex flex-col gap-6 px-4">
        
        {/* Tier Selector */}
        <div className="bg-secondary p-1 rounded-xl flex gap-1 relative shadow-inner mt-2">
          <button 
            type="button"
            onClick={() => setTier('QUICK')}
            className={`flex-1 py-3 px-2 rounded-lg text-xs font-bold transition-all flex items-center justify-center gap-2 relative z-10 ${
              tier === 'QUICK' ? 'bg-card text-foreground shadow-sm ring-1 ring-border' : 'text-muted-foreground'
            }`}
          >
            <Zap size={14} className={tier === 'QUICK' ? 'text-amber-500' : ''} />
            Observasi Cepat
          </button>
          <button 
            type="button"
            onClick={() => setTier('EXPERT')}
            className={`flex-1 py-3 px-2 rounded-lg text-xs font-bold transition-all flex items-center justify-center gap-2 relative z-10 ${
              tier === 'EXPERT' ? 'bg-primary text-primary-foreground shadow-md ring-1 ring-primary-foreground/20' : 'text-muted-foreground'
            }`}
          >
            <ShieldAlert size={14} />
            Analisis Pakar
          </button>
        </div>

        {/* Dynamic Form Content */}
        <div className="animate-in fade-in slide-in-from-bottom-4 duration-300">
          
          {tier === 'QUICK' ? (
            <div className="flex flex-col gap-5">
              <div className="bg-amber-500/10 border border-amber-500/20 p-3 rounded-xl flex gap-3 text-amber-500 text-xs mb-2 leading-relaxed">
                Mode Cepat ditujukan untuk verifikasi visual kilat. Reward yang diterima hanya berupa Base Reward (40% dari total).
              </div>

              <div className="flex flex-col gap-2">
                <label className="text-[11px] font-bold text-muted-foreground uppercase tracking-widest px-1">Kondisi Visual Dominan</label>
                <select className="w-full bg-card border border-border rounded-xl px-4 py-3.5 text-sm text-foreground focus:ring-2 ring-primary outline-none appearance-none font-medium">
                  <option>Pohon Sakit / Kekuningan</option>
                  <option>Pohon Mati Kering</option>
                  <option>Tajuk Patah / Sengklek</option>
                  <option>Sehat (AI Salah Deteksi)</option>
                  <option>Lainnya (Tulis di catatan)</option>
                </select>
              </div>

              <div className="flex flex-col gap-2">
                <label className="text-[11px] font-bold text-muted-foreground uppercase tracking-widest px-1">Keterangan Singkat</label>
                <textarea 
                  rows={4}
                  className="w-full bg-card border border-border rounded-xl px-4 py-3 text-sm text-foreground focus:ring-2 ring-primary outline-none resize-none"
                  placeholder="Ceritakan apa yang Anda lihat secara singkat..."
                />
              </div>
            </div>
          ) : (
            <div className="flex flex-col gap-6">
              <div className="bg-primary/10 border border-primary/20 p-3 rounded-xl flex gap-3 text-primary text-xs mb-2 leading-relaxed shadow-sm font-medium">
                Sistem mengharapkan detail presisi setingkat agronomis. Pelaporan tervalidasi akan memicu klaim Maksimal Reward (100% Poin).
              </div>

              {/* Diagnosis Definitif */}
              <div className="flex flex-col gap-2">
                <label className="text-[11px] font-bold text-muted-foreground uppercase tracking-widest px-1">Diagnosis Definitif</label>
                <input 
                  type="text" 
                  placeholder="Ketik patologi spesifik (mis: Ganoderma stadium awal)" 
                  value={expertDiagnosis}
                  onChange={e => setExpertDiagnosis(e.target.value)}
                  className="w-full bg-card border border-border rounded-xl px-4 py-3.5 text-sm text-foreground focus:ring-2 ring-primary outline-none font-bold placeholder:font-normal placeholder:text-muted-foreground"
                />
              </div>

              {/* Gejala Fisik */}
              <div className="flex flex-col gap-2">
                <label className="text-[11px] font-bold text-muted-foreground uppercase tracking-widest px-1">Gejala Fisik Teramati</label>
                <textarea 
                  rows={3}
                  value={expertSymptoms}
                  onChange={e => setExpertSymptoms(e.target.value)}
                  className="w-full bg-card border border-border rounded-xl px-4 py-3 text-sm text-foreground focus:ring-2 ring-primary outline-none resize-none placeholder:text-muted-foreground leading-relaxed"
                  placeholder="Deskripsikan dengan detail. Cth: Daun tombak menumpuk >3, pangkal membusuk dan ditemukan basidiokarp 5cm."
                />
              </div>

              {/* Metrik */}
              <div className="grid grid-cols-2 gap-4">
                <div className="flex flex-col gap-2">
                  <label className="text-[11px] font-bold text-muted-foreground uppercase tracking-widest px-1">Keparahan</label>
                  <select 
                    value={expertSeverity}
                    onChange={e => setExpertSeverity(e.target.value)}
                    className="w-full bg-card border border-border rounded-xl px-4 py-3.5 text-sm font-medium text-foreground focus:ring-2 ring-primary outline-none appearance-none"
                  >
                    <option value="">Pilih...</option>
                    <option value="Rendah">Rendah (Aman)</option>
                    <option value="Sedang">Sedang (Perlu Pantau)</option>
                    <option value="Tinggi">Tinggi (Aksi Segera)</option>
                    <option value="Kritis">Kritis (Isolasi)</option>
                  </select>
                </div>
                <div className="flex flex-col gap-2">
                  <label className="text-[11px] font-bold text-muted-foreground uppercase tracking-widest px-1">Estimasi Objek</label>
                  <input 
                    type="text" 
                    value={expertObjects}
                    onChange={e => setExpertObjects(e.target.value)}
                    placeholder="Cth: 12 Pokok" 
                    className="w-full bg-card border border-border rounded-xl px-4 py-3.5 text-sm text-foreground focus:ring-2 ring-primary outline-none placeholder:text-muted-foreground"
                  />
                </div>
              </div>

              {/* Rekomendasi Ahli */}
              <div className="flex flex-col gap-2">
                <label className="text-[11px] font-bold text-muted-foreground uppercase tracking-widest px-1">Rekomendasi Agronomis / Mitigasi</label>
                <textarea 
                  rows={3}
                  value={expertNotes}
                  onChange={e => setExpertNotes(e.target.value)}
                  className="w-full bg-card border border-border rounded-xl px-4 py-3 text-sm text-foreground focus:ring-2 ring-primary outline-none resize-none font-medium placeholder:font-normal placeholder:text-muted-foreground leading-relaxed"
                  placeholder="Instruksi spesifik pengamanan blok / tindak lanjut asisten..."
                />
              </div>

            </div>
          )}

        </div>
      </form>

      {/* Floating Action Button for Submit */}
      <div className="fixed bottom-0 left-0 right-0 p-4 bg-background/80 backdrop-blur-xl border-t border-border z-50">
        <button 
          onClick={handleSubmit}
          disabled={isSubmitting}
          className="flex items-center justify-center gap-2 w-full py-4 bg-foreground text-background font-bold text-[15px] rounded-xl active:scale-[0.98] transition-all disabled:opacity-70"
        >
          {isSubmitting ? (
            <div className="w-5 h-5 border-2 border-background/30 border-t-background rounded-full animate-spin" />
          ) : (
            <><Send size={18} /> Kirim Payload Verifikasi ({tier})</>
          )}
        </button>
      </div>
    </main>
  )
}
