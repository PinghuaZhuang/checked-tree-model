export interface Data {
    id: string | number;
    pId: string | number;
    name: string;
    childList: Data[];
    className?: string;
    level: number;
    expand?: boolean;
}
declare type Map = {
    [P: string]: TreeModel;
};
export declare type Diff = {
    [P: string]: {
        indeterminate?: boolean;
        checked?: boolean;
    };
};
declare type EachCallback = (data: TreeModel, parent: TreeModel, index: number) => void;
declare class TreeModel implements Data {
    #private;
    id: Data['id'];
    pId: Data['pId'];
    level: Data['level'];
    options: Data;
    name: Data['name'];
    childList: TreeModel[];
    parent?: TreeModel;
    className?: Data['className'];
    map: Map;
    constructor(options: Data, parent?: TreeModel);
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
    setChecked(value: boolean, unrecursion?: boolean): void;
    setIndeterminate(value: boolean, unrecursion?: boolean): void;
    /**
     * 通过ID设置选中
     */
    setCheckedReturnDiff(id?: Data['id'], value?: boolean): Diff;
    /**
     * 根据ID数组设置选中, 返回Diff
     */
    selectKeys(keys: Data['id'][]): Diff;
    /**
     * 获取当前树选中的状态
     */
    getSelectKeys(): (string | number)[];
    /**
     * 计算父元素的状态
     */
    calcParentStatus(): void;
    /**
     * 清空当前树的状态并返回 diff
     */
    clean(): Diff;
    each(fn: EachCallback): void;
    eachDeep(fn: EachCallback): void;
    eachDeepAfter(fn: EachCallback): void;
}
export default TreeModel;
