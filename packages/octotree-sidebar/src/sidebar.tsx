import React, { useCallback, useEffect, useState } from 'react'
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
   * Default sidebar width
   */
  defaultWidth?: number
  /**
   * Default sidebar pined state
   */
  defaultPined?: boolean
  /**
   * Called on width changed
   */
  onWidthChange?: (width: number) => void
  /**
   * Called on pined changed
   */
  onPinedChange?: (pined: boolean) => void
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


const ToggleArea = styled.div<{ $visible: boolean }>`
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

  ${ props => props.$visible
    ? css`
        display: flex;
        flex-direction: column;
        justify-content: center;
        align-items: center;
        opacity: 1;
      `
    : css`
        display: none;
        opacity: 0;
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
  transition: max-width 0.5s ease-in-out;
`


Container.defaultProps = { theme: { octotreeSidebar: defaultOctotreeSidebarTheme } }


/**
 * Class names
 */
export const octotreeSidebarClasses = {
  container: String(Container).substring(1),
  header: String(Header).substring(1),
  main: String(Main).substring(1),
  toggleArea: String(ToggleArea).substring(1),
  pushpin: String(Pushpin).substring(1),
}


/**
 *
 * @param props
 */
export const OctotreeSidebar = React.forwardRef<HTMLDivElement, OctotreeSidebarProps>(
  (props, forwardRef): React.ReactElement => {
    const {
      nodes,
      defaultPined = false,
      defaultWidth = 200,
      style,
      onWidthChange,
      onPinedChange,
      ...htmlProps
    } = props

    const [pined, setPined] = useState<boolean>(defaultPined)
    const [width, setWidth] = useState<number>(defaultWidth)

    // If it's not pined at initial time, the sidebar shouldn't be visible
    const [maxWidth, setMaxWidth] = useState<number>(pined ? defaultWidth : 0)

    const [hovering, setHovering] = useState<boolean>(false)
    const [toggleBtnHovering, setToggleBtnHovering] = useState<boolean>(false)

    const handleResize = useCallback((hm: number): void => { setWidth(width => width + hm) }, [])

    useEffect(() => {
      // reset maxWidth if width changed
      setMaxWidth(width)

      // check width changed callback
      if (onWidthChange != null) onWidthChange(width)
      // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [width])

    useEffect(() => {
      // check pined changed callback
      if (onPinedChange != null) onPinedChange(pined)
      // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [pined])

    // eslint-disable-next-line react-hooks/exhaustive-deps
    useEffect(() => { setMaxWidth(hovering || pined ? width : 0) }, [pined, hovering])

    const containerStyle = {
      ...style,
      width,
      maxWidth,
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
            $pined={ pined }
            onClick={ () => setPined(!pined) }
          />
        </Header>
        <ToggleArea
          $visible={ maxWidth === 0 || toggleBtnHovering }
          onMouseEnter={ () => setToggleBtnHovering(true) }
          onMouseLeave={ () => setToggleBtnHovering(false) }
        >
          <span>Octotree</span>
        </ToggleArea>
        <Main>
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
  defaultWidth: PropTypes.number,
}

export default OctotreeSidebar
