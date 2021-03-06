import chalk from 'chalk'
import fs from 'fs-extra'
import Ora from 'ora'
import { checkBrowsers } from 'react-dev-utils/browsersHelper'
import type { OpaqueFileSizes } from 'react-dev-utils/FileSizeReporter'
import {
  measureFileSizesBeforeBuild,
  printFileSizesAfterBuild,
} from 'react-dev-utils/FileSizeReporter'
import formatWebpackMessages from 'react-dev-utils/formatWebpackMessages'
import printBuildError from 'react-dev-utils/printBuildError'
import webpack from 'webpack'
import type { ConfigEnv } from './config/env'
import type { ConfigPaths } from './config/paths'
import createWebpackConfig from './config/webpack.config'
import checkRequiredFiles from './util/check-required-files'
import currentDate from './util/current-date'
import { printStaticServerInstructions } from './util/print-hosting-instructions'

// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore

interface Params {
  /**
   * @default 512K
   */
  WARN_AFTER_BUNDLE_GZIP_SIZE?: number
  /**
   * @default 1024K
   */
  WARN_AFTER_CHUNK_GZIP_SIZE?: number
}

export async function build(
  env: ConfigEnv,
  paths: ConfigPaths,
  config?: webpack.Configuration,
  {
    // these sizes are pretty large. we'll warn for bundles exceeding them.
    WARN_AFTER_BUNDLE_GZIP_SIZE = 512 * 1024,
    WARN_AFTER_CHUNK_GZIP_SIZE = 1024 * 1024,
  }: Params = {},
): Promise<boolean> {
  // Do this as the first thing so that any code reading it knows the right env.
  process.env.BABEL_ENV = 'production'
  ;(process.env as any).NODE_ENV = 'production'

  // Warn and crash if required files are missing
  if (!checkRequiredFiles(paths.entries)) {
    return false
  }

  // We used to support resolving modules according to `NODE_PATH`.
  // This now has been deprecated in favor of jsconfig/tsconfig.json
  // This lets you use absolute paths in imports inside large monorepos:
  if (process.env.NODE_PATH) {
    console.log(
      chalk.yellow(
        'Setting NODE_PATH to resolve modules absolutely has been deprecated in favor of setting baseUrl in jsconfig.json (or tsconfig.json if you are using TypeScript) and will be removed in a future major release of create-react-app.',
      ),
    )
    console.log()
  }

  const isInteractive = env.isInteractive
  // eslint-disable-next-line new-cap
  const spinner = Ora()

  function run(): Promise<{ stats: any }> {
    return new Promise((resolve, reject) => {
      let timer: NodeJS.Timeout
      const startTime = Date.now()

      const logProcess = (stop?: boolean): void => {
        const message = `packing for production.... time used: ${
          Date.now() - startTime
        }ms.`
        if (stop) {
          clearTimeout(timer)
          spinner.info(chalk.green(message))
        } else {
          spinner.text = chalk.cyan(message)
          timer = setTimeout(logProcess, 100) as any
        }
      }

      if (config == null) {
        // eslint-disable-next-line no-param-reassign
        config = createWebpackConfig('production', env, paths)
      }
      const compiler: webpack.Compiler = webpack(config)
      compiler.run((err: Error | null, stats: webpack.Stats) => {
        logProcess(true)
        let messages: { errors: string[]; warnings: string[] }

        if (err != null) {
          if (!err.message) return void reject(err)

          let errMessage = err.message

          // Add additional information for postcss errors
          if (Object.prototype.hasOwnProperty.call(err, 'postcssNode')) {
            errMessage +=
              '\nCompileError: Begins at CSS selector ' +
              err['postcssNode'].selector
          }

          messages = formatWebpackMessages(({
            errors: [errMessage],
            warnings: [],
          } as unknown) as webpack.Stats.ToJsonOutput)
        } else {
          messages = formatWebpackMessages(
            stats.toJson({ all: false, warnings: true, errors: true }),
          )
        }

        // if errors exists, only show errors.
        if (messages.errors.length) {
          // Only keep the first error. Others are often indicative
          // of the same problem, but confuse the reader with noise.
          if (messages.errors.length > 1) {
            messages.errors.length = 1
          }
          return void reject(new Error(messages.errors.join('\n\n')))
        }

        if (
          process.env.CI &&
          (typeof process.env.CI !== 'string' ||
            process.env.CI.toLowerCase() !== 'false') &&
          messages.warnings.length > 0
        ) {
          console.log(
            chalk.yellow(
              '\nTreating warnings as errors because process.env.CI = true.\n' +
                'Most CI servers set it automatically.\n',
            ),
          )
          return void reject(new Error(messages.warnings.join('\n\n')))
        }

        // If warnings exists, show warnings if no errors were found.
        if (messages.warnings.length > 0) {
          spinner.warn(chalk.yellow('Compiled with warnings.\n'))
          console.log(messages.warnings.join('\n\n'))
          console.log(
            'search related ' +
              chalk.underline(chalk.yellow('keyword')) +
              ' to get more info about the warning.\n',
          )
        } else {
          spinner.succeed(chalk.green('Compiled successfully.'))
          console.log()
        }

        resolve({ stats })
      })

      spinner.start()
      logProcess()
    })
  }

  try {
    await checkBrowsers(paths.source.root, isInteractive)

    // First, read the current file sizes in build directory.
    // This lets us display how much they changed later.
    const previousFileSizes: OpaqueFileSizes = await measureFileSizesBeforeBuild(
      paths.target.root,
    )

    // Remove all content but keep the directory so that
    // if you're in it, you don't end up in Trash
    fs.emptyDirSync(paths.target.root)

    // Merge with the public folder
    if (fs.existsSync(paths.source.public)) {
      fs.copySync(paths.source.public, paths.target.root, {
        dereference: true,
      })
    }

    // Start the webpack build
    const { stats } = await run()

    // Print bundled information
    console.log('file sizes after gzip:\n')
    printFileSizesAfterBuild(
      stats,
      previousFileSizes,
      paths.target.root,
      WARN_AFTER_BUNDLE_GZIP_SIZE,
      WARN_AFTER_CHUNK_GZIP_SIZE,
    )
    console.log()
    printStaticServerInstructions(paths.target.root, true)
    console.log()
  } catch (error) {
    const tscCompileOnError = process.env.TSC_COMPILE_ON_ERROR === 'true'
    if (tscCompileOnError) {
      spinner.warn(
        'Compiled with type errors (you may want to check these before deploying your app).',
      )
      console.log()
      printBuildError(error)
    } else {
      spinner.fail(currentDate() + chalk.red('compilation failed.'))
      console.log()
      printBuildError(error)
      return false
    }
  }

  return true
}

// Makes the script crash on unhandled rejections instead of silently
// ignoring them. In the future, promise rejections that are not handled will
// terminate the Node.js process with a non-zero exit code.
process.on('unhandledRejection', err => {
  throw err
})
