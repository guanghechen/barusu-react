import type { OctotreeTheme } from './theme'
import 'styled-components'


declare module 'styled-components' {
  export interface DefaultTheme {
    octotree?: OctotreeTheme
  }
}
