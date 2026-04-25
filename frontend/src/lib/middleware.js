import { verifyToken } from './auth.js'

export function withAuth(handler) {
  return async function (req, res) {
    const token = req.cookies?.token

    console.log('Token:', token) // debug ke liye

    if (!token) return res.status(401).json({ success: false, message: 'Not authenticated' })

    const user = verifyToken(token)

    if (!user) return res.status(401).json({ success: false, message: 'Invalid token' })

    req.user = user
    return handler(req, res)
  }
}