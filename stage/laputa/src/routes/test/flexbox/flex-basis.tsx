import React from 'react'


const stylesheet = `
.flex-container {
  display: flex;
  width: 1000px;
  box-sizing: content-box;
  border: 1px solid #c1c1c1;
  padding: 0;
  margin: 0;
}
.flex-item {
  width: 200px;
  height: 200px;
  box-sizing: border-box;
}
.flex-item1 {
  background-color: #26d700;
  flex-basis: 100%;
}
.flex-item2 {
  background-color: #aa00ff;
}
.flex-item3 {
  background-color: #fda101;
}
.flex-item4 {
  background-color: #00b3dd;
}
`.trim()


/**
 * Requirements
 *
 *  - flex: n           ===> flex n n 0
 *  - flex-basis: auto  ===> 取决与元素自身尺寸属性
 *
 *   Declaration            | What it should mean | What it means in IE 10
 *  :-----------------------|:--------------------|:------------------------
 *   (no flex declaration)  | `flex: 0 1 auto`    | `flex: 0 0 auto`
 *   `flex: 1`              | `flex: 1 1 0%`      | `flex: 1 0 0px`
 *   `flex: auto`           | `flex: 1 1 auto`    | `flex: 1 0 auto`
 *   `flex: initial`        | `flex: 0 1 auto`    | `flex: 0 0 auto`
 *
 * - 空间分配规则：
 *    - `flex-basis` 之和大于包含块，则按照 `flex-shrink * flex-basis` 分配减少空间
 *    - `flex-basis` 之和小于包含块，则按照 `flex-grow * flex-basis` 分配增加的空间
 *
 * 已知总空间为 1000px，而元素指定的空间为 100%*1000px + 200px * 3 = 1600px > 1000px
 * 因此需要压缩 600px 的空间；
 * 由于未指定 flex-grow 和 flex-shrink，故四个子元素均：flex-grow=0, flex-shrink=1
 * 因此第一个元素需要减少的空间为 `(100% * 1000px / 1600px) * 600px = 375px`，故其实际
 * 分配到的空间为 `100% * 1000px - 375px = 624px`
 * 其它三个元素需要减少的空间均为 `(200px / 1600px) * 600px = 75px`，故它们的实际尺寸
 * 均为 `200px - 75px = 125px`
 */
export function FlexBasisTest(): React.ReactElement {
  return (
    <div>
      <style>{ stylesheet }</style>
      <div className="flex-container">
        <div className="flex-item flex-item1" />
        <div className="flex-item flex-item2" />
        <div className="flex-item flex-item3" />
        <div className="flex-item flex-item4" />
      </div>
    </div>
  )
}


export default {
  title: 'flex-basis | test',
  pathname: '/test/display/flexbox/flex-basis',
  component: <FlexBasisTest />
}
