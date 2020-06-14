/* eslint-disable @typescript-eslint/no-var-requires */
import { start as baseStart } from '@barusu-react/webpack-util'
import webpack from 'webpack'
import webpackDevServer from 'webpack-dev-server'
import { RawEnv, resolveEnv } from './config/env'
import { Paths } from './config/paths'
import { createBaseDevWebConfig } from './config/webpack.config.base.dev'
import { createBaseWebpackServerConfig } from './config/webpack.config.base.server'


interface Params {
  env: RawEnv
  paths: Paths
  config?: webpack.Configuration
  serverConfig?: webpackDevServer.Configuration
}


export async function start({
  env: partialEnv,
  paths,
  config: _config,
  serverConfig: _serverConfig,
}: Params): Promise<void> {
  const env = resolveEnv(partialEnv)
  const config = _config == null ? createBaseDevWebConfig({ env, paths }) : _config
  const serverConfig = _serverConfig == null ? createBaseWebpackServerConfig({ env, paths }) : _serverConfig
  return await baseStart({ env, paths, config, serverConfig })
}
