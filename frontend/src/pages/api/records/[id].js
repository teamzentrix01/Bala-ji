import pool from '../../../lib/db.js'
import { withAuth } from '../../../lib/middleware.js'

async function handler(req, res) {
  const { id } = req.query

  if (req.method === 'GET') {
    try {
      const result = await pool.query(`
        SELECT 
          id, type,
          client_name    AS "clientName",
          client_phone   AS "clientPhone",
          client_address AS "clientAddress",
          product_name   AS "productName",
          image_url      AS "imageUrl",
          rate_per_sqft  AS "ratePerSqft",
          tiles_per_box  AS "tilesPerBox",
          total_area     AS "totalArea",
          total_boxes    AS "totalBoxes",
          price_per_box  AS "pricePerBox",
          grand_total    AS "grandTotal",
          created_at     AS "createdAt",
          updated_at     AS "updatedAt"
        FROM records WHERE id = $1
      `, [id])
      if (!result.rows[0]) return res.status(404).json({ message: 'Record nahi mila' })
      return res.status(200).json({ record: result.rows[0] })
    } catch (err) {
      return res.status(500).json({ message: 'Server error' })
    }
  }

  if (req.method === 'PUT') {
    try {
      const {
        clientName, clientPhone, clientAddress,
        productName, imageUrl, ratePerSqft, tilesPerBox,
        totalArea, totalBoxes, pricePerBox, grandTotal
      } = req.body

      const result = await pool.query(
        `UPDATE records SET 
        client_name=$1, client_phone=$2, client_address=$3, product_name=$4,
        image_url=$5, rate_per_sqft=$6, tiles_per_box=$7, total_area=$8,
        total_boxes=$9, price_per_box=$10, grand_total=$11, updated_at=NOW()
        WHERE id=$12 RETURNING *`,
        [clientName, clientPhone, clientAddress, productName, imageUrl,
        ratePerSqft, tilesPerBox, totalArea, totalBoxes, pricePerBox, grandTotal, id]
      )

      return res.status(200).json({ success: true, record: result.rows[0] })
    } catch (err) {
      return res.status(500).json({ message: 'Server error' })
    }
  }

  if (req.method === 'DELETE') {
    try {
      await pool.query('DELETE FROM records WHERE id = $1', [id])
      return res.status(200).json({ success: true, message: 'Record delete ho gaya' })
    } catch (err) {
      return res.status(500).json({ message: 'Server error' })
    }
  }

  return res.status(405).json({ message: 'Method not allowed' })
}

export default withAuth(handler)