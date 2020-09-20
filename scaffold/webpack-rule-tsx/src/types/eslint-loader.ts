/**
 * @see https://github.com/webpack-contrib/eslint-loader#options
 * @see https://eslint.org/docs/developer-guide/nodejs-api#cliengine
 */
export interface EslintLoaderOptions {
  /**
   * Determines the folder where plugins should be resolved from. Should be
   * used when an integration installs plugins and uses those plugins to lint
   * code on behalf of the end user
   */
  resolvePluginsRelativeTo?: string
  /**
   * This option will enable caching of the linting results into a file. This
   * is particularly useful in reducing linting time when doing a full build.
   * This can either be a boolean value or the cache directory
   * path(ex: './.eslint-loader-cache').
   * If cache: true is used, the cache is written to the
   * ./node_modules/.cache/eslint-loader directory. (Recommend).
   *
   * @default true
   * @originalDefault false
   */
  cache?: boolean | string
  /**
   * Path to eslint instance that will be used for linting. If the eslintPath
   * is a folder like a official eslint, or specify a formatter option.
   * Now you dont have to install eslint.
   *
   * @default <require.resolve('eslint')>
   * @originalDefault 'eslint'
   */
  eslintPath?: string
  /**
   * This option will enable ESLint autofix feature.
   * Be careful: this option will change source files.
   *
   * @originalDefault false
   */
  fix?: boolean
  /**
   * This option accepts a function that will have one argument: an array of
   * eslint messages (object). The function must return the output as a string.
   * You can use official eslint formatters.
   *
   * @default <require.resolve('@barusu-react/webpack-rule-tsx/lib/util/eslint-formtter.js')>
   * @originalDefault 'stylish'
   */
  // eslint-disable-next-line @typescript-eslint/ban-types
  formatter?: string | Function
  /**
   * Will always return errors, if this option is set to true
   * @originalDefault false
   */
  emitError?: boolean
  /**
   * Will always return warnings, if option is set to true. If you're using
   * hot module replacement, you may wish to enable this in development,
   * or else updates will be skipped when there's an eslint error.
   *
   * @originalDefault false
   */
  emitWarning?: boolean
  /**
   * Will cause the module build to fail if there are any errors,
   * if option is set to true.
   *
   * @originalDefault false
   */
  failOnError?: boolean
  /**
   * Will cause the module build to fail if there are any warnings,
   * if option is set to true.
   *
   * @originalDefault false
   */
  failOnWarning?: boolean
  /**
   * Will process and report errors only and ignore warnings,
   * if this option is set to true.
   *
   * @originalDefault false
   */
  quiet?: boolean
  /**
   * Write the output of the errors to a file, for example a checkstyle
   * xml file for use for reporting on Jenkins CI.
   *
   * @originalDefault false
   */
  outputReport?: boolean | Record<string, unknown>
}
