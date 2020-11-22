import React, { useEffect, useMemo, useState } from 'react'
import styled, { css } from 'styled-components'
import { Icon, Title } from './_common'
import OctotreeLeafNode from './leaf'
import { getOctotreeStyle } from './theme'
import { OctotreeNodeData } from './types'


/**
 * Props for creating OctotreeParentNode
 */
export interface OctotreeParentNodeProps {
  /**
   * Distance to the root node
   */
  depth: number
  /**
   * Title
   */
  title: string
  /**
   * Whether if this node is in collapsed
   */
  collapsed: boolean
  /**
   * Child nodes data
   */
  children: OctotreeNodeData[]
  /**
   *
   */
  iconWidth: number
  /**
   *
   */
  iconWidthUnit: string
}



const CollapseIcon = styled(Icon)`
  &::before {
    content: '\\e808'
  }
`


const TypeIcon = styled(Icon)`
  color: ${ getOctotreeStyle('typeIconColorPrimary') };
  &::before {
    content: '\\e840';
  }
`


const Header = styled.div`
  display: flex;
  align-items: center;
  width: 100%;
  height: 100%;
  &:hover {
    background: ${ getOctotreeStyle('linkBackgroundHover') };
  }
`


const Main = styled.div`
  display: block;
  overflow: auto;
  height: auto;
  opacity: 1;
`


const Container = styled.div<{ $isCollapsed: boolean }>`
  ${
    props => props.$isCollapsed
      ? css`
        ${ CollapseIcon } {
          &::before {
            content: '\\e80a';
          }
        }
        ${ Main } {
          height: 0;
          opacity: 0;
        }
      `
      : ''
  }
`


/**
 * Octotree parent node
 */
export function OctotreeParentNode(props: OctotreeParentNodeProps): React.ReactElement {
  const { depth, title, iconWidth, iconWidthUnit } = props

  const children = useOctotreeNodes(
    depth + 1, props.children, iconWidth, iconWidthUnit)
  const [collapsed, setCollapsed] = useState<boolean>(props.collapsed)

  // Reset collapsed if the props.collapsed changed
  useEffect(() => setCollapsed(props.collapsed), [props.collapsed])

  const headerStyle: React.CSSProperties = {
    paddingLeft: depth <= 0 ? 0 : (depth * iconWidth).toFixed(2) + iconWidthUnit,
  }

  const collapseIconStyle: React.CSSProperties = {
    width: iconWidth + iconWidthUnit,
  }

  const typeIconStyle: React.CSSProperties = {
    width: iconWidth + iconWidthUnit,
    paddingRight: (0.2 * iconWidth).toFixed(2) + iconWidthUnit,
  }

  return (
    <Container $isCollapsed={ collapsed }>
      <Header
        style={ headerStyle }
        onClick={ () => setCollapsed(c => !c) }
      >
        <CollapseIcon style={ collapseIconStyle } />
        <TypeIcon style={ typeIconStyle } />
        <Title title={ title }>{ title }</Title>
      </Header>
      <Main>
        <ul>{ children }</ul>
      </Main>
    </Container>
  )
}


/**
 * Cache octotree nodes
 *
 * @param depth
 * @param items
 */
export function useOctotreeNodes(
  depth: number,
  items: OctotreeNodeData[],
  iconWidth: number,
  iconWidthUnit: string,
): React.ReactElement[] {
  const results = useMemo<React.ReactElement[]>(() => {
    return items
      .map((item): React.ReactElement | null => {
        switch (item.type) {
          case 'leaf': {
            return (
              <li key={ item.title }>
                <OctotreeLeafNode
                  depth={ depth }
                  title={ item.title }
                  pathname={ item.pathname }
                  iconWidth={ iconWidth }
                  iconWidthUnit={ iconWidthUnit }
                />
              </li>
            )
          }
          case 'parent': {
            return (
              <li key={ item.title }>
                <OctotreeParentNode
                  depth={ depth }
                  title={ item.title }
                  collapsed={ item.collapsed }
                  children={ item.children }
                  iconWidth={ iconWidth }
                  iconWidthUnit={ iconWidthUnit }
                />
              </li>
            )
          }
          default:
            return null
        }
      })
      .filter((item): item is React.ReactElement => item != null)
  }, [depth, iconWidth, iconWidthUnit, items])
  return results
}


export default OctotreeParentNode
