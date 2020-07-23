import {
  DevelopmentEnv as BaseDevelopmentEnv,
  DevelopmentServerEnv,
  chooseIpv4Address,
} from '@barusu-react/webpack-util'
import { cover, coverBoolean, coverNumber, coverString } from '@barusu/util-option'


export interface DevelopmentEnv extends BaseDevelopmentEnv {
  inject: {
    NODE_ENV: 'development'
    PUBLIC_URL: string
    SITE_TITLE: string
  }
}


export interface RawDevelopmentEnv extends Partial<Omit<BaseDevelopmentEnv, 'server'>> {
  inject?: {
    PUBLIC_URL?: string
    SITE_TITLE?: string
  }
  server?: Partial<DevelopmentServerEnv>
}


export function resolveDevelopmentEnv(manifest: any, rawEnv: RawDevelopmentEnv): DevelopmentEnv {
  const {
    inject = {},
    server = {} as Partial<DevelopmentServerEnv>,
  } = rawEnv

  const defaultPublicPath = coverString('/', process.env.PUBLIC_PATH)
  const defaultShouldUseSourceMap = coverBoolean(true, process.env.GENERATE_SOURCEMAP)
  const defaultHostAddress = coverString(
    '127.0.0.1',
    process.env.HOST_IP_PREFIX != null ? chooseIpv4Address(process.env.HOST_IP_PREFIX || '') : undefined)
  const defaultProtocol = process.env.HTTPS ? 'https' : coverString('http', process.env.PROTOCOL)
  const defaultHostname = coverString(defaultHostAddress, process.env.HOST)
  const defaultPort = coverNumber(3000, process.env.PORT || '')
  const defaultDisableHostCheck = coverBoolean(false, process.env.DANGEROUSLY_DISABLE_HOST_CHECK)
  const defaultAllowedHosts = undefined
  const defaultLaunchBrowser = coverBoolean(true, process.env.LAUNCH_BROWSER)
  const defaultClearConsoleAfterUpdate = coverBoolean(process.stdout.isTTY, process.env.CLEAR_CONSOLE_AFTER_UPDATE)
  const defaultInjectPublicUrl = coverString('/', process.env.PUBLIC_URL)
  const defaultInjectSiteTitle = coverString(manifest.name, process.env.SITE_TITLE)

  return {
    publicPath: coverString(defaultPublicPath, rawEnv.publicPath),
    shouldUseSourceMap: coverBoolean(defaultShouldUseSourceMap, rawEnv.shouldUseSourceMap),
    server: {
      protocol: coverString(defaultProtocol, server.protocol) as DevelopmentServerEnv['protocol'],
      hostname: coverString(defaultHostname, server.hostname),
      port: coverNumber(defaultPort, server.port),
      disableHostCheck: coverBoolean(defaultDisableHostCheck, server.disableHostCheck),
      allowedHosts: cover(defaultAllowedHosts, server.allowedHosts),
      launchBrowser: coverBoolean(defaultLaunchBrowser, server.launchBrowser),
      clearConsoleAfterUpdate: coverBoolean(defaultClearConsoleAfterUpdate, server.clearConsoleAfterUpdate),
    },
    inject: {
      PUBLIC_URL: coverString(defaultInjectPublicUrl, inject.PUBLIC_URL),
      SITE_TITLE: coverString(defaultInjectSiteTitle, inject.SITE_TITLE),
      ...inject,
      NODE_ENV: 'development'
    }
  }
}
