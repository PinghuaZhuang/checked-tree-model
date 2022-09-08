import { describe, it, expect } from 'vitest';
import createMock from 'test/createMock';
import CheckedTreeModel from '../src/CheckedTreeModel';
import { sortedUniq } from 'lodash';

describe('状态变化', () => {
  it('全选/全不选', () => {
    const mock = new CheckedTreeModel(createMock());
    mock.setChecked(true);
    expect(sortedUniq(mock.getSelectKeys())).toEqual([
      21, 22, 23, 24, 25, 26, 27, 28, 29, 30, 31,
    ]);
    mock.clean();
    expect(sortedUniq(mock.getSelectKeys())).toEqual([]);
    mock.setChecked(true).setChecked(false);
    expect(sortedUniq(mock.getSelectKeys())).toEqual([]);
  });

  it('半选', () => {
    const mock = new CheckedTreeModel(createMock());
    mock.setCheckedByIdReturnDiff(23);
    expect(sortedUniq(mock.getSelectKeys())).toEqual([23, 24, 25]);
    expect(mock.checked).toEqual(false);
    expect(mock.indeterminate).toEqual(true);
    expect(mock.map[22].checked).toEqual(false);
    expect(mock.map[22].indeterminate).toEqual(true);
    expect(mock.map[29].checked).toEqual(false);
    expect(mock.map[29].indeterminate).toEqual(false);
  });

  it('selectKeys', () => {
    const mock = new CheckedTreeModel(createMock());
    expect(mock.selectKeys([23, 29])).toMatchObject({
      21: {
        indeterminate: true,
      },
      22: {
        indeterminate: true,
      },
      23: {
        checked: true,
        indeterminate: false,
      },
      24: {
        checked: true,
        indeterminate: false,
      },
      25: {
        checked: true,
        indeterminate: false,
      },
      29: {
        checked: true,
        indeterminate: false,
      },
      30: {
        checked: true,
        indeterminate: false,
      },
      31: {
        checked: true,
        indeterminate: false,
      },
    });
    expect(mock.getSelectKeys()).toEqual([23, 24, 25, 29, 30, 31]);
  });

  it('selectKeys-不遍历子元素', () => {
    const mock = new CheckedTreeModel(createMock());
    expect(mock.selectKeys([22], true)).toMatchObject({
      21: {
        indeterminate: true,
      },
      22: {
        checked: true,
      },
    });
    expect(mock.getSelectKeys()).toEqual([22]);
  });

  it('diff', () => {
    const mock = new CheckedTreeModel(createMock());
    const diff = mock.setCheckedByIdReturnDiff(23);
    expect(diff).toMatchObject({
      21: {
        indeterminate: true,
      },
      22: {
        indeterminate: true,
      },
      23: {
        checked: true,
        indeterminate: false,
      },
      24: {
        checked: true,
        indeterminate: false,
      },
      25: {
        checked: true,
        indeterminate: false,
      },
    });
    expect(mock.clean()).toMatchObject({
      21: {
        indeterminate: false,
      },
      22: {
        indeterminate: false,
      },
      23: {
        checked: false,
      },
      24: {
        checked: false,
      },
      25: {
        checked: false,
      },
    });
  });
});
