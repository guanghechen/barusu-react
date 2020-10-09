[![npm version](https://img.shields.io/npm/v/@barusu-react/hello-world.svg)](https://www.npmjs.com/package/@barusu-react/hello-world)
[![npm download](https://img.shields.io/npm/dm/@barusu-react/hello-world.svg)](https://www.npmjs.com/package/@barusu-react/hello-world)
[![npm license](https://img.shields.io/npm/l/@barusu-react/hello-world.svg)](https://www.npmjs.com/package/@barusu-react/hello-world)


This is a demo project that demonstrates how to package a library that uses the `react`+`stylus`+`ts` technology stack.

![hello-world.png][]


See [sourcecodes in github](https://github.com/lemon-clown/barusu-react/tree/master/packages/hello-world#readme) to get more information.


# Install

  ```shell
  yarn add @barusu-react/hello-world
  # you also should install peerDependencies if the terminal prompts for a warning
  ```

# Usage

  * Use in React project
    ```typescript
    // index.tsx
    import React from 'react'
    import ReactDOM from 'react-dom'
    import { HelloWorld } from '@barusu-react/hello-world'


    ReactDOM.render(
      <HelloWorld />
      , document.getElementById('root')
    )
    ```


[hello-world.png]: https://raw.githubusercontent.com/lemon-clown/barusu-react/master/packages/hello-world/doc/screenshots/hello-world.png
