[![npm version](https://img.shields.io/npm/v/@barusu-react/rollup-plugin-postcss-dts.svg)](https://www.npmjs.com/package/@barusu-react/rollup-plugin-postcss-dts)
[![npm download](https://img.shields.io/npm/dm/@barusu-react/rollup-plugin-postcss-dts.svg)](https://www.npmjs.com/package/@barusu-react/rollup-plugin-postcss-dts)
[![npm license](https://img.shields.io/npm/l/@barusu-react/rollup-plugin-postcss-dts.svg)](https://www.npmjs.com/package/@barusu-react/rollup-plugin-postcss-dts)


# Usage

  ## Install
    ```shell
    yarn add --dev @barusu-react/rollup-plugin-postcss-dts
    ```

  ## Demo

  * Install dependencies
    ```shell
    yarn add --dev @barusu-react/rollup-plugin-postcss-dts autoprefixer stylus\
    @rollup/plugin-commonjs rollup-plugin-typescript2 rollup-plugin-peer-deps-external\
    rollup-plugin-peer-deps-external
    ```

  * Create rollup configuration `rollup.config.js`
    ```javascript
    import postcss from '@barusu-react/rollup-plugin-postcss-dts'
    import commonjs from '@rollup/plugin-commonjs'
    import nodeResolve from '@rollup/plugin-node-resolve'
    import typescript from 'rollup-plugin-typescript2'
    import peerDepsExternal from 'rollup-plugin-peer-deps-external'
    import autoprefixer from 'autoprefixer'

    export default {
      input: 'src/index.tsx',
      output: [
        {
          file: 'lib/index.js',
          format: 'cjs',
          exports: 'named',
          sourcemap: true,
        },
        manifest.module && {
          file: 'lib/es/index.js',
          format: 'es',
          exports: 'named',
          sourcemap: true,
        }
      ],
      plugins: [
        typescript({
          clean: true,
          typescript: require('typescript'),
          rollupCommonJSResolveHack: true,
        }),
        commonjs({
          include: ['../../node_modules/**'],
          exclude: ['**/*.stories.js'],
          namedExports: {
            'react': Object.keys(react),
            'react-dom': Object.keys(reactDOM),
          },
        }),
        peerDepsExternal(),
        nodeResolve({
          browser: true,
        }),
        postcss({
          dts: {
            semicolon: true,
          },
          plugins: [autoprefixer]
          extract: true,
          extensions: ['.css'],
          minimize: false,
          modules: {
            camelCase: true,
            generateScopedName: 'barusu-[local]',
          },
        })
      ]
    }
    ```

  * Create a entry file `src/index.tsx`
    ```tsx
    import React from 'react'
    import * as classes from './index.styl'

    export interface AppProps {

    }

    export function App(props: AppProps): React.ReactElement {
      return (
        <div>PDF</div>
      )
    }
    ```

  * Create a stylus file `src/index.styl`
    ```styl
    .container
      display: fle
    ```

  * Run `rollup -c rollup.config.js`

# Options

## dts

### boolean
  * `true`: use default [CSSDtsProps](#cssdtsprops)

  * `false`: don't generate *.d.ts (default)

### CSSDtsProps

  * `indent: {string}`:
    - default: `  `

  * `semicolon: {boolean}`: whether to add a semicolon at the end of the statement
    - default: `false`

  * `encoding: {string}`: encoding of the target '.d.ts' file
    - default: `utf-8`

  * `alsoCreateTargetCssDts: {boolean}`: whether to aslo create a '*.d.s' file for the output CSS files
    - default: `false`

  * `hook: {GetCSSTokenHook}`:
    ```typescript
    interface GetCSSTokenHook {
      /**
       * get css tokens.
       * @param cssPath
       * @param json
       * @param outputFilePath
       * @see https://github.com/css-modules/postcss-modules#saving-exported-classes
       */
      getJSON?: (
        cssPath: string,
        json: { [key: string]: string },
        outputFilePath: string,
      ) => Promise<void> | void
    }
    ```

## Other Options

  * see [rollup-plugin-postcss](https://github.com/egoist/rollup-plugin-postcss#readme)
