import type { OctotreeSidebarTheme } from './theme'
import 'styled-components'


declare module 'styled-components' {
  export interface DefaultTheme {
    octotreeSidebar?: OctotreeSidebarTheme
  }
}
