[![npm version](https://img.shields.io/npm/v/@barusu-react/webpack-rule-tsx.svg)](https://www.npmjs.com/package/@barusu-react/webpack-rule-tsx)
[![npm download](https://img.shields.io/npm/dm/@barusu-react/webpack-rule-tsx.svg)](https://www.npmjs.com/package/@barusu-react/webpack-rule-tsx)
[![npm license](https://img.shields.io/npm/l/@barusu-react/webpack-rule-tsx.svg)](https://www.npmjs.com/package/@barusu-react/webpack-rule-tsx)


# Usage

  * Install
    ```shell
    yarn add --dev @barusu-react/webpack-rule-tsx
    ```

  * Use in webpack.config.js/webpack.config.ts
    ```typescript
    import path from 'path'
    import { calcTsxRule, calcOutsideJsRule, calcEslintRule } from '@barusu-react/webpack-rule-tsx'

    export default {
      ...
      module: {
        rules: [
          ...
          // First, run the linter.
          // It's important to do this before Babel processes the JS.
          {
            calcEslintRule({
              include: path.resolve('src'),
              eslintOptions: {
                resolvePluginsRelativeTo: __dirname,
              }
            })
          },
          {
            // "oneOf" will traverse all following loaders until one will
            // match the requirements. When no loader matches it will fall
            // back to the "file" loader at the end of the loader list.
            oneOf: [
              ...
              // Process application JS with Babel.
              // The preset includes JSX, Flow, TypeScript, and some ESnext features.
              calcTsxRule({
                include: path.resolve('src'),
                isEnvProduction: process.env.NODE_ENV === 'production',
                babelLoaderOptions: { }, // optional
              }),
              // Process any JS outside of the app with Babel.
              // Unlike the application JS, we only compile the standard ES features.
              calcOutsideJsRule({
                shouldUseSourceMap: true,
                babelLoaderOptions: { }, // optional
              }),
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
  * `calcTsxRule`: see [TsxRuleProps](https://github.com/lemon-clown/barusu-react/tree/master/scaffold/webpack-rule-tsx/src/tsx.ts#L6)

  * `calcOutsideJsRule`: see [OutsideJsRuleProps](https://github.com/lemon-clown/barusu-react/tree/master/scaffold/webpack-rule-tsx/src/outside-js.ts#L6)

  * `calcEslintRule`: see [EslintRuleProps](https://github.com/lemon-clown/barusu-react/tree/master/scaffold/webpack-rule-tsx/src/eslint.ts#L6)
