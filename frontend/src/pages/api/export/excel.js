import pool from '../../../lib/db.js'
import { withAuth } from '../../../lib/middleware.js'

async function handler(req, res) {
  if (req.method !== 'GET') return res.status(405).json({ message: 'Method not allowed' })

  try {
    const { id } = req.query

    const result = await pool.query(`
      SELECT 
        id, type,
        client_name    AS "clientName",
        client_phone   AS "clientPhone",
        client_address AS "clientAddress",
        product_name   AS "productName",
        rate_per_sqft  AS "ratePerSqft",
        tiles_per_box  AS "tilesPerBox",
        total_area     AS "totalArea",
        total_boxes    AS "totalBoxes",
        price_per_box  AS "pricePerBox",
        grand_total    AS "grandTotal",
        created_at     AS "createdAt"
      FROM records WHERE id = $1
    `, [id])

    const r = result.rows[0]
    if (!r) return res.status(404).json({ message: 'Record nahi mila' })

    const headers = ['ID','Type','Client Name','Phone','Address','Product','Rate/Sqft','Tiles/Box','Total Area','Total Boxes','Price/Box','Grand Total','Date']
    const row = [
      r.id, r.type, r.clientName, r.clientPhone || '',
      `"${r.clientAddress || ''}"`, r.productName,
      r.ratePerSqft, r.tilesPerBox, r.totalArea,
      r.totalBoxes, r.pricePerBox, r.grandTotal,
      new Date(r.createdAt).toLocaleDateString('en-IN')
    ]

    const csv = [headers.join(','), row.join(',')].join('\n')

    res.setHeader('Content-Type', 'text/csv')
    res.setHeader('Content-Disposition', `attachment; filename=${r.type}-${r.id}.csv`)
    return res.status(200).send(csv)
  } catch (err) {
    console.error(err)
    return res.status(500).json({ message: 'Server error' })
  }
}

export default withAuth(handler)