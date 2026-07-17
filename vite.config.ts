import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'

export default defineConfig({
  plugins: [vue()],
  // Relative assets so wujie can load under /vome/apps/{key}/
  base: './',
  build: {
    outDir: 'web',
    emptyOutDir: true,
  },
})
