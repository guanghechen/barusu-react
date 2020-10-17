import React from 'react'
import { Link } from 'react-router-dom'


/**
 * props for component RouteTreeLabel
 */
export interface RouteTreeNodeLabelProps {
  /**
   * A string placeholder of the link
   */
  title: string
  /**
   * A string representing the path to link to
   */
  pathname: string
  /**
   * A string representation of query parameters
   */
  search?: string
  /**
   * A hash to put in the URL, e.g. #a-hash
   */
  hash?: string
  /**
   * State to persist to the location
   */
  state?: Record<string, unknown>
  /**
   * extra attrs
   */
  extraLabelAttrs?: React.HTMLAttributes<HTMLAnchorElement>
}


/**
 * @param props
 */
export function RouteTreeNodeLabel(
  props: RouteTreeNodeLabelProps
): React.ReactElement {
  const { title, pathname, search, hash, state, extraLabelAttrs } = props
  return (
    <Link
      { ...extraLabelAttrs }
      title={ title }
      key={ pathname }
      to={{ pathname, search, hash, state }}
    >
      { title }
    </Link>
  )
}
