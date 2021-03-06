import CaseSensitivePathsPlugin from 'case-sensitive-paths-webpack-plugin'
import ESLintPlugin from 'eslint-webpack-plugin'
import HtmlWebpackPlugin from 'html-webpack-plugin'
import MiniCssExtractPlugin from 'mini-css-extract-plugin'
import OptimizeCSSAssetsPlugin from 'optimize-css-assets-webpack-plugin'
import path from 'path'
import safePostCssParser from 'postcss-safe-parser'
import InlineChunkHtmlPlugin from 'react-dev-utils/InlineChunkHtmlPlugin'
import InterpolateHtmlPlugin from 'react-dev-utils/InterpolateHtmlPlugin'
import ModuleScopePlugin from 'react-dev-utils/ModuleScopePlugin'
import WatchMissingNodeModulesPlugin from 'react-dev-utils/WatchMissingNodeModulesPlugin'
import resolve from 'resolve'
import TerserPlugin from 'terser-webpack-plugin'
import TsConfigPathsPlugin from 'tsconfig-paths-webpack-plugin'
import webpack from 'webpack'
import ManifestPlugin from 'webpack-manifest-plugin'
import type { ConfigEnv } from './env'
// eslint-disable-next-line import/order
import type { ConfigPaths } from './paths'

// eslint-disable-next-line @typescript-eslint/no-var-requires
const ForkTsCheckerWebpackPlugin = require('react-dev-utils/ForkTsCheckerWebpackPlugin')
// eslint-disable-next-line @typescript-eslint/no-var-requires
const ModuleNotFoundPlugin = require('react-dev-utils/ModuleNotFoundPlugin')
// eslint-disable-next-line @typescript-eslint/no-var-requires
const typescriptFormatter = require('react-dev-utils/typescriptFormatter')

export default function createWebpackConfig(
  mode: 'development' | 'production',
  env: ConfigEnv,
  paths: ConfigPaths,
): webpack.Configuration {
  const isEnvDevelopment: boolean = mode === 'development'
  const isEnvProduction: boolean = mode === 'production'

  // Variable used for enabling profiling in Production
  // passed into alias object. Uses a flag if passed into the build command
  const isEnvProductionProfile =
    isEnvProduction && process.argv.includes('--profile')

  // Grab NODE_ENV and REACT_APP_* environment variables and prepare them to be
  // injected into the application via DefinePlugin in webpack configuration.
  const REACT_APP = /^REACT_APP_/i
  const rawEnv = Object.keys(process.env)
    .filter(key => REACT_APP.test(key))
    .reduce(
      (env, key) => {
        // eslint-disable-next-line no-param-reassign
        env[key] = process.env[key]
        return env
      },
      { ...env[mode].inject },
    )
  const stringifiedEnv = {
    'process.env': Object.keys(rawEnv).reduce((e, key) => {
      // eslint-disable-next-line no-param-reassign
      e[key] = JSON.stringify(rawEnv[key])
      return e
    }, {}),
  }

  const getStyleLoaders = (
    useModule: boolean,
    cssLoaderOptions?: any,
    preProcessor?: string,
    preProcessorOptions?: any,
  ): webpack.RuleSetUseItem[] => {
    const loaders: webpack.RuleSetUseItem[] = [
      // This loader adds the CSS to the DOM so that the styles are active
      // and visible on the page
      isEnvDevelopment && {
        loader: require.resolve('style-loader'),
      },
      isEnvProduction && {
        // eslint-disable-next-line @typescript-eslint/no-var-requires
        loader: MiniCssExtractPlugin.loader,
        // css is located in `resource/css`, use '../../' to locate index.html folder
        // in production `paths.publicUrlOrPath` can be a relative path
        options: env.publicUrlOrPath.startsWith('.')
          ? { publicPath: '../../' }
          : {},
      },
      useModule && {
        loader: require.resolve(
          '@teamsupercell/typings-for-css-modules-loader',
        ),
      },
      {
        loader: require.resolve('css-loader'),
        options: {
          url: true,
          import: true,
          importLoaders: 1,
          sourceMap: env[mode].shouldUseSourceMap,
          ...(useModule && {
            modules: { ...env[mode].webpackOptions.cssLoaderOptions },
          }),
          ...cssLoaderOptions,
        },
      },
      {
        loader: require.resolve('postcss-loader'),
        options: {
          postcssOptions: {
            // Necessary for external CSS imports to work
            // https://github.com/facebook/create-react-app/issues/2677
            ident: 'postcss',
            plugins: [
              require('postcss-flexbugs-fixes'),
              // eslint-disable-next-line @typescript-eslint/no-var-requires
              require('postcss-preset-env')({
                autoprefixer: {
                  flexbox: 'no-2009',
                },
                stage: 3,
              }),
              // Adds PostCSS Normalize as the reset css with default options,
              // so that it honors browserslist config in package.json
              // which in turn let's users customize the target behavior as per their needs.
              // eslint-disable-next-line @typescript-eslint/no-var-requires
              require('postcss-normalize')(),
            ],
          },
          sourceMap: env[mode].shouldUseSourceMap,
        },
      },
    ].filter(Boolean) as webpack.RuleSetUseItem[]

    if (preProcessor) {
      loaders.push(
        {
          loader: require.resolve('resolve-url-loader'),
          options: {
            sourceMap: env[mode].shouldUseSourceMap,
          },
        },
        {
          loader: require.resolve(preProcessor),
          options: {
            sourceMap: true,
            ...preProcessorOptions,
          },
        },
      )
    }
    return loaders
  }

  return {
    mode,
    bail: isEnvProduction,
    stats: 'errors-only',
    target: 'web',
    devtool:
      (isEnvProduction &&
        (env.production.shouldUseSourceMap ? 'source-map' : false)) ||
      (isEnvDevelopment && 'cheap-module-source-map') ||
      false,

    // These are the "entry points" to our application.
    // This means they will be the "root" imports that are included in JS bundle.
    entry: (): webpack.Entry => {
      const resolvedEntries: webpack.Entry = {}
      // create entry by targets.
      for (const target of paths.entries) {
        resolvedEntries[target.name] = [
          // Include an alternative client for WebpackDevServer. A client's job is to
          // connect to WebpackDevServer by a socket and get notified about changes.
          // When you save a file, the client will either apply hot updates (in case
          // of CSS changes), or refresh the page (in case of JS changes). When you
          // make a syntax error, this client will display a syntax error overlay.
          // Note: instead of the default WebpackDevServer client, we use a custom one
          // to bring better experience for Create React App users. You can replace
          // the line below with these two lines if you prefer the stock client:
          // require.resolve('webpack-dev-server/client') + '?/',
          // require.resolve('webpack/hot/dev-server'),
          isEnvDevelopment &&
            require.resolve('react-dev-utils/webpackHotDevClient'),

          // Polyfill
          paths.source.polyfill,

          // We include the app code last so that if there is a runtime error during
          // initialization, it doesn't blow up the WebpackDevServer client, and
          // changing JS code would still trigger a refresh.
          target.script,
        ].filter((s): s is string => typeof s === 'string' && /^\S+$/.test(s))
      }
      return resolvedEntries
    },
    output: {
      // The build folder.
      path: isEnvProduction ? paths.target.root : undefined,

      // add /* filename */ comments to generated require()s in the output.
      pathinfo: isEnvDevelopment,

      // TODO: remove this when upgrading to webpack 5
      futureEmitAssets: true,

      // There will be one main bundle, and one file per asynchronous chunk.
      // In development, it does not produce real files.
      filename:
        isEnvProduction && env.production.shouldJsChunk
          ? 'resource/js/[name].[contenthash:8].js'
          : 'resource/js/[name].js',

      // There are also additional JS chunk files if you use code splitting.
      chunkFilename:
        isEnvProduction && env.production.shouldJsChunk
          ? 'resource/js/[name].[contenthash:8].chunk.js'
          : 'resource/js/[name].chunk.js',

      // webpack uses `publicPath` to determine where the app is being served from.
      // It requires a trailing slash, or the file assets will get an incorrect path.
      // We inferred the "public path" (such as / or /my-project) from homepage.
      publicPath: env.publicUrlOrPath,

      // point sourcemap entries to original disk location (format as URL on Windows)
      devtoolModuleFilenameTemplate: (info: any): string => {
        if (isEnvProduction) {
          return path
            .relative(
              paths.source.root,
              path.resolve(info.absoluteResourcePath),
            )
            .replace(/\\/g, '/')
        }
        if (isEnvDevelopment) {
          return path.resolve(info.absoluteResourcePath).replace(/\\/g, '/')
        }
        return path.resolve(info.absoluteResourcePath).replace(/\\/g, '/')
      },

      // Prevents conflicts when multiple webpack runtimes (from different apps)
      // are used on the same page.
      jsonpFunction: `webpackJsonp_${env.appName}`,

      // this defaults to 'window', but by setting it to 'this' then
      // module chunks which are built will work in web workers as well.
      globalObject: 'this',
    },

    optimization: {
      minimize:
        isEnvProduction &&
        (env.production.shouldCssMinified || env.production.shouldJsMinified),
      minimizer: [
        // This is only used in production mode
        new TerserPlugin({
          terserOptions: {
            parse: {
              // We want terser to parse ecma 8 code. However, we don't want it
              // to apply any minification steps that turns valid ecma 5 code
              // into invalid ecma 5 code. This is why the 'compress' and 'output'
              // sections only apply transformations that are ecma 5 safe
              // https://github.com/facebook/create-react-app/pull/423
              ecma: 8,
            },
            compress: {
              ecma: 5,
              warnings: false,
              // Disabled because of an issue with Uglify breaking seemingly valid code:
              // https://github.com/facebook/create-react-app/issues/2376
              // Pending further investigation:
              // https://github.com/mishoo/UglifyJS2/issues/201
              comparisons: false,
              // Disabled because of an issue with Terser breaking valid code:
              // https://github.com/facebook/create-react-app/issues/5250
              // Pending further investigation:
              // https://github.com/terser-js/terser/issues/12
              inline: 2,
            },
            mangle: {
              safari10: true,
            },
            // Added for profiling in devtools
            keep_classnames: isEnvProductionProfile,
            keep_fnames: isEnvProductionProfile,
            output: {
              ecma: 5,
              comments: false,
              // Turned on because emoji and regex is not minified properly using default
              // https://github.com/facebook/create-react-app/issues/2488
              ascii_only: true,
            },
          },
          sourceMap: env.production.shouldUseSourceMap,
        }),
        // This is only used in production mode
        new OptimizeCSSAssetsPlugin({
          cssProcessorOptions: {
            parser: safePostCssParser,
            map: env.production.shouldUseSourceMap
              ? {
                  // `inline: false` forces the sourcemap to be output into a
                  // separate file
                  inline: false,
                  // `annotation: true` appends the sourceMappingURL to the end of
                  // the css file, helping the browser find the sourcemap
                  annotation: true,
                }
              : false,
          },
          cssProcessorPluginOptions: {
            preset: ['default', { minifyFontValues: { removeQuotes: false } }],
          },
        }),
      ],
      // Automatically split vendor and commons
      // https://twitter.com/wSokra/status/969633336732905474
      // https://medium.com/webpack/webpack-4-code-splitting-chunk-graph-and-the-splitchunks-optimization-be739a861366
      splitChunks: (env.production.shouldCssChunk ||
        env.production.shouldJsChunk) && {
        chunks: 'all',
        name: false,
      },
      // Keep the runtime chunk separated to enable long term caching
      // https://twitter.com/wSokra/status/969679223278505985
      // https://github.com/facebook/create-react-app/issues/5358
      runtimeChunk: (env.production.shouldCssChunk ||
        env.production.shouldJsChunk) && {
        name: (entryPoint): string => `runtime-${entryPoint.name}`,
      },
    },
    resolve: {
      modules: [paths.source.nodeModules, ...paths.source.extraNodeModules],
      extensions: paths.moduleExtensions,
      plugins: [
        // Prevents users from importing files from outside of src/ (or node_modules/).
        // This often causes confusion because we only process files within src/ with babel.
        // To fix this, we prevent you from importing files out of src/ -- if you'd like to,
        // please link the files into your node_modules/ and let module-resolution kick in.
        // Make sure your source files are compiled, as they will not be processed in any way.
        new ModuleScopePlugin(paths.source.src, [paths.source.packageJson]),

        // Fix tsconfig alias
        new TsConfigPathsPlugin({ configFile: paths.source.tsconfigJson }),
      ],
      alias: paths.alias,
    },
    module: {
      strictExportPresence: true,
      rules: [
        // Disable require.ensure as it's not a standard language feature.
        { parser: { requireEnsure: false } },

        // Generate sourcemap only in development mode
        isEnvDevelopment &&
          env.development.shouldUseSourceMap && {
            test: /\.(js|mjs|jsx|ts|tsx)$/,
            include: [
              ...paths.source.src,
              (p: string): boolean => !/node_modules/.test(p),
            ],
            enforce: 'pre',
            use: [
              {
                loader: require.resolve('source-map-loader'),
              },
            ],
          },

        {
          // "oneOf" will traverse all following loaders until one will
          // match the requirements. When no loader matches it will fall
          // back to the "file" loader at the end of the loader list
          oneOf: [
            // "url" loader works like "file" loader except that it embeds assets
            // smaller than specified limit in bytes as data URLs to avoid requests.
            // A missing `test` is equivalent to a match.
            {
              test: [/\.bmp$/, /\.gif$/, /\.jpe?g$/, /\.png$/],
              loader: require.resolve('url-loader'),
              options: {
                limit: 10000,
                name: 'resource/image/[name].[hash:8].[ext]',
              },
            },

            // Process application JS with Babel.
            // The preset includes JSX, Flow, TypeScript, and some ESnext features.
            {
              test: /\.(js|mjs|jsx|ts|tsx)$/,
              include: [...paths.source.src],
              loader: require.resolve('babel-loader'),
              options: {
                // This is a feature of `babel-loader` for webpack (not Babel itself).
                // It enables caching results in ./node_modules/.cache/babel-loader/
                // directory for faster rebuilds.
                cacheDirectory: true,
                // See #6846 for context on why cacheCompression is disabled
                cacheCompression: false,
                compact: isEnvProduction,
                customize: require.resolve(
                  'babel-preset-react-app/webpack-overrides',
                ),
                presets: [
                  [
                    'react-app',
                    {
                      flow: false,
                      typescript: true,
                    },
                  ],
                ],
                plugins: [
                  [
                    require.resolve('babel-plugin-named-asset-import'),
                    {
                      loaderMap: {
                        svg: {
                          ReactComponent:
                            '@svgr/webpack?-svgo,+titleProp,+ref![path]',
                        },
                      },
                    },
                  ],
                  [
                    '@babel/plugin-transform-typescript',
                    {
                      allowNamespaces: true,
                    },
                  ],
                ],
              },
            },

            // Process any JS outside of the app with Babel.
            // Unlike the application JS, we only compile the standard ES features.
            {
              test: /\.(js|mjs)$/,
              exclude: /@babel(?:\/|\\{1,2})runtime/,
              loader: require.resolve('babel-loader'),
              options: {
                babelrc: false,
                configFile: false,
                compact: false,
                presets: [
                  [
                    require.resolve('babel-preset-react-app/dependencies'),
                    { helpers: true },
                  ],
                ],
                cacheDirectory: true,
                cacheCompression: false,

                // Babel sourcemaps are needed for debugging into node_modules
                // code.  Without the options below, debuggers like VSCode
                // show incorrect code and set breakpoints on the wrong lines.
                sourceMaps: env.development.shouldUseSourceMap,
                inputSourceMap: env.development.shouldUseSourceMap,
              },
            },

            // "postcss" loader applies autoprefixer to our CSS.
            // "css" loader resolves paths in CSS and adds assets as dependencies.
            // "style" loader turns CSS into JS modules that inject <style> tags.
            // In production, we use MiniCSSExtractPlugin to extract that CSS
            // to a file, but in development "style" loader enables hot editing
            // of CSS.
            {
              test: /\.css$/,
              exclude: /\.module\.css$/,
              include: [...paths.source.src],
              use: getStyleLoaders(false),
              // Don't consider CSS imports dead code even if the
              // containing package claims to have no side effects.
              // Remove this when webpack adds a warning or an error for this.
              // See https://github.com/webpack/webpack/issues/6571
              sideEffects: true,
            },

            // Adds support for CSS Modules (https://github.com/css-modules/css-modules)
            // using the extension .module.css
            {
              test: /\.module\.css$/,
              include: [...paths.source.src],
              use: getStyleLoaders(true),
            },

            // Inject css with `link` tag, instead of `style` tag
            isEnvDevelopment && {
              test: /\.css$/,
              exclude: [...paths.source.src],
              use: [
                {
                  loader: require.resolve('style-loader'),
                  options: {
                    injectType: 'linkTag',
                  },
                },
                {
                  loader: require.resolve('file-loader'),
                },
              ],
            },

            // Opt-in support for Stylus (using .styl extensions).
            {
              test: /\.styl$/,
              include: [...paths.source.src],
              use: getStyleLoaders(
                true,
                { importLoaders: 3 },
                'stylus-loader',
                env[mode].webpackOptions.stylusLoaderOptions,
              ),
              // Don't consider CSS imports dead code even if the
              // containing package claims to have no side effects.
              // Remove this when webpack adds a warning or an error for this.
              // See https://github.com/webpack/webpack/issues/6571
              sideEffects: true,
            },

            // Process *.pug to *.html
            {
              test: /\.pug$/,
              include: [...paths.source.src],
              loader: require.resolve('pug-loader'),
            },

            // "file" loader makes sure those assets get served by WebpackDevServer.
            // When you `import` an asset, you get its (virtual) filename.
            // In production, they would get copied to the `build` folder.
            // This loader doesn't use a "test" so it will catch all modules
            // that fall through the other loaders.
            {
              // Exclude `js` files to keep "css" loader working as it injects
              // its runtime that would otherwise be processed through "file" loader.
              // Also exclude `html` and `json` extensions so they get processed
              // by webpacks internal loaders.
              exclude: [/\.(js|mjs|jsx|ts|tsx)$/, /\.html$/, /\.json$/],
              loader: require.resolve('file-loader'),
              options: {
                name: 'resource/media/[name].[hash:8].[ext]',
              },
            },
          ].filter(Boolean) as webpack.RuleSetRule[],
        },
      ].filter(Boolean) as webpack.RuleSetRule[],
    },
    plugins: [
      // create HtmlWebpackPlugins by targets
      ...paths.entries.map(target => {
        if (isEnvDevelopment) {
          return new HtmlWebpackPlugin({
            inject: true,
            template: target.page,
            filename: `${target.name}.html`,
            chunks: [target.name],
          })
        }

        if (isEnvProduction) {
          return new HtmlWebpackPlugin({
            inject: true,
            template: target.page,
            filename: `${target.name}.html`,
            chunks: [target.name],
            minify: {
              removeComments: true,
              collapseWhitespace: true,
              removeRedundantAttributes: true,
              useShortDoctype: true,
              removeEmptyAttributes: true,
              removeStyleLinkTypeAttributes: true,
              keepClosingSlash: true,
              minifyJS: true,
              minifyCSS: true,
              minifyURLs: true,
            },
          })
        }

        return null
      }),

      // Eslint
      new ESLintPlugin({
        fix: true,
        failOnError: true,
        eslintPath: require.resolve('eslint'),
        formatter: require.resolve('react-dev-utils/eslintFormatter'),
        extensions: ['js', 'jsx', 'ts', 'tsx'],
      }),

      // Inlines the webpack runtime script. This script is too small to warrant
      // a network request.
      // https://github.com/facebook/create-react-app/issues/5358
      isEnvProduction &&
        env.production.shouldInlineRuntimeChunk &&
        new InlineChunkHtmlPlugin(HtmlWebpackPlugin, [/runtime~.+[.]js/]),

      // Makes some environment variables available in index.html.
      // The public URL is available as %PUBLIC_URL% in index.html, e.g.:
      // <link rel="icon" href="%PUBLIC_URL%/favicon.ico">
      // It will be an empty string unless you specify "homepage"
      // in `package.json`, in which case it will be the pathname of that URL.
      new InterpolateHtmlPlugin(HtmlWebpackPlugin, { ...rawEnv } as Record<
        string,
        string
      >),

      // This gives some necessary context to module not found errors, such as
      // the requesting resource.
      new ModuleNotFoundPlugin(paths.source.root, paths.source.lockFile),

      // Makes some environment variables available to the JS code, for example:
      // if (process.env.NODE_ENV === 'production') { ... }. See `./env.js`.
      // It is absolutely essential that NODE_ENV is set to production
      // during a production build.
      // Otherwise React will be compiled in the very slow development mode
      new webpack.DefinePlugin({ ...stringifiedEnv }),

      // This is necessary to emit hot updates (currently CSS only):
      isEnvDevelopment && new webpack.HotModuleReplacementPlugin(),

      // Watcher doesn't work well if you mistype casing in a path so we use
      // a plugin that prints an error when you attempt to do this.
      // See https://github.com/facebook/create-react-app/issues/240
      isEnvDevelopment && new CaseSensitivePathsPlugin(),

      // Ignore intermediate files
      isEnvDevelopment && new webpack.WatchIgnorePlugin([/\.styl\.d\.ts$/]),

      // If you require a missing module and then `npm install` it, you still have
      // to restart the development server for webpack to discover it. This plugin
      // makes the discovery automatic so you don't have to restart.
      // See https://github.com/facebook/create-react-app/issues/186
      isEnvDevelopment &&
        new WatchMissingNodeModulesPlugin(paths.source.nodeModules),

      // Extract css files
      isEnvProduction &&
        new MiniCssExtractPlugin(
          env.production.shouldCssChunk
            ? {
                filename: 'resource/css/[name].[contenthash:8].css',
                chunkFilename: 'resource/css/[name].[contenthash:8].chunk.css',
              }
            : { filename: 'resource/css/[name].css' },
        ),

      // Generate an asset manifest file with the following content:
      // - "files" key: Mapping of all asset filenames to their corresponding
      //   output file so that tools can pick it up without having to parse
      //   `index.html`
      // - "entrypoints" key: Array of files which are included in `index.html`,
      //   can be used to reconstruct the HTML if necessary
      new ManifestPlugin({
        fileName: 'asset-manifest.json',
        publicPath: env.publicUrlOrPath,
        generate: (seed, files, entrypoints) => {
          const manifestFiles = files.reduce((manifest, file) => {
            if (file.name != null) {
              // eslint-disable-next-line no-param-reassign
              manifest[file.name] = file.path
            }
            return manifest
          }, seed)

          const entrypointFiles = (entrypoints.main || []).filter(
            fileName => !fileName.endsWith('.map'),
          )

          return {
            files: manifestFiles,
            entrypoints: entrypointFiles,
          }
        },
      }),

      // Moment.js is an extremely popular library that bundles large locale files
      // by default due to how webpack interprets its code. This is a practical
      // solution that requires the user to opt into importing specific locales.
      // https://github.com/jmblog/how-to-optimize-momentjs-with-webpack
      // You can remove this if you don't use Moment.js:
      new webpack.IgnorePlugin(/^\.\/locale$/, /moment$/),

      // typescript checking
      new ForkTsCheckerWebpackPlugin({
        typescript: resolve.sync('typescript', {
          basedir: paths.source.nodeModules,
        }),
        async: isEnvDevelopment,
        useTypescriptIncrementalApi: true,
        checkSyntacticErrors: true,
        tsconfig: paths.source.tsconfigJson,
        reportFiles: [
          '**',
          '!**/__tests__/**',
          '!**/?(*.)(spec|test).*',
          '!**/src/setupProxy.*',
          '!**/src/setupTests.*',
        ],
        silent: true,
        watch: paths.source.src,
        // The formatter is invoked directly in WebpackDevServerUtils during development
        formatter: isEnvProduction ? typescriptFormatter : undefined,
      }),
    ].filter(Boolean) as webpack.Plugin[],

    // Some libraries import Node modules but don't use them in the browser.
    // Tell webpack to provide empty mocks for them so importing them works.
    node: {
      module: 'empty',
      dgram: 'empty',
      dns: 'mock',
      fs: 'empty',
      http2: 'empty',
      net: 'empty',
      tls: 'empty',
      child_process: 'empty',
    },

    // Turn off performance processing because we utilize
    // our own hints via the FileSizeReporter
    performance: false,

    /**
     * Third-party libraries which won't participate packaging by webpack
     * @see https://webpack.js.org/configuration/externals/
     */
    externals: paths.source.externals,
  }
}
