import { defineConfig } from 'vite'
import path from "path"
import crypto from "crypto"
import fs from "fs"
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'
import { VitePWA } from 'vite-plugin-pwa'
import pkg from './package.json'

const iconHash = crypto.createHash('md5').update(fs.readFileSync('public/pwa-512x512.png')).digest('hex').slice(0, 8)

// https://vite.dev/config/
export default defineConfig({
  plugins: [
    react(),
    tailwindcss(),
    VitePWA({
      registerType: 'prompt',
      injectRegister: false,
      registerOptions: {
        updateViaCache: 'none'
      },
      includeAssets: ['favicon.ico', 'apple-touch-icon.png', 'safari-pinned-tab.svg'],
      manifest: {
        name: 'DRIMS STAFF PORTAL',
        short_name: 'DRIMS STAFF',
        description: 'DRIMS UMI - Supervisor Portal',
        id: '/staff/',
        theme_color: '#2563eb',
        background_color: '#ffffff',
        display: 'standalone',
        orientation: 'portrait',
        scope: '/',
        start_url: '/',
        icons: [
          {
            src: `pwa-192x192.png?v=${iconHash}`,
            sizes: '192x192',
            type: 'image/png',
            purpose: 'any'
          },
          {
            src: `pwa-192x192.png?v=${iconHash}`,
            sizes: '192x192',
            type: 'image/png',
            purpose: 'maskable'
          },
          {
            src: `pwa-512x512.png?v=${iconHash}`,
            sizes: '512x512',
            type: 'image/png',
            purpose: 'any'
          },
          {
            src: `pwa-512x512.png?v=${iconHash}`,
            sizes: '512x512',
            type: 'image/png',
            purpose: 'maskable'
          }
        ]
      },
      workbox: {
        clientsClaim: true,
        globPatterns: ['**/*.{js,css,html,ico,png,svg}'],
        runtimeCaching: [
          {
            urlPattern: /^https:\/\/api\./,
            handler: 'NetworkFirst',
            options: {
              cacheName: 'api-cache',
              expiration: {
                maxEntries: 100,
                maxAgeSeconds: 60 * 60 * 24 // 24 hours
              },
              cacheableResponse: {
                statuses: [0, 200]
              }
            }
          }
        ]
      }
    })
  ],
  define: {
    __APP_VERSION__: JSON.stringify({
      version: pkg.version,
      build: new Date().toISOString(),
      iconVersion: iconHash
    })
  },
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
})
