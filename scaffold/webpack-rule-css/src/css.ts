/* eslint-disable @typescript-eslint/no-var-requires */
import webpack from 'webpack'
import { CSSLoaderOptions } from './types/css-loader'
import { StyleLoaderOptions } from './types/style-loader'
import { PostcssLoaderOptions } from './types/postcss-loader'
import { MiniCssExtractLoaderOptions } from './types/mini-css-extract-plugin'


export interface CssRuleProps extends webpack.RuleSetRule {
  /**
   * Whether is in development environment
   */
  isEnvDevelopment: boolean
  /**
   * Whether is in production environment
   */
  isEnvProduction: boolean
  /**
   * Whether to generate CSS source map
   */
  shouldUseSourceMap: boolean
  /**
   * Whether to generate *.d.ts
   * @default true
   */
  shouldGenerateDts?: boolean
  /**
   * options for css-loader
   */
  cssLoaderOptions?: CSSLoaderOptions
  /**
   * options for style-loader
   */
  styleLoaderOptions?: StyleLoaderOptions
  /**
   * options for postcss-loader
   */
  postcssLoaderOptions?: PostcssLoaderOptions
  /**
   * options for require('mini-css-extract-plugin').loader
   */
  miniCssExtractLoaderOptions?: MiniCssExtractLoaderOptions
}


export function calcCssRule(props: CssRuleProps): webpack.RuleSetRule {
  const {
    isEnvDevelopment,
    isEnvProduction,
    shouldUseSourceMap,
    shouldGenerateDts = true,
    styleLoaderOptions,
    miniCssExtractLoaderOptions,
    cssLoaderOptions,
    postcssLoaderOptions,
    ...rest
  } = props

  const defaultShouldUseSourceMap = Boolean(isEnvProduction && shouldUseSourceMap)
  const loaders: webpack.RuleSetUseItem[] = [
    /**
     * This loader adds the CSS to the DOM so that the styles are active and visible on the page
     */
    isEnvDevelopment && {
      loader: require.resolve('style-loader'),
      options: styleLoaderOptions,
    },
    isEnvProduction && {
      loader: require('mini-css-extract-plugin').loader,
      options: miniCssExtractLoaderOptions,
    },
    shouldGenerateDts && {
      loader: require.resolve('@teamsupercell/typings-for-css-modules-loader'),
    },
    {
      loader: require.resolve('css-loader'),
      options: {
        url: true,
        import: true,
        modules: true,
        importLoaders: 1,
        sourceMap: defaultShouldUseSourceMap,
        localsConvention: 'camelCaseOnly',
        ...cssLoaderOptions,
      }
    },
    {
      loader: require.resolve('postcss-loader'),
      options: {
        // Necessary for external CSS imports to work
        // https://github.com/facebook/create-react-app/issues/2677
        ident: 'postcss',
        plugins: () => [
          require('postcss-flexbugs-fixes'),
          require('postcss-preset-env')({
            autoprefixer: {
              flexbox: 'no-2009',
            },
            stage: 3,
          }),
          // Adds PostCSS Normalize as the reset css with default options,
          // so that it honors browserslist config in package.json
          // which in turn let's users customize the target behavior as per their needs.
          require('postcss-normalize')(),
        ],
        sourceMap: isEnvProduction && shouldUseSourceMap,
        ...postcssLoaderOptions,
      }
    }
  ].filter(Boolean) as webpack.RuleSetUseItem[]

  return {
    test: /\.css$/,
    // Don't consider CSS imports dead code even if the
    // containing package claims to have no side effects.
    // Remove this when webpack adds a warning or an error for this.
    // See https://github.com/webpack/webpack/issues/657
    sideEffects: true,
    ...rest,
    use: loaders,
  }
}
