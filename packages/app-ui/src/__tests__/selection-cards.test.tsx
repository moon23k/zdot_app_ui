import { fireEvent, render, screen } from '@testing-library/react-native';
import { useState } from 'react';
import { StyleSheet } from 'react-native';
import {
  ChipGroup,
  CircleGrid,
  FilterTabs,
  SearchField,
  TileGrid,
  SheetOptions,
  SummaryHeader,
  defaultThemes,
} from '../index';

const items = [
  { value: 'a', label: '화병' },
  { value: 'b', label: '포스터' },
  { value: 'c', label: '쿠션' },
] as const;

function Many({ max }: { max?: number }) {
  const [value, setValue] = useState<string[]>([]);
  return (
    <CircleGrid
      multiple
      max={max}
      columns={4}
      items={items}
      value={value}
      onValueChange={setValue}
    />
  );
}

describe('CircleGrid multiple', () => {
  it('toggles several items as checkboxes', async () => {
    await render(<Many />);
    await fireEvent.press(screen.getByLabelText('화병'));
    await fireEvent.press(screen.getByLabelText('쿠션'));
    expect(
      screen.getByLabelText('화병').props.accessibilityState
    ).toMatchObject({
      checked: true,
    });
    expect(
      screen.getByLabelText('쿠션').props.accessibilityState
    ).toMatchObject({
      checked: true,
    });
    await fireEvent.press(screen.getByLabelText('화병'));
    expect(
      screen.getByLabelText('화병').props.accessibilityState
    ).toMatchObject({
      checked: false,
    });
  });

  it('stops adding at max', async () => {
    await render(<Many max={2} />);
    await fireEvent.press(screen.getByLabelText('화병'));
    await fireEvent.press(screen.getByLabelText('포스터'));
    await fireEvent.press(screen.getByLabelText('쿠션'));
    expect(
      screen.getByLabelText('쿠션').props.accessibilityState
    ).toMatchObject({
      checked: false,
    });
  });

  it('keeps single selection as radio', async () => {
    const onValueChange = jest.fn();
    await render(
      <CircleGrid items={items} value="a" onValueChange={onValueChange} />
    );
    expect(
      screen.getByLabelText('화병').props.accessibilityState
    ).toMatchObject({
      checked: true,
    });
    await fireEvent.press(screen.getByLabelText('화병'));
    expect(onValueChange).not.toHaveBeenCalled();
    await fireEvent.press(screen.getByLabelText('포스터'));
    expect(onValueChange).toHaveBeenCalledWith('b');
  });
});

describe('SummaryHeader press', () => {
  it('becomes a button when onPress is given', async () => {
    const onPress = jest.fn();
    await render(
      <SummaryHeader title="바닷가 펜션" badge="영업 중" onPress={onPress} />
    );
    await fireEvent.press(screen.getByRole('button', { name: '바닷가 펜션' }));
    expect(onPress).toHaveBeenCalled();
  });

  it('stays static without onPress', async () => {
    await render(<SummaryHeader title="바닷가 펜션" />);
    expect(screen.queryByRole('button')).toBeNull();
  });
});

describe('single choice reads as a checked radio', () => {
  it('ChipGroup single marks the chosen chip checked', async () => {
    await render(
      <ChipGroup
        items={[
          { value: 'a', label: '택배' },
          { value: 'b', label: '방문 수령' },
        ]}
        value="a"
        onValueChange={() => {}}
      />
    );
    const chosen = screen.getByRole('radio', { name: '택배' });
    expect(chosen.props.accessibilityState).toMatchObject({ checked: true });
    expect(chosen.props.accessibilityState.selected).toBeUndefined();
  });

  it('ChipGroup lifts the chosen chip and keeps the rest sunken', async () => {
    const { shadow } = defaultThemes.light;
    await render(
      <ChipGroup
        items={[
          { value: 'a', label: '택배' },
          { value: 'b', label: '방문 수령' },
        ]}
        value="a"
        onValueChange={() => {}}
      />
    );
    const face = (name: string) =>
      StyleSheet.flatten(screen.getByRole('radio', { name }).props.style);
    expect(face('택배').boxShadow).toBe(shadow.liftSm);
    expect(face('방문 수령').boxShadow).toBeUndefined();
    expect(screen.getByText('택배')).toHaveStyle({ fontWeight: '600' });
  });

  it('SheetOptions marks the chosen option checked', async () => {
    await render(
      <SheetOptions
        items={[
          { value: 'a', label: '최신순' },
          { value: 'b', label: '금액순' },
        ]}
        value="b"
        onValueChange={() => {}}
      />
    );
    expect(
      screen.getByRole('radio', { name: '금액순' }).props.accessibilityState
    ).toMatchObject({ checked: true });
  });
});

describe('TileGrid', () => {
  const tiles = [
    { value: 'bakery', label: '베이커리', caption: '디저트' },
    { value: 'flower', label: '플라워 숍', caption: '플랜트' },
    { value: 'perfume', label: '니치 퍼퓸 숍', caption: '뷰티' },
  ] as const;

  it('reads each tile as a radio named by its label only', async () => {
    const onValueChange = jest.fn();
    await render(
      <TileGrid items={tiles} value="bakery" onValueChange={onValueChange} />
    );
    expect(screen.getAllByRole('radio')).toHaveLength(3);
    const chosen = screen.getByRole('radio', { name: '베이커리' });
    expect(chosen.props.accessibilityState).toMatchObject({ checked: true });
    expect(screen.getByText('디저트')).toBeTruthy();
    await fireEvent.press(chosen);
    expect(onValueChange).not.toHaveBeenCalled();
    await fireEvent.press(screen.getByRole('radio', { name: '니치 퍼퓸 숍' }));
    expect(onValueChange).toHaveBeenCalledWith('perfume');
  });

  it('lifts only the chosen tile name to bold', async () => {
    await render(
      <TileGrid items={tiles} value="flower" onValueChange={() => {}} />
    );
    expect(screen.getByText('플라워 숍')).toHaveStyle({ fontWeight: '700' });
    expect(screen.getByText('베이커리')).toHaveStyle({ fontWeight: '600' });
  });
});

describe('FilterTabs', () => {
  it('marks the current tab selected and reports a new pick', async () => {
    const onValueChange = jest.fn();
    await render(
      <FilterTabs
        items={[
          { value: 'all', label: '전체' },
          { value: 'beauty', label: '뷰티' },
        ]}
        value="all"
        onValueChange={onValueChange}
      />
    );
    expect(
      screen.getByRole('tab', { name: '전체' }).props.accessibilityState
    ).toMatchObject({ selected: true });
    await fireEvent.press(screen.getByRole('tab', { name: '전체' }));
    expect(onValueChange).not.toHaveBeenCalled();
    await fireEvent.press(screen.getByRole('tab', { name: '뷰티' }));
    expect(onValueChange).toHaveBeenCalledWith('beauty');
  });
});

describe('SearchField recess', () => {
  it('sinks into the recess surface with a faint placeholder', async () => {
    const { colors } = defaultThemes.light;
    await render(
      <SearchField
        variant="recess"
        value=""
        onChangeText={() => {}}
        placeholder="업종 검색"
      />
    );
    const input = screen.getByPlaceholderText('업종 검색');
    expect(input.props.placeholderTextColor).toBe(colors.faint);
  });
});
