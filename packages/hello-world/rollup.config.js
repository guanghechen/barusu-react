import path from 'path'
import * as react from 'react'
import { createRollupConfig } from '@barusu-react/rollup-config'
import manifest from './package.json'


const paths = {
  eslintrc: path.resolve(__dirname, '.eslintrc'),
  tsconfig: path.resolve(__dirname, 'tsconfig.json'),
}


const config = createRollupConfig({
  manifest,
  preprocessOptions: {
    stylesheets: {
      input: 'src/**/*.styl',
      pluginOptions: {
        multiEntryOptions: {
          exports: false,
        },
        postcssOptions: {
          modules: {
            camelCase: true,
          },
        }
      },
    }
  },
  pluginOptions: {
    eslintOptions: {
      configFile: paths.eslintrc,
      include: ['src/**/*{.ts,.tsx}'],
      exclude: ['src/**/*.styl.d.ts'],
    },
    typescriptOptions: {
      tsconfig: paths.tsconfig,
      include: ['src/**/*{.ts,.tsx}'],
      exclude: '**/__tests__/**',
    },
    commonjsOptions: {
      include: ['../../node_modules/**'],
      exclude: ['**/*.stories.js'],
      namedExports: {
        'react': Object.keys(react),
      },
    },
    postcssOptions: {
      extract: false,
      minimize: true,
      modules: {
        camelCase: true,
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
