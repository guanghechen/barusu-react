/* eslint-disable @typescript-eslint/no-var-requires */
import webpack from 'webpack'
import { BabelLoaderOptionsForOutsideJs } from './types/babel-loader'


export interface OutsideJsRuleProps extends webpack.RuleSetRule {
  /**
   * Whether to generate babel sourcemaps
   */
  shouldUseSourceMap: boolean
  /**
   * options for babel-loader
   */
  babelLoaderOptions?: BabelLoaderOptionsForOutsideJs
  /**
   * @default /\.(js|mjs)$/
   */
  test?: webpack.RuleSetRule['test']
  /**
   * @default /@babel(?:\/|\\{1,2})runtime/
   */
  exclude?: webpack.RuleSetRule['exclude']
}


export function calcOutsideJsRule(props: OutsideJsRuleProps): webpack.RuleSetRule {
  const {
    shouldUseSourceMap,
    babelLoaderOptions,
    ...rest
  } = props

  const loaders: webpack.RuleSetUseItem[] = [
    {
      loader: require.resolve('babel-loader'),
      options: {
        babelrc: false,
        configFile: false,
        compact: false,
        presets: [
          [
            require.resolve('babel-preset-react-app/dependencies'),
            { helpers: true },
          ],
        ],

        cacheDirectory: true,
        // See #6846 for context on why cacheCompression is disabled
        cacheCompression: false,

        // Babel sourcemaps are needed for debugging into node_modules
        // code.  Without the options below, debuggers like VSCode
        // show incorrect code and set breakpoints on the wrong lines.
        sourceMaps: shouldUseSourceMap,
        inputSourceMap: shouldUseSourceMap,
        ...babelLoaderOptions,
      }
    }
  ].filter(Boolean) as webpack.RuleSetUseItem[]

  return {
    test: /\.(js|mjs)$/,
    exclude: /@babel(?:\/|\\{1,2})runtime/,
    ...rest,
    use: loaders,
  }
}
