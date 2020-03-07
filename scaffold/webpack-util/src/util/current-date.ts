import chalk from 'chalk'


/**
 * print current date-time (gray).
 */
export function currentDate() {
  const date = new Date()
  return chalk.gray(
    new Date(date.getTime() - (date.getTimezoneOffset() * 60000))
      .toISOString()
      .replace(/T/, ' ')
      .replace(/\..+/, '')
      .concat(' ')
  )
}
