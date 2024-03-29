import {fileURLToPath, URL} from 'node:url'

import {defineConfig} from 'vite'
import AutoImport from 'unplugin-auto-import/vite'
import Components from 'unplugin-vue-components/vite'
import {ElementPlusResolver} from 'unplugin-vue-components/resolvers'
import vue from '@vitejs/plugin-vue'

// https://vitejs.dev/config/
export default defineConfig({
    plugins: [
        vue(),
        AutoImport({
            resolvers: [ElementPlusResolver()],
        }),
        Components({
            resolvers: [ElementPlusResolver()],
        }),
    ],
    resolve: {
        alias: {
            '@': fileURLToPath(new URL('./src', import.meta.url))
        }
    },
    server: {
        host: 'localhost',
        port: 8080,
        proxy: {
            "/api": {
                target: "http://api-manager.marsview.cc",
                changeOrigin: true
            },
            "/test": {
                target: "http://localhost:3000",
                changeOrigin: true
            }
        }
    },
    build: {
        sourcemap: true
    }
})
