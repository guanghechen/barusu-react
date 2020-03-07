import React from 'react'
import ReactDOM from 'react-dom'
import { HelloWorld } from '@barusu-react/hello-world'
import { App, RouteItem } from './app'


export const routes: RouteItem[] = [
  {
    name: 'hello-world',
    path: '/hello-world',
    component: <HelloWorld />
  },
]


ReactDOM.render(
  <App routes={ routes } />
  , document.getElementById('root')
)
