/* eslint-disable @typescript-eslint/no-var-requires */
import webpack from 'webpack'
import { build as baseBuild } from '@barusu-react/webpack-util'
import { RawEnv, resolveEnv } from './config/env'
import { Paths } from './config/paths'
import { createBaseProdWebConfig } from './config/webpack.config.base.prod'


interface Params {
  env: RawEnv
  paths: Paths
  config?: webpack.Configuration
}


export async function build({ env: partialEnv, paths, config: _config }: Params) {
  const env = resolveEnv(partialEnv)
  const config = _config == null ? createBaseProdWebConfig({ env, paths }) : _config
  return await baseBuild({ env, paths, config })
}
