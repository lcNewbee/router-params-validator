import rollupTypescript  from '@rollup/plugin-typescript'
import resolve from '@rollup/plugin-node-resolve';
import babel from '@rollup/plugin-babel'
import commonjs from '@rollup/plugin-commonjs'
import { terser } from 'rollup-plugin-terser'

export default [
  {
    input: 'src/index.ts',
    output: {
      file: 'dist/index.cjs.js',
      format: 'cjs'
    },
    external: ['jsonschema'],
    plugins: [
      resolve(),
      rollupTypescript(),
      babel({ babelHelpers: 'bundled' }),
      commonjs(),
      terser()
    ]
  },
  {
    input: 'src/index.ts',
    output: {
      file: 'dist/index.esm.js',
      format: 'es'
    },
    external: ['jsonschema'],
    plugins: [
      resolve(),
      rollupTypescript(),
      babel({ babelHelpers: 'bundled' }),
      commonjs(),
      terser()
    ]
  }
]