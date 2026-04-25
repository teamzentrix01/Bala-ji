'use client'

export default function DetailModal({ record, onClose }) {
  if (!record) return null

  const fields = [
    { label: 'Client Name',   value: record.clientName },
    { label: 'Phone',         value: record.clientPhone },
    { label: 'Address',       value: record.clientAddress },
    { label: 'Product Name',  value: record.productName },
    { label: 'Rate / Sq. Ft', value: `₹${record.ratePerSqft}` },
    { label: 'Tiles per Box', value: record.tilesPerBox },
    { label: 'Total Area',    value: `${record.totalArea} sq. ft.` },
    { label: 'Total Boxes',   value: parseFloat(record.totalBoxes).toFixed(2) },
    { label: 'Price per Box', value: `₹${parseFloat(record.pricePerBox).toFixed(2)}` },
    { label: 'Grand Total',   value: `₹${parseFloat(record.grandTotal).toLocaleString('en-IN')}` },
    { label: 'Date',          value: new Date(record.createdAt).toLocaleDateString('en-IN') },
  ]

  return (
    <div className="fixed inset-0 bg-black/70 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="bg-[#0d1f3c] border border-cyan-900/40 rounded-2xl w-full max-w-lg shadow-2xl">
        <div className="flex items-center justify-between px-6 py-4 border-b border-cyan-900/30">
          <div>
            <h2 className="text-white font-semibold">{record.clientName}</h2>
            <span className={`text-xs px-2 py-0.5 rounded border mt-1 inline-block ${
              record.type === 'quotation'
                ? 'bg-blue-500/10 text-blue-400 border-blue-500/20'
                : 'bg-green-500/10 text-green-400 border-green-500/20'
            }`}>
              {record.type === 'quotation' ? 'Quotation' : 'Invoice'}
            </span>
          </div>
          <button onClick={onClose} className="text-slate-400 hover:text-white text-xl">✕</button>
        </div>

        {record.imageUrl && (
          <div className="px-6 pt-4">
            <img src={record.imageUrl} alt="product" className="w-full h-40 object-cover rounded-xl border border-cyan-900/30" />
          </div>
        )}

        <div className="px-6 py-4 grid grid-cols-2 gap-3">
          {fields.map((f) => (
            <div key={f.label} className="bg-[#0a1628] rounded-xl px-4 py-3">
              <p className="text-slate-500 text-xs mb-0.5">{f.label}</p>
              <p className="text-white text-sm font-medium">{f.value || '—'}</p>
            </div>
          ))}
        </div>

        <div className="px-6 py-4 border-t border-cyan-900/30 flex justify-end">
          <button onClick={onClose} className="px-6 py-2 bg-cyan-500/20 hover:bg-cyan-500/30 text-cyan-300 rounded-xl text-sm border border-cyan-500/30 transition-all">
            Close
          </button>
        </div>
      </div>
    </div>
  )
}