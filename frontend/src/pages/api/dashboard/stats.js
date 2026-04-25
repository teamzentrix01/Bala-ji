import pool from '../../../lib/db.js'
import { withAuth } from '../../../lib/middleware.js'

async function handler(req, res) {
  if (req.method !== 'GET') return res.status(405).json({ message: 'Method not allowed' })

  try {
    const [totalRecords, totalQuotations, totalRevenueResult, recentResult] = await Promise.all([
      pool.query(`SELECT COUNT(*) FROM records WHERE type = 'quotation'`),
      pool.query(`SELECT COUNT(*) FROM records WHERE type = 'quotation'`),
      pool.query(`SELECT COALESCE(SUM(grand_total), 0) as revenue FROM records WHERE type = 'quotation'`),
      pool.query(`
        SELECT 
          id, type,
          client_name  AS "clientName",
          product_name AS "productName",
          grand_total  AS "grandTotal",
          created_at   AS "createdAt"
        FROM records 
        WHERE type = 'quotation'
        ORDER BY created_at DESC LIMIT 5
      `)
    ])

    return res.status(200).json({
      success: true,
      stats: {
        totalRecords: parseInt(totalRecords.rows[0].count),
        totalQuotations: parseInt(totalQuotations.rows[0].count),
        totalInvoices: 0,
        totalRevenue: parseFloat(totalRevenueResult.rows[0].revenue),
        recent: recentResult.rows
      }
    })
  } catch (err) {
    console.error(err)
    return res.status(500).json({ message: 'Server error' })
  }
}

export default withAuth(handler)