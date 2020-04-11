/* eslint-disable @typescript-eslint/no-var-requires */
import webpack from 'webpack'
import { EslintLoaderOptions } from './types/eslint-loader'
import eslintFormatter from './util/eslint-formtter'


export interface EslintRuleProps extends webpack.RuleSetRule {
  /**
   * options for eslint-loader
   */
  eslintOptions?: EslintLoaderOptions
  /**
   * @default /\.(js|mjs|jsx|ts|tsx)$/
   */
  test?: webpack.RuleSetRule['test']
}


export function calcEslintRule(props: EslintRuleProps): webpack.RuleSetRule {
  const { eslintOptions, ...rest } = props
  const loaders: webpack.RuleSetUseItem[] = [
    {
      loader: require.resolve('eslint-loader'),
      options: {
        cache: true,
        eslintPath: require.resolve('eslint'),
        /**
         * eslint-loader cannot use string formatter
         * @see https://github.com/webpack-contrib/eslint-loader/issues/289
         */
        formatter: eslintFormatter,
        ...eslintOptions
      },
    }
  ].filter(Boolean) as webpack.RuleSetUseItem[]

  return {
    test: /\.(js|mjs|jsx|ts|tsx)$/,
    enforce: 'pre',
    ...rest,
    use: loaders,
  }
}
