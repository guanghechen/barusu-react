import React from 'react'
import ReactDOM from 'react-dom'
import { routes } from './routes'
import { App } from './app'


ReactDOM.render(
  <App routes={ routes } />
  , document.getElementById('root')
)
