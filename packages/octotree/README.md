[![npm version](https://img.shields.io/npm/v/@barusu-react/octotree.svg)](https://www.npmjs.com/package/@barusu-react/octotree)
[![npm download](https://img.shields.io/npm/dm/@barusu-react/octotree.svg)](https://www.npmjs.com/package/@barusu-react/octotree)
[![npm license](https://img.shields.io/npm/l/@barusu-react/octotree.svg)](https://www.npmjs.com/package/@barusu-react/octotree)


Render directory tree like the [chrome extension `octotree`][].

# Install

  ```shell
  yarn add @barusu-react/octotree
  ```

# Usage
  * Use in React project

    - Pure

      ```tsx
      import React from 'react'
      import { BrowserRouter as Router } from 'react-router-dom'
      import Octotree, { resolveOctotreeData } from '@barusu-react/octotree'

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
          <Octotree
            nodes={ data }
            iconWidth="1.5rem"
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
      import Octotree, { resolveOctotreeData } from '@barusu-react/octotree'

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
        octotree: {
          fontSize: '18px',
          colorTitle: '#ccc',
          linkBackgroundHover: 'red',
          linkBackgroundActive: 'blue',
          typeIconColorSecondary: 'green'
        }
      }}

      const wrapper = (
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
      ```

  * Props

     Name     | Type                                | Required  | Default | Description
    :--------:|:-----------------------------------:|:---------:|:-------:|:-------------
     `ref`    | `React.RefObject<HTMLSpanElement>`  | `false`   | -       | Forwarded ref callback
     `value`  | `string`                            | `true`    | -       | Text content

    TextProps inherited all attributes of `HTMLSpanElement` (`React.HTMLAttributes<HTMLSpanElement>`)

  * Theme

     Prop Name              | Default
    :----------------------:|:--------------
     fontSize               | `1rem`
     colorTitle             | `#0f2e47`
     linkBackgroundHover    | `#f6f8fa`
     linkBackgroundActive   | `#dbeeff`
     typeIconColorPrimary   | `#6cb5fe`
     typeIconColorSecondary | `#8a8a8a`

    See [OctotreeTheme][] for details.



[chrome extension `octotree`]: https://chrome.google.com/webstore/detail/octotree-github-code-tree/bkhaagjahfmjljalopjnoealnfndnagc?hl=en-US
[OctotreeTheme]: https://github.com/guanghechen/barusu-react/blob/master/packages/octotree/src/theme.ts
