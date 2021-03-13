import { HelloWorld } from '@barusu-react/hello-world'
import React from 'react'
import type { RouteItemData } from '../app'

const data: RouteItemData = {
  title: 'Hello World',
  pathname: '/hello-world',
  component: <HelloWorld />,
}

export default data
