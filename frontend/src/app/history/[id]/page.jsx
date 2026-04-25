'use client'
import { useEffect, useState } from 'react'
import { useRouter, useParams } from 'next/navigation'
import Layout from '../../../components/Layout'

export default function RecordDetail() {
  const router = useRouter()
  const { id } = useParams()
  const [record, setRecord] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (!id) return
    fetch(`/api/records/${id}`)
      .then(r => r.json())
      .then(d => { if (d.record) setRecord(d.record) })
      .finally(() => setLoading(false))
  }, [id])

  if (loading) return (
    <Layout title="Record Detail">
      <div className="text-center text-slate-500 py-20">Loading...</div>
    </Layout>
  )

  if (!record) return (
    <Layout title="Record Detail">
      <div className="text-center text-slate-500 py-20">Record nahi mila</div>
    </Layout>
  )

  return (
    <Layout title="Record Detail">
      <div className="max-w-3xl mx-auto space-y-6">
        <div className="flex items-center justify-between">
          <button onClick={() => router.back()}
            className="text-slate-400 hover:text-white text-sm transition-all">
            ← Back
          </button>
          <span className={`px-3 py-1 rounded-lg text-xs font-semibold border ${
            record.type === 'quotation'
              ? 'bg-blue-500/10 text-blue-400 border-blue-500/20'
              : 'bg-green-500/10 text-green-400 border-green-500/20'
          }`}>
            {record.type === 'quotation' ? 'Quotation' : 'Invoice'}
          </span>
        </div>

        <div className="bg-[#0d1f3c] border border-cyan-900/30 rounded-2xl p-6">
          <h2 className="text-cyan-400 font-semibold text-sm uppercase tracking-widest mb-4">Client Information</h2>
          <div className="grid grid-cols-2 gap-4">
            <Detail label="Client Name"  value={record.clientName} />
            <Detail label="Phone"        value={record.clientPhone || '-'} />
            <Detail label="Address"      value={record.clientAddress || '-'} />
            <Detail label="Date"         value={new Date(record.createdAt).toLocaleDateString('en-IN')} />
          </div>
        </div>

        <div className="bg-[#0d1f3c] border border-cyan-900/30 rounded-2xl p-6">
          <h2 className="text-cyan-400 font-semibold text-sm uppercase tracking-widest mb-4">Product Details</h2>
          <div className="grid grid-cols-2 gap-4">
            <Detail label="Product Name"  value={record.productName} />
            <Detail label="Rate/Sqft"     value={`₹${record.ratePerSqft}`} />
            <Detail label="Tiles Per Box" value={record.tilesPerBox} />
            <Detail label="Total Area"    value={`${record.totalArea} sqft`} />
          </div>
          {record.imageUrl && (
            <img src={record.imageUrl} alt="product"
              className="mt-4 h-40 object-contain rounded-xl border border-cyan-900/20" />
          )}
        </div>

        <div className="bg-gradient-to-br from-cyan-950/60 to-teal-950/60 border border-cyan-500/20 rounded-2xl p-6">
          <h2 className="text-cyan-400 font-semibold text-sm uppercase tracking-widest mb-4">Calculations</h2>
          <div className="grid grid-cols-3 gap-4">
            <CalcCard label="Total Boxes" value={record.totalBoxes} />
            <CalcCard label="Price/Box"   value={`₹${record.pricePerBox}`} />
            <CalcCard label="Grand Total" value={`₹${parseFloat(record.grandTotal).toLocaleString('en-IN')}`} highlight />
          </div>
        </div>
      </div>
    </Layout>
  )
}

function Detail({ label, value }) {
  return (
    <div>
      <p className="text-slate-500 text-xs mb-1">{label}</p>
      <p className="text-white text-sm font-medium">{value}</p>
    </div>
  )
}

function CalcCard({ label, value, highlight }) {
  return (
    <div className={`rounded-xl p-4 text-center border ${highlight ? 'bg-cyan-500/10 border-cyan-500/30' : 'bg-white/5 border-white/10'}`}>
      <p className="text-slate-400 text-xs mb-1">{label}</p>
      <p className={`text-lg font-bold ${highlight ? 'text-cyan-300' : 'text-white'}`}>{value}</p>
    </div>
  )
}