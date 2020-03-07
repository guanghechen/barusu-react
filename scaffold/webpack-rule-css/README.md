[![npm version](https://img.shields.io/npm/v/@barusu-react/webpack-rule-css.svg)](https://www.npmjs.com/package/@barusu-react/webpack-rule-css)
[![npm download](https://img.shields.io/npm/dm/@barusu-react/webpack-rule-css.svg)](https://www.npmjs.com/package/@barusu-react/webpack-rule-css)
[![npm license](https://img.shields.io/npm/l/@barusu-react/webpack-rule-css.svg)](https://www.npmjs.com/package/@barusu-react/webpack-rule-css)


# Usage

  * Install
    ```shell
    yarn add --dev @barusu-react/webpack-rule-css
    ```

    - If you want to generate `*.d.ts`, more `optionalDependencies` need to install:
      -  `@teamsupercell/typings-for-css-modules-loader`

    - If you want to support `*.styl`, more `optionalDependencies` need to install:
      - `resolve-url-loader`
      - `stylus`
      - `stylus-loader`

    - If you want to support `*.sass|*.scss`, more `optionalDependencies` need to install:
      - `resolve-url-loader`
      - `node-sass`
      - `sass-loader`

  * Use in webpack.config.js/webpack.config.ts
    ```typescript
    import path from 'path'
    import {
      calcCssRule, calcStylusRule,
      CssRuleProps, StylusRuleProps,
    } from '@barusu-react/webpack-rule-css'

    const publicUrlOrPath = '/'
    const cssRuleOptions: CssRuleProps = {
      include: path.resolve('src'),
      isEnvDevelopment: process.env.NODE_ENV === 'development',
      isEnvProduction: process.env.NODE_ENV === 'production',
      shouldUseSourceMap: true,

      // optionals
      shouldGenerateDts: true,
      styleLoaderOptions: {}
      miniCssExtractLoaderOptions: {
        // assume css located in `static/css`, use '../../' to locate index.html folder
        // in production `publicUrlOrPath` can be a relative path
        publicPath: publicUrlOrPath.startsWith('.') ? undefined : '../../',
      },
      cssLoaderOptions: {
        modules: {
          localIdentName: 'barusu-[local]'
        },
      },
      postcssLoaderOptions: {}
    }

    const stylusRuleOptions: StyleRuleProps = {
      ...cssRuleOptions,

      // optionals
      resolveUrlLoaderOptions: {},
      stylusLoaderOptions: {},
    }

    export default {
      ...
      module: {
        rules: [
          ...
          {
            // "oneOf" will traverse all following loaders until one will
            // match the requirements. When no loader matches it will fall
            // back to the "file" loader at the end of the loader list.
            oneOf: [
              ...
              // process *.css
              calcCssRule(cssRuleOptions),
              // process *.styl
              calcStylusRule(stylusRuleOptions),
              ...
            ]
          }
          ...
        ]
      }
      ...
    }
    ```

# Options
  * `calcCssRule`: see [CssRuleProps](https://github.com/lemon-clown/barusu-reactd/blob/master/scaffold/webpack-rule-css/src/css.ts#L9)

  * `calcStylusRule`: see [StylusRuleProps](https://github.com/lemon-clown/barusu-reactd/blob/master/scaffold/webpack-rule-css/src/stylus.ts#L7)

  * `calcSassRule`: see [SassRuleProps](https://github.com/lemon-clown/barusu-reactd/blob/master/scaffold/webpack-rule-css/src/sass.ts#L7)
