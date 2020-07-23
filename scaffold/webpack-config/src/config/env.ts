import { CssRuleProps, StylusRuleProps } from '@barusu-react/webpack-rule-css'
import { OutsideJsRuleProps, TsxRuleProps } from '@barusu-react/webpack-rule-tsx'
import { Env as BaseEnv } from '@barusu-react/webpack-util'
import { coverBoolean } from '@barusu/util-option'
import webpack from 'webpack'
import { DevelopmentEnv, RawDevelopmentEnv, resolveDevelopmentEnv } from './env-development'
import { ProductionEnv, RawProductionEnv, resolveProductionEnv } from './env-production'


export interface HookParams {
  /**
   * 是否处于生产环境下
   */
  isEnvProduction: boolean
  /**
   * 是否处于开发环境下
   */
  isEnvDevelopment: boolean
  /**
   * 环境变量信息
   */
  env: Env
}


export interface Env extends BaseEnv {
  /**
   * 是否使用 react-dev-utils/ModuleScopePlugin
   * 该插件在 yarn 的 workspaces 模式下可能引起错误
   * @see https://github.com/facebook/create-react-app/issues/5711
   * @default true
   */
  useModuleScopePlugin: boolean
  /**
   * 开发模式下的配置
   */
  development: DevelopmentEnv
  /**
   * 生产模式下的配置
   */
  production: ProductionEnv
  /**
   * webpack 配置选项
   */
  webpackOptions: {
    cssRuleOptionsHook: (params: HookParams) => Partial<CssRuleProps>[]
    stylusRuleOptionsHook: (params: HookParams) => Partial<StylusRuleProps>[]
    tsxRuleOptionsHook: (params: HookParams) => Partial<TsxRuleProps>[]
    outsideJsRuleOptionHook: (params: HookParams) => Partial<OutsideJsRuleProps>[]
    /**
     * 创建额外的配置项，插入到 module.rule.rules.$.oneOf 的 fallback 之前
     */
    additionalRulesHook: (params: HookParams) => webpack.RuleSetRule[]
    /**
     * 额外的插件，插入到 plugins 的 ForTsCheckerWebpackPlugin 之前
     */
    additionalPluginsHook: (params: HookParams) => webpack.Plugin[]
  }
}


export interface RawEnv extends Partial<Omit<BaseEnv, 'development' | 'production'>> {
  useModuleScopePlugin?: boolean
  development?: RawDevelopmentEnv
  production?: RawProductionEnv
  webpackOptions?: {
    cssRuleOptionsHook?: (params: HookParams) => (Partial<CssRuleProps> | false)[]
    stylusRuleOptionsHook?: (params: HookParams) => (Partial<StylusRuleProps> | false)[]
    tsxRuleOptionsHook?: (params: HookParams) => (Partial<TsxRuleProps> | false)[]
    outsideJsRuleOptionHook?: (params: HookParams) => (Partial<TsxRuleProps> | false)[]
    additionalRulesHook?: (params: HookParams) => (webpack.RuleSetRule | false)[]
    additionalPluginsHook?: (params: HookParams) => (webpack.Plugin | false)[]
  }
}


export function resolveEnv(rawEnv: RawEnv): Env {
  const { webpackOptions = {} } = rawEnv
  const {
    cssRuleOptionsHook = (): [] => [],
    stylusRuleOptionsHook = (): [] => [],
    tsxRuleOptionsHook = (): [] => [],
    outsideJsRuleOptionHook = (): [] => [],
    additionalRulesHook = (): [] => [],
    additionalPluginsHook = (): [] => [],
  } = webpackOptions


  const defaultIsInteractive = Boolean(process.stdout.isTTY)
  const defaultUseModuleScopePlugin = true
  const development: DevelopmentEnv = resolveDevelopmentEnv(rawEnv.manifest, rawEnv.development || {})
  const production: ProductionEnv = resolveProductionEnv(rawEnv.manifest, rawEnv.production || {})

  const filterEmptyHooks = <T>(hook: (params: HookParams) => (T | false)[]) => {
    return (params: HookParams): T[] => (
      hook(params).filter(Boolean) as T[]
    )
  }

  return {
    manifest: rawEnv.manifest,
    isInteractive: coverBoolean(defaultIsInteractive, rawEnv.isInteractive),
    useModuleScopePlugin: coverBoolean(defaultUseModuleScopePlugin, rawEnv.useModuleScopePlugin),
    development,
    production,
    webpackOptions: {
      cssRuleOptionsHook: filterEmptyHooks(cssRuleOptionsHook),
      stylusRuleOptionsHook: filterEmptyHooks(stylusRuleOptionsHook),
      tsxRuleOptionsHook: filterEmptyHooks(tsxRuleOptionsHook),
      outsideJsRuleOptionHook: filterEmptyHooks(outsideJsRuleOptionHook),
      additionalRulesHook: filterEmptyHooks(additionalRulesHook),
      additionalPluginsHook: filterEmptyHooks(additionalPluginsHook),
    },
  }
}
