import React from 'react'
import { HelloWorld } from '@barusu-react/hello-world'
import { RouteTree, RouteTreeNodeData } from '@barusu-react/route-tree'
import { RouteItem } from './app'


const nodes: RouteTreeNodeData[] = [
  {
    title: 'Apple',
    pathname: '/apple',
    children: [
      {
        title: 'Banana',
        pathname: '/apple/banana',
      }
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
        ]
      }
    ],
  },
  {
    title: 'Hello World',
    pathname: '/hello-world',
  },
]


export const routes: RouteItem[] = [
  {
    name: 'hello-world',
    path: '/hello-world',
    component: <HelloWorld />
  },
  {
    name: 'route-tree',
    path: '/route-tree',
    component: (
      <RouteTree
        nodes={ nodes }
        foldEmptyPath={ true }
      />
    )
  },
]
