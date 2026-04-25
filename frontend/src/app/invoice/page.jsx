import Layout from '../../components/Layout'
import Form from '../../components/Form'

export default function InvoicePage() {
  return (
    <Layout title="Create Invoice">
      <div className="max-w-3xl mx-auto">
        <div className="mb-8">
          <h2 className="text-white font-bold text-xl">New Invoice</h2>
          <p className="text-slate-400 text-sm mt-1">Fill in the details to generate an invoice</p>
        </div>
        <Form type="invoice" />
      </div>
    </Layout>
  )
}