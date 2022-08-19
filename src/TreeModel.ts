export interface Data {
  id: string | number;
  pId: string | number;
  name: string;
  childList: Data[];
  className?: string;
  level: number;
  expand?: boolean;
}

type Map = {
  [P: string]: TreeModel;
};

export type Diff = {
  [P: string]: {
    indeterminate?: boolean;
    checked?: boolean;
  };
};

type EachCallback = (data: TreeModel, parent: TreeModel, index: number) => void;

let diff: Diff = {};

function merge(source: any, ...targets: any[]) {
  targets.forEach(diff => {
    for (const k in diff) {
      const target = diff[k];
      if (target !== null) {
        if (typeof target !== 'object') {
          source[k] = target;
        } else {
          source[k] = source[k] ?? {};
          merge(source[k], target);
        }
      }
    }
  });
}

class TreeModel implements Data {
  #checked: boolean = false;
  #prechecked: boolean = false;
  #indeterminate: boolean = false;
  #preindeterminate: boolean = false;
  id: Data['id'];
  pId: Data['pId'];
  level: Data['level'];
  options: Data;
  name: Data['name'];
  childList: TreeModel[];
  parent?: TreeModel;
  className?: Data['className'];
  map: Map;

  constructor(options: Data, parent?: TreeModel) {
    this.options = Object.assign({}, options);
    this.name = options.name;
    this.className = options.className;
    this.id = options.id;
    this.pId = options.pId;
    this.parent = parent;
    this.level = parent == null ? 0 : parent.level + 1;
    this.map = parent == null ? { [this.id]: this } : parent.map;
    this.childList = options.childList.map((o) => {
      const target = new TreeModel(o, this);
      this.map[target.id] = target;
      return target;
    });
  }

  isRoot() {
    return this.level === 0;
  }

  get checked() {
    return this.#checked;
  }
  get indeterminate() {
    return this.#indeterminate;
  }

  // 获取变化状态
  diff() {
    let targetDiff = diff[this.id];

    if (this.#prechecked !== this.#checked) {
      targetDiff = targetDiff ?? {};
      targetDiff.checked = this.#checked;
      if (this.#checked) {
        // FIXED: indeterminate优先级高, 这里要添加 diff. 告诉外部状态变化
        targetDiff.indeterminate = false;
      }
    }
    if (this.#preindeterminate !== this.#indeterminate) {
      targetDiff = targetDiff ?? {};
      targetDiff.indeterminate = this.#indeterminate;
    }
    if (targetDiff) {
      diff[this.id] = targetDiff;
    }
    return targetDiff;
  }

  /**
   * checked 中要使用 indeterminate. 赋值的时候注意顺序.
   */
  setChecked(value: boolean, unrecursion?: boolean) {
    this.#prechecked = this.#checked;
    this.#checked = value;

    if (value) {
      // 选中后, 非半选
      this.setIndeterminate(false, true);
    }

    // 自身状态变化 && 非递归子元素.
    // 避免递归子元素的时候, 重复计算父元素的状态.
    if (this.diff() && this.parent && !unrecursion) {
      // 自身状态改变后计算父元素的状态
      this.calcParentStatus();
    }

    if (value) {
      // 选中后, 子元素全部选中
      this.each((o) => {
        o.setIndeterminate(false, true);
        o.setChecked(true, true);
      });
    } else if (!this.indeterminate) {
      // 取消选中后, 子元素全部取消选中
      this.each((o) => {
        o.setIndeterminate(false, true);
        o.setChecked(false, true);
      });
    }
  }

  setIndeterminate(value: boolean, unrecursion?: boolean) {
    this.#preindeterminate = this.#indeterminate;
    this.#indeterminate = value;

    if (value && !unrecursion) {
      this.#prechecked = this.#checked;
      this.#checked = false;
      // 半选后, 递归父元素也半选
      if (this.parent) {
        this.parent.setIndeterminate(true);
      }
    }

    if (!unrecursion) {
      this.diff();
    }
  }

  /**
   * 通过ID设置选中
   */
  setCheckedReturnDiff(id?: Data['id'], value?: boolean): Diff {
    diff = {};
    const target = this.map[id ?? this.id];
    if (target == null) return {};
    target.setChecked(value ?? true);
    const ret = Object.assign({}, diff);
    diff = {};
    return ret;
  }

  /**
   * 根据ID数组设置选中, 返回Diff
   */
  selectKeys(keys: Data['id'][]) {
    // 先清空状态
    const diffTmp: Diff = this.clean();
    keys.forEach((o) => {
      merge(diffTmp, this.setCheckedReturnDiff(o));
    });
    return diffTmp;
  }

  /**
   * 获取当前树选中的状态
   */
  getSelectKeys() {
    const selectKeys: Data['id'][] = [];
    Object.values(this.map).forEach((o) => {
      if (o.checked) {
        selectKeys.push(o.id);
      }
    });
    return selectKeys;
  }

  /**
   * 计算父元素的状态
   */
  calcParentStatus() {
    const { parent } = this;
    if (parent == null) return;

    const { childList } = parent;
    const { length } = childList;
    if (length <= 0) return;

    parent.#prechecked = parent.#checked;
    parent.#preindeterminate = parent.#indeterminate;

    const selectKeysLength = childList.filter((o) => o.checked).length;

    if (selectKeysLength === length) {
      // 全选
      parent.#checked = true;
      parent.#indeterminate = false;
    } else if (selectKeysLength > 0) {
      // 半选
      // 半选递归父元素
      parent.setIndeterminate(true);
      parent.#checked = false;
    } else {
      // 全不选
      parent.#indeterminate = false;
      parent.#checked = false;
    }

    // 父元素状态变化, 递归上去
    const targetDiff = parent.diff();
    // 半选不用递归计算子元素与父元素的关系.
    if (targetDiff && !parent.indeterminate) {
      parent.calcParentStatus();
    }
  }

  /**
   * 清空当前树的状态并返回 diff
   */
  clean() {
    const tempDiff: Diff = {};
    Object.values(this.map).forEach((o) => {
      let targetDiff = tempDiff[o.id];
      if (o.checked) {
        targetDiff = targetDiff ?? {};
        targetDiff.checked = false;
      }
      if (o.indeterminate) {
        targetDiff = targetDiff ?? {};
        targetDiff.indeterminate = false;
      }
      if (targetDiff) {
        tempDiff[o.id] = targetDiff;
      }
      o.#prechecked = o.#checked = false;
      o.#preindeterminate = o.#indeterminate = false;
    });
    return tempDiff;
  }

  // 遍历下一级元素
  each(fn: EachCallback) {
    this.childList.forEach((data, index) => {
      fn(data, this, index);
    });
  }

  // 递归遍历下级元素, 回调再递归前
  eachDeep(fn: EachCallback) {
    this.childList.forEach((data, index) => {
      fn(data, this, index);
      data.eachDeep(fn);
    });
  }

  // 递归遍历下级元素, 回调再递归后
  eachDeepAfter(fn: EachCallback) {
    this.childList.forEach((data, index) => {
      data.eachDeep(fn);
      fn(data, this, index);
    });
  }
}

export default TreeModel;
