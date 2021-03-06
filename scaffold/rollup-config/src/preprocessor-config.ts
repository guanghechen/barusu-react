import postcss from '@barusu-react/rollup-plugin-postcss-dts'
import multiEntry from '@rollup/plugin-multi-entry'
import type rollup from 'rollup'
import type { MultiEntryOptions, PostcssDtsOptions } from './types/options'

export interface PreprocessorConfigOptions {
  /**
   * Input config
   */
  input: string | string[] | { include?: string[]; exclude?: string }
  /**
   * Output config (required in `rollup -w` mode)
   */
  output?: rollup.OutputOptions | rollup.OutputOptions[]
  /**
   * Plugin options
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

/**
 * Create rollup config for preprocessor
 * @param options
 */
export function createPreprocessorConfig(
  options: PreprocessorConfigOptions,
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
