import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// base must match your GitHub repo name so assets resolve at
// https://prnaag.github.io/poorna_ai/
export default defineConfig({
  plugins: [react()],
  base: '/poorna_ai/',
})
