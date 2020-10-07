import path from 'path'
import webpack from 'webpack'


export interface ConfigPaths {
  resolvePath: (...relativePath: string[]) => string
  source: {
    root: string
    src: string
    public: string
    polyfill?: string
    eslintrc: string
    packageJson: string
    tsconfigJson: string
    nodeModules: string
    extraNodeModules: string[]
    lockFile: string
    proxySetup: string
    externals: webpack.ExternalsElement[]
  }
  target: {
    root: string
    mainPage: string
  }
  entries: {
    name: string
    page: string
    script: string
  }[]
  moduleExtensions: string[]
  alias: Record<string, string>
}


export function createConfigPaths(appDirectory: string): ConfigPaths {
  const resolvePath = (...relativePath: string[]): string => {
    return path.normalize(path.resolve(appDirectory, ...relativePath))
  }

  const paths: ConfigPaths = {
    resolvePath,
    source: {
      root: appDirectory,
      src: resolvePath('src'),
      public: resolvePath('public'),
      polyfill: '',
      eslintrc: resolvePath('.eslintrc.js'),
      packageJson: resolvePath('package.json'),
      tsconfigJson: resolvePath('tsconfig.src.json'),
      nodeModules: resolvePath('node_modules'),
      extraNodeModules: [],
      lockFile: resolvePath('yarn.lock'),
      proxySetup: resolvePath('src/setupProxy.js'),
      externals: [] as webpack.ExternalsElement[],
    },
    target: {
      root: resolvePath('dist'),
      mainPage: resolvePath('dist/index.html'),
    },
    entries: [
      {
        name: 'index',
        page: resolvePath('src/index.pug'),
        script: resolvePath('src/index.tsx'),
      }
    ],
    moduleExtensions: [
      '.web.mjs',
      '.mjs',
      '.web.js',
      '.js',
      '.web.ts',
      '.ts',
      '.web.tsx',
      '.tsx',
      '.json',
      '.web.jsx',
      '.jsx'
    ],
    alias: {
      '@': resolvePath('src'),
    }
  }

  return paths
}
