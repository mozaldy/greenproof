import { VerifierSidebar } from '@/components/dashboard/verifier-sidebar'

export default function VerifierLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex" style={{ minHeight: '100vh', background: 'var(--bg-base)' }}>
      <VerifierSidebar />
      <div className="flex flex-col flex-1 min-w-0 overflow-hidden">
        {children}
      </div>
    </div>
  )
}