import type { Metadata } from 'next'
import './globals.css'

export const metadata: Metadata = {
  title: 'GreenProof Dashboard',
  description: 'Platform manajemen validasi lapangan perkebunan',
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="id" className="dark">
      <body>{children}</body>
    </html>
  )
}
