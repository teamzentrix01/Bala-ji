import pool from '../../../lib/db.js'
import { withAuth } from '../../../lib/middleware.js'

async function handler(req, res) {
  if (req.method !== 'GET') return res.status(405).json({ message: 'Method not allowed' })

  try {
    const { search, page = 1, limit = 10 } = req.query
    const offset = (page - 1) * limit

    let query = `SELECT * FROM records WHERE type = 'invoice'`
    const params = []

    if (search) {
      params.push(`%${search}%`)
      query += ` AND client_name ILIKE $${params.length}`
    }

    query += ` ORDER BY created_at DESC LIMIT $${params.length + 1} OFFSET $${params.length + 2}`
    params.push(limit, offset)

    const result = await pool.query(query, params)
    const countResult = await pool.query(`SELECT COUNT(*) FROM records WHERE type = 'invoice'`)

    return res.status(200).json({
      invoices: result.rows,
      total: parseInt(countResult.rows[0].count),
      page: parseInt(page),
      limit: parseInt(limit)
    })
  } catch (err) {
    console.error(err)
    return res.status(500).json({ message: 'Server error' })
  }
}

export default withAuth(handler)