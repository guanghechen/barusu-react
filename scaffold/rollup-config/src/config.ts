import postcss from '@barusu-react/rollup-plugin-postcss-dts'
import createBaseRollupConfig from '@guanghechen/rollup-config'
import multiEntry from '@rollup/plugin-multi-entry'
import autoprefixer from 'autoprefixer'
import postcssFlexbugsFixes from 'postcss-flexbugs-fixes'
import postcssUrl from 'postcss-url'
import type rollup from 'rollup'
import type { PreprocessConfigOptions, RollupConfigOptions } from './types/options'

/**
 * Create rollup config for handle react component
 * @param options
 */
export function createRollupConfig(
  options: RollupConfigOptions,
): rollup.RollupOptions {
  const { ...baseOptions } = options
  const {
    postcssOptions: _postcssOptions,
    ...pluginOptions
  } = baseOptions.pluginOptions || {}

  const { pluginOptions: postcssPluginOptions, ...postcssOptions} = _postcssOptions || {}
  const { autoprefixerOptions, postcssUrlOptions } = (pluginOptions || {}) as unknown as any

  baseOptions.pluginOptions = pluginOptions
  baseOptions.additionalPlugins = [
    postcss({
      plugins: [
        postcssFlexbugsFixes({}),
        autoprefixer({ ...autoprefixerOptions }),
        postcssUrl({
          url: 'inline',
          ...postcssUrlOptions,
        }),
      ],
      ...postcssOptions,
    }) as rollup.Plugin,
    ...(baseOptions.additionalPlugins || []),
  ]

  const config = createBaseRollupConfig(baseOptions)
  return config
}


/**
 * Create rollup config for preprocessor
 * @param options
 */
export function createPreprocessorConfig(
  options: PreprocessConfigOptions,
): rollup.RollupOptions {
  const {
    input,
    output = {
      dir: 'node_modules/.cache/.rollup.preprocess.dts',
    },
    pluginOptions = {},
  } = options

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
  return precessStylesheetConfig
}


export default createRollupConfig
