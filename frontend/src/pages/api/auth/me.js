import { verifyToken } from '../../../lib/auth.js'

export default function handler(req, res) {
  const token = req.cookies?.token
  if (!token) return res.status(401).json({ message: 'Not authenticated' })

  const user = verifyToken(token)
  if (!user) return res.status(401).json({ message: 'Invalid token' })

  return res.status(200).json({ admin: user })
}