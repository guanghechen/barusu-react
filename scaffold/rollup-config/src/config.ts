/* eslint-disable @typescript-eslint/no-var-requires */
import rollup from 'rollup'
import commonjs from '@rollup/plugin-commonjs'
import multiEntry from '@rollup/plugin-multi-entry'
import nodeResolve from '@rollup/plugin-node-resolve'
import postcss from '@barusu-react/rollup-plugin-postcss-dts'
import typescript from 'rollup-plugin-typescript2'
import peerDepsExternal from 'rollup-plugin-peer-deps-external'
import { eslint } from 'rollup-plugin-eslint'
import autoprefixer from 'autoprefixer'
import postcssUrl from 'postcss-url'
import postcssFlexbugsFixes from 'postcss-flexbugs-fixes'
import {
  NodeResolveOptions,
  TypescriptOptions,
  CommonJSOptions,
  PeerDepsExternalOptions,
  EslintOptions,
  MultiEntryOptions,
  PostcssDtsOptions,
  PostcssPluginPostcssUrlOptions,
  PostcssPluginAutoprefixerOptions,
} from './types/options'


export interface ProdConfigParams {
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
  // preprocess task
  const { preprocessOptions = {} } = props
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
  const { manifest, pluginOptions = {} } = props
  const {
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
        sourcemap: true,
      },
      manifest.module && {
        file: manifest.module,
        format: 'es',
        exports: 'named',
        sourcemap: true,
      }
    ].filter(Boolean) as rollup.OutputOptions[],
    external: [
      'glob',
      'sync',
      ...require('builtin-modules'),
      ...Object.keys(manifest.dependencies || {})
    ],
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
        exclude: ['*.css', '*.styl', '*.styl.d.ts'],
        ...eslintOptions,
      }),
      typescript({
        clean: true,
        typescript: require('typescript'),
        rollupCommonJSResolveHack: true,
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
  }

  return [
    ...preprocessConfigs,
    config,
  ].filter(Boolean) as rollup.RollupOptions[]
}
