/**
 * options for style-loader
 * @see https://github.com/webpack-contrib/style-loader#options
 */
export interface StyleLoaderOptions {
  /**
   * Allows to setup how styles will be injected into the DOM
   * @originalDefault 'styleTag'
   */
  injectType?: 'styleTag' | 'singletonStyleTag' | 'lazyStyleTag'
                | 'lazySingletonStyleTag' | 'linkTag' | string
  /**
   * If defined, the style-loader will attach given attributes
   * with their values on `<style>` / `<link>` element.
   * @originalDefault {}
   */
  attributes?: Record<string, unknown>
  /**
   * By default, the style-loader appends `<style>` / `<link>` elements
   * to the end of the style target, which is the <head> tag of the page
   * unless specified by insert.
   * This will cause CSS created by the loader to take priority over CSS
   * already present in the target. You can use other values if the standard
   * behavior is not suitable for you, but we do not recommend doing this.
   * If you target an iframe make sure you have sufficient access rights,
   * the styles will be injected into the content document head.
   * @originalDefault 'head'
   */
  insert?: string | Record<string, unknown>
  /**
   * Sets module ID base (DLLPlugin)
   */
  base?: number
  /**
   * Use ES modules syntax
   * @originalDefault false
   */
  esModule?: boolean
}
