import {
  createPreprocessorConfig,
  createRollupConfig,
} from '@barusu-react/rollup-config'
import path from 'path'
import manifest from './package.json'

const resolvePath = p => path.resolve(__dirname, p)
const paths = {
  source: {
    stylesheetInput: [resolvePath('src/style/index.styl')],
    assetsRoot: resolvePath('src/assets'),
  },
  eslintrc: resolvePath('.eslintrc.js'),
  tsconfig: resolvePath('tsconfig.src.json'),
}

const preprocessorConfig = createPreprocessorConfig({
  input: paths.source.stylesheetInput,
  pluginOptions: {
    multiEntryOptions: {
      exports: false,
    },
    postcssOptions: {
      modules: {
        localsConvention: 'camelCase',
      },
    },
  },
})

const config = createRollupConfig({
  manifest,
  pluginOptions: {
    typescriptOptions: {
      tsconfig: paths.tsconfig,
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
        },
      },
    },
  },
})

const resolvedConfig = [preprocessorConfig, config]

export default resolvedConfig
