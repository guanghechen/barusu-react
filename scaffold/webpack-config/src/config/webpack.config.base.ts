/* eslint-disable @typescript-eslint/camelcase */
/* eslint-disable @typescript-eslint/no-var-requires */
import path from 'path'
import webpack from 'webpack'
import TsConfigPathsPlugin from 'tsconfig-paths-webpack-plugin'
import HtmlWebpackPlugin from 'html-webpack-plugin'
import { calcCssRule, calcStylusRule } from '@barusu-react/webpack-rule-css'
import { calcOutsideJsRule, calcEslintRule, calcTsxRule } from '@barusu-react/webpack-rule-tsx'
import { Env } from './env'
import { Paths, PagePathsItem, EntryPathsItem } from './paths'
const resolve = require('resolve')
const ForkTsCheckerWebpackPlugin = require('react-dev-utils/ForkTsCheckerWebpackPlugin')
const InterpolateHtmlPlugin = require('react-dev-utils/InterpolateHtmlPlugin')
const typescriptFormatter = require('react-dev-utils/typescriptFormatter')
const ModuleNotFoundPlugin = require('react-dev-utils/ModuleNotFoundPlugin')
const ModuleScopePlugin = require('react-dev-utils/ModuleScopePlugin')


interface Params {
  env: Env
  paths: Paths
  mode: 'production' | 'development'
  pages: PagePathsItem[]
  entries: EntryPathsItem[]
  plugins: webpack.Plugin[]
  newHtmlWebpackPlugin(page: PagePathsItem): HtmlWebpackPlugin
}


export function createBaseWebpackConfig({
  env,
  paths,
  mode,
  pages,
  entries,
  plugins,
  newHtmlWebpackPlugin,
}: Params): webpack.Configuration {
  const isEnvDevelopment: boolean = mode === 'development'
  const isEnvProduction: boolean = mode === 'production'
  const shouldUseSourceMap: boolean = isEnvProduction && env.production.shouldUseSourceMap

  const rawEnv = env[mode].inject
  const stringifiedEnv = {
    'process.env': Object.keys(rawEnv).reduce((e, key) => {
      // eslint-disable-next-line no-param-reassign
      e[key] = JSON.stringify(rawEnv[key])
      return e
    }, {})
  }

  // some apps do not use client-side routing with pushState.
  // for these, "homepage" can be set to "." to enable relative asset paths
  const shouldUseRelativeAssetPaths: boolean = env[mode].publicPath === './'

  const hookParams = { isEnvDevelopment, isEnvProduction, env }

  const cssRuleOptions = env.webpackOptions.cssRuleOptionsHook(hookParams)
  const stylusRuleOptions = env.webpackOptions.stylusRuleOptionsHook(hookParams)
  const tsxRuleOptions = env.webpackOptions.tsxRuleOptionsHook(hookParams)
  const outsideJsRuleOptions = env.webpackOptions.outsideJsRuleOptionHook(hookParams)
  const additionalRules = env.webpackOptions.additionalRulesHook(hookParams)
  const additionalPlugins = env.webpackOptions.additionalPluginsHook(hookParams)

  if (tsxRuleOptions.length > 0 && outsideJsRuleOptions.length <= 0) {
    outsideJsRuleOptions.push({})
  }

  return {
    mode,
    stats: 'errors-only',
    target: 'web',
    entry: () => {
      const resolvedEntries: webpack.Entry = {}
      // create entry by targets.
      for (const target of entries) {
        resolvedEntries[target.name] = [
          paths.source.polyfill,
          target.script,
          isEnvDevelopment && require.resolve('react-dev-utils/webpackHotDevClient'),
        ].filter((s): s is string => typeof s === 'string' && /^\S+$/.test(s))
      }
      return resolvedEntries
    },
    output: {
      path: isEnvProduction ? paths.target.root : undefined,
      // add /* filename */ comments to generated require()s in the output.
      pathinfo: isEnvDevelopment,
      filename: isEnvProduction && env.production.shouldJsChunk
        ? 'js/[name].[contenthash:8].js'
        : 'js/[name].js',
      chunkFilename: isEnvProduction
        ? env.production.shouldJsChunk ? 'js/[name].[contenthash:8].chunk.js' : undefined
        : 'js/[name].chunk.js',
      publicPath: env[mode].publicPath,
      // point sourcemap entries to original disk location (format as URL on Windows)
      devtoolModuleFilenameTemplate: (info: any) => (
        isEnvProduction
          ? path.relative(paths.source.src, path.resolve(info.absoluteResourcePath)).replace(/\\/g, '/')
          : path.resolve(info.absoluteResourcePath).replace(/\\/g, '/')
      ),
      // Prevents conflicts when multiple webpack runtimes (from different apps)
      // are used on the same page.
      jsonpFunction: `webpackJsonp${ env.manifest.name }`,
      // this defaults to 'window', but by setting it to 'this' then
      // module chunks which are built will work in web workers as well.
      globalObject: 'this',
    },
    resolve: {
      modules: [paths.source.src, paths.source.nodeModules, ...paths.source.extraNodeModules],
      extensions: ['.js', '.jsx', '.ts', '.tsx', '.json', '.pug', '.styl'],
      plugins: [
        env.useModuleScopePlugin && new ModuleScopePlugin(paths.source.src, [paths.source.packageJson]),
        new TsConfigPathsPlugin({ configFile: paths.source.tsconfigJson }),
      ].filter(Boolean),
      alias: paths.alias,
    },
    module: {
      strictExportPresence: true,
      rules: [
        // disable require.ensure as it's not a standard language feature.
        { parser: { requireEnsure: false } },

        // first, run the linter.
        // it's important to do this before Babel processes the JS
        calcEslintRule({
          include: paths.source.src,
          eslintOptions: {
            resolvePluginsRelativeTo: paths.source.root,
            /**
             * By default Eslint errors will raise webpack errors
             * @see https://github.com/webpack-contrib/eslint-loader/issues/168#issuecomment-296433277
             */
            emitWarning: true,
            emitError: false,
          },
        }),
        isEnvDevelopment && env.development.shouldUseSourceMap && {
          test: /\.(js|mjs|jsx|ts|tsx)$/,
          use: ['@barusu/webpack-source-map-loader'],
          enforce: 'pre',
        },
        {
          // "oneOf" will traverse all following loaders until one will
          // match the requirements. When no loader matches it will fall
          // back to the "file" loader at the end of the loader list
          oneOf: [
            {
              test: [/\.bmp$/, /\.gif$/, /\.jpe?g$/, /\.png$/],
              loader: require.resolve('url-loader'),
              options: {
                limit: 10000,
                name: 'resource/image/[name].[hash:8].[ext]',
              },
            },
            ...tsxRuleOptions.map(tsxRuleOptions => {
              return calcTsxRule({
                include: paths.source.src,
                isEnvProduction,
                ...tsxRuleOptions,
              })
            }),
            // process any JS outside of the app with Babel.
            // unlike the application JS, we only compile the standard ES features.
            ...outsideJsRuleOptions.map(outsideJsRuleOption => {
              return calcOutsideJsRule({
                shouldUseSourceMap: shouldUseSourceMap,
                include: [
                  paths.source.src,
                  /[\s\S]*node_modules/,
                ],
                ...outsideJsRuleOption,
              })
            }),
            ...cssRuleOptions.map(cssRuleOptions => {
              return calcCssRule({
                isEnvProduction,
                isEnvDevelopment,
                shouldUseSourceMap,
                include: [
                  paths.source.src,
                  /[\s\S]*node_modules/,
                ],
                cssLoaderOptions: cssRuleOptions.cssLoaderOptions,

                // css is located in `static/css`, use '../../' to locate index.html folder
                // in production `paths.publicUrlOrPath` can be a relative path
                miniCssExtractLoaderOptions: {
                  ...(shouldUseRelativeAssetPaths ? { publicPath: '../../' } : undefined)
                },
                ...cssRuleOptions,
              })
            }),
            ...stylusRuleOptions.map(stylusRuleOptions => {
              return calcStylusRule({
                isEnvProduction,
                isEnvDevelopment,
                shouldUseSourceMap,
                include: paths.source.src,
                cssLoaderOptions: stylusRuleOptions.cssLoaderOptions,

                // css is located in `static/css`, use '../../' to locate index.html folder
                // in production `paths.publicUrlOrPath` can be a relative path
                miniCssExtractLoaderOptions: {
                  ...(shouldUseRelativeAssetPaths ? { publicPath: '../../' } : undefined)
                },
              })
            }),
            {
              test: /\.pug$/,
              include: paths.source.src,
              loader: require.resolve('pug-loader'),
            },
            ...additionalRules,
            {
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
      ...pages.map(target => newHtmlWebpackPlugin(target)),
      // Makes some environment variables available in index.html.
      // The public URL is available as %PUBLIC_URL% in index.html, e.g.:
      // <link rel="icon" href="%PUBLIC_URL%/favicon.ico">
      // It will be an empty string unless you specify "homepage"
      // in `package.json`, in which case it will be the pathname of that URL.
      new InterpolateHtmlPlugin(HtmlWebpackPlugin, { ...rawEnv }),
      // This gives some necessary context to module not found errors, such as
      // the requesting resource.
      new ModuleNotFoundPlugin(paths.source.root),
      // Makes some environment variables available to the JS code, for example:
      // if (process.env.NODE_ENV === 'production') { ... }. See `./env.js`.
      // It is absolutely essential that NODE_ENV is set to production
      // during a production build.
      // Otherwise React will be compiled in the very slow development mode
      new webpack.DefinePlugin({ ...stringifiedEnv }),
      new webpack.IgnorePlugin(/^\.\/locale$/, /moment$/),
      ...plugins,
      ...additionalPlugins,
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
        watch: paths.source.src,
        silent: true,
        // The formatter is invoked directly in WebpackDevServerUtils during development
        formatter: isEnvProduction ? typescriptFormatter : undefined,
      }),
    ],
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
    performance: false,
    externals: paths.source.externals,
  }
}
