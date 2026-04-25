'use client'
import { useEffect, useState } from 'react'
import Layout from '../../components/Layout'
import StatCard from '../../components/StatCard'

export default function DashboardPage() {
  const [stats, setStats] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetch('/api/dashboard/stats')
      .then(r => r.json())
      .then(d => { if (d.success) setStats(d.stats) })
      .finally(() => setLoading(false))
  }, [])

  return (
    <Layout title="Dashboard">
      <div className="space-y-8">
        <div className="bg-gradient-to-r from-cyan-950/60 to-teal-950/60 border border-cyan-500/20 rounded-2xl p-6">
          <h2 className="text-white font-bold text-xl">Welcome back, Admin 👋</h2>
          <p className="text-slate-400 text-sm mt-1">Here's what's happening with your shop today.</p>
        </div>

        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {[...Array(4)].map((_, i) => (
              <div key={i} className="bg-[#0d1f3c] border border-cyan-900/30 rounded-2xl p-6 animate-pulse h-28" />
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <StatCard label="Total Quotations" value={stats?.totalQuotations ?? 0} icon="📋" color="blue" />
            
            <StatCard label="Total Records"     value={stats?.totalRecords ?? 0}     icon="📁" color="cyan" />
            <StatCard label="Total Revenue"     value={"₹" + (stats?.totalRevenue ?? 0).toLocaleString('en-IN')} icon="💰" color="purple" />
          </div>
        )}

        <div className="bg-[#0d1f3c] border border-cyan-900/30 rounded-2xl p-6">
          <h3 className="text-white font-semibold mb-5 flex items-center gap-2">
            <span className="w-1.5 h-5 rounded-full bg-cyan-400 inline-block"></span>
            Recent Activity
          </h3>
          {loading ? (
            <p className="text-slate-500 text-sm">Loading...</p>
          ) : stats?.recent?.length === 0 ? (
            <p className="text-slate-500 text-sm">No records yet.</p>
          ) : (
            <div className="space-y-3">
              {stats?.recent?.map((r) => (
                <div key={r.id} className="flex items-center justify-between p-4 bg-[#0a1628] rounded-xl border border-cyan-900/20">
                  <div className="flex items-center gap-3">
                    <span className={`px-2.5 py-1 rounded-lg text-xs font-semibold border ${
                      r.type === 'quotation'
                        ? 'bg-blue-500/10 text-blue-400 border-blue-500/20'
                        : 'bg-green-500/10 text-green-400 border-green-500/20'
                    }`}>
                      {r.type === 'quotation' ? 'Quotation' : 'Invoice'}
                    </span>
                    <div>
                      <p className="text-white text-sm font-medium">{r.clientName}</p>
                      <p className="text-slate-500 text-xs">{r.productName}</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-cyan-300 font-semibold text-sm">₹{r.grandTotal.toLocaleString('en-IN')}</p>
                    <p className="text-slate-500 text-xs">{new Date(r.createdAt).toLocaleDateString('en-IN')}</p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </Layout>
  )
}