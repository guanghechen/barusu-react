/**
 * 服务器的配置项
 */
export interface DevelopmentServerEnv {
  /**
   * devServer 的访问协议
   */
  protocol: 'http' | 'https'
  /**
   * devServer 的 hostname
   */
  hostname: string
  /**
   * devServer 的端口
   */
  port: number
  /**
   * 是否禁用访问 ip 白名单
   */
  disableHostCheck: boolean
  /**
   * 在服务器启动后是否打开浏览器
   */
  launchBrowser: boolean
  /**
   * 发生更新后是否清空控制台
   */
  clearConsoleAfterUpdate: boolean
  /**
   * 指定的 ip 地址列表才能访问
   */
  allowedHosts?: string[]
}


/**
 * 开发环境的配置项
 */
export interface DevelopmentEnv {
  /**
   * 路由根路径
   */
  publicPath: string
  /**
   * 是否生成 sourcemap
   */
  shouldUseSourceMap: boolean
  /**
   * 注入的环境变量
   */
  inject: object
  /**
   * devServer 的配置项
   */
  server: DevelopmentServerEnv
}
