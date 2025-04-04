import react from '@vitejs/plugin-react'
import { defineConfig } from 'vite'

// https://vite.dev/config/
export default defineConfig({
    build: {
        rollupOptions: {
            //
            //  build.rollupOptions.external`
        },
    },
    esbuild: {
        format: 'esm',
    },
    plugins: [react()],
})
