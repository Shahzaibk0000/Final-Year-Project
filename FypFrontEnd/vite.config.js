import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react-swc'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      '@components': '/src/components',
      '@assets': '/src/assets',
      '@pages': '/src/pages',
      '@layout': '/src/layout',
      '@context': '/src/context',
      '@utility': '/src/utility',
    },
  },
})
