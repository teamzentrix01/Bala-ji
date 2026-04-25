'use client'
import { useState } from 'react'
import { useRouter } from 'next/navigation'

export default function LoginPage() {
  const router = useRouter()
  const [form, setForm] = useState({ email: '', password: '' })
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')
    setLoading(true)
    try {
      const res = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      })
      const data = await res.json()
      if (data.success) {
        router.push('/dashboard')
      } else {
        setError(data.message || 'Login failed')
      }
    } catch {
      setError('Network error. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-[#060f1e] flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <div className="text-center mb-10">
          <div className="inline-flex items-center justify-center w-20 h-20 rounded-2xl bg-gradient-to-br from-cyan-400 to-teal-700 mb-5">
            <span className="text-white font-bold text-3xl">JB</span>
          </div>
          <h1 className="text-white font-bold text-2xl">Jai Balaji</h1>
          <p className="text-cyan-400 text-sm mt-1 tracking-widest uppercase">Bath and Tile</p>
          <p className="text-slate-500 text-sm mt-3">Admin Management Portal</p>
        </div>

        <div className="bg-[#0d1f3c] border border-cyan-900/40 rounded-2xl p-8">
          <h2 className="text-white font-semibold text-lg mb-6">Sign In</h2>

          {error && (
            <div className="mb-5 px-4 py-3 bg-red-500/10 border border-red-500/30 rounded-xl text-red-400 text-sm">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label className="block text-slate-400 text-sm mb-2">Email Address</label>
              <input
                type="email" required
                placeholder="admin@jaibalaji.com"
                value={form.email}
                onChange={(e) => setForm({ ...form, email: e.target.value })}
                className="w-full bg-[#0a1628] border border-cyan-900/40 focus:border-cyan-500/60 text-white placeholder-slate-600 rounded-xl px-4 py-3 text-sm outline-none transition-all"
              />
            </div>
            <div>
              <label className="block text-slate-400 text-sm mb-2">Password</label>
              <input
                type="password" required
                placeholder="••••••••"
                value={form.password}
                onChange={(e) => setForm({ ...form, password: e.target.value })}
                className="w-full bg-[#0a1628] border border-cyan-900/40 focus:border-cyan-500/60 text-white placeholder-slate-600 rounded-xl px-4 py-3 text-sm outline-none transition-all"
              />
            </div>
            <button
              type="submit" disabled={loading}
              className="w-full py-3.5 bg-gradient-to-r from-cyan-500 to-teal-600 hover:from-cyan-400 hover:to-teal-500 text-white font-semibold rounded-xl transition-all disabled:opacity-50"
            >
              {loading ? 'Signing in...' : 'Sign In'}
            </button>
          </form>
          <p className="text-slate-600 text-xs text-center mt-6">
            
          </p>
        </div>
      </div>
    </div>
  )
}