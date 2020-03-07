import { DevelopmentEnv } from './env-development'
import { ProductionEnv } from './env-production'


/**
 * 环境变量
 */
export interface Env {
  /**
   * package.json 内容
   */
  manifest: any
  /**
   * 是否清除控制台
   */
  isInteractive: boolean
  /**
   * 开发环境下的选项
   */
  development: DevelopmentEnv
  /**
   * 生产环境下的选项
   */
  production: ProductionEnv
}
