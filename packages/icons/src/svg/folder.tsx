import React from 'react'
import { createSvgIcon } from '../util/create-svg-icon'

/**
 * @see https://github.com/mui-org/material-ui/blob/master/packages/material-ui-icons/src/Folder.js
 */
export const Folder = createSvgIcon(
  <path d="M10 4H4c-1.1 0-1.99.9-1.99 2L2 18c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V8c0-1.1-.9-2-2-2h-8l-2-2z" />,
  'Folder',
)

/**
 * @see https://github.com/mui-org/material-ui/blob/master/packages/material-ui-icons/src/FolderOutlined.js
 */
export const FolderOutlined = createSvgIcon(
  <path d="M9.17 6l2 2H20v10H4V6h5.17M10 4H4c-1.1 0-1.99.9-1.99 2L2 18c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V8c0-1.1-.9-2-2-2h-8l-2-2z" />,
  'FolderOutlined',
)

/**
 * @see https://github.com/mui-org/material-ui/blob/master/packages/material-ui-icons/src/FolderRounded.js
 */
export const FolderRounded = createSvgIcon(
  <path d="M10.59 4.59C10.21 4.21 9.7 4 9.17 4H4c-1.1 0-1.99.9-1.99 2L2 18c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V8c0-1.1-.9-2-2-2h-8l-1.41-1.41z" />,
  'FolderRounded',
)

/**
 * @see https://github.com/mui-org/material-ui/blob/master/packages/material-ui-icons/src/FolderSharp.js
 */
export const FolderSharp = createSvgIcon(
  <path d="M10 4H2v16h20V6H12l-2-2z" />,
  'FolderSharp',
)

/**
 * @see https://github.com/mui-org/material-ui/blob/master/packages/material-ui-icons/src/FolderTwoTone.js
 */
export const FolderTwoTone = createSvgIcon(
  <React.Fragment>
    <path opacity=".3" d="M11.17 8l-.58-.59L9.17 6H4v12h16V8h-8z" />
    <path d="M20 6h-8l-2-2H4c-1.1 0-1.99.9-1.99 2L2 18c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V8c0-1.1-.9-2-2-2zm0 12H4V6h5.17l1.41 1.41.59.59H20v10z" />
  </React.Fragment>,
  'FolderTwoTone',
)
