import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import { crx } from '@crxjs/vite-plugin'
// import manifest from './manifest.json' assert { type: 'json' } // Node >=17
import manifest from './manifest.config'

// https://vitejs.dev/config/
export default defineConfig({
  resolve: {
    alias: {
      '@': '/src'
    }
  },
  plugins: [
    vue(),
    crx({ manifest })
  ],
  emptyOutDir: true
})
