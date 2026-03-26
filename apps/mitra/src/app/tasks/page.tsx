import Link from 'next/link'
import { MapPin, Search, Filter, AlertTriangle, ArrowRight, CheckCircle2, Navigation } from 'lucide-react'

const MOCK_TASKS = [
  { id: 'VRD-008', title: 'Investigasi Kematian Tajuk Merata', block: 'KB-A1 (Batas Desa)', distance: '120m', reward: '150 Poin', urgent: true, status: 'OPEN' },
  { id: 'VRD-009', title: 'Verifikasi Bercak Daun PN', block: 'KB-E1 Nursery', distance: '1.2km', reward: '50 Poin', urgent: false, status: 'OPEN' },
  { id: 'VRD-010', title: 'Genangan Air Drainase', block: 'KT-B1', distance: '2.5km', reward: '80 Poin', urgent: false, status: 'OPEN' },
  { id: 'VRD-003', title: 'Deteksi Ganoderma Standar', block: 'KB-C3', distance: '3.1km', reward: '200 Poin', urgent: false, status: 'COMPLETED' },
]

export default function TasksPage() {
  return (
    <main className="flex flex-col min-h-screen bg-background">
      {/* Header & Map Mock Component */}
      <div className="relative h-64 bg-card shrink-0 shadow-md border-b border-border">
        {/* Mock Map Background */}
        <div className="absolute inset-0 opacity-40 bg-[url('/images/map-bg.jpg')] bg-cover bg-center" />
        <div className="absolute inset-0 bg-gradient-to-t from-background via-background/60 to-transparent" />
        
        {/* Floating User Location Pin */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2">
           <div className="relative">
             <div className="absolute -inset-4 bg-primary/20 rounded-full animate-ping" />
             <div className="w-6 h-6 bg-primary rounded-full border-2 border-primary-foreground shadow-[0_0_15px_var(--primary)] flex justify-center items-center">
               <div className="w-2 h-2 bg-primary-foreground rounded-full" />
             </div>
           </div>
        </div>

        {/* Floating Anomaly Pin */}
        <div className="absolute top-1/3 left-1/3 -translate-x-1/2 -translate-y-1/2">
           <div className="w-8 h-8 rounded-full bg-red-500/10 flex items-center justify-center border border-red-500/50 shadow-sm animate-bounce">
             <MapPin size={16} className="text-red-500" />
           </div>
        </div>

        {/* Top Floating App Bar */}
        <div className="absolute top-0 left-0 right-0 p-6 z-10 flex justify-between items-center">
          <div className="bg-background/80 backdrop-blur-md px-4 py-2 rounded-full border border-border flex items-center gap-2 shadow-sm text-sm font-bold">
            <Navigation size={14} className="text-primary" /> Posisi GPS Aktif
          </div>
          <button className="w-10 h-10 rounded-full bg-background/80 backdrop-blur-md border border-border flex items-center justify-center text-foreground hover:bg-secondary transition-colors">
            <Filter size={18} />
          </button>
        </div>

        {/* Bottom Search Bar Overlaid on Map */}
        <div className="absolute bottom-4 left-6 right-6">
          <div className="bg-background/90 backdrop-blur-md border border-border rounded-xl px-4 py-3 flex items-center gap-3 shadow-lg">
            <Search size={18} className="text-muted-foreground" />
            <input 
              type="text" 
              placeholder="Cari blok atau jenis tugas..." 
              className="bg-transparent border-none outline-none text-sm text-foreground w-full font-medium"
            />
          </div>
        </div>
      </div>

      {/* Task List Content */}
      <div className="p-6 flex-1 flex flex-col gap-4 relative z-10 -mt-2">
        <div className="flex justify-between items-end mb-2">
          <h2 className="text-lg font-bold">Tugas di Sekitarmu</h2>
          <span className="text-xs text-muted-foreground">Radius 5km</span>
        </div>

        {MOCK_TASKS.map(task => (
           <Link 
             href={`/tasks/${task.id}`} 
             key={task.id} 
             className={`block p-4 rounded-2xl border transition-all active:scale-[0.98] ${
               task.status === 'COMPLETED' 
                 ? 'bg-secondary/30 border-border opacity-70' 
                 : task.urgent 
                   ? 'bg-red-500/5 border-red-500/30 relative overflow-hidden'
                   : 'bg-card border-border hover:bg-secondary/50'
             }`}
           >
             {task.urgent && <div className="absolute top-0 left-0 w-1 h-full bg-red-500" />}
             
             <div className="flex justify-between items-start mb-3">
               <div className="flex items-center gap-2">
                 <span className="font-mono text-[10px] bg-secondary px-2 py-0.5 rounded text-muted-foreground font-bold border border-border">
                   {task.id}
                 </span>
                 {task.urgent && (
                   <span className="text-[10px] font-bold text-red-500 bg-red-500/10 px-2 py-0.5 rounded border border-red-500/20 flex items-center gap-1 uppercase">
                     <AlertTriangle size={10} /> Urgent (Red Flag)
                   </span>
                 )}
               </div>
               <div className="text-xs font-mono font-bold text-primary flex items-center gap-1">
                 {task.reward}
               </div>
             </div>

             <h3 className={`font-bold text-sm mb-1 line-clamp-1 ${task.status === 'COMPLETED' ? 'text-muted-foreground' : 'text-foreground'}`}>
               {task.title}
             </h3>
             
             <div className="flex items-center gap-4 mt-3 pt-3 border-t border-border/50 text-xs text-muted-foreground font-medium">
               <div className="flex items-center gap-1.5 w-1/2">
                 <MapPin size={14} /> {task.block}
               </div>
               <div className="flex items-center justify-between w-1/2 pl-4 border-l border-border/50">
                 <span>Jarak: <strong className="text-foreground">{task.distance}</strong></span>
                 {task.status === 'COMPLETED' ? (
                   <CheckCircle2 size={16} className="text-[#10b981]" />
                 ) : (
                   <ArrowRight size={16} className="text-primary" />
                 )}
               </div>
             </div>
           </Link>
        ))}
      </div>
    </main>
  )
}
