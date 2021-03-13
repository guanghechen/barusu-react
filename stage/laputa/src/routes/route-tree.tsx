import type { RouteTreeNodeData } from '@barusu-react/route-tree'
import { RouteTree } from '@barusu-react/route-tree'
import React from 'react'
import type { RouteItemData } from '../app'

const nodes: RouteTreeNodeData[] = [
  {
    title: 'Apple',
    pathname: '/apple',
    children: [
      {
        title: 'Banana',
        pathname: '/apple/banana',
      },
    ],
  },
  {
    title: 'Animals',
    pathname: '/animals',
    children: [
      {
        title: 'Felidae',
        pathname: '/animals/felidae',
        children: [
          {
            title: 'Cat',
            pathname: '/animals/felidae/cat',
          },
          {
            title: 'Tiger',
            pathname: '/animals/felidae/tiger',
          },
        ],
      },
    ],
  },
  {
    title: 'Hello World',
    pathname: '/hello-world',
  },
]

const data: RouteItemData = {
  title: 'Route Tree',
  pathname: '/route-tree',
  component: <RouteTree nodes={nodes} foldEmptyPath={true} />,
}

export default data
