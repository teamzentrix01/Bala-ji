'use client'
import { useState } from 'react'
import Layout from '../../components/Layout'

export default function ReportsPage() {
  const [type, setType] = useState('all')
  const [downloading, setDownloading] = useState(false)

  const handleDownload = async () => {
    setDownloading(true)
    try {
      const res = await fetch(`/api/export/excel?type=${type}`)
      const blob = await res.blob()
      const url = URL.createObjectURL(blob)
      const a = document.createElement('a')
      a.href = url
      a.download = `jai-balaji-${type}-report.xlsx`
      a.click()
      URL.revokeObjectURL(url)
    } catch {
      alert('Download failed.')
    } finally {
      setDownloading(false)
    }
  }

  const options = [
    { value: 'all',       label: 'All Records', desc: 'Export all quotations and invoices', icon: '📁' },
    { value: 'quotation', label: 'Quotations',  desc: 'Export only quotation records',      icon: '📋' },
    { value: 'invoice',   label: 'Invoices',    desc: 'Export only invoice records',        icon: '🧾' },
  ]

  return (
    <Layout title="Download Reports">
      <div className="max-w-xl mx-auto space-y-8">
        <div>
          <h2 className="text-white font-bold text-xl">Download Reports</h2>
          <p className="text-slate-400 text-sm mt-1">Export your records as Excel (.xlsx) files</p>
        </div>

        <div className="space-y-3">
          {options.map((o) => (
            <label key={o.value} className={`flex items-center gap-4 p-5 rounded-2xl border cursor-pointer transition-all ${
              type === o.value
                ? 'bg-cyan-500/10 border-cyan-500/30'
                : 'bg-[#0d1f3c] border-cyan-900/30 hover:border-cyan-900/60'
            }`}>
              <input type="radio" name="type" value={o.value} checked={type === o.value}
                onChange={() => setType(o.value)} className="accent-cyan-400" />
              <span className="text-2xl">{o.icon}</span>
              <div>
                <p className={`font-semibold text-sm ${type === o.value ? 'text-cyan-300' : 'text-white'}`}>{o.label}</p>
                <p className="text-slate-500 text-xs mt-0.5">{o.desc}</p>
              </div>
            </label>
          ))}
        </div>

        <button
          onClick={handleDownload} disabled={downloading}
          className="w-full py-4 bg-gradient-to-r from-green-500 to-teal-600 hover:from-green-400 hover:to-teal-500 text-white font-semibold rounded-xl transition-all disabled:opacity-50 flex items-center justify-center gap-2"
        >
          <span>⬇</span>
          {downloading ? 'Generating...' : 'Download Excel Report'}
        </button>
      </div>
    </Layout>
  )
}