import { fileURLToPath, URL } from 'node:url'
import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import AutoImport from 'unplugin-auto-import/vite'

export default defineConfig({
  plugins: [
    vue(),
    AutoImport({
      imports: ['vue', 'pinia', 'vue-router'],
      dts: 'src/auto-imports.d.ts',
      dirs: ['src/stores/**', 'src/utils/**'],
      vueTemplate: true,
    }),
  ],
  resolve: {
    alias: {
      '@': fileURLToPath(new URL('./src', import.meta.url)),
    },
    dedupe: ['vue', 'vue-router', 'pinia'],
  },
  optimizeDeps: {
    exclude: ['vome-core'],
  },
  // Relative assets so wujie can load under /vome/apps/{key}/
  base: './',
  build: {
    outDir: 'web',
    emptyOutDir: true,
  },
})
