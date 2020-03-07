/**
 * @see https://github.com/babel/babel-loader#options
 * @see https://babeljs.io/docs/en/options
 */
export interface BabelLoaderOptionsForTsx {
  /**
   * As long as the filename option has been specified
   * Placement: Allowed in Babel's programmatic options, or inside of the loaded
   * "configFile".A programmatic option will override a config file one.
   * @originalDefault true
   */
  babelrc?: boolean
  /**
   * If it exists, false otherwise
   * Placement: Only allowed in Babel's programmatic options
   * @originalDefault <path.resolve(opts.root, 'babel.config.json')>
   */
  configFile?: boolean | string
  /**
   *    - true: to generate a sourcemap for the code and include it in the result object.
   *    - 'inline': to generate a sourcemap and append it as a data URL to the end of
   *                the code, but not include it in the result object.
   *    - 'both': is the same as inline, but will include the map in the result object.
   *
   * @babel/cli overloads some of these to also affect how maps are written to disk:
   *
   *    - true: will write the map to a .map file on disk
   *    - 'inline': will write the file directly, so it will have a data: containing the map
   *    - 'both': will write the file with a data: URL and also a .map.
   *
   * Note: These options are bit weird, so it may make the most sense to just use true
   *       and handle the rest in your own code, depending on your use case.
   * @originalDefault false
   */
  sourceMaps?: boolean | 'inline' | 'both'
  /**
   * true will attempt to load an input sourcemap from the file itself, if it contains
   * a //# sourceMappingURL=... comment. If no map is found, or the map fails to load
   * and parse, it will be silently discarded.
   * If an object is provided, it will be treated as the source map object itself.
   * @originalDefault true
   */
  inputSourceMap?: boolean | object
  /**
   * When set, the given directory will be used to cache the results of the loader.
   * Future webpack builds will attempt to read from the cache to avoid needing to
   * run the potentially expensive Babel recompilation process on each run.
   * If the value is set to true in options ({ cacheDirectory: true }), the loader
   * will use the default cache directory in node_modules/.cache/babel-loader or
   * fallback to the default OS temporary file directory if no node_modules folder
   * could be found in any root directory.
   * @default true
   * @originalDefault false
   */
  cacheDirectory?: boolean
  /**
   * Default is a string composed by the @babel/core's version, the babel-loader's
   * version, the contents of .babelrc file if it exists, and the value of the
   * environment variable BABEL_ENV with a fallback to the NODE_ENV environment variable.
   * This can be set to a custom value to force cache busting if the identifier changes.
   */
  cacheIdentifier?: string
  /**
   * When set, each Babel transform output will be compressed with Gzip.
   * If you want to opt-out of cache compression, set it to false -- your project may
   * benefit from this if it transpiles thousands of files.
   * @default false
   * @originalDefault true
   */
  cacheCompression?: boolean
  /**
   * The path of a module that exports a custom callback like the one that you'd
   * pass to .custom(). Since you already have to make a new file to use this, it is
   * recommended that you instead use .custom to create a wrapper loader. Only use
   * this if you must continue using babel-loader directly, but still want to customize.
   * @default <require.resolve('babel-preset-react-app/webpack-overrides')>
   * @originalDefault null
   */
  customize?: string | null
  /**
   * "auto" will set the value by evaluating code.length > 500_000
   * All optional newlines and whitespace will be omitted when generating code in compact mode.
   * @default <isEnvProduction>
   * @originalDefault null
   */
  compact?: boolean | 'auto'
}


/**
 * @see https://github.com/babel/babel-loader#options
 * @see https://babeljs.io/docs/en/options
 */
export interface BabelLoaderOptionsForOutsideJs extends BabelLoaderOptionsForTsx {
  /**
   * @default false
   */
  babelrc?: BabelLoaderOptionsForTsx['babelrc']
  /**
   * @default false
   */
  configFile?: BabelLoaderOptionsForTsx['configFile']
  /**
   * @default <shouldUseSourceMap>
   */
  sourceMaps?: BabelLoaderOptionsForTsx['sourceMaps']
  /**
   * @default <shouldUseSourceMap>
   */
  inputSourceMap?: BabelLoaderOptionsForTsx['inputSourceMap']
  /**
   * @default null
   */
  customize?: BabelLoaderOptionsForTsx['customize']
  /**
   * @default false
   */
  compact?: BabelLoaderOptionsForTsx['compact']
}
