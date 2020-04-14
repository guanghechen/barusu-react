/* eslint-disable @typescript-eslint/no-var-requires */
import chalk from 'chalk'
import path from 'path'
import webpack from 'webpack'
import { currentDate } from './current-date'


const clearConsole = require('react-dev-utils/clearConsole')
const typescriptFormatter = require('react-dev-utils/typescriptFormatter')
const formatWebpackMessages = require('react-dev-utils/formatWebpackMessages')
const forkTsCheckerWebpackPlugin = require('react-dev-utils/ForkTsCheckerWebpackPlugin')


interface Params {
  config: webpack.Configuration
  url: string
  spinner: any
  devSocket: {
    warnings: (warnings: any[]) => void
    errors: (errors: any[]) => void
  }
  isInteractive?: boolean
  useTypescript?: boolean
  clearConsoleAfterUpdate?: boolean
  onCompiled?: () => void
}


export function createCompiler({
  config,
  url,
  spinner,
  devSocket,
  useTypescript = true,
  isInteractive = Boolean(process.stdout.isTTY),
  clearConsoleAfterUpdate: clearConsoleAfterUpdated = isInteractive,
  onCompiled,
}: Params) {
  let firstStart = true
  const compiler: webpack.Compiler = webpack(config)

  compiler.hooks.invalid.tap('invalid', () => {
    if (clearConsoleAfterUpdated) clearConsole()
    // eslint-disable-next-line no-param-reassign
    spinner.text = currentDate() + 'recompiling...'
  })

  let tsMessagesPromise: Promise<any>
  if (useTypescript) {
    let tsMessagesResolver: (messages: any) => void
    compiler.hooks.beforeCompile.tap('beforeCompile', () => {
      tsMessagesPromise = new Promise(resolve => {
        tsMessagesResolver = (messages: any) => resolve(messages)
      })
    })

    forkTsCheckerWebpackPlugin
      .getCompilerHooks(compiler)
      .receive.tap('afterTypeScriptCheck', (diagnostics: any[], lints: any[]) => {
        const allMessages = [...diagnostics, ...lints]
        const format = (message: any) =>
          `${ message.file }\n${ typescriptFormatter(message, true) }`

        tsMessagesResolver({
          errors: allMessages.filter(msg => msg.severity === 'error').map(format),
          warnings: allMessages
            .filter(msg => msg.severity === 'warning')
            .map(format),
        })
      })
  }

  compiler.hooks.done.tap('done', async (stats: any) => {
    if (clearConsoleAfterUpdated) clearConsole()
    const statsData = stats.toJson({
      all: false,
      warnings: true,
      errors: true
    })
    if (useTypescript && statsData.errors.length === 0) {
      const delayedMessage = setTimeout(() => {
        console.log(
          chalk.yellow(
            'files successfully emitted, waiting for type-check results...'
          )
        )
      }, 100)

      const messages = await tsMessagesPromise
      clearTimeout(delayedMessage)
      statsData.errors.push(...messages.errors)
      statsData.warnings.push(...messages.warnings)

      // push errors and warnings into compilation result
      // to show them after page refresh triggered by user.
      stats.compilation.errors.push(...messages.errors)
      stats.compilation.warnings.push(...messages.warnings)

      if (messages.errors.length > 0) {
        devSocket.errors(messages.errors)
      } else if (messages.warnings.length > 0) {
        devSocket.warnings(messages.warnings)
      }

      if (clearConsoleAfterUpdated) clearConsole()
    }

    const messages = formatWebpackMessages(statsData)
    if (!messages.errors.length && !messages.warnings.length) {
      if (onCompiled instanceof Function) onCompiled()

      let message = currentDate() + chalk.green('compilation succeed. ')
      if (!firstStart) message += chalk.gray(`(${ url })`)
      spinner.succeed(message)

      const { assets } = stats.compilation
      Object.getOwnPropertyNames(assets)
        .map(key => assets[key])
        .filter(asset => asset.existsAt != null)
        .filter(asset => !/\.map$/.test(asset.existsAt))
        .forEach(asset => {
          spinner.succeed(chalk.cyan('\t' + path.relative(process.cwd(), asset.existsAt)))
        })
    }

    // if errors exists, only show errors.
    if (messages.errors.length > 0) {
      await spinner.fail(currentDate() + chalk.red('compilation fails.'))
      console.log()
      console.log(chalk.white(messages.errors.join('\n\n')))
      console.log()
      return
    }

    // if warnings exists, show warnings if no errors were found.
    if (messages.warnings.length > 0) {
      spinner.warn(currentDate() + chalk.yellow('compilation with warnings: '))
      console.log()
      console.log(messages.warnings.join('\n\n'))
      console.log()

      // teach some ESLint tricks.
      console.log(
        'search related '
        + chalk.underline(chalk.yellow('keyword'))
        + ' to get more info about the warning.'
      )
    }

    if (firstStart) {
      spinner.succeed(currentDate() + chalk.green(`webpack-server running on ${ url }`))
      console.log()
    }
    firstStart = false
  })

  return compiler
}
