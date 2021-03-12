import cn from 'clsx'
import React from 'react'
import type { RouteTreeComponentProps } from '../component/tree'
import { RouteTreeComponent } from '../component/tree'
import classes from '../style/index.styl'

export interface RouteTreeProps
  extends React.HTMLAttributes<HTMLDivElement>,
    RouteTreeComponentProps {}

/**
 * 默认的 route-tree
 * @param props
 */
export function RouteTree(props: RouteTreeProps): React.ReactElement {
  const {
    className,
    children,
    nodes,
    foldEmptyPath,
    defaultPathIcon,
    defaultLeafIcon,
    ...restProps
  } = props

  return (
    <div {...restProps} className={cn(className, classes.routeTreeContainer)}>
      <RouteTreeComponent
        nodes={nodes}
        foldEmptyPath={foldEmptyPath}
        defaultPathIcon={defaultPathIcon}
        defaultLeafIcon={defaultLeafIcon}
      />
    </div>
  )
}
