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
    APP_API_BASE_URL: process.env.APP_API_BASE_URL || 'http://localhost:3002',
    GLOB_OPEN_LONG_REPLY: process.env.GLOB_OPEN_LONG_REPLY || 'false',
    GLOB_APP_PWA: process.env.GLOB_APP_PWA || 'false',
	SYS_THEME:  process.env.SYS_THEME,
	HIDE_SERVER: process.env.HIDE_SERVER,
	HIDE_MENUS: process.env.HIDE_MENUS,
	MJ_SERVER:  process.env.MJ_SERVER,
	MJ_KEY: process.env.MJ_KEY,
	LUMA_SERVER: process.env.LUMA_SERVER,
	LUMA_KEY: process.env.LUMA_KEY,
	SUNO_SERVER: process.env.SUNO_SERVER,
	SUNO_KEY: process.env.SUNO_KEY,
	RUNWAY_SERVER: process.env.RUNWAY_SERVER,
	RUNWAY_KEY: process.env.RUNWAY_KEY,
	VIGGLE_SERVER: process.env.VIGGLE_SERVER,
	VIGGLE_KEY: process.env.VIGGLE_KEY,
	

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
          target: viteEnv.APP_API_BASE_URL,
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
