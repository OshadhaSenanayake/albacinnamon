import react from '@vitejs/plugin-react'
import { defineConfig, loadEnv, type PreviewServer, type ViteDevServer } from 'vite'
import { createQuotationHandler } from './server/quotations.ts'

export default defineConfig(({ mode }) => {
  const handle = createQuotationHandler({ ...loadEnv(mode, process.cwd(), ['QUOTATION_', 'RESEND_']), ...process.env })
  function attach(server: ViteDevServer | PreviewServer) {
    server.middlewares.use((req, res, next) => {
      if (req.url?.split('?')[0] === '/api/quotations') void handle(req, res)
      else next()
    })
  }
  return { plugins: [react(), { name: 'quotation-api', configureServer: attach, configurePreviewServer: attach }] }
})
