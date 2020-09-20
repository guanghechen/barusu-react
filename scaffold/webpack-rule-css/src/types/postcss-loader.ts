/**
 * options for postcss-loader
 * @see https://github.com/postcss/postcss-loader#options
 */
export interface PostcssLoaderOptions {
  /**
   * Enable PostCSS Parser support in CSS-in-JS
   */
  exec?: boolean
  /**
   * Set PostCSS Parser
   */
  parser?: string | Record<string, unknown>
  /**
   * Set PostCSS Syntax
   */
  syntax?: string | Record<string, unknown>
  /**
   * Set PostCSS Stringifier
   */
  stringifier?: string | Record<string, unknown>
  /**
   * Set postcss.config.js config path && ctx
   */
  config?: Record<string, unknown>
  /**
   * Set PostCSS Plugins
   * @default []
   */
  // eslint-disable-next-line @typescript-eslint/ban-types
  plugins?: Function
  /**
   * Enable Source Maps
   * @default false
   */
  sourceMap?: string | boolean
}

