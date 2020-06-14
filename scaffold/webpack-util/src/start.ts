/* eslint-disable @typescript-eslint/no-var-requires */
import chalk from 'chalk'
import Ora from 'ora'
import webpack from 'webpack'
import webpackDevServer from 'webpack-dev-server'
import { Env } from './types/env'
import { Paths } from './types/paths'
import { checkRequiredFiles } from './util/check-required-files'
import { createCompiler } from './util/create-compiler'
import { currentDate } from './util/current-date'


const openBrowser = require('react-dev-utils/openBrowser')
const { checkBrowsers } = require('react-dev-utils/browsersHelper')
const { choosePort, prepareUrls } = require('react-dev-utils/WebpackDevServerUtils')
const clearConsole = require('react-dev-utils/clearConsole')


interface Params {
  env: Env
  paths: Paths
  config: webpack.Configuration
  serverConfig: webpackDevServer.Configuration
}


export async function start({
  env,
  paths,
  config,
  serverConfig,
}: Params): Promise<void> {
  // do this as the first thing so that any code reading it knows the right env.
  process.env.BABEL_ENV = 'development'
  process.env.NODE_ENV = 'development'
  checkRequiredFiles(paths.entries)

  const spinner = Ora()

  async function run(): Promise<void> {
    // eslint-disable-next-line prefer-const
    let { hostname, protocol, port } = env.development.server
    await checkBrowsers(paths.source.root, env.isInteractive)

    port = Number(await choosePort(hostname, port))
    if (port == null) return
    const { lanUrlForConfig, localUrlForBrowser } = prepareUrls(protocol, hostname, port)

    const devSocket = {
      warnings: (warnings: any[]): void => {
        const s = server as any
        return s.sockWrite(s.sockets, 'warnings', warnings)
      },
      errors: (errors: any[]): void => {
        const s = server as any
        return s.sockWrite(s.sockets, 'errors', errors)
      }
    }

    const compiler = createCompiler({
      config,
      url: localUrlForBrowser,
      spinner,
      devSocket,
      clearConsoleAfterUpdate: env.development.server.clearConsoleAfterUpdate,
    })

    const proxySetting = env.manifest.proxy
    const resolvedServerConfig = {
      ...serverConfig,
      disableHostCheck: !proxySetting,
      public: lanUrlForConfig,
      proxy: proxySetting,
    }

    const server = new webpackDevServer(compiler, resolvedServerConfig)
    server.listen(port, hostname, (error?: Error) => {
      if (error) return console.log(chalk.magenta(error.stack || ''))
      if (env.development.server.clearConsoleAfterUpdate) clearConsole()

      // open browser
      console.log(chalk.cyan('starting server...\n'))
      if (env.development.server.launchBrowser) {
        try {
          openBrowser(localUrlForBrowser)
        } catch (error) {
          console.log(chalk.magenta(`failed to open browser: ${ error }`))
        }
      }
    })

      ;['SIGINT', 'SIGTERM'].forEach((sig: any) => {
        process.on(sig, () => {
          server.close()
          process.exit()
        })
      })
  }

  try {
    await run()
  } catch (error) {
    spinner.fail(currentDate() + chalk.red('compilation failed.'))
    console.log()
    console.log(error.message || error)
    console.log()
    process.exit(-1)
  }
}
