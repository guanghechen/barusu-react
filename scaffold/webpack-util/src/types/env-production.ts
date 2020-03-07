/**
 * 生产环境的配置项
 */
export interface ProductionEnv {
  /**
   * 路由根路径
   */
  publicPath: string
  /**
   * 是否生成 sourcemap
   */
  shouldUseSourceMap: boolean
  /**
   * 是否使用运行时的分片
   */
  shouldInlineRuntimeChunk: boolean
  /**
   * css 是否分片
   */
  shouldCSSChunk: boolean
  /**
   * js 是否分片
   */
  shouldJsChunk: boolean
  /**
   * css 是否压缩
   */
  shouldCSSMinified: boolean
  /**
   * js 是否压缩
   */
  shouldJsMinified: boolean
  /**
   * 注入的环境变量
   */
  inject: object
}
