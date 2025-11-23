import { serve } from '@hono/node-server'
import { Hono } from 'hono'
import mongoose from 'mongoose'
import crypto from 'node:crypto'
import Params from './models/Params.js'
import sanitizer from './utils/sanitizer.js'
import cron from 'node-cron'

const app = new Hono()

const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://mongo:27017/mydb'

mongoose
  .connect(MONGODB_URI)
  .then(() => console.log('MongoDB connected'))
  .catch(err => console.error('MongoDB connection error:', err))

app.get('/', c => {
  return c.html(
    `
    <html>
      <head><meta http-equiv="refresh" content="0;url=about:blank"></head>
      <body></body>
    </html>
    `,
  )
})

app.get('/:botname', async c => {
  const bot = c.req.param('botname')
  const query = c.req.query()
  const timestamp = Date.now().toString()
  if (Object.keys(query).length === 0) {
    return c.redirect(`https://t.me/${bot}`)
  }
  sanitizer(query)
  const hash = crypto
    .createHash('sha3-256')
    .update(Object.values({ bot, timestamp, ...query }).join(', '))
    .digest('base64url')
  const paramsInDb = new Params({
    hash,
    bot,
    timestamp,
    queryParams: { ...query },
  })
  await paramsInDb.save()
  return c.redirect(`http://t.me/${bot}?start=${hash}`)
})

app.get('/api/params/:hash', async c => {
  const hash = c.req.param('hash')
  const params = await Params.findOne({ hash })
  if (!params) return c.json({ error: 'Not found' }, 404)
  const { timestamp, queryParams } = params
  return c.json({ timestamp, queryParams })
})

cron.schedule('0 1 * * 0', async () => {
  await mongoose.connection.dropDatabase()
  console.log('DB erased')
})

serve({
  fetch: app.fetch,
  port: 3010,
})
