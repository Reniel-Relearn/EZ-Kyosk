import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  base: '/EZ-Kyosk/',
  plugins: [react()],
  test: {
    include: ['src/**/*.test.{js,jsx}'],
  },
});

