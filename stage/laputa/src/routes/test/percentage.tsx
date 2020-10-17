import React, { useLayoutEffect, useRef } from 'react'


export function BoxPercentageTest(): React.ReactElement {
  const containerRef = useRef<HTMLDivElement | null>(null)
  const childRef = useRef<HTMLDivElement | null>(null)
  useLayoutEffect(() => {
    if (containerRef.current == null) return
    if (childRef.current == null) return

    const containerStyle = window.getComputedStyle(containerRef.current)
    const childStyle = window.getComputedStyle(childRef.current)

    const f = (style: CSSStyleDeclaration): string => (
      ['width', 'height', 'padding', 'margin', 'border', 'box-sizing', 'top', 'right', 'bottom', 'left']
        .map(key => `${ key }(${ style[key] })`)
        .join(', ')
    )

    console.log('container:', f(containerStyle))
    console.log('child:', f(childStyle))
  }, [])


  const container: React.CSSProperties = {
    position: 'relative',
    boxSizing: 'border-box',
    width: '600px',
    height: '400px',
    padding: '20px',
    background: 'blue',
    borderRadius: '50%',
  }


  const child: React.CSSProperties = {
    position: 'absolute',
    width: '20%',
    height: '30%',
    marginTop: '20%',
    background: 'green',
    top: '20%',
    transform: 'translate(50%, -50%)'
  }

  return (
    <div>
      <div ref={ containerRef } style={ container }>
        <div ref={ childRef } style={ child } />
        <div style={{ width: '20px', height: '20px', background: 'orange' }} />
      </div>
    </div>
  )
}


// eslint-disable-next-line import/no-anonymous-default-export
export default {
  title: 'box-model percentage | test',
  pathname: '/test/box-model/percentage',
  component: <BoxPercentageTest />
}
