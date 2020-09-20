/* eslint-disable @typescript-eslint/no-var-requires */
import autoprefixer from 'autoprefixer'
import postcssFlexbugsFixes from 'postcss-flexbugs-fixes'
import postcssUrl from 'postcss-url'
import rollup from 'rollup'
import { eslint } from 'rollup-plugin-eslint'
import peerDepsExternal from 'rollup-plugin-peer-deps-external'
import typescript from 'rollup-plugin-typescript2'
import postcss from '@barusu-react/rollup-plugin-postcss-dts'
import { collectAllDependencies } from '@barusu/util-cli'
import { convertToBoolean, coverBoolean } from '@barusu/util-option'
import commonjs from '@rollup/plugin-commonjs'
import json from '@rollup/plugin-json'
import multiEntry from '@rollup/plugin-multi-entry'
import nodeResolve from '@rollup/plugin-node-resolve'
import {
  CommonJSOptions,
  EslintOptions,
  JsonOptions,
  MultiEntryOptions,
  NodeResolveOptions,
  PeerDepsExternalOptions,
  PostcssDtsOptions,
  PostcssPluginAutoprefixerOptions,
  PostcssPluginPostcssUrlOptions,
  TypescriptOptions,
} from './types/options'


export interface ProdConfigParams extends rollup.InputOptions {
  /**
   * 是否生成 sourceMap （包括 declarationMap）
   */
  useSourceMap: boolean
  /**
   * 是否将所有的依赖置为 external
   * @default true
   */
  externalAllDependencies: boolean
  manifest: {
    /**
     * 源文件入口
     */
    source: string
    /**
     * cjs 目标文件入口
     */
    main?: string
    /**
     * es 目标文件入口
     */
    module?: string
    /**
     * 依赖列表
     */
    dependencies?: { [key: string]: string }
  }
  /**
   * 预处理选项
   */
  preprocessOptions?: {
    /**
     * 样式文件的预处理选项
     */
    stylesheets?: {
      /**
       * 入口文件
       */
      input: string | string[] | { include?: string[], exclude?: string }
      /**
       * 出口配置（在 rollup -w 模式下为必选项）
       */
      output?: rollup.OutputOptions | rollup.OutputOptions[]
      /**
       * 插件选项
       */
      pluginOptions?: {
        /**
         * options for @rollup/plugin-multi-entry
         */
        multiEntryOptions?: MultiEntryOptions
        /**
         * options for rollup-plugin-postcss
         */
        postcssOptions?: PostcssDtsOptions
      }
    }
  }
  /**
   * 插件选项
   */
  pluginOptions?: {
    /**
     * options for rollup-plugin-eslint
     */
    eslintOptions?: EslintOptions,
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


export const createRollupConfig = (props: ProdConfigParams): rollup.RollupOptions[] => {
  const DEFAULT_USE_SOURCE_MAP = coverBoolean(
    true, convertToBoolean(process.env.ROLLUP_USE_SOURCE_MAP))
  const DEFAULT_EXTERNAL_ALL_DEPENDENCIES = coverBoolean(
    true, convertToBoolean(process.env.ROLLUP_EXTERNAL_ALL_DEPENDENCIES))

  const {
    useSourceMap = DEFAULT_USE_SOURCE_MAP,
    externalAllDependencies = DEFAULT_EXTERNAL_ALL_DEPENDENCIES,
    manifest,
    preprocessOptions = {},
    pluginOptions = {},
    ...resetInputOptions
  } = props

  const externals: string[] = [
    'glob',
    'sync',
    ...require('builtin-modules'),
    ...Object.keys(manifest.dependencies || {}),
  ]

  if (externalAllDependencies) {
    const dependencies = collectAllDependencies(
      undefined,
      Object.keys(manifest.dependencies || {}),
      undefined,
      /[\s\S]*/,
    )
    externals.push(...dependencies)
  }

  // preprocess task
  const preprocessConfigs: rollup.RollupOptions[] = []
  if (preprocessOptions.stylesheets != null) {
    const {
      input,
      output = {
        dir: 'node_modules/.cache/.rollup.preprocess.dts',
      },
      pluginOptions = {}
    } = preprocessOptions.stylesheets
    const { multiEntryOptions, postcssOptions } = pluginOptions
    const precessStylesheetConfig: rollup.RollupOptions = {
      input: input as any,
      output: output,
      plugins: [
        multiEntry(multiEntryOptions),
        postcss({
          dts: true,
          extract: false,
          minimize: false,
          ...postcssOptions,
        }),
      ] as rollup.Plugin[],
    }
    preprocessConfigs.push(precessStylesheetConfig)
  }

  // process task
  const {
    jsonOptions = {},
    eslintOptions = {},
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
    external: externals.sort().filter((x, i, A) => A.indexOf(x) === i),
    plugins: [
      peerDepsExternal(peerDepsExternalOptions),
      nodeResolve({
        browser: true,
        preferBuiltins: false,
        ...nodeResolveOptions,
      }),
      eslint({
        fix: true,
        throwOnError: true,
        include: ['src/**/*{.ts,.tsx}'],
        exclude: ['*.styl.d.ts'],
        ...eslintOptions,
      }),
      json({
        namedExports: true,
        ...jsonOptions,
      }),
      typescript({
        clean: true,
        typescript: require('typescript'),
        rollupCommonJSResolveHack: true,
        include: ['src/**/*{.ts,.tsx}'],
        exclude: '**/__tests__/**',
        tsconfigOverride: {
          compilerOptions: {
            declarationMap: useSourceMap,
          }
        },
        ...typescriptOptions,
      }),
      commonjs({
        ...commonjsOptions,
      }),
      postcss({
        plugins: [
          postcssFlexbugsFixes({

          }),
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

  return [
    ...preprocessConfigs,
    config,
  ].filter(Boolean) as rollup.RollupOptions[]
}
