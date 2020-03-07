import { start as baseStart } from '@barusu-react/webpack-config'
import { env } from './config/env'
import { paths } from './config/paths'


export async function start() {
  await baseStart({ env, paths })
}


start()
