import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import path from 'path'


export default defineConfig({
  plugins: [vue()],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src')
    }
  },
  server: {
  proxy: {
    '/api': {
      target: 'http://8.134.127.25',
      changeOrigin: true,
      rewrite: (path) => path.replace(/^\/api/, '/api'), // 确保保留/api前缀
      secure: false,
      ws: true
    }
  }
}
})
