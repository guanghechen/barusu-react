/* eslint-disable @typescript-eslint/no-var-requires */
import webpack from 'webpack'
import { BabelLoaderOptionsForTsx } from './types/babel-loader'


export interface TsxRuleProps extends webpack.RuleSetRule {
  /**
   * Whether is in production environment
   */
  isEnvProduction: boolean
  /**
   * options for babel-loader
   */
  babelLoaderOptions?: BabelLoaderOptionsForTsx
  /**
   * @default /\.(js|mjs|jsx|ts|tsx)$/
   */
  test?: webpack.RuleSetRule['test']
}


export function calcTsxRule(props: TsxRuleProps): webpack.RuleSetRule {
  const {
    isEnvProduction,
    babelLoaderOptions,
    ...rest
  } = props

  const loaders: webpack.RuleSetUseItem[] = [
    {
      loader: require.resolve('babel-loader'),
      options: {
        // This is a feature of `babel-loader` for webpack (not Babel itself).
        // It enables caching results in ./node_modules/.cache/babel-loader/
        // directory for faster rebuilds.
        cacheDirectory: true,
        // See #6846 for context on why cacheCompression is disabled
        cacheCompression: false,
        compact: isEnvProduction,
        customize: require.resolve('babel-preset-react-app/webpack-overrides'),
        plugins: [
          [
            require.resolve('babel-plugin-named-asset-import'),
            {
              loaderMap: {
                svg: {
                  ReactComponent: '@svgr/webpack?-svgo,+titleProp,+ref![path]',
                },
              },
            },
          ],
        ],
        ...babelLoaderOptions,
      }
    }
  ].filter(Boolean) as webpack.RuleSetUseItem[]

  return {
    test: /\.(js|mjs|jsx|ts|tsx)$/,
    ...rest,
    use: loaders,
  }
}
