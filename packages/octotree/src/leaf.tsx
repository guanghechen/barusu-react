import React from 'react'
import { Link } from 'react-router-dom'
import styled from 'styled-components'
import { Icon, Title } from './_common'
import { getOctotreeStyle } from './theme'


/**
 * Props for creating OctotreeLeafNode
 */
export interface OctotreeLeafNodeProps {
  /**
   * Distance to the root node
   */
  depth: number
  /**
   * Title
   */
  title: string
  /**
   * Route path
   */
  pathname: string
  /**
   * Node icon
   */
  icon?: React.ReactNode
  /**
   *
   */
  iconWidth: number
  /**
   *
   */
  iconWidthUnit: string
}


const TypeIcon = styled(Icon)`
  color: ${ getOctotreeStyle('typeIconColorSecondary') };
  &::before {
    content: "\e827";
  }
`


const Container = styled(Link)<{ $isActive: boolean }>`
  display: flex;
  align-items: center;
  width: 100%;
  height: 100%;
  font-size: inherit;
  background: ${
    props => props.$isActive
      ? getOctotreeStyle('linkBackgroundActive')(props)
      : 'none'
  };
  &:hover {
    background: ${ getOctotreeStyle('linkBackgroundHover') };
  }
`


/**
 *
 * @param props
 */
export function OctotreeLeafNode(props: OctotreeLeafNodeProps): React.ReactElement {
  const { depth, title, pathname, icon, iconWidth, iconWidthUnit } = props

  const containerStyle: React.CSSProperties = {
    paddingLeft: ((depth + 1) * iconWidth).toFixed(2) + iconWidthUnit,
  }

  const typeIconStyle: React.CSSProperties = {
    paddingRight: (0.2 * iconWidth).toFixed(2) + iconWidthUnit,
  }

  return (
    <Container $isActive={ false } style={ containerStyle } to={{ pathname }}>
      <TypeIcon style={ typeIconStyle }>{ icon }</TypeIcon>
      <Title>{ title }</Title>
    </Container>
  )
}


OctotreeLeafNode.displayName = 'OctotreeLeafNode'


export default OctotreeLeafNode
