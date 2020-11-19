import React from 'react'
import { BrowserRouter as Router } from 'react-router-dom'
import { mount, render } from 'enzyme'
import { DefaultTheme, ThemeProvider } from 'styled-components'
import Octotree, { RawOctotreeNodeData, resolveOctotreeData } from '../src'


describe('basic rendering case', () => {
  const errorLogger = jest
    .spyOn(global.console, 'error')
    .mockImplementation((...args) => {
      throw new Error(args.join(' '))
    })

  afterAll(() => {
    errorLogger.mockRestore()
  })

  const rawData: RawOctotreeNodeData[] = [
    {
      title: 'hooks',
      children: [
        {
          title: 'demo',
          pathname: '/hooks/demo',
          children: [{ title: '2', pathname: '/hooks/demo/2' }]
        },
        { title: 'ref', pathname: '/hooks/ref' }
      ]
    },
    { title: 'context', pathname: '/context' },
    { title: 'demo', pathname: '/demo' },
  ]

  const data = resolveOctotreeData('/api', rawData)

  it('nodes is required', () => {
    for (const value of [undefined, null] as any[]) {
      expect(() => render(
        <Router>
          <Octotree nodes={ value } />
        </Router>
      ))
        .toThrow(/Failed prop type: The prop `nodes` is marked as required/i)
    }
  })

  it('forward ref', () => {
    const ref = React.createRef<HTMLDivElement>()
    const wrapper = mount(
      <Router>
        <Octotree ref={ ref } data-value="waw" nodes={ data } />
      </Router>
    )

    const o = wrapper.getDOMNode()
    expect(o).toEqual(ref.current)
    expect(o.getAttribute('data-value')).toEqual('waw')
  })

  it('snapshot', () => {
    const wrapper = render(
      <Router>
        <Octotree
          nodes={ data }
          iconWidth="1.5rem"
          style={{ color: 'orange', fontSize: '16px' }}
        />
      </Router>
    )
    expect(wrapper).toMatchSnapshot()
  })

  it('snapshot with theme', () => {
    const theme: DefaultTheme = {
      octotree: {
        fontSize: '18px',
        colorTitle: '#ccc',
        linkBackgroundHover: 'red',
        linkBackgroundActive: 'blue',
        typeIconColorSecondary: 'green'
      }
    }

    const wrapper = render(
      <ThemeProvider theme={ theme }>
        <Router>
          <Octotree
            nodes={ data }
            iconWidth="1.5rem"
            style={{ color: 'orange', fontSize: '16px' }}
          />
        </Router>
      </ThemeProvider>
    )
    expect(wrapper).toMatchSnapshot()
  })
})
