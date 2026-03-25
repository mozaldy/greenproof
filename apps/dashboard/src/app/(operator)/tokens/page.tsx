'use client'

import { useState } from 'react'
import { Coins, Gift, Lock, ExternalLink, ArrowUpRight, Database, Clock, CheckCircle2, TrendingUp, KeyRound, ShieldCheck, ArrowRightLeft } from 'lucide-react'
import { PageHeader } from '@/components/ui/page-header'
import { treasuryData } from '@/lib/treasury-data'

type FilterTab = 'Semua' | 'Alokasi Sistem' | 'Berhasil Dicairkan' | 'Menunggu Verifikasi'

export default function TokensPage() {
  const [activeTab, setActiveTab] = useState<FilterTab>('Semua')
  const [hoveredDay, setHoveredDay] = useState<number | null>(null)
  
  const { summary, dailyHistory, recentTransactions, token } = treasuryData

  const filteredTx = recentTransactions.filter(tx => {
    if (activeTab === 'Semua') return true
    if (activeTab === 'Berhasil Dicairkan') return tx.type === 'distributed'
    if (activeTab === 'Menunggu Verifikasi') return tx.type === 'locked' || tx.status === 'pending_verdict'
    if (activeTab === 'Alokasi Sistem') return tx.type === 'mint' || tx.type === 'locked' 
    return true
  })

  const CHART_WIDTH = 1000;
  const CHART_HEIGHT = 220;
  const maxVal = Math.max(...dailyHistory.map(d => d.distributed + d.locked)) || 1;

  const createAreaPath = (key: 'distributed' | 'locked') => {
    if (dailyHistory.length === 0) return '';
    const points = dailyHistory.map((d, i) => {
      const x = (i / (dailyHistory.length - 1)) * CHART_WIDTH;
      const y = CHART_HEIGHT - (d[key] / maxVal) * CHART_HEIGHT;
      return `${x},${y}`;
    });
    return `M 0,${CHART_HEIGHT} L ${points.join(' L ')} L ${CHART_WIDTH},${CHART_HEIGHT} Z`;
  };

  const createLinePath = (key: 'distributed' | 'locked') => {
    if (dailyHistory.length === 0) return '';
    return 'M ' + dailyHistory.map((d, i) => {
      const x = (i / (dailyHistory.length - 1)) * CHART_WIDTH;
      const y = CHART_HEIGHT - (d[key] / maxVal) * CHART_HEIGHT;
      return `${x},${y}`;
    }).join(' L ');
  };

  return (
    <div className="flex flex-col min-h-screen bg-[var(--bg-base)] pb-20">
      <PageHeader 
        title="Sistem Aliran Reward" 
        subtitle="Manajemen anggaran, transparansi distribusi, dan kendali smart contract perusahaan Anda." 
        icon={Coins} 
      />

      <div className="p-6 sm:p-8 flex flex-col gap-8 max-w-[1400px] mx-auto w-full">
        
        {/* ── PANEL KEDAULATAN PERUSAHAAN ── */}
        <div className="bg-gradient-to-r from-blue-900/30 to-emerald-900/10 border border-blue-500/20 rounded-2xl p-5 sm:p-6 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-6 relative overflow-hidden">
          <div className="absolute top-0 right-1/4 w-64 h-64 bg-blue-500/10 blur-[80px] rounded-full pointer-events-none" />
          
          <div className="flex items-center gap-5 relative z-10">
            <div className="w-14 h-14 rounded-full bg-blue-500/20 border border-blue-500/30 flex items-center justify-center text-blue-400 shrink-0">
              <ShieldCheck size={28} />
            </div>
            <div>
              <div className="text-[10px] font-bold text-blue-400 uppercase tracking-widest mb-1">Identitas Smart Contract</div>
              <h2 className="font-sans text-xl font-bold text-[var(--text-primary)] flex items-center gap-2">
                Token {token.symbol}
                <span className="px-2 py-0.5 rounded text-[10px] font-mono bg-black/30 border border-white/10 text-slate-300">
                  {token.contractAddress}
                </span>
              </h2>
              <p className="text-[12px] text-[var(--text-secondary)] mt-1 font-medium">
                Kontrak eksklusif milik perusahaan. Terpisah sepenuhnya dari ekosistem lain.
              </p>
            </div>
          </div>

          <div className="flex items-center gap-4 relative z-10 bg-black/20 p-3.5 rounded-xl border border-white/5">
            <div className="p-2.5 bg-amber-500/20 rounded-lg text-amber-500">
              <KeyRound size={20} />
            </div>
            <div>
              <div className="text-[10px] font-bold text-amber-500/80 uppercase tracking-widest mb-0.5">Status Hak Akses</div>
              <div className="text-sm font-bold text-[var(--text-primary)]">Dompet Memegang <span className="font-mono text-amber-400">TreasuryCap</span></div>
              <div className="text-[11px] text-[var(--text-muted)] mt-0.5">Hanya entitas ini yang berhak mencetak alokasi poin.</div>
            </div>
          </div>
        </div>

        {/* ── 4 Kartu Statistik (Sesuai Konsep Baru) ── */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <StatCard 
            title="Total Alokasi Poin" 
            value={summary.totalMinted} 
            icon={Database} 
            colorClass="text-blue-500" 
            bgClass="bg-blue-500/10 border-blue-500/20" 
            desc="Keseluruhan suplai poin yang telah disiapkan oleh sistem." 
          />
          <StatCard 
            title="Berhasil Dicairkan" 
            value={summary.distributed} 
            icon={Gift} 
            colorClass="text-emerald-500" 
            bgClass="bg-emerald-500/10 border-emerald-500/20" 
            desc={`Poin sah masuk ke dompet ${summary.distributedMitraCount} mitra.`} 
          />
          <StatCard 
            title="Menunggu Verifikasi" 
            value={summary.lockedInEscrow} 
            icon={ShieldCheck} 
            colorClass="text-amber-500" 
            bgClass="bg-amber-500/10 border-amber-500/20" 
            desc={`Diamankan dari ${summary.escrowTaskCount} tugas lapangan.`} 
          />
          <StatCard 
            title="Rata-rata Pencairan" 
            value={summary.avgDailyBurn} 
            icon={ArrowUpRight} 
            colorClass="text-purple-500" 
            bgClass="bg-purple-500/10 border-purple-500/20" 
            desc="Poin cair per hari selama bulan ini." 
          />
        </div>

        {/* ── Grafik Area Mulus ── */}
        <div className="rounded-2xl border border-[var(--border)] bg-[var(--bg-surface)] p-6 sm:p-8 shadow-sm">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-8 gap-4">
            <div>
              <h3 className="font-sans text-base font-bold text-[var(--text-primary)]">Tren Pencairan Poin (30 Hari Terakhir)</h3>
              <p className="text-xs text-[var(--text-muted)] mt-1 font-medium">Bandingkan jumlah poin yang berhasil dicairkan vs tertahan oleh sistem.</p>
            </div>
            <div className="flex items-center gap-4 text-[10px] font-bold tracking-widest uppercase bg-[var(--bg-elevated)] px-4 py-2 rounded-full border border-[var(--border)]">
              <div className="flex items-center gap-2 text-emerald-500"><span className="w-2.5 h-2.5 rounded-full bg-emerald-500 shadow-[0_0_8px_#10b981]"></span> Dicairkan</div>
              <div className="flex items-center gap-2 text-amber-500"><span className="w-2.5 h-2.5 rounded-full bg-amber-500 shadow-[0_0_8px_#f59e0b]"></span> Ditahan</div>
            </div>
          </div>
          
          <div className="w-full relative group cursor-crosshair">
            <svg viewBox={`0 0 ${CHART_WIDTH} ${CHART_HEIGHT}`} className="w-full h-[240px] overflow-visible" preserveAspectRatio="none">
              <defs>
                <linearGradient id="gradDistributed" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#10b981" stopOpacity="0.25" />
                  <stop offset="100%" stopColor="#10b981" stopOpacity="0.0" />
                </linearGradient>
                <linearGradient id="gradLocked" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#f59e0b" stopOpacity="0.2" />
                  <stop offset="100%" stopColor="#f59e0b" stopOpacity="0.0" />
                </linearGradient>
              </defs>
              <path d={createAreaPath('distributed')} fill="url(#gradDistributed)" className="transition-all duration-300" />
              <path d={createLinePath('distributed')} fill="none" stroke="#10b981" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" className="transition-all duration-300 drop-shadow-[0_4px_6px_rgba(16,185,129,0.3)]" />
              <path d={createAreaPath('locked')} fill="url(#gradLocked)" className="transition-all duration-300" />
              <path d={createLinePath('locked')} fill="none" stroke="#f59e0b" strokeWidth="2" strokeDasharray="6 4" strokeLinecap="round" strokeLinejoin="round" className="transition-all duration-300" />
            </svg>

            <div className="absolute inset-0 flex">
              {dailyHistory.map((day, idx) => (
                <div 
                  key={idx} 
                  className="flex-1 h-full z-10"
                  onMouseEnter={() => setHoveredDay(idx)}
                  onMouseLeave={() => setHoveredDay(null)}
                />
              ))}
            </div>

            {hoveredDay !== null && (
              <div className="absolute top-0 w-px h-full bg-[var(--border-strong)] z-0 pointer-events-none" style={{ left: `${(hoveredDay / (dailyHistory.length - 1)) * 100}%` }}>
                <div className="absolute top-0 -translate-x-1/2 -translate-y-[110%] bg-[var(--bg-surface)] border border-[var(--border-strong)] p-3 rounded-xl shadow-xl w-max pointer-events-none z-20">
                  <div className="text-[10px] font-bold text-[var(--text-muted)] border-b border-[var(--border)] pb-1.5 mb-2 text-center uppercase tracking-widest">
                    {dailyHistory[hoveredDay].date}
                  </div>
                  <div className="flex gap-5 px-1">
                    <div className="flex flex-col items-center">
                      <span className="font-mono text-[15px] font-black text-emerald-500">{dailyHistory[hoveredDay].distributed}</span>
                      <span className="text-[9px] uppercase tracking-wider text-[var(--text-muted)]">Dicairkan</span>
                    </div>
                    <div className="w-px bg-[var(--border)]" />
                    <div className="flex flex-col items-center">
                      <span className="font-mono text-[15px] font-black text-amber-500">{dailyHistory[hoveredDay].locked}</span>
                      <span className="text-[9px] uppercase tracking-wider text-[var(--text-muted)]">Ditahan</span>
                    </div>
                  </div>
                </div>
                <div className="absolute -translate-x-1/2 w-3 h-3 rounded-full bg-emerald-500 border-2 border-[var(--bg-base)] shadow-[0_0_10px_#10b981]" style={{ top: `calc(100% - ${(dailyHistory[hoveredDay].distributed / maxVal) * 100}%)` }} />
                <div className="absolute -translate-x-1/2 w-3 h-3 rounded-full bg-amber-500 border-2 border-[var(--bg-base)] shadow-[0_0_10px_#f59e0b]" style={{ top: `calc(100% - ${(dailyHistory[hoveredDay].locked / maxVal) * 100}%)` }} />
              </div>
            )}
          </div>
        </div>

        {/* ── Tabel Transaksi Sederhana ── */}
        <div className="flex flex-col gap-4">
          <h3 className="font-sans text-sm font-bold text-[var(--text-primary)] pl-1">Riwayat Aliran Data Transaksi</h3>
          
          <div className="flex items-center gap-2 bg-[var(--bg-surface)] p-1.5 rounded-xl border border-[var(--border)] w-fit shadow-sm">
            {(['Semua', 'Alokasi Sistem', 'Berhasil Dicairkan', 'Menunggu Verifikasi'] as FilterTab[]).map(tab => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`px-5 py-2.5 rounded-lg text-[11px] font-bold tracking-wide uppercase transition-all cursor-pointer ${
                  activeTab === tab 
                    ? 'bg-[var(--bg-elevated)] text-[var(--text-primary)] shadow-sm border border-[var(--border-strong)]' 
                    : 'bg-transparent text-[var(--text-muted)] border border-transparent hover:text-[var(--text-secondary)]'
                }`}
              >
                {tab}
              </button>
            ))}
          </div>

          <div className="rounded-2xl border border-[var(--border)] bg-[var(--bg-surface)] shadow-sm overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="bg-[var(--bg-elevated)] border-b border-[var(--border)]">
                    <th className="p-4 text-[10px] font-bold text-[var(--text-muted)] uppercase tracking-widest whitespace-nowrap">Waktu</th>
                    <th className="p-4 text-[10px] font-bold text-[var(--text-muted)] uppercase tracking-widest whitespace-nowrap">Aksi Sistem</th>
                    <th className="p-4 text-[10px] font-bold text-[var(--text-muted)] uppercase tracking-widest whitespace-nowrap">Aliran Poin</th>
                    <th className="p-4 text-[10px] font-bold text-[var(--text-muted)] uppercase tracking-widest whitespace-nowrap">Kaitan Tugas</th>
                    <th className="p-4 text-[10px] font-bold text-[var(--text-muted)] uppercase tracking-widest whitespace-nowrap">Transaksi Sistem</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[var(--border-subtle)]">
                  {filteredTx.map(tx => {
                    const date = new Date(tx.timestamp).toLocaleString('id-ID', { day: 'numeric', month: 'long', hour: '2-digit', minute: '2-digit' })
                    const isLocked = tx.type === 'locked'
                    
                    const source = isLocked ? "Dompet Perusahaan" : "Sistem Pengaman";
                    const target = isLocked ? "Sistem Pengaman" : (tx.recipient?.name || "Mitra");
                    const actionBadge = isLocked ? "DIALOKASIKAN & DITAHAN" : "BERHASIL DICAIRKAN";

                    return (
                      <tr key={tx.id} className="hover:bg-[var(--bg-hover)] transition-colors group">
                        <td className="p-4 text-[12px] text-[var(--text-secondary)] font-medium whitespace-nowrap">
                          {date} WIB
                        </td>
                        <td className="p-4">
                          <div className={`inline-flex items-center gap-1.5 px-2.5 py-1.5 rounded-md text-[10px] font-bold uppercase tracking-wider border ${
                            isLocked ? 'bg-amber-500/10 text-amber-500 border-amber-500/20' : 
                            'bg-emerald-500/10 text-emerald-500 border-emerald-500/20'
                          }`}>
                            {isLocked ? <Lock size={12} strokeWidth={2.5}/> : <ArrowRightLeft size={12} strokeWidth={2.5} />}
                            {actionBadge}
                          </div>
                        </td>
                        <td className="p-4">
                          <div className={`font-mono text-[14px] font-bold mb-1 ${isLocked ? 'text-amber-500' : 'text-[var(--text-primary)]'}`}>
                            {tx.amount} Poin
                          </div>
                          <div className="flex items-center gap-1 text-[10px] font-medium text-[var(--text-muted)]">
                            <span>{source}</span>
                            <ArrowRightLeft size={8} className="opacity-50" />
                            <span className={isLocked ? "text-amber-500/70" : "text-[var(--text-secondary)]"}>{target}</span>
                          </div>
                        </td>
                        <td className="p-4">
                          <div className="font-mono text-[11px] font-bold text-[var(--text-secondary)] bg-[var(--bg-elevated)] px-2.5 py-1 rounded-md border border-[var(--border)] w-fit">
                            {tx.taskId}
                          </div>
                        </td>
                        <td className="p-4">
                          <div className="flex items-center gap-1.5 text-[11px] text-blue-500 font-mono cursor-pointer hover:underline opacity-80 group-hover:opacity-100 transition-opacity">
                            {tx.txHash.substring(0, 8)}...{tx.txHash.substring(tx.txHash.length - 6)} <ExternalLink size={12} />
                          </div>
                        </td>
                      </tr>
                    )
                  })}
                  {filteredTx.length === 0 && (
                    <tr>
                      <td colSpan={5} className="p-8 text-center text-sm text-[var(--text-muted)] font-medium">
                        Tidak ada riwayat untuk kategori ini.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>

      </div>
    </div>
  )
}

// Mini Component Stat Card
function StatCard({ title, value, icon: Icon, colorClass, bgClass, desc }: { title: string, value: number, icon: any, colorClass: string, bgClass: string, desc: string }) {
  return (
    <div className={`rounded-2xl p-5 border shadow-sm relative overflow-hidden transition-all hover:-translate-y-1 ${bgClass}`}>
      <div className="flex justify-between items-start mb-3">
        <div className="flex items-center gap-2">
          <Icon size={16} className={colorClass} />
          <h4 className={`text-[10px] font-bold uppercase tracking-widest ${colorClass}`}>{title}</h4>
        </div>
      </div>
      <div className="mt-2">
        <div className={`font-mono text-3xl font-black mb-2 tracking-tight drop-shadow-sm ${colorClass}`}>
          {value.toLocaleString()}
        </div>
        <p className="text-[11px] text-[var(--text-secondary)] font-medium leading-snug pr-2">{desc}</p>
      </div>
      <div className={`absolute -bottom-6 -right-6 opacity-10 pointer-events-none ${colorClass}`}>
        <Icon size={120} />
      </div>
    </div>
  )
}