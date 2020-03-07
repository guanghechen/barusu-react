import { build as baseBuild } from '@barusu-react/webpack-config'
import { env } from './config/env'
import { paths } from './config/paths'


export async function build () {
  await baseBuild({ env, paths })
}

build()
