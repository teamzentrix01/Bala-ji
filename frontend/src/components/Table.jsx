'use client'
import { useState } from 'react'
import { useRouter } from 'next/navigation'

export default function Table({ data = [] }) {
  const router = useRouter()
  const [search, setSearch] = useState('')
  const [dateFilter, setDateFilter] = useState('')

  const filtered = data.filter((row) => {
    const nameMatch = row.clientName?.toLowerCase().includes(search.toLowerCase())
    const dateMatch = dateFilter
      ? new Date(row.createdAt).toLocaleDateString('en-IN') === new Date(dateFilter).toLocaleDateString('en-IN')
      : true
    return nameMatch && dateMatch
  })

  const handleDownload = async (id, rowType) => {
    const res = await fetch(`/api/export/excel?id=${id}&type=${rowType}`)
    const blob = await res.blob()
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `${rowType}-${id}.csv`
    a.click()
    URL.revokeObjectURL(url)
  }

  const handleDelete = async (id) => {
    if (!confirm('You want to delete it permanently.')) return
    const res = await fetch(`/api/records/${id}`, { method: 'DELETE' })
    const data = await res.json()
    if (data.success) {
      window.location.reload()
    } else {
      alert('Delete nahi hua, dobara try karo')
    }
  }

  return (
    <div className="space-y-5">
      <div className="flex flex-col sm:flex-row gap-3">
        <input
          type="text" placeholder="Search by client name..."
          value={search} onChange={(e) => setSearch(e.target.value)}
          className="flex-1 bg-[#0d1f3c] border border-cyan-900/40 focus:border-cyan-500/60 text-white placeholder-slate-600 rounded-xl px-4 py-3 text-sm outline-none"
        />
        <input
          type="date" value={dateFilter} onChange={(e) => setDateFilter(e.target.value)}
          className="bg-[#0d1f3c] border border-cyan-900/40 text-white rounded-xl px-4 py-3 text-sm outline-none"
        />
        {(search || dateFilter) && (
          <button onClick={() => { setSearch(''); setDateFilter('') }}
            className="px-4 py-3 bg-white/5 hover:bg-white/10 text-slate-400 hover:text-white rounded-xl text-sm transition-all">
            Clear
          </button>
        )}
      </div>

      <div className="bg-[#0d1f3c] border border-cyan-900/30 rounded-2xl overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-cyan-900/30 bg-[#0a1628]/60">
                <th className="text-left text-cyan-400 font-semibold text-xs uppercase tracking-wider px-5 py-4">#</th>
                <th className="text-left text-cyan-400 font-semibold text-xs uppercase tracking-wider px-5 py-4">Client</th>
                <th className="text-left text-cyan-400 font-semibold text-xs uppercase tracking-wider px-5 py-4">Product</th>
                <th className="text-left text-cyan-400 font-semibold text-xs uppercase tracking-wider px-5 py-4">Type</th>
                <th className="text-left text-cyan-400 font-semibold text-xs uppercase tracking-wider px-5 py-4">Grand Total</th>
                <th className="text-left text-cyan-400 font-semibold text-xs uppercase tracking-wider px-5 py-4">Date</th>
                <th className="text-left text-cyan-400 font-semibold text-xs uppercase tracking-wider px-5 py-4">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-cyan-900/20">
              {filtered.length === 0 ? (
                <tr>
                  <td colSpan={7} className="text-center text-slate-500 py-12">No records found</td>
                </tr>
              ) : (
                filtered.map((row, i) => (
                  <tr key={row.id} className="hover:bg-white/3 transition-colors">
                    <td className="px-5 py-4 text-slate-500">{i + 1}</td>
                    <td className="px-5 py-4">
                      <p className="text-white font-medium">{row.clientName}</p>
                      <p className="text-slate-500 text-xs">{row.clientPhone}</p>
                    </td>
                    <td className="px-5 py-4 text-slate-300">{row.productName}</td>
                    <td className="px-5 py-4">
                      <span className={`px-2.5 py-1 rounded-lg text-xs font-semibold border ${
                        row.type === 'quotation'
                          ? 'bg-blue-500/10 text-blue-400 border-blue-500/20'
                          : 'bg-green-500/10 text-green-400 border-green-500/20'
                      }`}>
                        {row.type === 'quotation' ? 'Quotation' : 'Invoice'}
                      </span>
                    </td>
                    <td className="px-5 py-4 text-cyan-300 font-semibold">
                      ₹{parseFloat(row.grandTotal).toLocaleString('en-IN')}
                    </td>
                    <td className="px-5 py-4 text-slate-400 text-xs">
                      {new Date(row.createdAt).toLocaleDateString('en-IN')}
                    </td>
                    <td className="px-5 py-4">
                      <div className="flex items-center gap-2">
                        <button onClick={() => router.push(`/history/${row.id}`)}
                          className="px-3 py-1.5 bg-cyan-500/10 hover:bg-cyan-500/20 text-cyan-400 rounded-lg text-xs border border-cyan-500/20 transition-all">
                          View
                        </button>
                        <button onClick={() => handleDownload(row.id, row.type)}
                          className="px-3 py-1.5 bg-green-500/10 hover:bg-green-500/20 text-green-400 rounded-lg text-xs border border-green-500/20 transition-all">
                          CSV
                        </button>
                        <button onClick={() => handleDelete(row.id)}
                          className="px-3 py-1.5 bg-red-500/10 hover:bg-red-500/20 text-red-400 rounded-lg text-xs border border-red-500/20 transition-all">
                          Delete
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
        {filtered.length > 0 && (
          <div className="px-5 py-3 border-t border-cyan-900/20 text-slate-500 text-xs">
            Showing {filtered.length} of {data.length} records
          </div>
        )}
      </div>
    </div>
  )
}