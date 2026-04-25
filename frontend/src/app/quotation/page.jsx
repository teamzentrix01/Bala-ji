import Layout from '../../components/Layout'
import Form from '../../components/Form'

export default function QuotationPage() {
  return (
    <Layout title="Create Quotation">
      <div className="max-w-3xl mx-auto">
        <div className="mb-8">
          <h2 className="text-white font-bold text-xl">New Quotation</h2>
          <p className="text-slate-400 text-sm mt-1">Fill in the details to generate a quotation</p>
        </div>
        <Form type="quotation" />
      </div>
    </Layout>
  )
}