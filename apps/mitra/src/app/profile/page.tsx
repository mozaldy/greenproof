import Link from 'next/link'
import { Wallet, Gift, ArrowUpRight, History, Settings, BadgeAlert, Coins, CircleCheck, Medal } from 'lucide-react'

// Dummy Data
const MOCK_HISTORY = [
  { id: 'TX-9921', task: 'VRD-008 (Investigasi Kematian)', date: 'Hari ini, 09:30', amount: '+150 Poin', status: 'DITERIMA' },
  { id: 'TX-9920', task: 'Review Harian Standar', date: 'Kemarin, 16:45', amount: '+40 Poin', status: 'DITERIMA' },
  { id: 'TX-9915', task: 'VRD-004 (Deteksi Ganoderma)', date: '21 Mar 2026', amount: '+200 Poin', status: 'DITERIMA' },
  { id: 'WD-0102', task: 'Penukaran Reward Internal', date: '19 Mar 2026', amount: '-500 Poin', status: 'DIPROSES' },
]

export default function ProfilePage() {
  return (
    <main className="flex flex-col min-h-screen bg-background pb-32">
      {/* Settings Header */}
      <header className="px-6 pt-6 pb-2 flex justify-between items-center">
        <h1 className="text-xl font-bold">Profil Mitra</h1>
        <button className="w-10 h-10 rounded-full bg-secondary flex items-center justify-center text-foreground hover:bg-secondary/80 outline-none">
          <Settings size={20} />
        </button>
      </header>

      <div className="p-6 flex flex-col gap-6">

        {/* Profile Card */}
        <div className="bg-card border border-border rounded-3xl p-6 shadow-sm flex flex-col items-center text-center relative overflow-hidden">
          <div className="absolute top-0 right-0 p-4">
             <div className="bg-primary/10 text-primary border border-primary/20 text-[10px] font-bold px-2 py-1 rounded uppercase tracking-wider flex items-center gap-1">
               <CircleCheck size={12} /> Pegawai Internal
             </div>
          </div>
          <div className="w-24 h-24 rounded-full border-4 border-background shadow-[0_0_0_2px_var(--primary)] overflow-hidden mb-4 mt-2">
            <img src="https://picsum.photos/seed/agus/200/200" alt="Agus Mulyono" className="w-full h-full object-cover" />
          </div>
          <h2 className="text-2xl font-bold">Agus Mulyono</h2>
          <p className="text-muted-foreground text-sm mb-4">Staff Agronomi</p>
          
          <div className="w-full flex justify-around border-t border-border pt-4 mt-2">
            <div>
              <div className="text-[10px] text-muted-foreground uppercase font-bold tracking-wider mb-1">Total Laporan</div>
              <div className="text-xl font-mono font-bold">142</div>
            </div>
            <div className="w-px bg-border" />
            <div>
              <div className="text-[10px] text-muted-foreground uppercase font-bold tracking-wider mb-1">Akurasi Validasi</div>
              <div className="text-xl font-mono font-bold text-primary">96%</div>
            </div>
          </div>
        </div>

        {/* Closed-Loop Points Card */}
        <div className="rounded-3xl p-6 relative overflow-hidden text-white shadow-xl isolate">
           <div className="absolute inset-0 bg-gradient-to-br from-emerald-600 to-emerald-950 -z-10" />
           {/* Abstract pattern */}
           <div className="absolute -top-10 -right-10 w-40 h-40 bg-white/10 rounded-full blur-2xl -z-10 pointer-events-none" />
           
           <div className="flex justify-between items-start mb-6">
             <div className="flex items-center gap-2 bg-black/20 backdrop-blur px-3 py-1.5 rounded-full border border-white/10">
               <Medal size={16} className="text-emerald-300" />
               <span className="text-xs font-bold tracking-widest uppercase">Poin Internal</span>
             </div>
           </div>

           <div className="mb-2 text-sm text-emerald-100 font-medium tracking-wide">Saldo Reward Kinerja</div>
           <div className="text-4xl font-black font-mono tracking-tight flex items-baseline gap-2 mb-6">
             2,450 <span className="text-lg text-emerald-300 font-sans">Poin</span>
           </div>

           <div className="flex gap-3">
             <button className="flex-1 bg-white text-emerald-900 py-3 rounded-xl font-bold text-sm shadow-[0_4px_15px_rgba(255,255,255,0.2)] active:scale-95 transition-transform flex items-center justify-center gap-2">
               <Gift size={18} /> Penukaran Poin
             </button>
           </div>
        </div>

        {/* Transaction History Mock */}
        <div className="flex flex-col gap-4 mt-2">
          <div className="flex items-center justify-between">
            <h3 className="font-bold text-lg flex items-center gap-2">
              <History size={18} className="text-muted-foreground" /> Riwayat Keuangan
            </h3>
            <button className="text-xs font-bold text-primary uppercase">Lihat Semua</button>
          </div>

          <div className="bg-card border border-border rounded-2xl overflow-hidden shadow-sm">
            {MOCK_HISTORY.map((tx, idx) => (
              <div key={tx.id} className={`p-4 flex items-center justify-between ${idx !== MOCK_HISTORY.length - 1 ? 'border-b border-border/50' : ''}`}>
                <div className="flex items-center gap-3">
                  <div className={`w-10 h-10 rounded-full flex items-center justify-center ${
                    tx.amount.startsWith('+') ? 'bg-primary/10 text-primary' : 'bg-amber-500/10 text-amber-500'
                  }`}>
                    {tx.amount.startsWith('+') ? <Coins size={18} /> : <Gift size={18} />}
                  </div>
                  <div>
                    <div className="font-bold text-sm">{tx.task}</div>
                    <div className="text-[10px] text-muted-foreground">{tx.date} • {tx.id}</div>
                  </div>
                </div>
                <div className="text-right">
                  <div className={`font-mono font-bold ${tx.amount.startsWith('+') ? 'text-primary' : 'text-foreground'}`}>
                    {tx.amount}
                  </div>
                  <div className="text-[10px] font-bold text-muted-foreground uppercase">{tx.status}</div>
                </div>
              </div>
            ))}
          </div>
        </div>

      </div>
    </main>
  )
}
