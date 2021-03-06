import React from 'react'
import PropTypes from 'prop-types'
import styled from 'styled-components'
import { useOctotreeNodes } from './parent'
import { defaultOctotreeTheme, getOctotreeStyle } from './theme'
import { OctotreeNodeData } from './types'

/**
 * Props for creating Octotree
 */
export interface OctotreeProps extends React.HTMLAttributes<HTMLDivElement> {
  /**
   * Node data of octotree
   */
  nodes: OctotreeNodeData[]
  /**
   * Icon width
   * @default 1.25rem
   */
  iconWidth?: string
}

const Main = styled.ul`
  display: block;
  padding: 0;
  margin: 0;
  list-style: none;
  ul, li {
    display: block;
    padding: 0;
    margin: 0;
    list-style: none;
    line-height: 1.5;
    font-size: ${getOctotreeStyle('fontSize')};
  }
  a {
    color: ${getOctotreeStyle('colorTitle')};
    outline: 0;
    text-decoration: none;
  }
`

const Container = styled.div`
  display: flex;
  flex-direction: column;
  margin: 0;
  padding: 0;
  text-indent: 0;
  user-select: none;
`

Container.defaultProps = { theme: { octotree: defaultOctotreeTheme } }

/**
 *
 * @param props
 */
export const Octotree = React.forwardRef<HTMLDivElement, OctotreeProps>(
  (props, forwardRef): React.ReactElement => {
    const { nodes = [], iconWidth = '1.25rem', ...rawProps } = props

    const match = /([\d]*(?:\.[\d]+))?([a-zA-Z]+)/.exec(iconWidth)
    const width: number = match == null ? 1.25 : Number(match[1])
    const widthUnit: string = match == null ? 'rem' : match[2]
    const children = useOctotreeNodes(0, nodes, width, widthUnit)

    return (
      <Container {...rawProps} ref={forwardRef}>
        <Main>{children}</Main>
      </Container>
    )
  },
)

Octotree.displayName = 'Octotree'

Octotree.propTypes = {
  nodes: PropTypes.array.isRequired,
  iconWidth: PropTypes.string,
}

export default Octotree
