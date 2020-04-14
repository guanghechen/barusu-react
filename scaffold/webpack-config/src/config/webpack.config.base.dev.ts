/* eslint-disable @typescript-eslint/no-var-requires */
import CaseSensitivePathsPlugin from 'case-sensitive-paths-webpack-plugin'
import HtmlWebpackPlugin from 'html-webpack-plugin'
import webpack from 'webpack'
import merge from 'webpack-merge'
import { Env } from './env'
import { PagePathsItem, Paths } from './paths'
import { createBaseWebpackConfig } from './webpack.config.base'


const WatchMissingNodeModulesPlugin = require('react-dev-utils/WatchMissingNodeModulesPlugin')


interface Params {
  env: Env
  paths: Paths
}


export function createBaseDevWebConfig({ env, paths }: Params): webpack.Configuration {
  const newHtmlWebpackPlugin = (target: PagePathsItem): HtmlWebpackPlugin => {
    return new HtmlWebpackPlugin({
      inject: true,
      template: target.page,
      filename: `${ target.name }.html`,
      chunks: [target.name],
    })
  }

  const baseWebConfig: webpack.Configuration = createBaseWebpackConfig({
    env,
    paths,
    mode: 'development',
    pages: paths.entries,
    entries: paths.entries,
    plugins: [
      new webpack.NamedChunksPlugin(),
      // This is necessary to emit hot updates (currently CSS only):
      new webpack.HotModuleReplacementPlugin(),
      new webpack.WatchIgnorePlugin([/\.styl\.d\.ts$/]),
      // Watcher doesn't work well if you mistype casing in a path so we use
      // a plugin that prints an error when you attempt to do this.
      // See https://github.com/facebook/create-react-app/issues/24
      new CaseSensitivePathsPlugin(),
      new WatchMissingNodeModulesPlugin(paths.source.nodeModules),
    ],
    newHtmlWebpackPlugin,
  })

  return merge(baseWebConfig, {
    bail: false,
    devtool: 'cheap-module-source-map',
  })
}
