import React from 'react'
import { BrowserRouter as Router } from 'react-router-dom'
import { mount, render } from 'enzyme'
import { DefaultTheme, ThemeProvider } from 'styled-components'
import {
  RawOctotreeNodeData,
  resolveOctotreeData,
} from '@barusu-react/octotree'
import OctotreeSidebar, { octotreeSidebarClasses } from '../src'


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
          <OctotreeSidebar nodes={ value } />
        </Router>
      ))
        .toThrow(/The prop `nodes` is marked as required/i)
    }
  })

  it('container hover', () => {
    const wrapper = mount(
      <Router>
        <OctotreeSidebar nodes={ data } defaultWidth={ 120 } />
      </Router>
    )
    const o = wrapper.getDOMNode()
    expect(getComputedStyle(o).width).toBe('120px')
    expect(getComputedStyle(o).maxWidth).toBe('0')

    wrapper.simulate('mouseenter')
    expect(getComputedStyle(o).width).toBe('120px')
    expect(getComputedStyle(o).maxWidth).toBe('120px')

    wrapper.simulate('mouseleave')
    expect(getComputedStyle(o).width).toBe('120px')
    expect(getComputedStyle(o).maxWidth).toBe('0')
  })

  it('toggle-area hover', () => {
    const wrapper = mount(
      <Router>
        <OctotreeSidebar nodes={ data } defaultWidth={ 120 } defaultPined={ true } />
      </Router>
    )

    const toggleArea = wrapper.find('.' + octotreeSidebarClasses.toggleArea)
    toggleArea.simulate('mouseenter')
    expect(getComputedStyle(toggleArea.getDOMNode()).display).not.toBe('none')

    toggleArea.simulate('mouseleave')
    expect(getComputedStyle(toggleArea.getDOMNode()).display).toBe('none')
  })

  it('toggle pin', () => {
    const onPinedChanged = jest.fn()

    const wrapper = mount(
      <Router>
        <OctotreeSidebar nodes={ data } defaultWidth={ 120 } onPinedChange={ onPinedChanged } />
      </Router>
    )
    const o = wrapper.getDOMNode()
    expect(getComputedStyle(o).width).toBe('120px')
    expect(getComputedStyle(o).maxWidth).toBe('0')
    expect(onPinedChanged.mock.calls.length).toBe(1)

    // pin
    const pushpin = wrapper.find('.' + octotreeSidebarClasses.pushpin)
    pushpin.simulate('click')
    expect(getComputedStyle(o).width).toBe('120px')
    expect(getComputedStyle(o).maxWidth).toBe('120px')
    expect(onPinedChanged.mock.calls.length).toBe(2)

    // cancel pin
    pushpin.simulate('click')
    expect(getComputedStyle(o).width).toBe('120px')
    expect(getComputedStyle(o).maxWidth).toBe('0')
    expect(onPinedChanged.mock.calls.length).toBe(3)
  })

  it('forward ref', () => {
    const ref = React.createRef<HTMLDivElement>()
    const wrapper = mount(
      <Router>
        <OctotreeSidebar ref={ ref } data-value="waw" nodes={ data } />
      </Router>
    )

    const o = wrapper.getDOMNode()
    expect(o).toEqual(ref.current)
    expect(o.getAttribute('data-value')).toEqual('waw')
  })

  it('snapshot', () => {
    const wrapper = render(
      <Router>
        <OctotreeSidebar
          nodes={ data }
          defaultWidth={ 250 }
          style={{ color: 'orange', fontSize: '16px' }}
        />
      </Router>
    )
    expect(wrapper).toMatchSnapshot()
  })

  it('snapshot with theme', () => {
    const theme: DefaultTheme = {
      octotreeSidebar: {
        borderRight: 'none',
        headerBackground: 'red',
        // mainBackground: '#fff',
        toggleBackground: 'blue',
        toggleBorderColor: 'green',
      }
    }

    const wrapper = render(
      <ThemeProvider theme={ theme }>
        <Router>
          <OctotreeSidebar
            nodes={ data }
            defaultWidth={ 250 }
            style={{ color: 'orange', fontSize: '16px' }}
          />
        </Router>
      </ThemeProvider>
    )
    expect(wrapper).toMatchSnapshot()
  })
})
