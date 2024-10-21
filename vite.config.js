import { fileURLToPath, URL } from 'node:url'
import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import { VitePWA } from 'vite-plugin-pwa'
import fs from 'fs'

// https://vitejs.dev/config/
export default defineConfig({
  base: './',
  server: {
    // https: {
    //   key: fs.readFileSync('./dev-app.tomiru.com/private.key'),
    //   cert: fs.readFileSync('./dev-app.tomiru.com/certificate.crt')
    // },
    // https: {
    //   key: fs.readFileSync('./dev-nic-fe.vietnamskilled.com/private.key'),
    //   cert: fs.readFileSync('./dev-nic-fe.vietnamskilled.com/certificate.crt')
    // },
    // port: 443,
    // host: 'dev-nic-fe.vietnamskilled.com'
    host: '0.0.0.0', // Or your desired host
    port: 3000
  },

  plugins: [
    vue(),
    VitePWA({
      registerType: 'autoUpdate',
      workbox: {
        cleanupOutdatedCaches: true
      },
      devOptions: {
        enabled: false
      },
      manifest: {
        name: 'TOMIRU',
        short_name: 'TOMIRU',
        start_url: '.',
        display: 'standalone',
        background_color: '#000000',
        icons: [
          {
            src: '/logo.png',
            sizes: '192x192', // sort cut icon
            type: 'image/png'
          },
          {
            src: '/logo.png',
            sizes: '512x512', // icon background
            type: 'image/png'
          }
        ]
      }
    })
  ],
  resolve: {
    alias: {
      '@': fileURLToPath(new URL('./src', import.meta.url))
    }
  }
})
