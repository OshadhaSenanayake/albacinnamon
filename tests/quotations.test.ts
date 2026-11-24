import assert from 'node:assert/strict'
import { once } from 'node:events'
import { mkdtemp, readFile, readdir, rm } from 'node:fs/promises'
import { createServer } from 'node:http'
import type { AddressInfo } from 'node:net'
import { tmpdir } from 'node:os'
import { join } from 'node:path'
import test from 'node:test'
import { createQuotationHandler } from '../server/quotations.ts'

const inquiry = { productId: 'cinnamon-tea', quantity: 5, name: 'Test Buyer', email: 'buyer@example.test', message: 'Delivery to Galle' }

test('demo submissions validate product details and save one replyable email across retries', async (t) => {
  const dir = await mkdtemp(join(tmpdir(), 'alba-quote-test-'))
  t.after(() => rm(dir, { recursive: true, force: true }))
  const server = createServer(createQuotationHandler({ QUOTATION_MODE: 'demo', QUOTATION_INBOX_DIR: dir }))
  server.listen(0, '127.0.0.1')
  await once(server, 'listening')
  t.after(() => new Promise<void>(resolve => server.close(() => resolve())))
  const url = 'http://127.0.0.1:' + (server.address() as AddressInfo).port + '/api/quotations'
  const post = (body: object) => fetch(url, {
    method: 'POST', headers: { 'Content-Type': 'application/json', 'Idempotency-Key': 'example' }, body: JSON.stringify(body),
  })
  assert.equal((await post({ ...inquiry, productId: 'unknown' })).status, 400)
  assert.equal((await post({ ...inquiry, quantity: -1 })).status, 400)
  assert.deepEqual(await readdir(dir), [])
  assert.equal((await post(inquiry)).status, 201)
  assert.deepEqual(await (await post(inquiry)).json(), { delivery: 'demo' })
  const files = await readdir(dir)
  assert.equal(files.length, 1)
  const mail = await readFile(join(dir, files[0]), 'utf8')
  for (const field of ['To: quotations@example.com', 'Reply-To: buyer@example.test', 'Cinnamon Herbal Tea', '5 packs', 'Delivery to Galle']) assert.ok(mail.includes(field))
})
