'use client'
import { useRouter } from 'next/navigation'

export default function Navbar({ title = 'Dashboard' }) {
  const router = useRouter()

  const handleLogout = async () => {
  if (!confirm('Are you sure you want to logout?')) return
  await fetch('/api/auth/logout', { method: 'POST' })
  router.push('/login')

  }

  return (
    <header className="fixed top-0 left-64 right-0 h-16 bg-[#0a1628]/95 backdrop-blur border-b border-cyan-900/30 flex items-center justify-between px-8 z-30">
      <div className="flex items-center gap-3">
        <div className="w-1 h-6 rounded-full bg-gradient-to-b from-cyan-400 to-teal-600"></div>
        <h1 className="text-white font-semibold text-lg">{title}</h1>
      </div>
      <div className="flex items-center gap-4">
        <div className="flex items-center gap-2 bg-white/5 border border-white/10 rounded-xl px-4 py-2">
          <div className="w-7 h-7 rounded-lg bg-gradient-to-br from-cyan-400 to-teal-600 flex items-center justify-center text-white text-xs font-bold">A</div>
          <span className="text-slate-300 text-sm">Admin</span>
        </div>
        <button
          onClick={handleLogout}
          className="flex items-center gap-2 bg-red-500/10 hover:bg-red-500/20 border border-red-500/20 text-red-400 hover:text-red-300 rounded-xl px-4 py-2 text-sm font-medium transition-all"
        >
          <span>⏻</span> Logout
        </button>
      </div>
    </header>
  )
}