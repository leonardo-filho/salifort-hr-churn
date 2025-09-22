import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react-swc';

export default defineConfig({
  plugins: [react()],
  base: '/salifort-hr-churn/',
  build: {
    rollupOptions: {
      output: {
        manualChunks: {
          vendor: ['react', 'react-router-dom', 'recharts', 'react-dom'],
        },
      },
    },
  },
});