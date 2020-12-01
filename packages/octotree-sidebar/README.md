[![npm version](https://img.shields.io/npm/v/@barusu-react/octotree-sidebar.svg)](https://www.npmjs.com/package/@barusu-react/octotree-sidebar)
[![npm download](https://img.shields.io/npm/dm/@barusu-react/octotree-sidebar.svg)](https://www.npmjs.com/package/@barusu-react/octotree-sidebar)
[![npm license](https://img.shields.io/npm/l/@barusu-react/octotree-sidebar.svg)](https://www.npmjs.com/package/@barusu-react/octotree-sidebar)


Render a simple directory tree similar to [octotree-sidebar][], but really more coarse.

# Install

  ```shell
  yarn add @barusu-react/octotree-sidebar
  ```

# Usage

  You should import the [octotree-sidebar.woff2][] font manually.

  ```css
  @font-face {
    src: url('/font/octotree-sidebar.woff2') format('woff2');
    font-family: 'octotree-sidebar';
  }
  ```

  * Use in React project

    - Pure

      ```tsx
      import React from 'react'
      import { BrowserRouter as Router } from 'react-router-dom'
      import { resolveOctotreeData } from '@barusu-react/octotree'
      import OctotreeSidebar from '@barusu-react/octotree-sidebar'

      const data = resolveOctotreeData([
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
      ])

      const wrapper = (
        <Router>
          <OctotreeSidebar
            nodes={ data }
            defaultPined={ true }
            defaultWidth={ 250 }
            style={{ color: 'orange', fontSize: '16px' }}
          />
        </Router>
      )
      ```

    - With theme

      ```tsx
      import React from 'react'
      import { BrowserRouter as Router } from 'react-router-dom'
      import { DefaultTheme, ThemeProvider } from 'styled-components'
      import { resolveOctotreeData } from '@barusu-react/octotree'
      import OctotreeSidebar from '@barusu-react/octotree-sidebar'

      const data = resolveOctotreeData([
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
      ])

      const theme: DefaultTheme = {
        octotreeSidebar: {
          borderRight: 'none',
          headerBackground: 'red',
          // mainBackground: '#fff',
          toggleBackground: 'blue',
          toggleBorderColor: 'green',
        }
      }

      const wrapper = (
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
      ```

  * Props

     Name           | Type                              | Required  | Default | Description
    :--------------:|:---------------------------------:|:---------:|:-------:|:-------------
     `ref`          | `React.RefObject<HTMLDivElement>` | `false`   | -       | Forwarded ref callback
     `nodes`        | `OctotreeNodeData[]`              | `true`    | -       | Node data of octotree
     `defaultPined` | `boolean`                         | `false`   | `false` | Initial sidebar pined state
     `defaultWidth` | `number`                          | `false`   | `200`   | Initial sidebar width

    OctotreeSidebarProps inherited all attributes of `HTMLDivElement` (`React.HTMLAttributes<HTMLDivElement>`)

  * Theme

     Prop Name          | Default
    :------------------:|:--------------
     borderRight        | `1px solid #dfe2e5`
     headerBackground   | `#373e43`
     mainBackground     | `#fff`
     toggleBackground   | `#f2f5f7`
     toggleBorderColor  | `#e0e4e7`

    See [OctotreeTheme][] for details.



[octotree-sidebar]: https://github.com/ovity/octotree-sidebar.git
[OctotreeTheme]: https://github.com/guanghechen/barusu-react/blob/master/packages/octotree-sidebar/src/theme.ts
[octotree-sidebar.woff2]: https://github.com/ovity/octotree-sidebar/blob/c8819379c9cc60b3c2124440766906028891120d/libs/fonts/octicons.woff2
