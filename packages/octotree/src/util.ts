import type {
  OctotreeLeafNodeData,
  OctotreeParentNodeData,
  RawOctotreeNodeData,
} from './types'


/**
 * Classify & Format & Sort OctotreeNodeData
 *
 * @param prefixUrl
 * @param data
 */
export function resolveOctotreeData(
  prefixUrl: string,
  data: RawOctotreeNodeData[],
): (OctotreeLeafNodeData | OctotreeParentNodeData)[] {
  const results: (OctotreeLeafNodeData | OctotreeParentNodeData)[] = []
  for (const u of data) {
    if (u.children != null && u.children.length > 0) {
      const v: OctotreeParentNodeData = {
        type: 'parent',
        title: u.title,
        collapsed: u.collapsed == null ? true : u.collapsed,
        children: resolveOctotreeData(prefixUrl, u.children),
      }
      results.push(v)
    } else {
      const v: OctotreeLeafNodeData = {
        type: 'leaf',
        title: u.title,
        pathname: prefixUrl + u.pathname,
      }
      results.push(v)
    }
  }

  results.sort((x, y): -1 | 0 | 1 => {
    if (x.type !== y.type) return x.type === 'parent' ? -1 : 1
    if (x.title === y.title) return 0
    return x.title < y.title ? -1 : 1
  })
  return results
}
