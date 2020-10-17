import React from 'react'
import { HelloWorldContent } from './content'
import classes from './style/index.styl'


export interface HelloWorldProps {
  content?: string
}


export function HelloWorld(props: HelloWorldProps): React.ReactElement {
  const { content = 'Hello, world!' } = props
  return (
    <div className={ classes.container }>
      <HelloWorldContent content={ content } />
    </div>
  )
}
