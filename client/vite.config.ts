import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
// import kartTest from './src/constants/images';
// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    port: 3000,
    host: 'localhost'
  },
})
