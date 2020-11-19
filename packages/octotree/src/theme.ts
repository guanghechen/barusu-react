import type { CSSProperties, DefaultTheme } from 'styled-components'


/**
 * octotree theme
 */
export interface OctotreeTheme {
  /**
   * Font size
   * @default '1rem'
   */
  fontSize?: CSSProperties['fontSize'] | string
  /**
   * Title color
   * @default '#0f2e47'
   */
  colorTitle?: CSSProperties['color'] | string
  /**
   * Background of link on hover
   * @default '#f6f8fa'
   */
  linkBackgroundHover?: CSSProperties['background'] | string
  /**
   * Background of link of active
   * @default '#dbeeff'
   */
  linkBackgroundActive?: CSSProperties['background'] | string
  /**
   * Type icon color of parent node
   * @default '#6cb5fe'
   */
  typeIconColorPrimary?: CSSProperties['color'] | string
  /**
   * Type icon color of leaf node
   * @default '#8a8a8a'
   */
  typeIconColorSecondary?: CSSProperties['color'] | string
}


/**
 * Default octotree theme
 */
export const defaultOctotreeTheme: OctotreeTheme = {
  fontSize: '1rem',
  colorTitle: '#0f2e47',
  linkBackgroundHover: '#f6f8fa',
  linkBackgroundActive: '#dbeeff',
  typeIconColorPrimary: '#6cb5fe',
  typeIconColorSecondary: '#8a8a8a',
}


/**
 * Get style from theme
 * @param key
 * @param defaultTheme
 */
export function getOctotreeStyle(
  key: keyof OctotreeTheme,
  defaultTheme: OctotreeTheme = defaultOctotreeTheme,
) {
  // eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types
  return (props: { theme: DefaultTheme }) => {
    const { octotree } = props.theme
    if (octotree == null || octotree[key] == null) {
      return defaultTheme[key]
    }
    return octotree[key]
  }
}
