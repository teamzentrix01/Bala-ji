'use client'
import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'

export default function Form({ type = 'quotation' }) {
  const router = useRouter()
  const [loading, setLoading] = useState(false)
  const [imagePreview, setImagePreview] = useState(null)
  const [imageFile, setImageFile] = useState(null)

  const [form, setForm] = useState({
    clientName: '', clientPhone: '', clientAddress: '',
    productName: '', ratePerSqft: '', tilesPerBox: '', totalArea: '',
  })

  const [calc, setCalc] = useState({ totalBoxes: 0, pricePerBox: 0, grandTotal: 0 })

  useEffect(() => {
    const rate = parseFloat(form.ratePerSqft) || 0
    const tpb  = parseFloat(form.tilesPerBox) || 0
    const area = parseFloat(form.totalArea)   || 0
    const totalBoxes  = tpb > 0 ? area / tpb : 0
    const pricePerBox = rate * tpb
    const grandTotal  = totalBoxes * pricePerBox
    setCalc({ totalBoxes, pricePerBox, grandTotal })
  }, [form.ratePerSqft, form.tilesPerBox, form.totalArea])

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value })

  const handleImage = (e) => {
    const file = e.target.files[0]
    if (!file) return
    setImageFile(file)
    setImagePreview(URL.createObjectURL(file))
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)
    try {
      let imageUrl = ''
      if (imageFile) {
        const fd = new FormData()
        fd.append('file', imageFile)
        const upRes = await fetch('/api/upload', { method: 'POST', body: fd })
        const upData = await upRes.json()
        imageUrl = upData.url || ''
      }
      const payload = { ...form, ...calc, imageUrl, type }
      const endpoint = type === 'quotation' ? '/api/quotation/create' : '/api/invoice/create'
      const res = await fetch(endpoint, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      })
      const data = await res.json()
      if (data.success) {
        alert(`${type === 'quotation' ? 'Quotation' : 'Invoice'} saved successfully!`)
        router.push('/history')
      } else {
        alert(data.message || 'Something went wrong')
      }
    } catch (err) {
      alert('Error: ' + err.message)
    } finally {
      setLoading(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-8">
      {/* Client Details */}
      <div className="bg-[#0d1f3c] border border-cyan-900/30 rounded-2xl p-6">
        <h2 className="text-cyan-400 font-semibold text-sm uppercase tracking-widest mb-5">Client Information</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          <InputField label="Client Name"   name="clientName"    value={form.clientName}    onChange={handleChange} required placeholder="e.g. Rahul Sharma" />
          <InputField label="Phone Number"  name="clientPhone"   value={form.clientPhone}   onChange={handleChange} placeholder="e.g. 9876543210" />
          <div className="md:col-span-2">
            <InputField label="Address" name="clientAddress" value={form.clientAddress} onChange={handleChange} placeholder="Full address" />
          </div>
        </div>
      </div>

      {/* Product Details */}
      <div className="bg-[#0d1f3c] border border-cyan-900/30 rounded-2xl p-6">
        <h2 className="text-cyan-400 font-semibold text-sm uppercase tracking-widest mb-5">Product Details</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          <InputField label="Product Name" name="productName" value={form.productName} onChange={handleChange} required placeholder="e.g. Vitrified Floor Tile 60x60" />

          <div>
            <label className="block text-slate-400 text-sm mb-2">Product Image</label>
            <div className="relative border-2 border-dashed border-cyan-900/50 hover:border-cyan-500/50 rounded-xl p-4 transition-colors cursor-pointer">
              <input type="file" accept="image/*" onChange={handleImage} className="absolute inset-0 w-full h-full opacity-0 cursor-pointer" />
              {imagePreview ? (
                <img src={imagePreview} alt="preview" className="h-20 object-contain mx-auto rounded" />
              ) : (
                <div className="text-center">
                  <p className="text-slate-500 text-sm">Click to upload image</p>
                  <p className="text-slate-600 text-xs mt-1">PNG, JPG up to 5MB</p>
                </div>
              )}
            </div>
          </div>

          <InputField label="Rate per Sq. Ft (₹)"   name="ratePerSqft" type="number" value={form.ratePerSqft} onChange={handleChange} required placeholder="e.g. 45" />
          <InputField label="Tiles per Box (sq. ft.)" name="tilesPerBox"  type="number" value={form.tilesPerBox}  onChange={handleChange} required placeholder="e.g. 10" />
          <InputField label="Total Area (sq. ft.)"    name="totalArea"    type="number" value={form.totalArea}    onChange={handleChange} required placeholder="e.g. 200" />
        </div>
      </div>

      {/* Live Calculations */}
      <div className="bg-gradient-to-br from-cyan-950/60 to-teal-950/60 border border-cyan-500/20 rounded-2xl p-6">
        <h2 className="text-cyan-400 font-semibold text-sm uppercase tracking-widest mb-5">⚡ Live Calculations</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <CalcCard label="Total Boxes"   value={calc.totalBoxes.toFixed(2)}  unit="boxes" />
          <CalcCard label="Price per Box" value={`₹${calc.pricePerBox.toFixed(2)}`} unit="per box" />
          <CalcCard label="Grand Total"   value={`₹${calc.grandTotal.toFixed(2)}`}  unit="total" highlight />
        </div>
      </div>

      <button
        type="submit" disabled={loading}
        className="w-full py-4 bg-gradient-to-r from-cyan-500 to-teal-600 hover:from-cyan-400 hover:to-teal-500 text-white font-semibold rounded-xl transition-all disabled:opacity-50 text-sm tracking-wide"
      >
        {loading ? 'Saving...' : `Save ${type === 'quotation' ? 'Quotation' : 'Invoice'}`}
      </button>
    </form>
  )
}

function InputField({ label, name, value, onChange, type = 'text', required, placeholder }) {
  return (
    <div>
      <label className="block text-slate-400 text-sm mb-2">{label}</label>
      <input
        type={type} name={name} value={value} onChange={onChange}
        required={required} placeholder={placeholder}
        step={type === 'number' ? 'any' : undefined}
        className="w-full bg-[#0a1628] border border-cyan-900/40 focus:border-cyan-500/60 text-white placeholder-slate-600 rounded-xl px-4 py-3 text-sm outline-none transition-all"
      />
    </div>
  )
}

function CalcCard({ label, value, unit, highlight }) {
  return (
    <div className={`rounded-xl p-4 text-center border ${highlight ? 'bg-cyan-500/10 border-cyan-500/30' : 'bg-white/5 border-white/10'}`}>
      <p className="text-slate-400 text-xs uppercase tracking-wider mb-1">{label}</p>
      <p className={`text-2xl font-bold ${highlight ? 'text-cyan-300' : 'text-white'}`}>{value}</p>
      <p className="text-slate-500 text-xs mt-1">{unit}</p>
    </div>
  )
}