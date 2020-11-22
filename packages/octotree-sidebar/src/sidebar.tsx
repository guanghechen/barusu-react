import React, { useCallback, useEffect, useRef, useState } from 'react'
import PropTypes from 'prop-types'
import styled, { css } from 'styled-components'
import { Octotree, OctotreeNodeData } from '@barusu-react/octotree'
import ResizableEdge from './resizable-edge.no-cover'
import { defaultOctotreeSidebarTheme, getOctotreeSidebarStyle } from './theme'


/**
 * Props for creating OctotreeSidebar
 */
export interface OctotreeSidebarProps extends React.HTMLAttributes<HTMLDivElement> {
  /**
   * Node data of octotree
   */
  nodes: OctotreeNodeData[]
  /**
   * Initial width
   */
  initialWidth?: number
  /**
   * Whether if the sidebar is pined
   */
  pined?: boolean
}


const Pushpin = styled.i<{ $pined: boolean }>`
  position: absolute;
  top: 50%;
  right: 1rem;
  transform: translate(0, -50%);
  color: #fff;
  &::before {
    content: "\\e829";
    display: inline-block;
    transform: rotate(${ props => props.$pined ? '45deg' : '90deg' });
    width: 1rem;
    line-height: 1;
    font-size: 1rem;
    font-family: octotree;
    font-style: normal;
    font-weight: 400;
    text-align: center;
    text-transform: none;
    -webkit-font-smoothing: antialiased;
    font-variant: normal;
  }
`


const Header = styled.div`
  flex: 0 0 2rem;
  position: relative;
  background: ${ getOctotreeSidebarStyle('headerBackground') };
`


const Main = styled.div`
  flex: 1 1 0;
  overflow: auto;
  background: ${ getOctotreeSidebarStyle('mainBackground') };
`


const Toggle = styled.div<{ $pined: boolean }>`
  position: absolute;
  top: 50%;
  left: 0;
  transform: translate(0, -50%);
  transition: opacity 0.2s ease-in-out;
  height: 6rem;
  width: 2rem;
  background: ${ getOctotreeSidebarStyle('toggleBackground') };
  border: 1px solid ${ getOctotreeSidebarStyle('toggleBorderColor') };;
  border-left: none;
  user-select: none;
  cursor: default;

  ${ props => props.$pined
    ? css`
        display: none;
        opacity: 0;
      `
    : css`
        display: flex;
        flex-direction: column;
        justify-content: center;
        align-items: center;
        opacity: 1;
      `
  }

  &::before {
    font-family: octotree;
    content: "\\e80a";
  }

  & > span {
    display: inline-block;
    transform: rotate(180deg);
    writing-mode: tb-rl;
    color: #0f2e47;
  }
`


const Container = styled.div`
  position: relative;
  display: flex;
  flex-direction: column;
  padding: 0;
  border: 0;
  border-right: ${ getOctotreeSidebarStyle('borderRight') };
  margin: 0;
  transition: width 0.5s ease-in-out;
`


Container.defaultProps = { theme: { octotreeSidebar: defaultOctotreeSidebarTheme } }


/**
 *
 * @param props
 */
export const OctotreeSidebar = React.forwardRef<HTMLDivElement, OctotreeSidebarProps>(
  (props, forwardRef): React.ReactElement => {
    const {
      nodes,
      pined: initialPined = false,
      initialWidth = 200,
      style,
      ...htmlProps
    } = props
    const sidebarRef = useRef<HTMLDivElement>(null)
    const [width, setWidth] = useState<number>(initialWidth)
    const [pined, setPined] = useState<boolean>(initialPined)
    const [hovering, setHovering] = useState<boolean>(false)

    const handleResize = useCallback((hm: number): void => {
      setWidth(width => width + hm)
    }, [setWidth])

    useEffect(() => {
      const current: HTMLElement | null = sidebarRef.current
      if (current == null) return
      setWidth(current.clientWidth)
    }, [sidebarRef])

    // reset pined if the props.pined changed
    useEffect(() => { setPined(initialPined) }, [initialPined])
    const containerStyle = {
      ...style,
      width: (pined || hovering) ? width : 0,
    }

    return (
      <Container
        { ...htmlProps }
        ref={ forwardRef }
        style={ containerStyle }
        onMouseEnter={ () => setHovering(true) }
        onMouseLeave={ () => setHovering(false) }
      >
        <Header>
          <Pushpin
            onClick={ () => setPined(!pined) }
            $pined={ pined }
          />
        </Header>
        <Toggle $pined={ pined }>
          <span>Octotree</span>
        </Toggle>
        <Main ref={ sidebarRef }>
          <Octotree nodes={ props.nodes } />
        </Main>
        <ResizableEdge type='right' onResize={ handleResize } />
      </Container>
    )
  }
)


OctotreeSidebar.displayName = 'OctotreeSidebar'


OctotreeSidebar.propTypes = {
  nodes: PropTypes.array.isRequired,
  initialWidth: PropTypes.number,
}

export default OctotreeSidebar
