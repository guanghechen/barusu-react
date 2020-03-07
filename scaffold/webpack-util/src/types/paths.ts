import webpack from 'webpack'


export interface EntryPathsItem {
  /**
   * 入口名称
   */
  name: string
  /**
   * .pug/html 所在的路径
   */
  page: string
  /**
   * 入口脚本所在的路径
   */
  script?: string
}


export interface PagePathsItem {
  /**
   * 页面名称
   */
  name: string
  /**
   * 模板位置
   */
  page: string
}


/**
 * 源文件配置信息
 */
export interface SourcePaths {
  /**
   * 源文件的根目录
   */
  root: string
  /**
   * 源代码所在的目录
   */
  src: string
  /**
   * 静态资源文件所在的目录
   */
  public: string
  /**
   * eslint 配置文件所在的路径
   */
  eslintrc: string
  /**
   * package.json 所在的路径
   */
  packageJson: string
  /**
   * tsconfig.json 所在的路径
   */
  tsconfigJson: string
  /**
   * node_modules 所在的路径
   */
  nodeModules: string
  /**
    * 额外的 node modules 路径
    */
  extraNodeModules: string[]
  /**
   * yarn.lock/package-lock.json 所在的路径
   */
  lockFile: string
  /**
   * 脚本垫片
   */
  polyfill?: string
  /**
   * 外部库的配置
   * @see https://webpack.js.org/configuration/externals/
   */
  externals?: webpack.ExternalsElement | webpack.ExternalsElement[]
}


/**
 * 目标文件配置信息
 */
export interface TargetPaths {
  /**
   * 目标文件的根目录
   */
  root: string
}


/**
 * 路径信息
 */
export interface Paths {
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
