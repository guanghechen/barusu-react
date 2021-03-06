import './postcss-flexbus-fixes'
import './rollup-plugin-multi-entry'


import type { PostcssDtsOptions } from '@barusu-react/rollup-plugin-postcss-dts'
import type {
  RollupConfigOptions as BaseRollupConfigOptions,
  RollupPluginOptions as BaseRollupPluginOptions
} from '@guanghechen/rollup-config'
import type { MultiEntryOptions } from '@rollup/plugin-multi-entry'
import type { Options as PostcssPluginAutoprefixerOptions } from 'autoprefixer'
import type { Options as PostcssPluginPostcssUrlOptions } from 'postcss-url'
import type rollup from 'rollup'

export type {
  CommonJSOptions,
  JsonOptions,
  NodeResolveOptions,
  TypescriptOptions,
} from '@guanghechen/rollup-config'
export { Options as PostcssPluginAutoprefixerOptions } from 'autoprefixer'
export { Options as PostcssPluginPostcssUrlOptions } from 'postcss-url'
export { PostcssDtsOptions } from '@barusu-react/rollup-plugin-postcss-dts'
export { MultiEntryOptions } from '@rollup/plugin-multi-entry'


/**
 * Params for creating a rollup config.
 */
export interface RollupConfigOptions extends BaseRollupConfigOptions {
  /**
   * Options of the builtin plugin by the @guanghechen/rollup-config.
   */
  pluginOptions?: RollupPluginOptions
}

/**
 * Options of the builtin plugins.
 */
export interface RollupPluginOptions extends BaseRollupPluginOptions {
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


/**
 * Preprocess config
 */
export interface PreprocessConfigOptions {
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
