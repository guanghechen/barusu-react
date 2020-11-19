import 'styled-components'
import type { OctotreeTheme } from './theme'


declare module 'styled-components' {
  export interface DefaultTheme {
    octotree?: OctotreeTheme
  }
}
