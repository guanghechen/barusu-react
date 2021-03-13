<header>
  <h1 align="center">
    <a href="https://github.com/guanghechen/barusu-react/tree/master/packages/hello-world#readme">@barusu-react/hello-world</a>
  </h1>
  <div align="center">
    <a href="https://www.npmjs.com/package/@barusu-react/hello-world">
      <img
        alt="Npm Version"
        src="https://img.shields.io/npm/v/@barusu-react/hello-world.svg"
      />
    </a>
    <a href="https://www.npmjs.com/package/@barusu-react/hello-world">
      <img
        alt="Npm Download"
        src="https://img.shields.io/npm/dm/@barusu-react/hello-world.svg"
      />
    </a>
    <a href="https://www.npmjs.com/package/@barusu-react/hello-world">
      <img
        alt="Npm License"
        src="https://img.shields.io/npm/l/@barusu-react/hello-world.svg"
      />
    </a>
    <a href="https://github.com/nodejs/node">
      <img
        alt="Node.js Version"
        src="https://img.shields.io/node/v/@barusu-react/hello-world"
      />
    </a>
    <a href="https://github.com/facebook/react">
      <img
        alt="React version"
        src="https://img.shields.io/npm/dependency-version/@barusu-react/hello-world/peer/react"
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
<div align="center">
  <img
    alt="Hello world"
    src="https://raw.githubusercontent.com/guanghechen/barusu-react/master/packages/hello-world/doc/screenshots/hello-world.png"
  />
</div>
<br/>


This is a demo project that demonstrates how to package a library that uses the `react`+`stylus`+`ts` technology stack.

See [sourcecodes in github][homepage] for details.

## Install

* npm

  ```bash
  npm install --save @barusu-react/hello-world
  ```

* yarn

  ```bash
  yarn add @barusu-react/hello-world
  ```

## Usage

  * Use in React project:

    ```tsx
    // index.tsx
    import React from 'react'
    import ReactDOM from 'react-dom'
    import { HelloWorld } from '@barusu-react/hello-world'
    import '@barusu-react/hello-world/lib/esm/index.css'

    ReactDOM.render(
      <HelloWorld />,
      document.getElementById('root')
    )
    ```


[homepage]: https://github.com/guanghechen/barusu-react/tree/master/packages/hello-word#readme
[hello-world.png]:
