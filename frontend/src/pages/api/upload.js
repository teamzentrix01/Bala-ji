import { IncomingForm } from 'formidable'
import path from 'path'
import fs from 'fs'
import { withAuth } from '../../lib/middleware'

export const config = { api: { bodyParser: false } }

async function handler(req, res) {
  if (req.method !== 'POST') return res.status(405).end()

  const uploadDir = path.join(process.cwd(), 'public', 'uploads')
  if (!fs.existsSync(uploadDir)) fs.mkdirSync(uploadDir, { recursive: true })

  const form = new IncomingForm({ uploadDir, keepExtensions: true, maxFileSize: 5 * 1024 * 1024 })

  form.parse(req, (err, fields, files) => {
    if (err) return res.status(500).json({ success: false, message: 'Upload failed' })
    const file = Array.isArray(files.file) ? files.file[0] : files.file
    if (!file) return res.status(400).json({ success: false, message: 'No file' })
    const filename = path.basename(file.filepath)
    return res.status(200).json({ success: true, url: '/uploads/' + filename })
  })
}

export default withAuth(handler)