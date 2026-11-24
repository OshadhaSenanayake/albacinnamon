import { createReadStream, readdirSync } from 'node:fs'
import { createServer } from 'node:http'
import { extname, join, relative, sep } from 'node:path'
import { fileURLToPath } from 'node:url'
import { createInquiryHandler } from './quotations.ts'

const dist = fileURLToPath(new URL('../dist/', import.meta.url))
const assets = new Map<string, string>()
for (const entry of readdirSync(dist, { recursive: true, withFileTypes: true })) {
  if (!entry.isFile()) continue
  const file = join(entry.parentPath, entry.name)
  assets.set('/' + relative(dist, file).split(sep).join('/'), file)
}
const index = assets.get('/index.html')
if (!index) throw new Error('Run npm run build first.')
const types: Record<string, string> = { '.html': 'text/html; charset=utf-8', '.js': 'text/javascript', '.css': 'text/css', '.png': 'image/png', '.svg': 'image/svg+xml' }
const quotations = createInquiryHandler('quotation', process.env)
const contact = createInquiryHandler('contact', process.env)
const port = Number(process.env.PORT || 3000)
createServer((req, res) => {
  const path = (req.url ?? '/').split('?')[0]
  if (path === '/api/quotations') return void quotations(req, res)
  if (path === '/api/contact') return void contact(req, res)
  if (req.method !== 'GET' && req.method !== 'HEAD') return void res.writeHead(405, { Allow: 'GET, HEAD' }).end()
  const isPage = !path.startsWith('/api/') && !extname(path) && req.headers.accept?.includes('text/html')
  const file = assets.get(path) ?? (path === '/' || isPage ? index : undefined)
  if (!file) return void res.writeHead(404).end()
  res.setHeader('Content-Type', types[extname(file)] ?? 'application/octet-stream')
  if (req.method === 'HEAD') return void res.end()
  const stream = createReadStream(file)
  stream.on('error', () => { if (!res.headersSent) res.writeHead(500); res.end() })
  res.on('close', () => stream.destroy())
  stream.pipe(res)
}).listen(port, process.env.HOST || '0.0.0.0', () => console.log('Alba Cinnamon listening on port ' + port))
