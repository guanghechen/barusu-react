[![npm version](https://img.shields.io/npm/v/@barusu-react/rollup-config.svg)](https://www.npmjs.com/package/@barusu-react/rollup-config)
[![npm download](https://img.shields.io/npm/dm/@barusu-react/rollup-config.svg)](https://www.npmjs.com/package/@barusu-react/rollup-config)
[![npm license](https://img.shields.io/npm/l/@barusu-react/rollup-config.svg)](https://www.npmjs.com/package/@barusu-react/rollup-config)


# Usage

  ## Install
  ```shell
  yarn add --dev @barusu-react/rollup-config
  ```

  ## Demo
  * Add `package.json`
    ```json
    {
      "name": "hello-world",
      "version": "0.0.0",
      "scripts": {
        "start": "rollup -w -c rollup.config.js",
        "build": "rollup -c rollup.config.js"
      },
      "dependencies": {
        "@types/classnames": "^2.2.9",
        "@types/react": "^16.9.23",
        "@types/react-dom": "^16.9.5",
        "classnames": "^2.2.6",
        "react": "^16.13.0",
        "react-dom": "^16.13.0"
      },
      "devDependencies": {
        "@barusu-react/eslint-config": "^0.0.1",
        "@barusu-react/rollup-config": "^0.0.1",
        "rollup": "2.28.1",
        "stylus": "^0.54.8"
      },
      "browserslist": [
        "last 2 versions",
        "Firefox ESR",
        "> 1%",
        "ie >= 11"
      ]
    }
    ```

  * Install dependencies
    ```shell
    yarn install
    ```

  * create `.eslintc`
    ```json
    {
      "extends": [
        "@barusu-react/eslint-config"
      ],
      "parserOptions": {
        "project": "./tsconfig.json"
      },
      "rules": {
      }
    }
    ```

  * create `tsconfig.json`
    ```json
    {
      "compilerOptions": {
        "moduleResolution": "node",
        "resolveJsonModule": true,
        "strict": true,
        "strictNullChecks": true,
        "noUnusedLocals": false,
        "noUnusedParameters": false,
        "noImplicitAny": true,
        "noImplicitThis": true,
        "noImplicitReturns": false,
        "alwaysStrict": true,
        "suppressImplicitAnyIndexErrors": true,
        "newLine": "LF",
        "removeComments": false,
        "composite": true,
        "declarationMap": true,
        "declaration": true,
        "sourceMap": true,
        "pretty": false,
        "esModuleInterop": true,
        "allowSyntheticDefaultImports": true,
        "experimentalDecorators": true,
        "forceConsistentCasingInFileNames": true,
        "downlevelIteration": true,
        "outDir": "lib",
        "rootDir": "src",
        "target": "es5",
        "module": "esnext",
        "jsx": "react",
        "lib": [
          "esnext",
          "dom",
          "dom.iterable"
        ]
      },
      "include": [
        "src"
      ]
    }
    ```

  * Create rollup configuration `rollup.config.js`
    ```javascript
    import path from 'path'
    import { createRollupConfig } from '@barusu-react/rollup-config'
    import manifest from './package.json'

    const resolvePath = p => path.resolve(__dirname, p)
    const paths = {
      source: {
        stylesheetInput: [
          resolvePath('src/**/*.styl'),
        ],
        assetsRoot: path.resolve(__dirname, 'src/assets'),
      },
      eslintrc: resolvePath('.eslintrc.js'),
      tsconfig: resolvePath('tsconfig.json'),
    }

    const config = createRollupConfig({
      manifest,
      preprocessOptions: {
        stylesheets: {
          input: paths.source.stylesheetInput,
          pluginOptions: {
            multiEntryOptions: {
              exports: false,
            },
            postcssOptions: {
              modules: {
                camelCase: true,
              },
            }
          },
        }
      },
      pluginOptions: {
        eslintOptions: {
          configFile: paths.eslintrc,
        },
        typescriptOptions: {
          tsconfig: paths.tsconfig,
          useTsconfigDeclarationDir: true,
        },
        commonjsOptions: {
          include: ['./node_modules/**'],
        },
        postcssOptions: {
          extract: false,
          minimize: true,
          modules: {
            camelCase: true,
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

    export default config
    ```

  * Create a entry file `src/index.tsx`
    ```tsx
    import React from 'react'
    import classes from './style.styl'


    export interface HelloWorldProps {
      content?: string
    }


    export function HelloWorld(props: HelloWorldProps): React.ReactElement {
      const { content = 'Hello, world!' } = props
      return (
        <div className={ classes.container }>
          <h1 className={ classes.content }>{ content }</h1>
        </div>
      )
    }
    ```

  * Create a stylus file `src/index.styl`
    ```stylus
    .container
      display: flex
      .content
        font-family: 'Comic Sans', sans-serif
        font-size: 18px
        color: #1a1a1a
        line-height: 1.75
    ```

  * Commands:
    - `yarn build`
    - `yarn start`

# Options

## manifest

   property       | type                      | required  | description
  :--------------:|:-------------------------:|:---------:|:------------------------
   `source`       | `string`                  | `true`    | source entry file
   `main`         | `string`                  | `false`   | target entry file of cjs
   `module`       | `string`                  | `false`   | target entry file of es
   `dependencies` | `{[key: string]: string}` | `false`   | ignore these dependencies (`external`)


## preprocessOptions

### stylesheet
  property         | required  | description
 :----------------:|:---------:|:------------
  `input`          | `true`    | see [Supported Input Types][multi-entry-input-types]
  `output`         | `false`   |
  `pluginOptions`  | `false`   |

* `pluginOptions`:
    property             | required  | description
  :--------------------:|:---------:|:------------
    `multiEntryOptions`  | `false`   | options for [@rollup/plugin-multi-entry][]
    `postcssOptions`     | `false`   | options for [@barusu-react/rollup-plugin-postcss-dts][]

## pluginOptions
   property                   | required  | description
  :--------------------------:|:---------:|:------------
   `eslintOptions`            | `false`   | options for [rollup-plugin-eslint][]
   `nodeResolveOptions`       | `false`   | options for [@rollup/plugin-node-resolve][]
   `commonjsOptions`          | `false`   | options for [@rollup/plugin-commonjs][]
   `typescriptOptions`        | `false`   | options for [rollup-plugin-typescript2][]
   `peerDepsExternalOptions`  | `false`   | options for [rollup-plugin-peer-deps-external][]
   `postcssOptions`           | `false`   | options for [@barusu-react/rollup-plugin-postcss-dts][]


# References
  * [@barusu-react/hello-world](https://github.com/lemon-clown/barusu-react/tree/master/packages/hello-world#readme)



[rollup-plugin-eslint]: https://github.com/TrySound/rollup-plugin-eslint#readme
[@rollup/plugin-node-resolve]: https://github.com/rollup/plugins/tree/master/packages/node-resolve#readme
[@rollup/plugin-multi-entry]: https://github.com/rollup/plugins/tree/master/packages/multi-entry#readme
[@rollup/plugin-commonjs]: https://github.com/rollup/plugins/tree/master/packages/commonjs#readme
[rollup-plugin-typescript2]: https://github.com/ezolenko/rollup-plugin-typescript2#readme
[rollup-plugin-peer-deps-external]: https://github.com/pmowrer/rollup-plugin-peer-deps-external#readme
[@barusu-react/rollup-plugin-postcss-dts]: https://github.com/lemon-clown/barusu-react/tree/master/scaffold/rollup-plugin-postcss-dts#readme
[multi-entry-input-types]: https://github.com/rollup/plugins/tree/master/packages/multi-entry#supported-input-types
