import express from 'express'
import cors from 'cors'
import authRoutes from './routes/auth.js'
import recordRoutes from './routes/records.js'

const app = express()
app.use(cors({ origin: 'http://localhost:3000' }))
app.use(express.json())

app.use('/api/auth', authRoutes)
app.use('/api/records', recordRoutes)

app.listen(5000, () => console.log('Server running on port 5000'))