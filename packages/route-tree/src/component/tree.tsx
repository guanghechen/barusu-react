import React from 'react'
import { RouteTreeNodeData, RouteTreeNode } from './node'
import classes from '../style/index.styl'


export interface RouteTreeProps {
  /**
   * 树形控件中的节点
   */
  nodes: RouteTreeNodeData[]
  /**
   * 是否折叠路径
   * @default false
   */
  foldEmptyPath?: boolean
  /**
   * 默认的路径（非叶子节点）图标
   */
  defaultPathIcon?: React.ReactNode
  /**
   * 默认的叶子节点的图标
   */
  defaultLeafIcon?: React.ReactNode
}


export function RouteTree(props: RouteTreeProps): React.ReactElement {
  const {
    nodes,
    foldEmptyPath = false,
    defaultPathIcon = '',
    defaultLeafIcon = '',
  } = props

  return (
    <div className={ classes.container }>
      <ul>
        { nodes.map(o => (
          <RouteTreeNode
            key={ o.pathname }
            foldedParents={ [] }
            foldEmptyPath={ foldEmptyPath }
            { ...o }
          />
        )) }
      </ul>
    </div>
  )
}

