import type { Metadata, Viewport } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'GreenProof Mitra',
  description: 'Aplikasi validasi lapangan perkebunan',
  manifest: '/manifest.json',
}

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
  themeColor: '#16a34a',
}

import { BottomNav } from '../components/bottom-nav'

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="id">
      <body className={`${inter.className} max-w-md mx-auto min-h-screen bg-background relative shadow-2xl pb-20`}>
        {children}
        <BottomNav />
      </body>
    </html>
  )
}
