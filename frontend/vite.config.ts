import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react-swc'

export default defineConfig({
  plugins: [react()],
  build: {
    rollupOptions: {
      output: {
        manualChunks: {
          vendor: ['react', 'react-router-dom', 'recharts', 'react-dom'],
          // Outras bibliotecas que podem ser grandes
        },
      },
    },
  },
});
