/* eslint-disable @typescript-eslint/no-var-requires */
import { coverString } from '@barusu/option-util'
import { RawEnv } from '@barusu-react/webpack-config'
import { paths } from './paths'
import manifest from '../../package.json'


export const env: RawEnv = {
  manifest,
  useModuleScopePlugin: false,
  development: {
    publicPath: coverString('/', process.env.PUBLIC_PATH),
    server: {
      launchBrowser: false,
    }
  },
  production: {
    publicPath: coverString('/', process.env.PUBLIC_PATH),
    shouldUseSourceMap: false,
    shouldJsChunk: false,
    shouldCSSChunk: false,
    shouldJsMinified: false,
    shouldCSSMinified: false,
    inject: {
    },
  },
  webpackOptions: {
    cssRuleOptionsHook: ({ isEnvProduction }) => {
      return [
        {
          include: [paths.source.src],
          cssLoaderOptions: {
            url: true,
            import: true,
            modules: {
              localIdentName: 'laputa-[local]'
            },
            sourceMap: false,
            importLoaders: 1,
            localsConvention: 'camelCaseOnly',
          },
        },
        isEnvProduction && {
          include: undefined,
          exclude: [paths.source.src],
          cssLoaderOptions: {
            url: false,
            import: false,
            modules: false,
            sourceMap: false,
            importLoaders: 1,
          },
        }
      ]
    },
    stylusRuleOptionsHook: () => [
      {
        cssLoaderOptions: {
          url: true,
          import: true,
          modules: {
            localIdentName: 'laputa-[local]'
          },
          sourceMap: false,
          importLoaders: 1,
          localsConvention: 'camelCaseOnly',
        },
      }
    ],
    tsxRuleOptionsHook: ({ isEnvDevelopment }) => [{
      include: [
        paths.source.src,
        /@barusu\//,
        /@barusu-react\//,
      ],
      babelLoaderOptions: {
        sourceMaps: isEnvDevelopment,
      }
    }],
    additionalRulesHook: ({ isEnvDevelopment }) => {
      return [
        isEnvDevelopment && {
          test: /\.css$/,
          exclude: [paths.source.src],
          use: [
            {
              loader: require.resolve('style-loader'),
              options: {
                injectType: 'linkTag'
              },
            },
            {
              loader: require.resolve('file-loader'),
            }
          ]
        },
      ]
    },
  }
}
