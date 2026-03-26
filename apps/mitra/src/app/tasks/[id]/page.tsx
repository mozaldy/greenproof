import Link from 'next/link'
import { ChevronLeft, MapPin, Cpu, Clock, AlertTriangle, Route } from 'lucide-react'

// Dummy data fetching
const getTaskDetail = (id: string) => ({
  id,
  title: 'Investigasi Kematian Tajuk Merata',
  block: 'KB-A1 (Batas Desa)',
  estate: 'Kapuas Barat',
  distance: '120m',
  reward: '150 Poin',
  urgent: true,
  dronePred: 'Lightning Strike / BSR Lanjut (Conf: 45%)',
  droneDesc: 'Drone terpantau mendeteksi 12 pokok berurutan mati mendadak atau tajuk sengklek kaku. Dibutuhkan konfirmasi manusia di lapangan untuk menentukan penyebab sebenarnya.',
  timeSince: '2 jam yang lalu',
  coords: '-2.91238, 114.39201'
})

export default function TaskDetailPage({ params }: { params: { id: string } }) {
  const task = getTaskDetail(params.id)

  return (
    <main className="flex flex-col min-h-screen bg-background">
      {/* Header Navigation */}
      <header className="px-4 py-4 bg-card border-b border-border flex items-center justify-between sticky top-0 z-50 shadow-sm">
        <Link 
          href="/tasks" 
          className="w-10 h-10 rounded-full bg-secondary flex items-center justify-center text-foreground hover:bg-secondary/80 transition-colors"
        >
          <ChevronLeft size={20} />
        </Link>
        <div className="font-bold text-sm">Detail Penugasan</div>
        <div className="w-10" /> {/* Spacer */}
      </header>

      {/* Hero Image (Drone Capture) */}
      <div className="h-64 relative bg-black shrink-0">
        <img src="/images/task-hero.jpg" alt="Pandangan Drone" className="w-full h-full object-cover opacity-80" />
        <div className="absolute inset-0 bg-gradient-to-t from-background to-transparent" />
        
        {/* Absolute floating details */}
        <div className="absolute bottom-4 left-6 right-6">
          <div className="flex gap-2 mb-2">
            <span className="font-mono text-[10px] bg-secondary px-2 py-0.5 rounded text-muted-foreground font-bold border border-border">
              {task.id}
            </span>
            {task.urgent && (
              <span className="text-[10px] font-bold text-red-500 bg-red-500/10 px-2 py-0.5 rounded border border-red-500/20 flex items-center gap-1 uppercase">
                <AlertTriangle size={10} /> Urgent (Red Flag)
              </span>
            )}
          </div>
          <h1 className="text-2xl font-bold text-foreground leading-tight drop-shadow-md">
            {task.title}
          </h1>
        </div>
      </div>

      <div className="px-6 py-6 flex-1 flex flex-col gap-6">
        
        {/* Location Box */}
        <div className="bg-card border border-border rounded-2xl p-4 shadow-sm flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div className="w-10 h-10 rounded-full bg-secondary flex items-center justify-center text-primary">
              <MapPin size={18} />
            </div>
            <div>
              <div className="font-bold text-sm">{task.block}</div>
              <div className="text-[11px] text-muted-foreground">{task.estate}</div>
            </div>
          </div>
          <button className="flex flex-col items-center gap-1 text-primary">
            <Route size={18} />
            <span className="text-[9px] font-bold uppercase tracking-wider">{task.distance}</span>
          </button>
        </div>

        {/* AI Initial Report */}
        <div className="flex flex-col gap-3">
          <h3 className="text-xs font-bold text-muted-foreground uppercase tracking-widest flex items-center gap-2">
            <Cpu size={14} /> Deteksi Awal Mesin
          </h3>
          <div className="bg-card border border-border rounded-2xl p-5 shadow-sm">
            <div className="flex justify-between items-center mb-3">
               <span className="font-mono text-sm text-foreground font-bold">{task.dronePred}</span>
               <span className="text-[11px] text-muted-foreground flex items-center gap-1"><Clock size={12} /> {task.timeSince}</span>
            </div>
            <p className="text-xs text-muted-foreground leading-relaxed">
              {task.droneDesc}
            </p>
          </div>
        </div>

        {/* Reward Box */}
        <div className="bg-primary/10 border border-primary/20 rounded-2xl p-5 shadow-sm text-center">
          <div className="text-[11px] font-bold text-primary uppercase tracking-widest mb-1">Potensi Reward Validasi</div>
          <div className="text-2xl font-mono font-black text-primary drop-shadow-[0_2px_10px_rgba(16,185,129,0.2)]">{task.reward}</div>
          <p className="text-[10px] text-muted-foreground mt-2">Dapatkan nilai penuh jika memilih mode laporan pakar forensik.</p>
        </div>

      </div>

      {/* Fixed Bottom Action Bar */}
      <div className="fixed bottom-0 left-0 right-0 p-6 bg-background/80 backdrop-blur-xl border-t border-border z-50 shadow-[0_-10px_40px_rgba(0,0,0,0.3)]">
        <Link 
          href={`/tasks/${task.id}/submit`}
          className="flex items-center justify-center gap-2 w-full py-4 bg-primary text-primary-foreground font-bold text-lg rounded-xl active:scale-[0.98] transition-all shadow-[0_4px_20px_rgba(16,185,129,0.3)]"
        >
          Mulai Verifikasi Lapangan
        </Link>
      </div>

      {/* Spacer to prevent content cut-off by sticky bottom bar */}
      <div className="h-28" />
    </main>
  )
}
