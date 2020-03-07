/* eslint-disable @typescript-eslint/camelcase */
/* eslint-disable @typescript-eslint/no-var-requires */
import fs from 'fs-extra'
import webpack from 'webpack'
import merge from 'webpack-merge'
import CopyWebpackPlugin from 'copy-webpack-plugin'
import HtmlWebpackPlugin from 'html-webpack-plugin'
import { Env } from './env'
import { Paths, PagePathsItem } from './paths'
import { createBaseWebpackConfig } from './webpack.config.base'
const TerserPlugin = require('terser-webpack-plugin')
const safePostCssParser = require('postcss-safe-parser')
const MiniCssExtractPlugin = require('mini-css-extract-plugin')
const InlineChunkHtmlPlugin = require('react-dev-utils/InlineChunkHtmlPlugin')
const OptimizeCSSAssetsPlugin = require('optimize-css-assets-webpack-plugin')


interface Params {
  env: Env
  paths: Paths
}


export function createBaseProdWebConfig({ env, paths }: Params): webpack.Configuration {
  const {
    shouldUseSourceMap,
    shouldCSSChunk,
    shouldCSSMinified,
    shouldJsChunk,
    shouldJsMinified,
    shouldInlineRuntimeChunk,
  } = env.production
  const shouldChunk: boolean = shouldCSSChunk || shouldJsChunk

  const newHtmlWebpackPlugin = (target: PagePathsItem): HtmlWebpackPlugin => {
    return new HtmlWebpackPlugin({
      inject: true,
      template: target.page,
      filename: `${ target.name }.html`,
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

  const baseWebConfig: webpack.Configuration = createBaseWebpackConfig({
    env,
    paths,
    mode: 'production',
    pages: paths.entries,
    entries: paths.entries,
    plugins: [
      // Inlines the webpack runtime script. This script is too small to warrant
      // a network request.
      // https://github.com/facebook/create-react-app/issues/5358
      shouldInlineRuntimeChunk && new InlineChunkHtmlPlugin(HtmlWebpackPlugin, [/runtime~.+[.]js/]),
      // 仅当 public 目录存在时才复制
      fs.existsSync(paths.source.public) && new CopyWebpackPlugin([
        {
          from: `${ paths.source.public }/`,
          to: `${ paths.target.root }/`,
          toType: 'dir',
          force: true,
        },
      ]),
      new MiniCssExtractPlugin({
        ...(shouldCSSChunk
          ? {
            filename: 'css/[name].[contenthash:8].css',
            chunkFilename: 'css/[name].[contenthash:8].chunk.css',
          }
          : { filename: 'css/[name].css', }
        )
      }),
    ].filter(Boolean),
    newHtmlWebpackPlugin,
  })

  return merge(baseWebConfig, {
    bail: true,
    devtool: shouldUseSourceMap ? 'source-map' : false,
    optimization: {
      minimize: shouldCSSMinified || shouldJsMinified,
      minimizer: [
        shouldJsMinified && new TerserPlugin({
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
      ].filter(Boolean),
      // Automatically split vendor and commons
      // https://twitter.com/wSokra/status/969633336732905474
      // https://medium.com/webpack/webpack-4-code-splitting-chunk-graph-and-the-splitchunks-optimization-be739a861366
      splitChunks: shouldChunk && {
        chunks: 'all',
        name: false,
      },
      runtimeChunk: shouldChunk && {
        // Keep the runtime chunk separated to enable long term caching
        // https://twitter.com/wSokra/status/969679223278505985
        // https://github.com/facebook/create-react-app/issues/5358
        name: entrypoint => `runtime-${entrypoint.name}`,
      },
    },
  })
}
