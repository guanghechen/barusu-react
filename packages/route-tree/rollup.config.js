import path from 'path'
import { createRollupConfig } from '@barusu-react/rollup-config'
import manifest from './package.json'


const resolvePath = p => path.resolve(__dirname, p)
const paths = {
  source: {
    stylesheetInput: [
      resolvePath('src/style/index.styl'),
    ],
  },
  eslintrc: resolvePath('.eslintrc.js'),
  tsconfig: resolvePath('tsconfig.src.json'),
  nodeModules: resolvePath('../../node_modules/**'),
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
    typescriptOptions: {
      tsconfig: paths.tsconfig,
    },
    commonjsOptions: {
      include: [paths.nodeModules],
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
        }
      },
    }
  }
})


export default config
