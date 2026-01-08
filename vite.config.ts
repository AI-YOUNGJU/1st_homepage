
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  define: {
    // Vite가 빌드 타임에 process.env.API_KEY를 실제 값으로 교체하도록 설정
    'process.env.API_KEY': JSON.stringify(process.env.API_KEY || '')
  },
  server: {
    port: 3000,
    host: true,
    strictPort: false // 3000번이 사용 중이면 다음 포트를 자동으로 찾음
  }
});
