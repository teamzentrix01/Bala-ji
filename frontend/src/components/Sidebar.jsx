'use client'
import Link from 'next/link'
import { usePathname } from 'next/navigation'

const navItems = [
  { href: '/dashboard', label: 'Dashboard',        icon: '⊞' },
  { href: '/quotation', label: 'Create Quotation', icon: '📋' },
 
  { href: '/history',   label: 'History',          icon: '🕒' },
  
]

export default function Sidebar() {
  const pathname = usePathname()

  return (
    <aside className="fixed top-0 left-0 h-screen w-64 bg-[#0a1628] border-r border-cyan-900/30 flex flex-col z-40">
      <div className="px-6 py-6 border-b border-cyan-900/30">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-cyan-400 to-teal-600 flex items-center justify-center text-white font-bold text-lg">
            JB
          </div>
          <div>
            <p className="text-white font-bold text-sm leading-tight">Jai Balaji</p>
            <p className="text-cyan-400 text-xs">Bath and Tile</p>
          </div>
        </div>
      </div>

      <nav className="flex-1 px-4 py-6 space-y-1">
        {navItems.map((item) => {
          const isActive = pathname === item.href
          return (
            <Link
              key={item.href}
              href={item.href}
              className={`flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-all duration-200 ${
                isActive
                  ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/30'
                  : 'text-slate-400 hover:text-white hover:bg-white/5'
              }`}
            >
              <span className="text-base">{item.icon}</span>
              {item.label}
              {isActive && <span className="ml-auto w-1.5 h-1.5 rounded-full bg-cyan-400"></span>}
            </Link>
          )
        })}
      </nav>

      <div className="px-6 py-4 border-t border-cyan-900/30">
        <p className="text-slate-600 text-xs text-center">v1.0.0 • Admin Panel</p>
      </div>
    </aside>
  )
}