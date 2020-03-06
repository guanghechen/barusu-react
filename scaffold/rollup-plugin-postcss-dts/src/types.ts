export interface GetCSSTokenHook {
  /**
   * get css tokens.
   * @param cssPath
   * @param json
   * @param outputFilePath
   * @see https://github.com/css-modules/postcss-modules#saving-exported-classes
   */
  getJSON?: (
    cssPath: string,
    json: { [key: string]: string },
    outputFilePath: string,
  ) => Promise<void> | void
}
