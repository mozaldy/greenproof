// === File: apps/mitra/src/components/ui/TaskCard.tsx ===
import React from 'react'
import Link from 'next/link'
import { MapPin, AlertTriangle, ArrowRight, CheckCircle2 } from 'lucide-react'

interface TaskCardProps {
  task: {
    id: string
    title: string
    block: string
    distance: string
    reward: string
    urgent: boolean
    status: string
  }
}

export function TaskCard({ task }: TaskCardProps) {
  const isCompleted = task.status === 'COMPLETED'
  
  return (
    <Link 
      href={`/tasks/${task.id}`} 
      className={`block p-4 rounded-2xl border transition-all active:scale-[0.98] ${
        isCompleted 
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

      <h3 className={`font-bold text-sm mb-1 line-clamp-1 ${isCompleted ? 'text-muted-foreground' : 'text-foreground'}`}>
        {task.title}
      </h3>
      
      <div className="flex items-center gap-4 mt-3 pt-3 border-t border-border/50 text-xs text-muted-foreground font-medium">
        <div className="flex items-center gap-1.5 w-1/2">
          <MapPin size={14} /> {task.block}
        </div>
        <div className="flex items-center justify-between w-1/2 pl-4 border-l border-border/50">
          <span>Jarak: <strong className="text-foreground">{task.distance}</strong></span>
          {isCompleted ? (
            <CheckCircle2 size={16} className="text-[#10b981]" />
          ) : (
            <ArrowRight size={16} className="text-primary" />
          )}
        </div>
      </div>
    </Link>
  )
}