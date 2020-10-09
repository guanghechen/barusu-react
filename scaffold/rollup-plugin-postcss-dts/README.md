[![npm version](https://img.shields.io/npm/v/@barusu-react/rollup-plugin-postcss-dts.svg)](https://www.npmjs.com/package/@barusu-react/rollup-plugin-postcss-dts)
[![npm download](https://img.shields.io/npm/dm/@barusu-react/rollup-plugin-postcss-dts.svg)](https://www.npmjs.com/package/@barusu-react/rollup-plugin-postcss-dts)
[![npm license](https://img.shields.io/npm/l/@barusu-react/rollup-plugin-postcss-dts.svg)](https://www.npmjs.com/package/@barusu-react/rollup-plugin-postcss-dts)


# Install

  ```shell
  yarn add --dev @barusu-react/rollup-plugin-postcss-dts
  ```

# Examples

  * [@barusu-react/rollup-config](https://github.com/lemon-clown/barusu-react/tree/master/scaffold/rollup-config)


# Options

## dts

  * boolean
    - `true`: use default [CSSDtsProps](#cssdtsprops)

    - `false`: don't generate *.d.ts (default)

  * CSSDtsProps

    - `indent: {string}`:
      - Default: `  ` (two spaces)

    - `semicolon: {boolean}`: whether to add a semicolon at the end of the statement
      - Default: `false`

    - `encoding: {string}`: encoding of the target '.d.ts' file
      - Default: `utf-8`

    - `alsoCreateTargetCssDts: {boolean}`: whether to aslo create a '*.d.s' file for the output CSS files
      - Default: `false`

    - `hook: {GetCSSTokenHook}`:
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

    - `shouldGenerateDtsFile`:
      ```typescript
      /**
       * Determine whether to generate typescript declaration file
       * for the specified file
       *
       * @param cssPath         filepath of the css file
       * @param json            css class name map
       * @param outputFilepath  filepath of the ts declaration file
       */
      shouldGenerateDtsFile?: (
        cssPath: string,
        json: { [key: string]: string },
        outputFilePath: string,
      ) => boolean
      ```

## Other Options

  * see [rollup-plugin-postcss](https://github.com/egoist/rollup-plugin-postcss#readme)

# References

  * [rollup-plugin-postcss](https://github.com/egoist/rollup-plugin-postcss#readme)
  * [@barusu-react/rollup-config](https://www.npmjs.com/package/@barusu-react/rollup-config)
    - It is recommended to use this build configuration directly.
