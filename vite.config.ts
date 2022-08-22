/// <reference types="vitest" />
import { defineConfig } from 'vite';
import path from 'path';
import typescript from '@rollup/plugin-typescript';

function resolve(url: string) {
  return path.resolve(__dirname, url);
}

// https://vitejs.dev/config/
export default defineConfig({
  base: './',
  envPrefix: 'APP_',
  server: {
    host: '0.0.0.0',
  },
  build: {
    outDir: 'lib',
    lib: {
      entry: resolve('./src/CheckedTreeModel.ts'),
      name: 'CheckedTreeModel',
      formats: ['es', 'umd'],
      fileName: (format) => `index.${format}.js`,
    },
    rollupOptions: {
      plugins: [
        typescript({
          target: 'es2015',
          rootDir: resolve('./src'),
          declaration: true,
          declarationDir: resolve('./lib'),
          exclude: resolve('node_modules/**'),
          tsconfig: resolve('./tsconfig.json'),
        }),
      ],
    },
  },
  plugins: [],
  test: {},
});
