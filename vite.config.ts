import { fileURLToPath, URL } from 'node:url'

import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import checker from 'vite-plugin-checker'

// https://vitejs.dev/config/
export default defineConfig({
    plugins: [
        vue(),
        checker({
            vueTsc: true,
            eslint: {
                lintCommand: 'eslint ./src --ext .vue,.js,.jsx,.cjs,.ts'
            }
        })
    ],
    resolve: {
        alias: {
            '@': fileURLToPath(new URL('./src', import.meta.url))
        }
    },
    base: '', // relative base url for asset
    // build: {
    //     // target: ['modules'],
    //     // minify: 'esbuild',             // default use esbuild. approx 40x faster than terser
    //     outDir: '',
    //     emptyOutDir: true,
    //     sourcemap: useMode === 'development', // please add source map to svn ignore
    //     cssCodeSplit: useFormat === 'umd', // wether include in js file or use a single css file. format 'umd' default to include in js file when cssCodeSplit set to true or not set
    //     manifest: true,
    //     rollupOptions: {
    //         // external: ['vue'], // any external library you do not want to include add to here
    //         input: resolve(__dirname, `src/main_${useFormat}.ts`),
    //         output: {
    //             // entryFileNames: 'entry.umd.js',
    //             // assetFileNames: 'style.css',
    //             format: useFormat as
    //                 | 'amd'
    //                 | 'cjs'
    //                 | 'es'
    //                 | 'iife'
    //                 | 'system'
    //                 | 'umd'
    //                 | 'commonjs'
    //                 | 'esm'
    //                 | 'module'
    //                 | 'systemjs'
    //         }
    //     }
    // }
})
