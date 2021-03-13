<header>
  <h1 align="center">
    <a href="https://github.com/guanghechen/barusu-react/tree/master/packages/octotree#readme">@barusu-react/octotree</a>
  </h1>
  <div align="center">
    <a href="https://www.npmjs.com/package/@barusu-react/octotree">
      <img
        alt="Npm Version"
        src="https://img.shields.io/npm/v/@barusu-react/octotree.svg"
      />
    </a>
    <a href="https://www.npmjs.com/package/@barusu-react/octotree">
      <img
        alt="Npm Download"
        src="https://img.shields.io/npm/dm/@barusu-react/octotree.svg"
      />
    </a>
    <a href="https://www.npmjs.com/package/@barusu-react/octotree">
      <img
        alt="Npm License"
        src="https://img.shields.io/npm/l/@barusu-react/octotree.svg"
      />
    </a>
    <a href="https://github.com/nodejs/node">
      <img
        alt="Node.js Version"
        src="https://img.shields.io/node/v/@barusu-react/octotree"
      />
    </a>
    <a href="https://github.com/facebook/react">
      <img
        alt="React version"
        src="https://img.shields.io/npm/dependency-version/@barusu-react/octotree/peer/react"
      />
    </a>
    <a href="https://github.com/facebook/jest">
      <img
        alt="Tested with Jest"
        src="https://img.shields.io/badge/tested_with-jest-9c465e.svg"
      />
    </a>
    <a href="https://github.com/prettier/prettier">
      <img
        alt="Code Style: prettier"
        src="https://img.shields.io/badge/code_style-prettier-ff69b4.svg?style=flat-square"
      />
    </a>
  </div>
</header>
<br/>


Render a simple directory tree similar to [octotree][], but really more coarse.

See [sourcecodes in github][homepage] to for details.

## Install

* npm

  ```bash
  npm install --save @barusu-react/octotree
  ```

* yarn

  ```bash
  yarn add @barusu-react/octotree

## Usage

  You should import the [octotree.woff2][] font manually.

  ```css
  @font-face {
    src: url('/font/octotree.woff2') format('woff2');
    font-family: 'octotree';
  }
  ```

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

     Name         | Type                              | Required  | Default   | Description
    :------------:|:---------------------------------:|:---------:|:---------:|:-------------
     `ref`        | `React.RefObject<HTMLDivElement>` | `false`   | -         | Forwarded ref callback
     `nodes`      | `OctotreeNodeData[]`              | `true`    | -         | Node data of octotree
     `iconWidth`  | `string`                          | `false`   | `1.25rem` | Icon width

    OctotreeProps inherited all attributes of `HTMLDivElement` (`React.HTMLAttributes<HTMLDivElement>`)

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


[homepage]: https://github.com/guanghechen/barusu-react/tree/master/packages/octotree#readme
[octotree]: https://github.com/ovity/octotree.git
[OctotreeTheme]: https://github.com/guanghechen/barusu-react/blob/master/packages/octotree/src/theme.ts
[octotree.woff2]: https://github.com/ovity/octotree/blob/c8819379c9cc60b3c2124440766906028891120d/libs/fonts/octicons.woff2
