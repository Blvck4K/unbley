import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import path from 'path'
import { fileURLToPath } from 'url'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
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
