import pool from '../../../lib/db.js'
import { withAuth } from '../../../lib/middleware.js'

async function handler(req, res) {
  if (req.method === 'GET') {
    try {
      const { type, search, page = 1, limit = 10 } = req.query
      const offset = (page - 1) * limit
      const params = []

      let where = 'WHERE 1=1'
      if (type) { params.push(type); where += ` AND type = $${params.length}` }
      if (search) { params.push(`%${search}%`); where += ` AND client_name ILIKE $${params.length}` }

      params.push(limit, offset)

      const result = await pool.query(`
        SELECT 
          id, type,
          client_name      AS "clientName",
          client_phone     AS "clientPhone",
          client_address   AS "clientAddress",
          product_name     AS "productName",
          image_url        AS "imageUrl",
          rate_per_sqft    AS "ratePerSqft",
          tiles_per_box    AS "tilesPerBox",
          total_area       AS "totalArea",
          total_boxes      AS "totalBoxes",
          price_per_box    AS "pricePerBox",
          grand_total      AS "grandTotal",
          created_at       AS "createdAt",
          updated_at       AS "updatedAt"
        FROM records ${where}
        ORDER BY created_at DESC
        LIMIT $${params.length - 1} OFFSET $${params.length}
      `, params)

      const countResult = await pool.query('SELECT COUNT(*) FROM records')

      return res.status(200).json({
        success: true,
        records: result.rows,
        total: parseInt(countResult.rows[0].count),
        page: parseInt(page),
        limit: parseInt(limit)
      })
    } catch (err) {
      console.error(err)
      return res.status(500).json({ message: 'Server error' })
    }
  }

  if (req.method === 'POST') {
    try {
      const {
        type, clientName, clientPhone, clientAddress,
        productName, imageUrl, ratePerSqft, tilesPerBox,
        totalArea, totalBoxes, pricePerBox, grandTotal
      } = req.body

      const result = await pool.query(
        `INSERT INTO records 
        (type, client_name, client_phone, client_address, product_name, image_url, 
        rate_per_sqft, tiles_per_box, total_area, total_boxes, price_per_box, grand_total)
        VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11,$12)
        RETURNING *`,
        [type, clientName, clientPhone, clientAddress, productName, imageUrl,
        ratePerSqft, tilesPerBox, totalArea, totalBoxes, pricePerBox, grandTotal]
      )

      return res.status(201).json({ success: true, record: result.rows[0] })
    } catch (err) {
      console.error(err)
      return res.status(500).json({ message: 'Server error' })
    }
  }

  return res.status(405).json({ message: 'Method not allowed' })
}

export default withAuth(handler)