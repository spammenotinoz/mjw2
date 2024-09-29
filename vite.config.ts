import path from 'path';
import type { PluginOption } from 'vite';
import { defineConfig } from 'vite';
import vue from '@vitejs/plugin-vue';
import { VitePWA } from 'vite-plugin-pwa';
import { viteStaticCopy } from 'vite-plugin-static-copy';

function setupPlugins(env: any): PluginOption[] {
  return [
    vue(),
    viteStaticCopy({
      targets: [
        {
          src: path.resolve(__dirname, './src/static/mitf') + '/[!.]*',
          dest: './mitf/',
        },
      ],
    }),
    VitePWA({
      injectRegister: 'auto',
      manifest: {
        name: 'chatGPT-MJ',
        short_name: 'chatGPT-MJ',
        icons: [
          { src: 'pwa-192x192.png', sizes: '192x192', type: 'image/png' },
          { src: 'pwa-512x512.png', sizes: '512x512', type: 'image/png' },
        ],
      },
    }),
  ];
}

export default defineConfig(() => {
  // Access system environment variables
  const viteEnv = {
    VITE_APP_API_BASE_URL: process.env.VITE_APP_API_BASE_URL || 'http://localhost:3002',
    VITE_GLOB_OPEN_LONG_REPLY: process.env.VITE_GLOB_OPEN_LONG_REPLY || 'false',
    VITE_GLOB_APP_PWA: process.env.VITE_GLOB_APP_PWA || 'false',
  };

  return {
    resolve: {
      alias: {
        '@': path.resolve(process.cwd(), 'src'),
      },
    },
    plugins: setupPlugins(viteEnv),
    server: {
      host: '0.0.0.0',
      port: 1002,
      open: false,
      proxy: {
        '/api': {
          target: viteEnv.VITE_APP_API_BASE_URL,
          changeOrigin: true,
          rewrite: path => path.replace('/api/', '/'),
        },
        // Other proxies as needed
      },
    },
    build: {
      reportCompressedSize: false,
      sourcemap: false,
      commonjsOptions: {
        ignoreTryCatch: false,
      },
    },
  };
});
