import React from 'react'
import { RouteTree, RouteTreeNodeData } from '@barusu-react/route-tree'
import { RouteItemData } from '../app'

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

export default {
  title: 'Route Tree',
  pathname: '/route-tree',
  component: <RouteTree nodes={nodes} foldEmptyPath={true} />,
} as RouteItemData
