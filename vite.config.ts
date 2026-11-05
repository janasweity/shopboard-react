import react from '@vitejs/plugin-react'
import { defineConfig } from 'vite'
import { productsApi } from './tooling/products-api.ts'

// https://vite.dev/config/
export default defineConfig({
  server: { port: 5173, strictPort: true },
  plugins: [react(), productsApi()],
})
