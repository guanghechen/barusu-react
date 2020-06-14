import React, { useState } from 'react'
import cn from 'classnames'
import { Pin as PinIcon } from '@barusu-react/icons'
import { RouteTreeComponent, RouteTreeComponentProps } from '../component/tree'
import classes from '../style/index.styl'


export interface SidebarRouteTreeProps
  extends React.HTMLAttributes<HTMLDivElement>, RouteTreeComponentProps {
  /**
   * 是否处于可见状态
   */
  visible?: boolean
  /**
   * 是否处于固定状态
   */
  fixing?: boolean
}


/**
 * 封装了侧边栏的 route-tree
 * @param props
 */
export function SidebarRouteTree(props: SidebarRouteTreeProps): React.ReactElement {
  const {
    visible: defaultVisible = true,
    fixing: defaultFixing = true,
    className,
    children,
    nodes,
    foldEmptyPath,
    defaultPathIcon,
    defaultLeafIcon,
    ...restProps
  } = props
  const [fixing, setFixing] = useState<boolean>(defaultFixing)
  const [visible, setVisible] = useState<boolean>(fixing || defaultVisible)

  return (
    <div
      { ...restProps }
      className={ cn(
        className,
        classes.routeTreeContainer,
        classes.sidebarRouteTreeContainer,
        visible ? classes.sidebarRouteTreeVisible : classes.sidebarRouteTreeHidden,
        { [classes.sidebarRouteTreeFixing]: fixing },
      ) }
      onMouseEnter={ (): void => setVisible(true) }
      onMouseLeave={ (): void => { !fixing && setVisible(false) } }
    >
      <div className={ classes.sidebarRouteTreeHeader }>
        <span
          className={ classes.sidebarRouteTreeHeaderPin }
          onClick={ (): void => setFixing(v => !v) }
        >
          <PinIcon />
        </span>
      </div>
      <div className={ classes.sidebarRouteTreeMain }>
        <RouteTreeComponent
          nodes={ nodes }
          foldEmptyPath={ foldEmptyPath }
          defaultPathIcon={ defaultPathIcon }
          defaultLeafIcon={ defaultLeafIcon }
        />
      </div>
      <div
        className={ classes.sidebarRouteTreeToggleBtn }
        onMouseEnter={ (): void => setVisible(true) }
      >
        <span>Route Tree</span>
      </div>
    </div>
  )
}
