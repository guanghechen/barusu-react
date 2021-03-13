import React, { useEffect, useMemo, useRef } from 'react'
import styled from 'styled-components'

/**
 * Props for ResizableEdge
 */
export interface ResizableEdgeProps {
  /**
   * Edge position
   */
  type: 'left' | 'top' | 'right' | 'bottom'
  /**
   * Thickness of the edge
   */
  thickness?: number
  /**
   * Movement for horizontal / vertical direction.
   *
   * Please be careful, this callback function need to be stable, re-creation
   * will cause the movement events interrupted, it may also produce some
   * performance loss.
   *
   * @param horizontalMovement  the horizontal movement
   * @param verticalMovement    the vertical movement
   */
  onResize(horizontalMovement: number, verticalMovement: number): void
}

const Container = styled.div`
  position: absolute;
  background: transparent;
  z-index: 99;
`

/**
 * Resizable Edge
 *
 * @param props
 */
export function ResizableEdge(props: ResizableEdgeProps): React.ReactElement {
  const sidebarRef = useRef<HTMLDivElement>(null)

  const style = useMemo<React.CSSProperties>(() => {
    const thickness = Math.max(2, Number(props.thickness) || 8)
    const halfThickness = thickness / 2

    switch (props.type) {
      case 'left':
        return {
          top: 0,
          bottom: 0,
          left: -halfThickness,
          right: 'unset',
          height: '100%',
          width: thickness,
          cursor: 'col-resize',
        }
      case 'top':
        return {
          left: 0,
          right: 0,
          top: -halfThickness,
          bottom: 'unset',
          width: '100%',
          height: thickness,
          cursor: 'row-resize',
        }
      case 'right':
        return {
          top: 0,
          bottom: 0,
          left: 'unset',
          right: -halfThickness,
          height: '100%',
          width: thickness,
          cursor: 'col-resize',
        }
      case 'bottom':
        return {
          left: 0,
          right: 0,
          top: 'unset',
          bottom: -halfThickness,
          width: '100%',
          height: thickness,
          cursor: 'row-resize',
        }
    }
  }, [props.type, props.thickness])

  const handleResize = props.onResize
  useEffect(() => {
    const current = sidebarRef.current
    if (current == null) return

    let mouseDown = false,
      currentPageX = 0,
      currentPageY = 0

    // handle mouse down
    const onMouseDown = (e: MouseEvent): void => {
      mouseDown = true
      currentPageX = e.pageX
      currentPageY = e.pageY
      e.preventDefault()
      e.stopPropagation()
    }

    // handle mouse up
    const onMouseUp = (): void => {
      mouseDown = false
    }

    // handle mouse move
    const onMouseMove = (e: MouseEvent): void => {
      if (!mouseDown) return
      const horizontalMovement = e.pageX - currentPageX
      const verticalMovement = e.pageY - currentPageY
      handleResize(horizontalMovement, verticalMovement)

      currentPageX = e.pageX
      currentPageY = e.pageY
    }

    current.addEventListener('mousedown', onMouseDown, false)
    window.addEventListener('mouseup', onMouseUp)
    window.addEventListener('mousemove', onMouseMove, false)

    return () => {
      current.removeEventListener('mousedown', onMouseDown)
      window.removeEventListener('mouseup', onMouseUp)
      window.removeEventListener('mousemove', onMouseMove)
    }
  }, [handleResize, sidebarRef])

  return <Container ref={sidebarRef} style={style} />
}

export default ResizableEdge
