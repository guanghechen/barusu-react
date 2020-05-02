import path from 'path'
import * as react from 'react'
import { createRollupConfig } from '@barusu-react/rollup-config'
import manifest from './package.json'


const resolvePath = p => path.resolve(__dirname, p)
const paths = {
  source: {
    stylesheetInput: [
      resolvePath('src/style/index.styl'),
    ],
    assetsRoot: resolvePath('src/assets'),
  },
  eslintrc: resolvePath('.eslintrc.js'),
  tsconfig: resolvePath('tsconfig.src.json'),
}


const config = createRollupConfig({
  manifest,
  preprocessOptions: {
    stylesheets: {
      input: paths.source.stylesheetInput,
      pluginOptions: {
        multiEntryOptions: {
          exports: false,
        },
        postcssOptions: {
          modules: {
            localsConvention: 'camelCase',
          },
        }
      },
    }
  },
  pluginOptions: {
    eslintOptions: {
      configFile: paths.eslintrc,
    },
    typescriptOptions: {
      tsconfig: paths.tsconfig,
      useTsconfigDeclarationDir: true,
    },
    commonjsOptions: {
      include: ['../../node_modules/**'],
      namedExports: {
        'react': Object.keys(react),
      },
    },
    postcssOptions: {
      extract: false,
      minimize: true,
      modules: {
        localsConvention: 'camelCase',
        generateScopedName: 'barusu-[local]',
      },
      pluginOptions: {
        postcssUrlOptions: {
          url: 'inline',
          basePath: paths.source.assetsRoot,
        }
      },
    }
  }
})


export default config
