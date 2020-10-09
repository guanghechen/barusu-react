[![npm version](https://img.shields.io/npm/v/@barusu-react/eslint-config.svg)](https://www.npmjs.com/package/@barusu-react/eslint-config)
[![npm download](https://img.shields.io/npm/dm/@barusu-react/eslint-config.svg)](https://www.npmjs.com/package/@barusu-react/eslint-config)
[![npm license](https://img.shields.io/npm/l/@barusu-react/eslint-config.svg)](https://www.npmjs.com/package/@barusu-react/eslint-config)

Eslint config for `typescript` + `react` project.


# Install

  ```shell
  yarn add --dev @barusu-react/eslint-config
  ```

# Usage

  * Use in `.eslintrc.js`
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

# Examples
  * [@barusu-react/hello-world](https://github.com/lemon-clown/barusu-react/tree/master/packages/hello-world/)
  * [@barusu-react/icons](https://github.com/lemon-clown/barusu-react/tree/master/packages/icons)
  * [@barusu-react/route-tree](https://github.com/lemon-clown/barusu-react/tree/master/packages/route-tree)
