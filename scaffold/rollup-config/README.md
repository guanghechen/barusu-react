[![npm version](https://img.shields.io/npm/v/@barusu-react/rollup-config.svg)](https://www.npmjs.com/package/@barusu-react/rollup-config)
[![npm download](https://img.shields.io/npm/dm/@barusu-react/rollup-config.svg)](https://www.npmjs.com/package/@barusu-react/rollup-config)
[![npm license](https://img.shields.io/npm/l/@barusu-react/rollup-config.svg)](https://www.npmjs.com/package/@barusu-react/rollup-config)


# Install

  ```shell
  yarn add --dev @barusu-react/rollup-config
  ```

# Usage

  * Use in `rollup.config.js`
    - <details><summary>rollup.config.js</summary>

      ```javascript
      import path from 'path'
      import {
        createPreprocessorConfig,
        createRollupConfig,
      } from '@barusu-react/rollup-config'
      import manifest from './package.json'

      const resolvePath = p => path.resolve(__dirname, p)
      const paths = {
        source: {
          stylesheetInput: [
            resolvePath('src/style/index.styl'),
          ],
          assetsRoot: resolvePath('src/assets'),
        },
        eslintrc: resolvePath('.eslintrc.js'),
        tsconfig: resolvePath('tsconfig.src.json'),
      }

      const preprocessorConfig = createPreprocessorConfig({
        input: paths.source.stylesheetInput,
        pluginOptions: {
          multiEntryOptions: {
            exports: false,
          },
          postcssOptions: {
            modules: {
              localsConvention: 'camelCase',
            },
          }
        },
      })

      const config = createRollupConfig({
        manifest,
        pluginOptions: {
          typescriptOptions: {
            tsconfig: paths.tsconfig,
          },
          postcssOptions: {
            extract: false,
            minimize: true,
            modules: {
              localsConvention: 'camelCase',
              generateScopedName: 'barusu-[local]',
            },
            pluginOptions: {
              postcssUrlOptions: {
                url: 'inline',
                basePath: paths.source.assetsRoot,
              }
            },
          }
        }
      })

      const resolvedConfig = [preprocessorConfig, config]

      export default resolvedConfig
      ```

# Examples

  * [@barusu-react/hello-world](https://github.com/lemon-clown/barusu-react/tree/master/packages/hello-world)
  * [@barusu-react/icons](https://github.com/lemon-clown/barusu-react/tree/master/packages/icons)
  * [@barusu-react/route-tree](https://github.com/lemon-clown/barusu-react/tree/master/packages/route-tree)

# Options


## preprocessOptions

* `input`: Input config
  - type: `string | string[] | { include?: string[], exclude?: string }`
  - required: `true`
  - see [Supported Input Types][multi-entry-input-types]

* `output`: Output config
  - type: `rollup.OutputOptions | rollup.OutputOptions[]`
  - required: `false`

* `pluginOptions`:

   property             | required  | description
  :--------------------:|:---------:|:------------
   `multiEntryOptions`  | `false`   | options for [@rollup/plugin-multi-entry][]
   `postcssOptions`     | `false`   | options for [@barusu-react/rollup-plugin-postcss-dts][]


## Options of createRollupConfig

* `useSourceMap`: Whether to generate sourceMap (includes declarationMap)
  - type: `boolean`
  - default: true

* `externalAllDependencies`: Whether to exhaust all dependencies (include dependencies of child dependency)
  - type: `boolean`
  - default: true

* `manifest`

   property       | type                      | required  | description
  :--------------:|:-------------------------:|:---------:|:------------------------
   `source`       | `string`                  | `true`    | source entry file
   `main`         | `string`                  | `false`   | target entry file of cjs
   `module`       | `string`                  | `false`   | target entry file of es
   `dependencies` | `{[key: string]: string}` | `false`   | ignore these dependencies (`external`)

* `pluginOptions`

   property                   | required  | description
  :--------------------------:|:---------:|:------------
   `jsonOptions`              | `false`   | options for [@rollup/plugin-json][]
   `nodeResolveOptions`       | `false`   | options for [@rollup/plugin-node-resolve][]
   `typescriptOptions`        | `false`   | options for [rollup-plugin-typescript2][]
   `commonjsOptions`          | `false`   | options for [@rollup/plugin-commonjs][]
   `peerDepsExternalOptions`  | `false`   | options for [rollup-plugin-peer-deps-external][]
   `postcssOptions`           | `false`   | options for [@barusu-react/rollup-plugin-postcss-dts][]


[@rollup/plugin-json]: https://github.com/rollup/plugins/tree/master/packages/json#readme
[@rollup/plugin-node-resolve]: https://github.com/rollup/plugins/tree/master/packages/node-resolve#readme
[@rollup/plugin-multi-entry]: https://github.com/rollup/plugins/tree/master/packages/multi-entry#readme
[@rollup/plugin-commonjs]: https://github.com/rollup/plugins/tree/master/packages/commonjs#readme
[rollup-plugin-typescript2]: https://github.com/ezolenko/rollup-plugin-typescript2#readme
[rollup-plugin-peer-deps-external]: https://github.com/pmowrer/rollup-plugin-peer-deps-external#readme
[@barusu-react/rollup-plugin-postcss-dts]: https://github.com/lemon-clown/barusu-react/tree/master/scaffold/rollup-plugin-postcss-dts#readme
[multi-entry-input-types]: https://github.com/rollup/plugins/tree/master/packages/multi-entry#supported-input-types
