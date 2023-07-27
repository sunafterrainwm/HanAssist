// @ts-check
import { defineConfig } from 'rollup';
import typescript from '@rollup/plugin-typescript';
import terser from '@rollup/plugin-terser';
import { readFileSync } from 'fs';
import mwGadget from 'rollup-plugin-mediawiki-gadget';
import replace from '@rollup/plugin-replace';

const compat = process.env.COMPAT !== undefined;

export default defineConfig({
  input: 'lib/index.ts',
  output: {
    file: 'dist/Gadget-HanAssist.js',
    format: 'umd', // Use UMD so the script works outside a module system
    name: 'mw.libs.HanAssist',
    generatedCode: 'es5', // Keep in sync with tsconfig.json
    inlineDynamicImports: true,
    banner: readFileSync('./assets/intro.js').toString(),
    footer: readFileSync('./assets/outro.js').toString(),
  },
  plugins: [
    typescript(),
    replace({
      preventAssignment: true,
      COMPAT: JSON.stringify(compat),
    }),
    mwGadget({
      gadgetDef: './gadget-definition.txt',
    }),
    terser({
      format: {
        comments: /(^\*!|nowiki)/i, // Preserve banners & nowiki guards
      },
      ecma: 5, // Keep in sync with tsconfig.json
    }),
  ],
});
