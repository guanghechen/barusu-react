import postcss from 'rollup-plugin-postcss'
import { PostCssPluginOptions as PostcssOptions } from 'rollup-plugin-postcss'
import { CSSDtsProps, createHook } from './css-dts'
import { GetCSSTokenHook } from './types'
export * from './css-dts'
export * from './types'


export interface PostcssDtsOptions extends PostcssOptions {
  /**
   * options for generate *.d.ts
   * @default false
   */
  dts?: CSSDtsProps | boolean
}


export default function (options: PostcssDtsOptions = {}) {
  const { dts = false, modules, ...rest } = options

  const hook: GetCSSTokenHook = {}
  if (Boolean(dts)) {
    const props: CSSDtsProps | undefined = (typeof dts !== 'object')
      ? undefined
      : dts as CSSDtsProps
    hook.getJSON = createHook(props).getJSON
  }

  const defaultPostcssOptionsModules: PostcssDtsOptions['modules'] = {
    getJSON: hook.getJSON,
  }

  // merge postcssOptions.Modules
  const postcssOptionsModules: PostcssDtsOptions['modules'] = (
    typeof modules === 'boolean'
      ? (modules === true ? defaultPostcssOptionsModules : modules)
      : {
        ...defaultPostcssOptionsModules as any,
        ...modules as any
      }
  )

  return postcss({
    ...rest,
    modules: postcssOptionsModules,
  })
}