/* eslint-disable @typescript-eslint/no-var-requires */
import chalk from 'chalk'
import fs from 'fs-extra'
import Ora from 'ora'
import webpack from 'webpack'
import { Env } from './types/env'
import { Paths } from './types/paths'
import { checkRequiredFiles } from './util/check-required-files'
import { currentDate } from './util/current-date'


const { checkBrowsers } = require('react-dev-utils/browsersHelper')
const formatWebpackMessages = require('react-dev-utils/formatWebpackMessages')
const printBuildError = require('react-dev-utils/printBuildError')
const FileSizeReporter = require('react-dev-utils/FileSizeReporter')


interface Params {
  /**
   * 环境变量
   */
  env: Env
  /**
   * 路径信息
   */
  paths: Paths
  /**
   * webpack 配置
   */
  config: webpack.Configuration
  /**
   * @default 512K
   */
  WARN_AFTER_BUNDLE_GZIP_SIZE?: number
  /**
   * @default 1024K
   */
  WARN_AFTER_CHUNK_GZIP_SIZE?: number
}


export async function build({
  env,
  paths,
  config,
  // these sizes are pretty large. we'll warn for bundles exceeding them.
  WARN_AFTER_BUNDLE_GZIP_SIZE = 512 * 1024,
  WARN_AFTER_CHUNK_GZIP_SIZE = 1024 * 1024,
}: Params): Promise<void> {
  // do this as the first thing so that any code reading it knows the right env.
  process.env.BABEL_ENV = 'production'
  process.env.NODE_ENV = 'production'
  checkRequiredFiles(paths.entries)

  const measureFileSizesBeforeBuild = FileSizeReporter.measureFileSizesBeforeBuild
  const printFileSizesAfterBuild = FileSizeReporter.printFileSizesAfterBuild
  const isInteractive = env.isInteractive

  // eslint-disable-next-line new-cap
  const spinner = Ora()

  async function run(
    resolve: (data: { stats: any }) => void,
    reject: (error: any) => void
  ): Promise<void> {
    let timer: NodeJS.Timeout
    const startTime = Date.now()

    const logProcess = (stop?: boolean): void => {
      const message = `packing for production.... time used: ${ Date.now() - startTime }ms.`
      if (stop) {
        clearTimeout(timer)
        spinner.succeed(chalk.green(message))
      } else {
        spinner.text = chalk.cyan(message)
        timer = setTimeout(logProcess, 100) as any
      }
    }

    webpack(config).run((err: Error | null, stats: any) => {
      logProcess(true)
      let messages: any

      if (err != null) {
        if (!err.message) return reject(err)
        messages = formatWebpackMessages({
          errors: [err.message],
          warnings: [],
        })
      } else {
        messages = formatWebpackMessages(stats.toJson({
          all: false,
          warnings: true,
          errors: true,
        }))
      }

      // if errors exists, only show errors.
      if (messages.errors.length) {
        spinner.fail(chalk.red('compilation failed.'))
        console.log()
        console.log(chalk.white(messages.errors.join('\n\n')))
        return reject(messages.errors.join('\n\n'))
      }

      // if warnings exists, show warnings if no errors were found.
      if (messages.warnings.length > 0) {
        spinner.warn(chalk.yellow('compilation with warnings: '))
        console.log()
        console.log(messages.warnings.join('\n\n'))
        console.log()

        // teach some ESLint tricks.
        console.log(
          'search related '
          + chalk.underline(chalk.yellow('keyword'))
          + ' to get more info about the warning.'
        )

        return reject(new Error(messages.warnings.join('\n\n')))
      }

      spinner.succeed(chalk.green(`packaging complete. the target directory is: ${ paths.target.root }.`))
      console.log()
      resolve({ stats })
    })

    spinner.start()
    logProcess()
  }

  try {
    await checkBrowsers(paths.source.root, isInteractive)
      .then(() => {
        // first, read the current file sizes in build directory.
        // this lets us display how much they changed later.
        return measureFileSizesBeforeBuild(paths.target.root)
      })
      .then((previousFileSizes: any) => {
        // remove all target content and copy public folder
        fs.emptyDirSync(paths.target.root)

        // start the webpack build
        return new Promise((resolve, reject) => {
          run(({ stats }) => {
            console.log()
            console.log('file sizes after gzip:\n')
            printFileSizesAfterBuild(
              stats,
              previousFileSizes,
              paths.target.root,
              WARN_AFTER_BUNDLE_GZIP_SIZE,
              WARN_AFTER_CHUNK_GZIP_SIZE
            )
            console.log()
            resolve()
          }, reject)
        })
      })
  } catch (error) {
    spinner.fail(currentDate() + chalk.red('compilation failed.'))
    console.log()
    printBuildError(error)
    console.log()
    process.exit(1)
  }
}
