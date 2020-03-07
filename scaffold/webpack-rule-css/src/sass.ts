import webpack from 'webpack'
import { ResolveUrlLoaderOptions } from './types/resolve-url-loader'
import { SassLoaderOptions } from './types/sass-loader'
import { CssRuleProps, calcCssRule } from './css'


export interface SassRuleProps extends CssRuleProps {
  /**
   * options for resolve-url-loader
   */
  resolveUrlLoaderOptions?: ResolveUrlLoaderOptions
  /**
   * options for sass-loader
   */
  sassLoaderOptions?: SassLoaderOptions
}


export function calcSassRule(props: SassRuleProps): webpack.RuleSetRule {
  const {
    test = /\.(scss|sass)$/,
    isEnvProduction,
    shouldUseSourceMap,
    resolveUrlLoaderOptions,
    sassLoaderOptions,
  } = props
  const cssRule = calcCssRule({ ...props, test })
  const sassRule = {
    ...cssRule,
    use: [
      ...cssRule.use,
      {
        loader: require.resolve('resolve-url-loader'),
        options: {
          sourceMap: isEnvProduction && shouldUseSourceMap,
          ...resolveUrlLoaderOptions,
        },
      },
      {
        loader: require.resolve('sass-loader'),
        options: {
          sourceMap: true,
          ...sassLoaderOptions,
        },
      },
    ],
  }
  return sassRule
}
