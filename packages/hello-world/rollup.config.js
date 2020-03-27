import path from 'path'
import * as react from 'react'
import { createRollupConfig } from '@barusu-react/rollup-config'
import manifest from './package.json'


const resolvePath = p => path.resolve(__dirname, p)
const paths = {
  source: {
    stylesheetInput: [
      resolvePath('src/**/*.styl'),
    ],
  },
  eslintrc: resolvePath('.eslintrc.js'),
  tsconfig: resolvePath('tsconfig.json'),
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
      useTsconfigDeclarationDir: true,
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
