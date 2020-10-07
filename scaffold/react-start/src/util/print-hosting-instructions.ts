import chalk from 'chalk'
import fs from 'fs-extra'
import globalModules from 'global-modules'
import path from 'path'


/**
 * Print static server instructions
 *
 * @param buildFolder
 * @param useYarn
 */
export function printStaticServerInstructions(
  buildFolder: string,
  useYarn: boolean,
): void {
  console.log('You may serve it with a static server:')
  console.log()

  if (!fs.existsSync(`${ globalModules }/serve`)) {
    if (useYarn) {
      console.log(`  ${ chalk.cyan('yarn') } global add serve`)
    } else {
      console.log(`  ${ chalk.cyan('npm') } install -g serve`)
    }
  }

  const relativeBuildFolder = path.relative(path.resolve(), buildFolder)
  console.log(`  ${ chalk.cyan('serve') } -s ${ relativeBuildFolder }`)
}
