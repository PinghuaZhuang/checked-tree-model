export interface Data {
  id: string | number;
  pId: string | number;
  name: string;
  childList: Data[];
  className?: string;
  level: number;
  expand?: boolean;
}

type Map = Record<string, CheckedTreeModel>;

export type Diff = Record<
  string,
  {
    indeterminate?: boolean;
    checked?: boolean;
  }
>;

type EachCallback = (
  data: CheckedTreeModel,
  parent: CheckedTreeModel,
  index: number,
) => void;

type Ids = Data['id'][];

let diff: Diff = {};

function merge(source: any, ...targets: any[]) {
  targets.forEach((_diff) => {
    for (const k in _diff) {
      const target = _diff[k];
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

class CheckedTreeModel implements Data {
  #checked = false;
  #prechecked = false;
  #indeterminate = false;
  #preindeterminate = false;
  id: Data['id'];
  pId: Data['pId'];
  level: Data['level'];
  options: Data;
  name: Data['name'];
  childList: CheckedTreeModel[];
  parent?: CheckedTreeModel;
  className?: Data['className'];
  map: Map;

  constructor(options: Data, parent?: CheckedTreeModel) {
    this.options = Object.assign({}, options);
    this.name = options.name;
    this.className = options.className;
    this.id = options.id;
    this.pId = options.pId;
    this.parent = parent;
    this.level = parent == null ? 0 : parent.level + 1;
    this.map = parent == null ? { [this.id]: this } : parent.map;
    this.childList = options.childList.map((o) => {
      const target = new CheckedTreeModel(o, this);
      if (this.map[target.id] != null) {
        console.warn(`the same id. id: ${target.id}`);
      }
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
    return this;
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
    return this;
  }

  /**
   * 通过ID设置选中
   */
  setCheckedByIdReturnDiff(id?: Data['id'], value?: boolean): Diff {
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
  selectKeys(keys: Ids) {
    // 先清空状态
    const diffTmp: Diff = this.clean();
    keys.forEach((o) => {
      merge(diffTmp, this.setCheckedByIdReturnDiff(o));
    });
    return diffTmp;
  }

  /**
   * 获取当前树选中的状态
   */
  getSelectKeys() {
    const selectKeys: Ids = [];
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
    if (parent == null) return this;

    const { childList } = parent;
    const { length } = childList;
    if (length <= 0) return this;

    parent.#prechecked = parent.#checked;
    parent.#preindeterminate = parent.#indeterminate;

    const selectKeysLength = childList.filter(
      (o) => o.checked || o.indeterminate,
    ).length;

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
    return this;
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
    return this;
  }

  // 递归遍历下级元素, 回调再递归前
  eachDeep(fn: EachCallback) {
    this.childList.forEach((data, index) => {
      fn(data, this, index);
      data.eachDeep(fn);
    });
    return this;
  }

  // 递归遍历下级元素, 回调再递归后
  eachDeepAfter(fn: EachCallback) {
    this.childList.forEach((data, index) => {
      data.eachDeep(fn);
      fn(data, this, index);
    });
    return this;
  }
}

export default CheckedTreeModel;
