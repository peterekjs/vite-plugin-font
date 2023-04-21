import { resolve } from 'node:path'

import { defineConfig } from 'vite'
import dts from 'vite-plugin-dts'
import { getExternals } from '@peterek/rollup-externals'

import { dependencies } from './package.json'

export default defineConfig({
  build: {
    lib: {
      entry: resolve(__dirname, 'src/index.ts'),
      fileName: 'font',
      formats: ['cjs', 'es']
    },
    rollupOptions: {
      external: [/^node:/, ...getExternals(dependencies)]
    },
    sourcemap: true,
    target: 'esnext',
    minify: true
  },
  plugins: [dts()]
})
