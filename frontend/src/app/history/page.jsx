'use client'
import { useEffect, useState } from 'react'
import Layout from '../../components/Layout'
import Table from '../../components/Table'

export default function HistoryPage() {
  const [records, setRecords] = useState([])
  const [loading, setLoading] = useState(true)
  const [activeTab, setActiveTab] = useState('all')

  useEffect(() => {
    setLoading(true)
    const query = activeTab !== 'all' ? '?type=' + activeTab : ''
    fetch('/api/records' + query)
      .then(r => r.json())
      .then(d => { if (d.success) setRecords(d.records) })
      .finally(() => setLoading(false))
  }, [activeTab])

  const tabs = [
    { key: 'all',       label: 'All Records' },
    { key: 'quotation', label: 'Quotations'  },
   
  ]

  return (
    <Layout title="History">
      <div className="space-y-6">
        <div>
          <h2 className="text-white font-bold text-xl">History</h2>
          <p className="text-slate-400 text-sm mt-1">All your quotations and invoices</p>
        </div>

        <div className="flex gap-2 bg-[#0d1f3c] border border-cyan-900/30 rounded-xl p-1 w-fit">
          {tabs.map(t => (
            <button
              key={t.key}
              onClick={() => setActiveTab(t.key)}
              className={`px-5 py-2 rounded-lg text-sm font-medium transition-all ${
                activeTab === t.key
                  ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/30'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              {t.label}
            </button>
          ))}
        </div>

        {loading ? (
          <div className="bg-[#0d1f3c] border border-cyan-900/30 rounded-2xl p-12 text-center">
            <p className="text-slate-500">Loading records...</p>
          </div>
        ) : (
          <Table data={records} />
        )}
      </div>
    </Layout>
  )
}