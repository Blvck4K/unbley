import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'
import dotenv from 'dotenv'
import path from 'path'
import { fileURLToPath } from 'url'
import confirmOrderHandler from './api/payments/confirm-order.js'
import statusNotificationHandler from './api/orders/status-notification.js'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)
dotenv.config()

const localPaymentApi = () => ({
  name: 'local-payment-api',
  configureServer(server) {
    server.middlewares.use('/api/payments/confirm-order', async (req, res) => {
      if (req.method !== 'POST') {
        res.statusCode = 405
        res.end(JSON.stringify({ error: 'Method not allowed' }))
        return
      }

      try {
        const chunks = []
        for await (const chunk of req) chunks.push(chunk)
        req.body = JSON.parse(Buffer.concat(chunks).toString('utf8') || '{}')
      } catch {
        req.body = {}
      }

      const response = {
        statusCode: 200,
        status(code) {
          this.statusCode = code
          return this
        },
        json(body) {
          res.statusCode = this.statusCode
          res.setHeader('Content-Type', 'application/json')
          res.end(JSON.stringify(body))
        }
      }

      try {
        await confirmOrderHandler(req, response)
      } catch (error) {
        res.statusCode = 500
        res.setHeader('Content-Type', 'application/json')
        res.end(JSON.stringify({ error: error.message || 'Payment service failed.' }))
      }
    })

    server.middlewares.use('/api/orders/status-notification', async (req, res) => {
      if (req.method !== 'POST') {
        res.statusCode = 405
        res.end(JSON.stringify({ error: 'Method not allowed' }))
        return
      }
      try {
        const chunks = []
        for await (const chunk of req) chunks.push(chunk)
        req.body = JSON.parse(Buffer.concat(chunks).toString('utf8') || '{}')
      } catch {
        req.body = {}
      }
      const response = {
        statusCode: 200,
        status(code) {
          this.statusCode = code
          return this
        },
        json(body) {
          res.statusCode = this.statusCode
          res.setHeader('Content-Type', 'application/json')
          res.end(JSON.stringify(body))
        }
      }
      try {
        await statusNotificationHandler(req, response)
      } catch (error) {
        res.statusCode = 500
        res.setHeader('Content-Type', 'application/json')
        res.end(JSON.stringify({ error: error.message || 'Notification service failed.' }))
      }
    })
  }
})

// https://vite.dev/config/
export default defineConfig({
  plugins: [localPaymentApi(), react(), tailwindcss()],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
    },
  },
  optimizeDeps: {
    include: [
      'use-sync-external-store/shim/index.js',
      'use-sync-external-store/shim/with-selector.js'
    ],
    exclude: [
      '@tiptap/react',
      '@tiptap/starter-kit',
      '@tiptap/pm',
      '@tiptap/extension-image',
      '@tiptap/extension-table',
      '@tiptap/extension-table-row',
      '@tiptap/extension-table-header',
      '@tiptap/extension-table-cell',
      '@tiptap/extension-link',
      '@tiptap/extension-underline',
      '@tiptap/extension-placeholder',
      '@tiptap/extension-text-align',
      '@tiptap/extension-color',
      '@tiptap/extension-text-style',
      '@tiptap/extension-font-family'
    ]
  }
})
