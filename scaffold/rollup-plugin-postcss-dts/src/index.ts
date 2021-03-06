import type { Plugin } from 'rollup'
import type { PostCSSPluginConf as PostcssOptions } from 'rollup-plugin-postcss'
import postcss from 'rollup-plugin-postcss'
import type { CSSDtsProps } from './css-dts'
import { createHook } from './css-dts'

export * from './css-dts'
export * from './types'

export type PostcssDtsOptions = PostcssOptions & {
  /**
   * options for generate *.d.ts
   * @default false
   */
  dts?: CSSDtsProps | boolean
}

export default function postcssDtsPlugin(
  options: PostcssDtsOptions = {},
): Plugin {
  const { dts = false, modules, ...rest } = options
  const defaultPostcssOptionsModules: PostcssDtsOptions['modules'] = {}

  if (dts) {
    const props: CSSDtsProps | undefined =
      typeof dts !== 'object' ? undefined : (dts as CSSDtsProps)
    defaultPostcssOptionsModules.getJSON = createHook(props).getJSON
  }

  // merge postcssOptions.Modules
  const postcssOptionsModules: PostcssDtsOptions['modules'] =
    typeof modules === 'boolean'
      ? modules === true
        ? defaultPostcssOptionsModules
        : modules
      : {
          ...(defaultPostcssOptionsModules as any),
          ...(modules as any),
        }

  return postcss({
    autoModules: false,
    ...rest,
    modules: postcssOptionsModules,
  })
}
