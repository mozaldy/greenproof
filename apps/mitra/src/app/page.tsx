import Link from 'next/link'
import { Map, Zap, Star, Coins, AlertOctagon, ArrowRight, ShieldCheck, MapPin } from 'lucide-react'

export default function Home() {
  return (
    <main className="flex min-h-screen flex-col bg-background relative">
      {/* User Header */}
      <div className="bg-card px-6 py-8 rounded-b-3xl border-b border-border shadow-lg relative overflow-hidden">
        {/* Decorative Blob */}
        <div className="absolute -top-12 -right-12 w-32 h-32 bg-primary/20 rounded-full blur-3xl pointer-events-none" />
        
        <div className="flex items-center gap-4 relative z-10">
          <div className="w-14 h-14 rounded-full border-2 border-primary overflow-hidden shrink-0 shadow-[0_0_15px_rgba(16,185,129,0.3)]">
            <img src="https://picsum.photos/seed/agus/150/150" alt="Agus Mulyono" className="w-full h-full object-cover" />
          </div>
          <div className="flex-1">
            <h1 className="text-xl font-bold text-foreground leading-tight">Agus Mulyono</h1>
            <div className="flex items-center gap-2 mt-1">
              <span className="px-2 py-0.5 rounded text-[10px] uppercase font-bold tracking-wider bg-primary/10 text-primary border border-primary/20">
                Staff Agronomi
              </span>
              <span className="text-[11px] font-mono text-muted-foreground">ID: #GM-8291</span>
            </div>
          </div>
        </div>

        {/* Stats Row */}
        <div className="mt-8 relative z-10">
          <div className="bg-background/50 backdrop-blur border border-border rounded-2xl p-5 shadow-inner flex items-center justify-between">
            <div className="text-xs uppercase font-bold text-muted-foreground flex items-center gap-1.5 mb-1">
              <Coins size={14} className="text-amber-500" /> Total Poin Kinerja
            </div>
            <div className="text-2xl font-mono font-bold text-foreground">
              2,450 <span className="text-sm font-sans text-muted-foreground">Poin</span>
            </div>
          </div>
        </div>
      </div>

      <div className="p-6 flex flex-col gap-6">


        {/* Quick Assignment Alert */}
        <div className="relative overflow-hidden rounded-2xl">
          <div className="absolute inset-0 bg-gradient-to-br from-red-500/10 to-transparent" />
          <div className="bg-card border border-red-500/30 rounded-2xl p-5 relative z-10 shadow-[0_4px_20px_rgba(239,68,68,0.05)]">
            <div className="flex items-start justify-between mb-4">
              <div className="flex items-center gap-2.5">
                <div className="w-10 h-10 rounded-full bg-red-500/10 flex items-center justify-center text-red-500">
                  <AlertOctagon size={20} />
                </div>
                <div>
                  <h3 className="font-bold text-red-500">Anomali Terdeteksi</h3>
                  <p className="text-[11px] text-muted-foreground font-medium">Berdasarkan patroli Drone AI pagi ini.</p>
                </div>
              </div>
              <span className="bg-red-500/10 text-red-500 border border-red-500/20 px-2 py-1 rounded text-[10px] font-bold uppercase animate-pulse">
                Urgensi Tinggi
              </span>
            </div>
            <div className="flex items-center gap-3 text-sm text-foreground mb-4 font-medium border-l-2 border-red-500/50 pl-3 py-1">
              <MapPin size={16} className="text-muted-foreground" />
              Blok KB-A1 (Batas Desa) - Areal Kapuas Barat
            </div>
            <p className="text-xs text-muted-foreground mb-5 leading-relaxed">
              Drone mendeteksi kematian tajuk merata pada 12 pokok. Membutuhkan verifikasi lapangan segera untuk konfirmasi penyakit atau sabotase.
            </p>
            <Link 
              href="/tasks/VRD-008" 
              className="flex items-center justify-center gap-2 w-full py-3.5 bg-primary text-primary-foreground font-bold rounded-xl active:scale-[0.98] transition-all shadow-[0_4px_14px_rgba(16,185,129,0.3)]"
            >
              Lihat Detail Tugas <ArrowRight size={16} />
            </Link>
          </div>
        </div>

        {/* Nearby Map Button */}
        <Link 
          href="/tasks" 
          className="flex items-center justify-between p-5 bg-card border border-border rounded-2xl active:bg-secondary/50 transition-colors group"
        >
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-secondary flex items-center justify-center text-primary group-hover:scale-110 transition-transform">
              <Map size={20} />
            </div>
            <div>
              <div className="font-bold text-sm">Peta Geospasial</div>
              <div className="text-[11px] text-muted-foreground">Lihat 8 tugas lain di sekitarmu</div>
            </div>
          </div>
          <Zap size={18} className="text-muted-foreground" />
        </Link>
      </div>
    </main>
  )
}
