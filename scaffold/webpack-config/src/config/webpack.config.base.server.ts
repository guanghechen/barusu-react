/* eslint-disable @typescript-eslint/no-var-requires */
import { Configuration } from 'webpack-dev-server'
import { Env } from './env'
import { Paths } from './paths'


const errorOverlayMiddleware = require('react-dev-utils/errorOverlayMiddleware')
const evalSourceMapMiddleware = require('react-dev-utils/evalSourceMapMiddleware')
const ignoredFiles = require('react-dev-utils/ignoredFiles')


interface Params {
  env: Env
  paths: Paths
}


export function createBaseWebpackServerConfig({ env, paths }: Params): Configuration {
  return {
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'POST, GET, OPTIONS, HEAD, DELETE'
    },
    allowedHosts: env.development.server.allowedHosts,
    compress: true,
    contentBase: paths.source.public,
    watchContentBase: true,
    hot: true,
    // Use 'ws' instead of 'sockjs-node' on server since we're using native
    // websockets in `webpackHotDevClient`.
    transportMode: 'ws',
    // Prevent a WS client from getting injected as we're already including
    // `webpackHotDevClient`.
    injectClient: false,
    quiet: true,
    stats: 'errors-only',
    clientLogLevel: 'warning',
    https: env.development.server.protocol === 'https',
    host: env.development.server.hostname,
    overlay: false,
    publicPath: env.development.publicPath,
    disableHostCheck: env.development.server.disableHostCheck,
    watchOptions: {
      ignored: ignoredFiles(paths.source.src),

      // see https://stackoverflow.com/questions/40573774/webpack-hot-reloading-enoent-no-such-file-or-directory
      aggregateTimeout: 300,
      poll: 1000
    },
    index: 'index.html',
    historyApiFallback: {
      disableDotRule: true,
    },
    before(app, server): void {
      // This lets us fetch source contents from webpack for the error overlay
      app.use(evalSourceMapMiddleware(server))

      // This lets us open files from the runtime error overlay.
      app.use(errorOverlayMiddleware())
    },
  }
}
