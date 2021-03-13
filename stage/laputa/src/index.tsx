import React from 'react'
import ReactDOM from 'react-dom'
import { App } from './app'
import routes from './routes'

ReactDOM.render(<App routes={routes} />, document.getElementById('root'))
