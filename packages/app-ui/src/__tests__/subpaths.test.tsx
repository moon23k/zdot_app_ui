import { fireEvent, render, screen } from '@testing-library/react-native';
import { Text } from 'react-native';
import { SortableList } from '../sortable';
import { summarize } from '../charts/summary';
import { moveItem } from '../sortable/move';

describe('subpath entries', () => {
  it('load', () => {
    expect(require('../charts').DayBars).toBeDefined();
    expect(require('../adjust').DialStrip).toBeDefined();
    expect(require('../sortable').SortableGrid).toBeDefined();
    expect(require('../sortable').ImageGrid).toBeDefined();
  });
});

describe('chart summary', () => {
  it('summarizes for screen readers', () => {
    expect(summarize([], String)).toBe('데이터 없음');
    expect(summarize([1, 3, 2], String)).toBe(
      '3개 구간, 최고 3, 최저 1, 마지막 2'
    );
  });
});

describe('moveItem', () => {
  it.each([
    [0, 2, ['b', 'c', 'a', 'd']],
    [3, 0, ['d', 'a', 'b', 'c']],
    [1, 1, ['a', 'b', 'c', 'd']],
    [0, 9, ['a', 'b', 'c', 'd']],
  ])('%p → %p', (from, to, expected) => {
    expect(moveItem(['a', 'b', 'c', 'd'], from, to)).toEqual(expected);
  });
});

describe('SortableList accessibility actions', () => {
  it('moves an item down', async () => {
    const onDataChange = jest.fn();
    await render(
      <SortableList
        data={['a', 'b', 'c']}
        keyExtractor={(v) => v}
        itemLabel={(v) => `옵션 ${v}`}
        onDataChange={onDataChange}
        renderItem={({ item }) => <Text>{item}</Text>}
      />
    );
    await fireEvent(screen.getByLabelText('옵션 a'), 'accessibilityAction', {
      nativeEvent: { actionName: 'increment' },
    });
    expect(onDataChange).toHaveBeenCalledWith(['b', 'a', 'c'], {
      from: 0,
      to: 1,
    });
  });
});
