import pg from 'pg'

const { Pool } = pg

const globalForDb = globalThis
const pool = globalForDb.pool ?? new pg.Pool({
  connectionString: process.env.DATABASE_URL
})

if (process.env.NODE_ENV !== 'production') globalForDb.pool = pool

export default pool