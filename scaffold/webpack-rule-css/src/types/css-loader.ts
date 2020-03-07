/**
 * options for css-loader
 * @see https://github.com/webpack-contrib/css-loader#options
 */
export interface CSSLoaderOptions {
  /**
   * Enables/Disables url/image-set functions handling
   * @default true
   * @originalDefault true
   */
  url?: boolean | Function
  /**
   * Enables/Disables @import at-rules handling
   * @default true
   * @originalDefault true
   */
  import?: boolean | Function
  /**
   * Enables/Disables CSS Modules and their configuration
   * @default true
   * @originalDefault false
   */
  modules?: boolean | string | Record<string, any>
  /**
   * Enables/Disables generation of source maps
   * @originalDefault false
   */
  sourceMap?: boolean
  /**
   * Enables/Disables or setups number of loaders applied before CSS loader
   * @default 1
   * @originalDefault 0
   */
  importLoaders?: number
  /**
   * Style of exported classnames
   * @default 'camelCaseOnly'
   * @originalDefault 'asIs'
   */
  localsConvention?: 'asIs' | 'camelCase' | 'camelCaseOnly' | 'dashes' | 'dashesOnly' | string
  /**
   * Export only locals
   * @originalDefault false
   */
  onlyLocals?: boolean
  /**
   * Use ES modules syntax
   * @originalDefault false
   */
  esModule?: boolean
}
