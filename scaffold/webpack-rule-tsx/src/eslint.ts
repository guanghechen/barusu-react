/* eslint-disable @typescript-eslint/no-var-requires */
import webpack from 'webpack'
import { EslintLoaderOptions } from './types/eslint-loader'


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
        formatter: require.resolve('@barusu-react/webpack-rule-tsx/lib/util/eslint-formtter.js'),
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
