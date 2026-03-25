'use client'

import Link from 'next/link'
import { ArrowRight, Gift, Clock, CheckCircle2, ExternalLink, Coins, Activity, ShieldCheck } from 'lucide-react'
import { treasuryData } from '@/lib/treasury-data'

export function TokenTreasuryWidget() {
  const { summary, recentTransactions } = treasuryData

  return (
    <div className="rounded-2xl shadow-sm border border-[var(--border)] bg-[var(--bg-surface)] relative overflow-hidden">
      {/* Aksen Glow Halus di Pojok Kanan Atas */}
      <div className="absolute -top-32 -right-32 w-64 h-64 bg-emerald-500/10 blur-[80px] rounded-full pointer-events-none" />
      
      <div className="p-6 relative z-10">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-6 gap-4">
          <div>
            <h2 className="font-sans text-lg font-extrabold text-[var(--text-primary)] flex items-center gap-2.5">
              <Activity size={20} className="text-emerald-500" />
              Sistem Aliran Reward
            </h2>
            <p className="font-sans text-xs text-[var(--text-muted)] mt-1.5 font-medium">
              Pantau status pencairan poin insentif untuk mitra lapangan secara *real-time*.
            </p>
          </div>
          <Link href="/tokens" className="flex items-center gap-2 px-4 py-2.5 bg-[var(--bg-elevated)] hover:bg-[var(--bg-hover)] text-xs font-bold text-[var(--text-primary)] rounded-lg transition-all no-underline border border-[var(--border)] w-fit">
            Lihat Analisis Lengkap <ArrowRight size={14} />
          </Link>
        </div>

        {/* 3 Kartu Ringkasan (Dengan Konsep Bahasa Baru & Keterangan Tambahan) */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8">
          {/* Kartu 1: Total Alokasi */}
          <div className="bg-blue-500/10 border border-blue-500/20 rounded-xl p-5 flex flex-col justify-center relative overflow-hidden group">
            <div className="flex items-center gap-2 mb-1 text-blue-500 dark:text-blue-400">
              <span className="text-[10px] font-bold uppercase tracking-widest">Total Alokasi Poin</span>
            </div>
            <div className="font-mono text-3xl font-black text-blue-600 dark:text-blue-400 my-1">
              {summary.totalMinted.toLocaleString()}
            </div>
            <div className="text-[11px] text-blue-600/70 dark:text-blue-400/80 font-medium leading-snug pr-6">
              Keseluruhan suplai poin yang telah disiapkan oleh sistem perusahaan.
            </div>
            <div className="absolute -right-4 -bottom-4 opacity-10 group-hover:scale-110 transition-transform text-blue-500"><Coins size={80}/></div>
          </div>

          {/* Kartu 2: Menunggu Verifikasi */}
          <div className="bg-amber-500/10 border border-amber-500/20 rounded-xl p-5 flex flex-col justify-center relative overflow-hidden group">
            <div className="flex items-center gap-2 mb-1 text-amber-600 dark:text-amber-500">
              <span className="text-[10px] font-bold uppercase tracking-widest">Dalam Proses Verifikasi</span>
            </div>
            <div className="font-mono text-3xl font-black text-amber-600 dark:text-amber-500 my-1 flex items-baseline gap-2">
              {summary.lockedInEscrow.toLocaleString()}
            </div>
            <div className="text-[11px] text-amber-600/70 dark:text-amber-500/80 font-medium leading-snug pr-6">
              Poin dari {summary.escrowTaskCount} tugas yang diamankan sistem hingga mendapat *verdict* (Persetujuan).
            </div>
            <div className="absolute -right-4 -bottom-4 opacity-10 group-hover:scale-110 transition-transform text-amber-500"><ShieldCheck size={80}/></div>
          </div>

          {/* Kartu 3: Berhasil Dicairkan */}
          <div className="bg-emerald-500/10 border border-emerald-500/20 rounded-xl p-5 flex flex-col justify-center relative overflow-hidden group">
            <div className="flex items-center gap-2 mb-1 text-emerald-600 dark:text-emerald-500">
              <span className="text-[10px] font-bold uppercase tracking-widest">Berhasil Dicairkan</span>
            </div>
            <div className="font-mono text-3xl font-black text-emerald-600 dark:text-emerald-500 my-1 flex items-baseline gap-2">
              {summary.distributed.toLocaleString()}
            </div>
            <div className="text-[11px] text-emerald-600/70 dark:text-emerald-500/80 font-medium leading-snug pr-6">
              Poin yang telah sah dan masuk ke dalam dompet {summary.distributedMitraCount} mitra lapangan.
            </div>
            <div className="absolute -right-4 -bottom-4 opacity-10 group-hover:scale-110 transition-transform text-emerald-500"><Gift size={80}/></div>
          </div>
        </div>

        {/* Daftar Transaksi */}
        <div>
          <h3 className="text-[11px] font-bold text-[var(--text-muted)] uppercase tracking-widest mb-3">Aktivitas Pencairan Terkini</h3>
          <div className="flex flex-col gap-2">
            {recentTransactions.slice(0, 3).map((tx) => {
              const isPending = tx.type === 'locked';
              const timeStr = new Date(tx.timestamp).toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' });
              
              return (
                <div key={tx.id} className="flex items-center justify-between p-3.5 rounded-xl bg-[var(--bg-elevated)] border border-[var(--border)] hover:border-[var(--border-strong)] transition-all">
                  <div className="flex items-center gap-4">
                    <div className={`w-10 h-10 rounded-full flex items-center justify-center shrink-0 ${
                      isPending ? 'bg-amber-500/10 text-amber-500' : 'bg-emerald-500/10 text-emerald-500'
                    }`}>
                      {isPending ? <Clock size={16} /> : <CheckCircle2 size={16} strokeWidth={2.5} />}
                    </div>
                    <div>
                      <div className="font-sans text-[13px] font-bold text-[var(--text-primary)]">
                        {tx.amount} Poin {isPending ? 'menunggu verifikasi' : 'berhasil dicairkan'}
                      </div>
                      <div className="font-sans text-[11px] text-[var(--text-muted)] mt-1 flex items-center gap-1">
                        {isPending ? (
                          <>Diamankan untuk tugas <span className="font-mono font-bold text-[var(--text-secondary)]">{tx.taskId}</span></>
                        ) : (
                          <>Ke <span className="font-bold text-[var(--text-secondary)]">{tx.recipient?.name}</span> (Tugas: <span className="font-mono">{tx.taskId}</span>)</>
                        )}
                      </div>
                    </div>
                  </div>
                  <div className="flex flex-col items-end gap-1.5">
                    <span className="text-[11px] font-semibold text-[var(--text-muted)]">{timeStr} WIB</span>
                    <span className="text-[10px] text-blue-500 font-mono flex items-center gap-1 cursor-pointer hover:underline opacity-80 hover:opacity-100">
                      #{tx.id.split('-')[1]} <ExternalLink size={10} />
                    </span>
                  </div>
                </div>
              )
            })}
          </div>
        </div>
      </div>
    </div>
  )
}