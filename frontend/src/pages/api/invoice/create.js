import pool from '../../../lib/db.js'
import { withAuth } from '../../../lib/middleware.js'

async function handler(req, res) {
  if (req.method !== 'POST') return res.status(405).json({ message: 'Method not allowed' })

  try {
    const {
      clientName, clientPhone, clientAddress,
      productName, imageUrl, ratePerSqft, tilesPerBox,
      totalArea, totalBoxes, pricePerBox, grandTotal
    } = req.body

    const result = await pool.query(
      `INSERT INTO records 
      (type, client_name, client_phone, client_address, product_name, image_url,
      rate_per_sqft, tiles_per_box, total_area, total_boxes, price_per_box, grand_total)
      VALUES ('invoice',$1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11)
      RETURNING *`,
      [clientName, clientPhone, clientAddress, productName, imageUrl,
      ratePerSqft, tilesPerBox, totalArea, totalBoxes, pricePerBox, grandTotal]
    )

    return res.status(201).json({ invoice: result.rows[0] })
  } catch (err) {
    console.error(err)
    return res.status(500).json({ message: 'Server error' })
  }
}

export default withAuth(handler)