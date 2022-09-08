export interface Data {
    id: string | number;
    pId: string | number;
    name: string;
    childList: Data[];
    className?: string;
    level: number;
    expand?: boolean;
}
declare type Map = Record<string, CheckedTreeModel>;
export declare type Diff = Record<string, {
    indeterminate?: boolean;
    checked?: boolean;
}>;
declare type EachCallback = (data: CheckedTreeModel, parent: CheckedTreeModel, index: number) => void;
declare type Ids = Data['id'][];
declare class CheckedTreeModel implements Data {
    #private;
    id: Data['id'];
    pId: Data['pId'];
    level: Data['level'];
    options: Data;
    name: Data['name'];
    childList: CheckedTreeModel[];
    parent?: CheckedTreeModel;
    className?: Data['className'];
    map: Map;
    constructor(options: Data, parent?: CheckedTreeModel);
    isRoot(): boolean;
    get checked(): boolean;
    get indeterminate(): boolean;
    diff(): {
        indeterminate?: boolean | undefined;
        checked?: boolean | undefined;
    };
    /**
     * checked 中要使用 indeterminate. 赋值的时候注意顺序.
     */
    setChecked(value: boolean, unrecursion?: boolean, undown?: boolean): this | undefined;
    setIndeterminate(value: boolean, unrecursion?: boolean): this;
    /**
     * 通过ID设置选中
     */
    setCheckedByIdReturnDiff(id?: Data['id'], value?: boolean, undown?: boolean): Diff;
    /**
     * 根据ID数组设置选中, 返回Diff
     */
    selectKeys(keys: Ids, undown?: boolean): Diff;
    /**
     * 获取当前树选中的状态
     */
    getSelectKeys(): Ids;
    /**
     * 计算父元素的状态
     */
    calcParentStatus(): this;
    /**
     * 清空当前树的状态并返回 diff
     */
    clean(): Diff;
    each(fn: EachCallback): this;
    eachDeep(fn: EachCallback): this;
    eachDeepAfter(fn: EachCallback): this;
}
export default CheckedTreeModel;
