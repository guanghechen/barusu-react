import fs from 'fs-extra'
import path from 'path'
import { Paths } from '@barusu-react/webpack-config'


const appDirectory = fs.realpathSync(process.cwd())
export const resolvePath = (...relativePath: string[]) => {
  return path.normalize(path.resolve(appDirectory, ...relativePath))
}


export const paths: Paths = {
  source: {
    root: appDirectory,
    src: resolvePath('src'),
    public: resolvePath('public'),
    eslintrc: resolvePath('.eslintrc'),
    packageJson: resolvePath('package.json'),
    tsconfigJson: resolvePath('tsconfig.src.json'),
    nodeModules: resolvePath('node_modules'),
    extraNodeModules: [
      resolvePath('../../node_modules'),
    ],
    lockFile: resolvePath('yarn.lock'),
  },
  target: {
    root: resolvePath('dist'),
  },
  entries: [
    {
      name: 'index',
      page: resolvePath('src/index.pug'),
      script: resolvePath('src/index.tsx'),
    }
  ],
  alias: {
    '@': resolvePath('src'),
  }
}
