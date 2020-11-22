import 'styled-components'
import type { OctotreeSidebarTheme } from './theme'


declare module 'styled-components' {
  export interface DefaultTheme {
    octotreeSidebar?: OctotreeSidebarTheme
  }
}
