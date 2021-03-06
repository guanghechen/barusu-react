import type { CSSProperties, DefaultTheme } from 'styled-components'

/**
 * octotree-sidebar theme
 */
export interface OctotreeSidebarTheme {
  /**
   * Border right
   * @default '1px solid #dfe2e5'
   */
  borderRight?: CSSProperties['borderRight'] | string
  /**
   * Header area background
   * @default '#373e43'
   */
  headerBackground?: CSSProperties['background'] | string
  /**
   * Main area background
   * @default '#fff'
   */
  mainBackground?: CSSProperties['background'] | string
  /**
   * Toggle area background
   * @default '#f2f5f7'
   */
  toggleBackground?: CSSProperties['background'] | string
  /**
   * Toggle area border color
   * @default '#e0e4e7'
   */
  toggleBorderColor?: CSSProperties['color'] | string
}

/**
 * Default octotree theme
 */
export const defaultOctotreeSidebarTheme: OctotreeSidebarTheme = {
  borderRight: '1px solid #dfe2e5',
  headerBackground: '#373e43',
  mainBackground: '#fff',
  toggleBackground: '#f2f5f7',
  toggleBorderColor: '#e0e4e7',
}

/**
 * Get style from theme
 * @param key
 * @param defaultTheme
 */
export function getOctotreeSidebarStyle(
  key: keyof OctotreeSidebarTheme,
  defaultTheme: OctotreeSidebarTheme = defaultOctotreeSidebarTheme,
): (props: { theme: DefaultTheme }) => OctotreeSidebarTheme[typeof key] {
  // eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types
  return (props: { theme: DefaultTheme }) => {
    const { octotreeSidebar } = props.theme
    if (octotreeSidebar == null || octotreeSidebar[key] == null) {
      return defaultTheme[key]
    }
    return octotreeSidebar[key]
  }
}
