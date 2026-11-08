import { fileURLToPath } from 'node:url'
import tailwindcss from '@tailwindcss/vite'
import react from '@vitejs/plugin-react'
import { defineConfig } from 'vite'
import { productsApi } from './tooling/products-api.ts'

// https://vite.dev/config/
export default defineConfig({
  server: { port: 5173, strictPort: true },
  // shadcn/ui components import from @/ (see tsconfig.app.json paths).
  resolve: { alias: { '@': fileURLToPath(new URL('./src', import.meta.url)) } },
  plugins: [react(), tailwindcss(), productsApi()],
})
