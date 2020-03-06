import React from 'react'
import classes from './style.styl'


export interface HelloWorldContentProps {
  content: string
}


export function HelloWorldContent(props: HelloWorldContentProps): React.ReactElement {
  const { content } = props
  return (
    <h1 className={ classes.content }>{ content }</h1>
  )
}
