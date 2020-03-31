[![npm version](https://img.shields.io/npm/v/@barusu-react/eslint-config.svg)](https://www.npmjs.com/package/@barusu-react/eslint-config)
[![npm download](https://img.shields.io/npm/dm/@barusu-react/eslint-config.svg)](https://www.npmjs.com/package/@barusu-react/eslint-config)
[![npm license](https://img.shields.io/npm/l/@barusu-react/eslint-config.svg)](https://www.npmjs.com/package/@barusu-react/eslint-config)


# Usage

  * Install
    ```shell
    yarn add --dev @barusu-react/eslint-config
    ```

  * Use in .eslint.rc
    ```javascript
    module.exports = {
      root: true,
      extends: [
        '@barusu-react/eslint-config'
      ],
      parserOptions: {
        tsconfigRootDir: __dirname,
        project: './tsconfig.json'
      },
      rules: {
      }
    }
    ```
