import pool from '../../../lib/db.js'
import bcrypt from 'bcryptjs'
import { signToken } from '../../../lib/auth.js'

export default async function handler(req, res) {
  if (req.method !== 'POST') return res.status(405).json({ message: 'Method not allowed' })

  const { email, password } = req.body

  if (!email || !password) return res.status(400).json({ message: 'Email and password required' })

  try {
    const result = await pool.query('SELECT * FROM admins WHERE email = $1', [email])
    const admin = result.rows[0]

    if (!admin) return res.status(401).json({ message: 'Invalid email or password' })

    const isValid = await bcrypt.compare(password, admin.password)
    if (!isValid) return res.status(401).json({ message: 'Invalid email or password' })

    const token = signToken({ id: admin.id, email: admin.email, name: admin.name })

    res.setHeader('Set-Cookie', `token=${token}; HttpOnly; Path=/; Max-Age=${7 * 24 * 60 * 60}; SameSite=Lax`)
   return res.status(200).json({ success: true, message: 'Login successful', admin: { id: admin.id, email: admin.email, name: admin.name } })
  } catch (err) {
    console.error(err)
    return res.status(500).json({ message: 'Server error' })
  }
}