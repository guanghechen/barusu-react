import autoprefixer from 'autoprefixer'
import postcssFlexbugsFixes from 'postcss-flexbugs-fixes'
import postcssUrl from 'postcss-url'
import rollup from 'rollup'
import peerDepsExternal from 'rollup-plugin-peer-deps-external'
import typescript from 'rollup-plugin-typescript2'
import postcss from '@barusu-react/rollup-plugin-postcss-dts'
import { collectAllDependencies } from '@barusu/util-cli'
import { convertToBoolean, coverBoolean } from '@barusu/util-option'
import commonjs from '@rollup/plugin-commonjs'
import json from '@rollup/plugin-json'
import nodeResolve from '@rollup/plugin-node-resolve'
import {
  CommonJSOptions,
  JsonOptions,
  NodeResolveOptions,
  PeerDepsExternalOptions,
  PostcssDtsOptions,
  PostcssPluginAutoprefixerOptions,
  PostcssPluginPostcssUrlOptions,
  TypescriptOptions,
} from './types/options'


export interface ConfigOptions extends rollup.InputOptions {
  /**
   * Whether to generate sourceMap (includes declarationMap)
   */
  useSourceMap: boolean
  /**
   * 是否将所有的依赖置为 external
   * @default true
   */
  externalAllDependencies: boolean
  manifest: {
    /**
     * source entry file
     */
    source: string
    /**
     * cjs entry file
     */
    main?: string
    /**
     * es entry file
     */
    module?: string
    /**
     * Dependency list
     */
    dependencies?: { [key: string]: string }
  }
  /**
   * Plugin options
   */
  pluginOptions?: {
    /**
     * options for @rollup/plugin-json
     */
    jsonOptions?: JsonOptions,
    /**
     * options for @rollup/plugin-node-resolve
     */
    nodeResolveOptions?: NodeResolveOptions
    /**
     * options for rollup-plugin-typescript2
     */
    typescriptOptions?: TypescriptOptions
    /**
     * options for @rollup/plugin-commonjs
     */
    commonjsOptions?: CommonJSOptions
    /**
     * options for rollup-plugin-peer-deps-external
     */
    peerDepsExternalOptions?: PeerDepsExternalOptions
    /**
     * options for @barusu-react/rollup-plugin-postcss-dts
     */
    postcssOptions?: PostcssDtsOptions & {
      pluginOptions?: {
        /**
         * options for autoprefixer
         */
        autoprefixerOptions?: PostcssPluginAutoprefixerOptions
        /**
         * options for postcss-url
         */
        postcssUrlOptions?: PostcssPluginPostcssUrlOptions
      }
    }
  }
}


const builtinExternals: string[] = [
  'glob',
  'sync',
  ...require('builtin-modules'),
]


/**
 * Create rollup config for handle react component
 * @param options
 */
export function createRollupConfig(
  options: ConfigOptions
): rollup.RollupOptions {
  const DEFAULT_USE_SOURCE_MAP = coverBoolean(
    true, convertToBoolean(process.env.ROLLUP_USE_SOURCE_MAP))
  const DEFAULT_EXTERNAL_ALL_DEPENDENCIES = coverBoolean(
    true, convertToBoolean(process.env.ROLLUP_EXTERNAL_ALL_DEPENDENCIES))

  const {
    useSourceMap = DEFAULT_USE_SOURCE_MAP,
    externalAllDependencies = DEFAULT_EXTERNAL_ALL_DEPENDENCIES,
    manifest,
    pluginOptions = {},
    ...resetInputOptions
  } = options

  const externalSet: Set<string> = new Set([
    ...builtinExternals,
    ...Object.keys(manifest.dependencies || {}),
  ])

  if (externalAllDependencies) {
    const dependencies = collectAllDependencies(
      undefined,
      Object.keys(manifest.dependencies || {}),
      undefined,
      /[\s\S]*/,
    )
    for (const dependency of dependencies) {
      externalSet.add(dependency)
    }
  }
  // process task
  const {
    jsonOptions = {},
    nodeResolveOptions = {},
    typescriptOptions = {},
    commonjsOptions = {},
    peerDepsExternalOptions = {},
    postcssOptions: {
      pluginOptions: postcssPluginOptions = {},
      ...postcssOptions
    } = {},
  } = pluginOptions
  const config: rollup.RollupOptions = {
    input: manifest.source,
    output: [
      manifest.main && {
        file: manifest.main,
        format: 'cjs',
        exports: 'named',
        sourcemap: useSourceMap,
      },
      manifest.module && {
        file: manifest.module,
        format: 'es',
        exports: 'named',
        sourcemap: useSourceMap,
      }
    ].filter(Boolean) as rollup.OutputOptions[],
    external: function (id: string): boolean {
      const m = /^([.][\s\S]*|@[^/\s]+[/][^/\s]+|[^/\s]+)/.exec(id)
      if (m == null) return false
      return externalSet.has(m[1])
    },
    plugins: [
      peerDepsExternal(peerDepsExternalOptions),
      nodeResolve({
        browser: true,
        preferBuiltins: false,
        ...nodeResolveOptions,
      }),
      json({
        indent: '  ',
        namedExports: true,
        ...jsonOptions,
      }),
      typescript({
        clean: true,
        typescript: require('typescript'),
        useTsconfigDeclarationDir: true,
        include: ['src/**/*{.ts,.tsx}'],
        tsconfigDefaults: {
          compilerOptions: {
            declaration: true,
            declarationMap: true,
            declarationDir: 'lib/types',
            outDir: 'lib',
          }
        },
        tsconfigOverride: {
          compilerOptions: {
            declarationMap: useSourceMap,
          }
        },
        ...typescriptOptions,
      }),
      commonjs({
        extensions: ['.js', '.jsx', '.ts', '.tsx'],
        ...commonjsOptions,
      }),
      postcss({
        plugins: [
          postcssFlexbugsFixes({}),
          autoprefixer({
            ...postcssPluginOptions.autoprefixerOptions,
          }),
          postcssUrl({
            url: 'inline',
            ...postcssPluginOptions.postcssUrlOptions,
          }),
        ],
        ...postcssOptions,
      }),
    ] as rollup.Plugin[],
    ...resetInputOptions,
  }

  return config
}
