import { defineConfig } from 'vite';
import { defineConfig as defineVitestConfig, mergeConfig } from 'vitest/config';
import react from '@vitejs/plugin-react';

// https://vite.dev/config/
const viteConfig = defineConfig({
  plugins: [react()],
  server: {
    host: true, // Needed for the Docker Container port mapping to work correctly
    // strictPort: true,
    port: 3000, // Port inside a container
    hmr: {
      clientPort: 80,
    },
    watch: {
      usePolling: true,
    },
  },
});

const vitestConfig = defineVitestConfig({
  test: {
    environment: 'jsdom',
    globals: true,
    setupFiles: './src/test/setup.ts',
  },
});

export default mergeConfig(viteConfig, vitestConfig);
