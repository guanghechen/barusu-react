import React from 'react'
import { BrowserRouter as Router, Switch, Route } from 'react-router-dom'
import classes from './style.styl'


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
}


export interface AppProps {
  routes: RouteItem[]
}


export function App(props: AppProps): React.ReactElement {
  const { routes } = props
  return (
    <div className={ classes.container }>
      <Router>
        <Switch>
          {
            routes.map(({ name, path, component, exact, strict = true, sensitive = false }) => (
              <Route key={ name } path={ path } exact={ exact } strict={ strict } sensitive={ sensitive }>
                { component }
              </Route>
            ))
          }
        </Switch>
      </Router>
    </div>
  )
}
