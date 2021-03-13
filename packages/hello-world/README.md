[![npm version](https://img.shields.io/npm/v/@barusu-react/hello-world.svg)](https://www.npmjs.com/package/@barusu-react/hello-world)
[![npm download](https://img.shields.io/npm/dm/@barusu-react/hello-world.svg)](https://www.npmjs.com/package/@barusu-react/hello-world)
[![npm license](https://img.shields.io/npm/l/@barusu-react/hello-world.svg)](https://www.npmjs.com/package/@barusu-react/hello-world)
[![Node Version](https://img.shields.io/node/v/@barusu-react/hello-world)](https://github.com/nodejs/node)
[![React version](https://img.shields.io/npm/dependency-version/@barusu-react/hello-world/peer/react)](https://github.com/facebook/react)
[![Code Style: prettier](https://img.shields.io/badge/code_style-prettier-ff69b4.svg?style=flat-square)](https://github.com/prettier/prettier)


# `@barusu-react/hello-world`

This is a demo project that demonstrates how to package a library that uses the `react`+`stylus`+`ts` technology stack.

![hello-world.png][]

See [sourcecodes in github][sourcecodes] for details.

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

  * Use in React project
    ```typescript
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


[sourcecodes]: https://github.com/guanghechen/barusu-react/tree/master/packages/hello-world#readme
[hello-world.png]: https://raw.githubusercontent.com/guanghechen/barusu-react/master/packages/hello-world/doc/screenshots/hello-world.png
