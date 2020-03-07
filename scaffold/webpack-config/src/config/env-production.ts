import { coverBoolean, coverString } from '@barusu/option-util'
import { ProductionEnv as BaseProductionEnv } from '@barusu-react/webpack-util'


export interface ProductionEnv extends BaseProductionEnv {
  inject: {
    NODE_ENV: 'production'
    PUBLIC_URL: string
    SITE_TITLE: string
  }
}


export interface RawProductionEnv extends Partial<BaseProductionEnv> {
  inject?: {
    PUBLIC_URL?: string
    SITE_TITLE?: string
  }
}


export function resolveProductionEnv (manifest: any, rawEnv: RawProductionEnv): ProductionEnv {
  const {
    inject = {},
  } = rawEnv

  const defaultPublicPath = coverString('/', process.env.PUBLIC_PATH)
  const defaultShouldUseSourceMap = coverBoolean(true, process.env.GENERATE_SOURCEMAP)
  const defaultShouldInlineRuntimeChunk = coverBoolean(true, process.env.INLINE_RUNTIME_CHUNK)
  const defaultShouldCSSChunk = coverBoolean(true, process.env.CSS_CHUNK)
  const defaultShouldJsChunk = coverBoolean(true, process.env.JS_CHUNK)
  const defaultShouldCSSMinified = coverBoolean(true, process.env.CSS_MINIFIED)
  const defaultShouldJsMinified = coverBoolean(true, process.env.JS_MINIFIED)
  const defaultInjectPublicUrl = coverString('/', process.env.PUBLIC_URL)
  const defaultInjectSiteTitle = coverString(manifest.name, process.env.SITE_TITLE)

  return {
    publicPath: coverString(defaultPublicPath, rawEnv.publicPath),
    shouldUseSourceMap: coverBoolean(defaultShouldUseSourceMap, rawEnv.shouldUseSourceMap),
    shouldInlineRuntimeChunk: coverBoolean(defaultShouldInlineRuntimeChunk, rawEnv.shouldInlineRuntimeChunk),
    shouldCSSChunk: coverBoolean(defaultShouldCSSChunk, rawEnv.shouldCSSChunk),
    shouldJsChunk: coverBoolean(defaultShouldJsChunk, rawEnv.shouldJsChunk),
    shouldCSSMinified: coverBoolean(defaultShouldCSSMinified, rawEnv.shouldCSSMinified),
    shouldJsMinified: coverBoolean(defaultShouldJsMinified, rawEnv.shouldJsMinified),
    inject: {
      PUBLIC_URL: coverString(defaultInjectPublicUrl, inject.PUBLIC_URL),
      SITE_TITLE: coverString(defaultInjectSiteTitle, inject.SITE_TITLE),
      ...inject,
      NODE_ENV: 'production'
    },
  }
}
