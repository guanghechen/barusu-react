/**
 * @see https://github.com/webpack-contrib/sass-loader#options
 */
export interface SassLoaderOptions {
  /**
   * The special implementation option determines which implementation of Sass to use.
   * @originalDefault require('sass')
   */
  implementation?: any
  /**
   *
   */
  sassOptions?: object | Function
  /**
   * Enables/Disables generation of source maps
   * @originalDefault depends on the compiler.devtool value
   */
  sourceMap?: boolean
  /**
   * Enables/Disables the default Webpack importer.
   * @originalDefault true
   */
  webpackImporter?: boolean
}
