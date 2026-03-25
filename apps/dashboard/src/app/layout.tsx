import type { Metadata } from 'next'
import './globals.css' // Make sure this imports your Tailwind CSS

export const metadata: Metadata = {
  title: 'GreenProof Dashboard',
  description: 'Platform manajemen validasi lapangan perkebunan',
}

// This is the MASTER layout. Next.js needs this to wrap the whole app.
export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="id" className="dark">
      <body>{children}</body>
    </html>
  )
}