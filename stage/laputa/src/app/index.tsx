import React, { useMemo, useState, useCallback } from 'react'
import cn from 'classnames'
import { BrowserRouter as Router, Switch, Route } from 'react-router-dom'
import { RouteTreeNodeLabelProps, RouteTree } from '@barusu-react/route-tree'
import classes from './style.styl'


export interface RouteItemData extends RouteTreeNodeLabelProps {
  /**
   * the elements to render under the route (children of the Route)
   */
  component: React.ReactElement
  /**
   * @default true
   * @see https://reacttraining.com/react-router/web/api/Route/exact-bool
   */
  exact?: boolean
  /**
   * @default true
   * @see https://reacttraining.com/react-router/web/api/Route/strict-bool
   */
  strict?: boolean
  /**
   * @default false
   * @see https://reacttraining.com/react-router/web/api/Route/sensitive-bool
   */
  sensitive?: boolean
  /**
   * 是否处于折叠状态
   * @default true
   */
  collapsed?: boolean
  /**
   * 控件子节点列表
   */
  children?: RouteItemData[]
}


export interface RouteItem {
  /**
   * unique key for react component
   */
  name: string
  /**
   * route path
   * @see https://reacttraining.com/react-router/web/api/Route/path-string-string
   */
  path: string | string[]
  /**
   * the elements to render under the route (children of the Route)
   */
  component: React.ReactElement
  /**
   * @see https://reacttraining.com/react-router/web/api/Route/exact-bool
   */
  exact?: boolean
  /**
   * @see https://reacttraining.com/react-router/web/api/Route/strict-bool
   */
  strict?: boolean
  /**
   * @see https://reacttraining.com/react-router/web/api/Route/sensitive-bool
   */
  sensitive?: boolean
}


export interface AppProps {
  /**
   * 路由节点数据列表
   */
  routes: RouteItemData[]
  /**
   * @default true
   * @see https://reacttraining.com/react-router/web/api/Route/exact-bool
   */
  exact?: boolean
  /**
   * @default true
   * @see https://reacttraining.com/react-router/web/api/Route/strict-bool
   */
  strict?: boolean
  /**
   * @default false
   * @see https://reacttraining.com/react-router/web/api/Route/sensitive-bool
   */
  sensitive?: boolean
  /**
   * 侧边栏是否可见
   */
  visible?: boolean
}


export function App(props: AppProps): React.ReactElement {
  const {
    routes: routesData,
    exact: defaultExact = true,
    strict: defaultStrict = true,
    sensitive: defaultSensitive = false,
    visible: defaultVisible = true,
  } = props

  // 切换侧边栏可见
  const [visible, setVisible] = useState<boolean>(defaultVisible)
  const toggleVisible = useCallback(() => {
    setVisible(v => !v)
  }, [setVisible])

  const routes = useMemo(() => {
    const items: RouteItem[] = []
    const collectRouteItems = (o: RouteItemData) => {
      items.push({
        name: o.title,
        path: o.pathname,
        component: o.component,
        exact: o.exact,
        strict: o.strict,
        sensitive: o.sensitive,
      })
    }
    routesData.forEach(o => collectRouteItems(o))
    return items
  }, [routesData])

  return (
    <div className={ classes.route }>
      <Router>
        <div className={ cn(classes.routeSidebar, { [classes.routeSidebarVisible]: visible }) }>
          <div className={ classes.routeSidebarHeader }>
            <span
              className={ classes.routeSidebarHeaderPin }
              onClick={ toggleVisible }
            >p</span>
          </div>
          <div className={ classes.routeSidebarMain }>
            <RouteTree nodes={ routesData } />
          </div>
        </div>
        <div className={ classes.routeMain }>
          <Switch>
            {
              routes.map(({
                name, path, component,
                exact = defaultExact,
                strict = defaultStrict,
                sensitive = defaultSensitive,
              }) => (
                  <Route key={ name } path={ path } exact={ exact } strict={ strict } sensitive={ sensitive }>
                    { component }
                  </Route>
                ))
            }
          </Switch>
        </div>
      </Router>
    </div>
  )
}
