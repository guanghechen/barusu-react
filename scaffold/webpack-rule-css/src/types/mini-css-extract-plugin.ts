/**
 * options for mini-css-extract-plugin
 * @see https://github.com/webpack-contrib/mini-css-extract-plugin#options
 */
export interface MiniCssExtractLoaderOptions {
  /**
   * Specifies a custom public path for the target file(s).
   * @originalDefault the publicPath in webpackOptions.output
   */
  // eslint-disable-next-line @typescript-eslint/ban-types
  publicPath?: string | Function
  /**
   * By default, mini-css-extract-plugin generates JS modules
   * that use the CommonJS modules syntax. There are some cases
   * in which using ES modules is beneficial, like in the case
   * of module concatenation and tree shaking.
   * @originalDefault false
   */
  esModule?: boolean
  /**
   *
   */
  hmr?: boolean
  /**
   * reloadAll is an option that should only be enabled if HMR
   * isn't working correctly. The core challenge with css-modules
   * is that when code-split, the chunk ids can and do end up
   * different compared to the filename.
   */
  reloadAll?: boolean
}
