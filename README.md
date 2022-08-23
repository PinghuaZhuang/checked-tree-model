# CheckedTreeModel

[![publish](https://github.com/PinghuaZhuang/checked-tree-model/actions/workflows/publish.yml/badge.svg)](https://github.com/PinghuaZhuang/checked-tree-model/actions/workflows/publish.yml) [![test](https://github.com/PinghuaZhuang/checked-tree-model/actions/workflows/test.yml/badge.svg)](https://github.com/PinghuaZhuang/checked-tree-model/actions/workflows/test.yml) [![license](https://img.shields.io/badge/license-MIT-blue.svg)](https://github.com/PinghuaZhuang/checked-tree-model/blob/master/LICENSE) [![Commit](https://img.shields.io/github/last-commit/pinghuazhuang/checked-tree-model.svg)](https://github.com/PinghuaZhuang/checked-tree-model/commits/master) [![Verison](https://img.shields.io/npm/v/@zstark/checked-tree-model.svg)](https://www.npmjs.com/package/@zstark/checked-tree-model)

一个树形结构数据的 `checked` 状态变化的数据模型. 返回一个 `Diff` 状态变化集合. 参考 `antd` 的 `Tree` 组件.

## Example

[Live Demo](https://pinghuazhuang.github.io/@zstark/permission-table/)

## 🚀 Quick Start

```js
import CheckedTreeModel from '@zstark/checked-tree-model';

const mock = {
  id: 0,
  name: 'title1',
  childList: [
    { id: 1, name: 'title2' },
    { id: 2, name: 'title3' },
  ],
};

const data = new CheckedTreeModel(mock);

data.setCheckedByIdReturnDiff(1);
// => { 0: { indeterminate: true }, 1: { checked: true } }
data.setCheckedByIdReturnDiff(2);
// => { 0: { checked: true, indeterminate: false }, 2: { checked: true } }
```

## constructor

```ts
(options: Data, parent?: CheckedTreeModel) => void
```

```ts
export interface Data {
  id: string | number;
  pId: string | number;
  name: string;
  childList: Data[];
  className?: string;
  level: number;
  expand?: boolean;
}

export type Diff = {
  [P: string]: {
    indeterminate?: boolean;
    checked?: boolean;
  };
};

type EachCallback = (
  data: CheckedTreeModel,
  parent: CheckedTreeModel,
  index: number,
) => void;
```

## Methods

- isRoot: () => boolean. 是否是根元素
- diff: () => { indeterminate?: boolean; checked?: boolean;} | undefined. 当前数据变化状态
- setChecked: () => CheckedTreeModel. 选中当前数据.
- setIndeterminate: () => CheckedTreeModel. 半选.
- setCheckedByIdReturnDiff: (id?: Data['id'], value?: boolean) => {}
- selectKeys: (keys: Ids) => Diff. 根据 ID 数组设置选中
- getSelectKeys: () => Ids. 获取当前树所有选中的 ID.
- clean: () => Diff. 清空当前树所有状态.
- each: (fn: EachCallback) => void. 遍历子元素.
- eachDeep: (fn: EachCallback) => void. 递归遍历子元素. 回调在递归前.
- eachDeepAfter: (fn: EachCallback) => void. 递归遍历子元素. 回调在递归后.
