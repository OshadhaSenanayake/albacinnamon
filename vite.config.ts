import react from '@vitejs/plugin-react'
import { defineConfig, loadEnv, type PreviewServer, type ViteDevServer } from 'vite'
import { createInquiryHandler } from './server/quotations.ts'

export default defineConfig(({ mode }) => {
  const env = { ...loadEnv(mode, process.cwd(), ['QUOTATION_', 'RESEND_']), ...process.env }
  const quotations = createInquiryHandler('quotation', env)
  const contact = createInquiryHandler('contact', env)
  function attach(server: ViteDevServer | PreviewServer) {
    server.middlewares.use((req, res, next) => {
      const path = req.url?.split('?')[0]
      if (path === '/api/quotations') void quotations(req, res)
      else if (path === '/api/contact') void contact(req, res)
      else next()
    })
  }
  return { plugins: [react(), { name: 'quotation-api', configureServer: attach, configurePreviewServer: attach }] }
})
