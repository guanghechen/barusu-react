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
  parser?: string | object
  /**
   * Set PostCSS Syntax
   */
  syntax?: string | object
  /**
   * Set PostCSS Stringifier
   */
  stringifier?: string | object
  /**
   * Set postcss.config.js config path && ctx
   */
  config?: object
  /**
   * Set PostCSS Plugins
   * @default []
   */
  plugins?: Function
  /**
   * Enable Source Maps
   * @default false
   */
  sourceMap?: string | boolean
}

