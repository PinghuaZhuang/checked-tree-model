/// <reference types="vitest" />
import { defineConfig } from 'vite';
import lodash from 'lodash';
import path from 'path';
import dts from 'vite-plugin-dts';
import pkg from './package.json';

const { upperFirst, camelCase } = lodash;

const pkgName = upperFirst(camelCase(pkg.name.replace(/^.*?([\w-]+)$/, '$1')));

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
      name: pkgName,
      formats: ['es', 'umd'],
      fileName: (format) => `index.${format}.js`,
    },
  },
  plugins: [dts()],
});
