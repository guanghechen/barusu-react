/**
 * rewrite with ts
 * @see https://github.com/facebook/create-react-app/blob/master/packages/react-dev-utils/checkRequiredFiles.js
 */
import chalk from 'chalk'
import fs from 'fs'
import path from 'path'


interface Target {
  page: string
  script?: string
}


export default function checkRequiredFiles(targets: Target[]): boolean {
  // warn and crash if required files are missing
  const requiredFiles = targets.reduce((items, { page, script}) => {
    if (page != null) items.push(page)
    if (script != null) items.push(script)
    return items
  }, [] as string[])

  let currentFilePath: string | undefined
  try {
    for (const filePath of requiredFiles) {
      currentFilePath = filePath
      fs.accessSync(filePath, fs.constants.F_OK)
    }
    return true
  } catch (err) {
    const dirName = currentFilePath == null ? currentFilePath : path.dirname(currentFilePath)
    const fileName = currentFilePath == null ? currentFilePath : path.basename(currentFilePath)
    console.log(chalk.red('Could not find a required file.'))
    console.log(chalk.red('  Name: ') + chalk.cyan(fileName))
    console.log(chalk.red('  Searched in: ') + chalk.cyan(dirName))
    return false
  }
}
