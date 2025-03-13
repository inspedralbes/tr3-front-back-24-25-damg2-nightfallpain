// Plugins
import Components from 'unplugin-vue-components/vite'
import Vue from '@vitejs/plugin-vue'
import Vuetify, { transformAssetUrls } from 'vite-plugin-vuetify'
import VueRouter from 'unplugin-vue-router/vite'

// Utilities
import { defineConfig } from 'vite'
import { fileURLToPath, URL } from 'node:url'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    VueRouter(),
    Vue({
      template: { transformAssetUrls }
    }),
    Vuetify({
      autoImport: true,
      styles: { configFile: 'src/styles/settings.scss' },
    }),
    Components(),
  ],
  resolve: {
    alias: {
      '@': fileURLToPath(new URL('./src', import.meta.url))
    },
  },
  server: {
    host: '0.0.0.0', // Permite acceso desde fuera del contenedor
    port: 5173,
    strictPort: true, // Garantiza que use este puerto y no cambie automáticamente
    watch: {
      usePolling: true, // Necesario para hot reload en Docker
    },
    hmr: {
      host: '0.0.0.0', // Asegura que HMR funcione correctamente en Docker
    },
  },
  css: {
    preprocessorOptions: {
      scss: {
        additionalData: `@import "/app/fontend/vuetify-project/src/styles/settings.scss";`, // Usa SCSS en lugar de Sass indentado
      },
    },
  },
})
