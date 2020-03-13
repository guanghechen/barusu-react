import React, { useRef, useState } from 'react'
import cn from 'classnames'
import {
  ChevronRightRounded as ChevronRightRoundedIcon,
  ChevronDownRounded as ChevronDownRoundedIcon,
  Folder as FolderIcon,
  FolderOpen as FolderOpenIcon,
  Link as LinkIcon,
} from '@barusu-react/icons'
import classes from '../style/index.styl'
import { RouteTreeNodeLabel, RouteTreeNodeLabelProps } from './label'


export interface RouteTreeNodeData extends RouteTreeNodeLabelProps {
  /**
   * 是否处于折叠状态
   * @default true
   */
  collapsed?: boolean
  /**
   * 控件子节点列表
   */
  children?: RouteTreeNodeData[]
}


/**
 * props for RouteTreeLeafNode
 */
export interface RouteTreeNodeProps extends RouteTreeNodeData {
  /**
   * 是否折叠路径
   *
   * false case:
   *   src/
   *   └── component/
   *       └── tree.tsx
   *
   * true case:
   *   src/component/
   *   └── tree.tsx
   */
  foldEmptyPath: boolean
  /**
   * 折叠的父节点列表
   */
  foldedParents: RouteTreeNodeData[]
}


/**
 *
 * @param props
 */
export function RouteTreeNode(props: RouteTreeNodeProps): React.ReactElement {
  const { foldedParents, foldEmptyPath, ...currentNodeData } = props
  const {
    collapsed: defaultCollapsed = true,
    children,
    ...currentNodeLabelProps
  } = currentNodeData

  const [collapsed, setCollapsed] = useState<boolean>(defaultCollapsed)
  const stopTextSelectedRef = useRef<React.MouseEventHandler>((e: React.MouseEvent) => {
    e.preventDefault()
    e.stopPropagation()
  })
  const handleCollapseRef = useRef<React.MouseEventHandler>((e: React.MouseEvent) => {
    e.preventDefault()
    e.stopPropagation()
    setCollapsed(c => !c)
  })


  /**
   * 【是否曾渲染过子树】的数据引用
   */
  const subTreeRenderedRef = useRef<boolean>(false)

  /**
   * 是否折叠路径
   */
  if (foldEmptyPath && props.children != null) {
    const child = props.children[0]
    if (props.children.length === 1 && child.children != null) {
      return (
        <RouteTreeNode
          foldedParents={ [...foldedParents, currentNodeData] }
          foldEmptyPath={ foldEmptyPath }
          { ...child }
        />
      )
    }
  }

  /**
   * 优化：
   *  - 若子树未渲染过，且当前为折叠状态，则直接返回 undefined
   *  - 若子树渲染过，则不论折叠状态，都返回完整的子树（保持 dom 结构一致，以提升效率）
   */
  let content: React.ReactElement[] | undefined
  if (props.children != null && (subTreeRenderedRef.current || !collapsed)) {
    content = props.children.map(child => (
      <RouteTreeNode
        key={ child.pathname }
        foldedParents={ [] }
        foldEmptyPath={ foldEmptyPath }
        { ...child }
      />
    ))
    subTreeRenderedRef.current = true
  } else {
    content = undefined
  }

  const isLeafNode = children == null
  const collapseIcon = isLeafNode ? undefined : (
    collapsed ? <ChevronRightRoundedIcon /> : <ChevronDownRoundedIcon />
  )
  const icon = isLeafNode ? <LinkIcon /> : (
    collapsed ? <FolderIcon /> : <FolderOpenIcon />
  )

  return (
    <li className={ classes.routeTreeNode }>
      <div
        className={ classes.routeTreeNodeHeader }
        onClick={ handleCollapseRef.current }
      >
        <span
          key="collapse"
          className={ classes.routeTreeNodeHeaderCollapseBtn }
          onClick={ handleCollapseRef.current }
          onMouseDown={ stopTextSelectedRef.current }
        >
          { collapseIcon }
        </span>
        <span
          key="icon"
          className={ classes.routeTreeNodeHeaderIcon }
          onClick={ handleCollapseRef.current }
          onMouseDown={ stopTextSelectedRef.current }
        >
          { icon }
        </span>
        <span key="label" className={ classes.routeTreeNodeHeaderLabel }>
          {
            foldedParents.map(({ collapsed, children, ...labelProps }) => (
              // <></> 写法中不支持 key 属性，
              // 控制台会报 unique key 的错误
              <React.Fragment key={ labelProps.pathname }>
                <RouteTreeNodeLabel { ...labelProps } />
                <span className={ classes.routeTreeNodeHeaderSeparator } />
              </React.Fragment>
            ))
          }
          <RouteTreeNodeLabel
            key={ currentNodeLabelProps.pathname }
            { ...currentNodeLabelProps }
          />
        </span>
      </div>
      { !isLeafNode && (
        <ul className={ cn(classes.routeTreeNodeBody, { [classes.routeTreeNodeBodyCollapsed]: collapsed }) }>
          { content }
        </ul>
      ) }
    </li>
  )
}
