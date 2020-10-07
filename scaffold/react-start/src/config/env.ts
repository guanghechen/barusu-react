import { coverBoolean, coverNumber, coverString } from '@barusu/util-option'


export interface ConfigEnv {
  appName: string
  proxy?: any
  publicUrlOrPath: string
  tscCompileOnError: boolean
  isInteractive: boolean
  development: {
    server: {
      host: string
      port: number
      compress: boolean
      isHTTPS: boolean
      shouldDisableHostCheck: boolean
      sockHost?: string
      sockPath?: string
      sockPort?: string
    }
    shouldLaunchBrowser: boolean
    shouldJsChunk: boolean
    shouldJsMinified: boolean
    shouldCssChunk: boolean
    shouldCssMinified: boolean
    shouldInlineRuntimeChunk: boolean
    shouldUseSourceMap: boolean
    inject: {
      NODE_ENV: 'development'
      PUBLIC_URL: string
      SITE_TITLE: string
      // We support configuring the sockjs pathname during development.
      // These settings let a developer run multiple simultaneous projects.
      // They are used as the connection `hostname`, `pathname` and `port`
      // in webpackHotDevClient. They are used as the `sockHost`, `sockPath`
      // and `sockPort` options in webpack-dev-server.
      WDS_SOCKET_HOST?: string
      WDS_SOCKET_PATH?: string
      WDS_SOCKET_PORT?: string
      [key: string]: string | undefined
    },
    webpackOptions: {
      cssLoaderOptions: any
      stylusLoaderOptions: any
    }
  }
  production: {
    shouldJsChunk: boolean
    shouldJsMinified: boolean
    shouldCssChunk: boolean
    shouldCssMinified: boolean
    shouldInlineRuntimeChunk: boolean
    shouldUseSourceMap: boolean
    inject: {
      NODE_ENV: 'production'
      PUBLIC_URL: string
      SITE_TITLE: string
      [key: string]: string | undefined
    },
    webpackOptions: {
      cssLoaderOptions: any
      stylusLoaderOptions: any
    }
  }
}


export function createConfigEnv(
  appName: string,
  proxy?: unknown,
): ConfigEnv {
  const isInteractive = Boolean(process.stdout.isTTY)
  const publicUrlOrPath: string = coverString('/', process.env.PUBLIC_URL)

  const env: ConfigEnv = {
    appName,
    proxy,
    publicUrlOrPath: publicUrlOrPath,
    tscCompileOnError: coverBoolean(false, process.env.TSC_COMPILE_ON_ERROR),
    isInteractive,
    development: {
      server: {
        host: coverString('127.0.0.1', process.env.HOST),
        port: coverNumber(3000, process.env.PORT),
        compress: true,
        isHTTPS: coverBoolean(false, process.env.HTTPS),
        shouldDisableHostCheck: coverBoolean(false, process.env.DANGEROUSLY_DISABLE_HOST_CHECK),
        sockHost: process.env.WDS_SOCKET_HOST,
        sockPath: process.env.WDS_SOCKET_PATH, // default: '/sockjs-node'
        sockPort: process.env.WDS_SOCKET_PORT,
      },
      shouldLaunchBrowser: coverBoolean(true, process.env.LAUNCH_BROWSER),
      shouldJsChunk: coverBoolean(true, process.env.JS_CHUNK),
      shouldJsMinified: coverBoolean(true, process.env.JS_MINIFIED),
      shouldCssChunk: coverBoolean(true, process.env.CSS_CHUNK),
      shouldCssMinified: coverBoolean(true, process.env.CSS_MINIFIED),
      shouldInlineRuntimeChunk: coverBoolean(true, process.env.INLINE_RUNTIME_CHUNK),
      shouldUseSourceMap: coverBoolean(true, process.env.GENERATE_SOURCEMAP),
      inject: {
        NODE_ENV: 'development',
        PUBLIC_URL: publicUrlOrPath.replace(/\/$/, ''),
        SITE_TITLE: coverString(appName, process.env.SITE_TITLE),
        // We support configuring the sockjs pathname during development.
        // These settings let a developer run multiple simultaneous projects.
        // They are used as the connection `hostname`, `pathname` and `port`
        // in webpackHotDevClient. They are used as the `sockHost`, `sockPath`
        // and `sockPort` options in webpack-dev-server.
        WDS_SOCKET_HOST: process.env.WDS_SOCKET_HOST,
        WDS_SOCKET_PATH: process.env.WDS_SOCKET_PATH,
        WDS_SOCKET_PORT: process.env.WDS_SOCKET_PORT,
      },
      webpackOptions: {
        cssLoaderOptions: {
          localIdentName: 'ghc-[local]',
          exportLocalsConvention: 'camelCaseOnly',
        },
        stylusLoaderOptions: {},
      }
    },
    production: {
      shouldJsChunk: coverBoolean(false, process.env.JS_CHUNK),
      shouldJsMinified: coverBoolean(true, process.env.JS_MINIFIED),
      shouldCssChunk: coverBoolean(false, process.env.CSS_CHUNK),
      shouldCssMinified: coverBoolean(true, process.env.CSS_MINIFIED),
      shouldInlineRuntimeChunk: coverBoolean(false, process.env.INLINE_RUNTIME_CHUNK),
      shouldUseSourceMap: coverBoolean(false, process.env.GENERATE_SOURCEMAP),
      inject: {
        NODE_ENV: 'production',
        PUBLIC_URL: publicUrlOrPath.replace(/\/$/, ''),
        SITE_TITLE: coverString(appName, process.env.SITE_TITLE),
      },
      webpackOptions: {
        cssLoaderOptions: {
          localIdentName: 'ghc-[local]',
          exportLocalsConvention: 'camelCaseOnly',
        },
        stylusLoaderOptions: {},
      }
    },
  }

  return env
}
