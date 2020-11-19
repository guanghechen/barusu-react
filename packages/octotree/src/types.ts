/**
 * Raw node data of octotree
 */
export interface RawOctotreeNodeData {
  /**
   * Title
   */
  title: string
  /**
   * Route path
   */
  pathname?: string
  /**
   * Whether if this node is in collapsed
   */
  collapsed?: boolean
  /**
   *
   */
  children?: RawOctotreeNodeData[]
}


/**
 * node data of octotree
 */
export type OctotreeNodeData = OctotreeLeafNodeData | OctotreeParentNodeData


/**
 * Leaf node data of Octotree
 */
export interface OctotreeLeafNodeData {
  /**
   *
   */
  type: 'leaf'
  /**
   * Title
   */
  title: string
  /**
   * Route path
   */
  pathname: string
}


/**
 * Parent node data of Octotree
 */
export interface OctotreeParentNodeData {
  /**
   *
   */
  type: 'parent'
  /**
   * Title of the parent node
   */
  title: string
  /**
   * Whether if this node is in collapsed
   */
  collapsed: boolean
  /**
   *
   */
  children: (OctotreeParentNodeData | OctotreeLeafNodeData)[]
}
