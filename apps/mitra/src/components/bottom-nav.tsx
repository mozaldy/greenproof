'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { Home, MapPin, UserSquare2 } from 'lucide-react'

export function BottomNav() {
  const pathname = usePathname()

  const navItems = [
    { label: 'Beranda', icon: Home, href: '/' },
    { label: 'Tugas', icon: MapPin, href: '/tasks' },
    { label: 'Profil', icon: UserSquare2, href: '/profile' },
  ]

  // Hide BottomNav on deep pages (e.g., /tasks/[id], /tasks/[id]/submit)
  // Show only on Home (/), Tasks (/tasks), Profile (/profile)
  if (pathname.startsWith('/tasks/') && pathname !== '/tasks') {
    return null;
  }

  return (
    <div className="fixed bottom-0 left-0 right-0 z-50 flex justify-center w-full pointer-events-none">
      <div className="w-full max-w-md bg-card border-t border-border flex items-center justify-around pb-safe pointer-events-auto shadow-[0_-4px_24px_rgba(0,0,0,0.2)]">
        {navItems.map((item) => {
          const isActive = pathname === item.href || (item.href !== '/' && pathname.startsWith(item.href))
          const Icon = item.icon

          return (
            <Link 
              key={item.href} 
              href={item.href}
              className="flex flex-col items-center justify-center pt-3 pb-4 px-6 w-full touch-target transition-colors relative"
            >
               {isActive && (
                 <div className="absolute top-0 left-1/2 -translate-x-1/2 w-8 h-1 bg-primary rounded-b-full shadow-[0_0_8px_var(--primary)]" />
               )}
              <Icon 
                size={22} 
                className={`mb-1 transition-all duration-300 ${isActive ? 'text-primary' : 'text-muted-foreground'}`}
              />
              <span 
                className={`text-[10px] font-semibold tracking-wide transition-colors ${isActive ? 'text-primary' : 'text-muted-foreground'}`}
              >
                {item.label}
              </span>
            </Link>
          )
        })}
      </div>
    </div>
  )
}
