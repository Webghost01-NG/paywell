import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],

  define: {
    // stellar-sdk needs global
    global: 'globalThis',
  },

  optimizeDeps: {
    include: ['@stellar/freighter-api'],
    esbuildOptions: {
      define: {
        global: 'globalThis',
      },
    },
  },

  build: {
    commonjsOptions: {
      transformMixedEsModules: true,
    },
  },
})
