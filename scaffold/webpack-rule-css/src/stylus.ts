import webpack from 'webpack'
import { CssRuleProps, calcCssRule } from './css'
import { ResolveUrlLoaderOptions } from './types/resolve-url-loader'
import { StylusLoaderOptions } from './types/stylus-loader'


export interface StylusRuleProps extends CssRuleProps {
  /**
   * options for resolve-url-loader
   */
  resolveUrlLoaderOptions?: ResolveUrlLoaderOptions
  /**
   * options for stylus-loader
   */
  stylusLoaderOptions?: StylusLoaderOptions
}


export function calcStylusRule(props: StylusRuleProps): webpack.RuleSetRule {
  const {
    test = /\.styl$/,
    isEnvProduction,
    shouldUseSourceMap,
    resolveUrlLoaderOptions,
    stylusLoaderOptions,
  } = props
  const cssRule = calcCssRule({ ...props, test })
  const stylusRule = {
    ...cssRule,
    use: [
      ...(cssRule.use as webpack.RuleSetUseItem[]),
      {
        loader: require.resolve('resolve-url-loader'),
        options: {
          sourceMap: isEnvProduction && shouldUseSourceMap,
          ...resolveUrlLoaderOptions,
        },
      },
      {
        loader: require.resolve('stylus-loader'),
        options: {
          sourceMap: true,
          ...stylusLoaderOptions,
        },
      },
    ],
  }
  return stylusRule
}
