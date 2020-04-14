import {
  EntryPathsItem,
  Paths as BasePaths,
  SourcePaths,
  TargetPaths,
} from '@barusu-react/webpack-util'
export { EntryPathsItem, PagePathsItem } from '@barusu-react/webpack-util'


/**
 * 路径信息
 */
export interface Paths extends BasePaths {
  /**
   * 源文件配置信息
   */
  source: SourcePaths
  /**
   * 目标文件配置信息
   */
  target: TargetPaths
  /**
   * 入口配置
   */
  entries: EntryPathsItem[]
  /**
   * webpack 路径别名配置
   */
  alias?: { [key: string]: string }
}
