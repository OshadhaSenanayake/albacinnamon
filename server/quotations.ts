import { createHash, randomUUID } from 'node:crypto'
import { mkdir, rename, rm, writeFile } from 'node:fs/promises'
import type { IncomingMessage, ServerResponse } from 'node:http'
import { homedir } from 'node:os'
import { join } from 'node:path'
import { products } from '../src/models/product.ts'

export function createQuotationHandler(env: NodeJS.ProcessEnv, send = fetch) {
  return async (req: IncomingMessage, res: ServerResponse) => {
    function reply(status: number, body: object) {
      res.writeHead(status, { 'Content-Type': 'application/json', 'Cache-Control': 'no-store' }).end(JSON.stringify(body))
    }
    if (req.method !== 'POST') {
      res.setHeader('Allow', 'POST')
      return reply(405, { error: 'Use POST to submit an inquiry.' })
    }
    if (req.headers['content-type']?.split(';')[0].trim() !== 'application/json') return reply(415, { error: 'Expected JSON.' })
    try {
      const chunks: Buffer[] = []
      let size = 0
      for await (const chunk of req.iterator({ destroyOnReturn: false })) {
        size += chunk.length
        if (size > 16384) {
          req.resume()
          return reply(413, { error: 'Please shorten your inquiry.' })
        }
        chunks.push(chunk)
      }
      let data
      try { data = JSON.parse(Buffer.concat(chunks).toString('utf8')) }
      catch { return reply(400, { error: 'Invalid quotation request.' }) }
      const product = products.find(p => p.id === data?.productId)
      if (!product) return reply(400, { error: 'Choose a product from the catalog.' })
      const { quantity } = data
      if (!Number.isInteger(quantity) || quantity < 1 || quantity > 1000000) return reply(400, { error: 'Enter 1 to 1,000,000 whole packs.' })
      const name = typeof data.name === 'string' ? data.name.trim() : ''
      const email = typeof data.email === 'string' ? data.email.trim() : ''
      const message = data.message ?? ''
      if (!name || name.length > 100 || /[\r\n]/.test(name)) return reply(400, { error: 'Enter your full name.' })
      if (email.length > 254 || !/^[^\s@<>,;:"]+@[^\s@<>,;:"]+\.[^\s@<>,;:"]+$/.test(email)) return reply(400, { error: 'Enter a valid reply email.' })
      if (typeof message !== 'string' || message.length > 2000) return reply(400, { error: 'Keep additional details within 2,000 characters.' })
      const subject = 'Quotation request: ' + product.name
      const text = [subject, 'Pack size: ' + product.weight, 'Quantity: ' + quantity + ' packs', 'Name: ' + name, 'Email: ' + email, '', message.trim()].join('\n')
      const id = createHash('sha256').update(JSON.stringify([req.headers['idempotency-key'] || randomUUID(), text])).digest('hex')
      const delivery = env.QUOTATION_MODE || 'demo'
      if (delivery === 'demo') {
        const dir = env.QUOTATION_INBOX_DIR || join(homedir(), '.alba-cinnamon', 'quotation-inbox')
        const mail = ['From: website@example.com', 'To: quotations@example.com', 'Reply-To: ' + email, 'Subject: ' + subject,
          'Date: ' + new Date().toUTCString(), 'Message-ID: <' + id + '@example.com>', 'MIME-Version: 1.0',
          'Content-Type: text/plain; charset=UTF-8', 'Content-Transfer-Encoding: 8bit', '', text, ''].join('\n').replace(/\r\n?|\n/g, '\r\n')
        await mkdir(dir, { recursive: true, mode: 0o700 })
        const temp = join(dir, randomUUID() + '.tmp')
        try {
          await writeFile(temp, mail, { flag: 'wx', mode: 0o600 })
          await rename(temp, join(dir, id + '.eml'))
        } finally { await rm(temp, { force: true }) }
      } else if (delivery === 'email' && env.QUOTATION_FROM && env.QUOTATION_TO && env.RESEND_API_KEY) {
        const sent = await send('https://api.resend.com/emails', {
          method: 'POST', signal: AbortSignal.timeout(15000),
          headers: { Authorization: 'Bearer ' + env.RESEND_API_KEY, 'Content-Type': 'application/json', 'Idempotency-Key': id },
          body: JSON.stringify({ from: env.QUOTATION_FROM, to: [env.QUOTATION_TO], reply_to: email, subject, text }),
        })
        const receipt = sent.ok ? await sent.json() as { id?: string } | null : null
        if (!receipt?.id) throw new Error('Delivery declined')
      } else { throw new Error('Email delivery configuration missing') }
      reply(201, { delivery })
    } catch {
      reply(503, { error: 'Your quotation request could not be confirmed. Please try again later.' })
    }
  }
}
