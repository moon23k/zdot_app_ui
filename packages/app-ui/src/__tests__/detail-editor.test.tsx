import { fireEvent, render, screen } from '@testing-library/react-native';
import {
  CompareSlider,
  DetailCanvas,
  FontPicker,
  LayoutPicker,
  type DetailDocValue,
  detailBlockSpace,
  detailLineHeight,
  detailTracking,
} from '../index';

const doc: DetailDocValue = {
  blocks: [
    {
      id: 'b1',
      layout: 'text',
      layers: [
        { id: 't1', type: 'text', text: '보이는 글' },
        { id: 't2', type: 'text', text: '숨긴 글', hidden: true },
      ],
    },
  ],
};

it('canvas hides hidden layers and reports block and layer taps', async () => {
  const onSelect = jest.fn();
  await render(<DetailCanvas doc={doc} onSelect={onSelect} />);
  expect(screen.queryByText('숨긴 글')).toBeNull();
  await fireEvent.press(screen.getByLabelText('보이는 글'));
  expect(onSelect).toHaveBeenLastCalledWith({ block: 'b1', layer: 't1' });
  await fireEvent.press(screen.getByLabelText('블록'));
  expect(onSelect).toHaveBeenLastCalledWith({ block: 'b1' });
});

it('canvas never nests a pressable inside another', async () => {
  await render(<DetailCanvas doc={doc} onSelect={jest.fn()} />);
  type Node = {
    props?: { accessibilityRole?: string };
    children?: unknown[] | null;
  };
  let buttons = 0;
  let nested = 0;
  const walk = (node: unknown, inside: boolean) => {
    if (!node || typeof node !== 'object') return;
    if (Array.isArray(node)) {
      node.forEach((n) => walk(n, inside));
      return;
    }
    const n = node as Node;
    const button = n.props?.accessibilityRole === 'button';
    if (button) {
      buttons += 1;
      if (inside) nested += 1;
    }
    (n.children ?? []).forEach((c) => walk(c, inside || button));
  };
  walk(screen.toJSON(), false);
  expect(buttons).toBeGreaterThan(1);
  expect(nested).toBe(0);
});

it('pickers report the chosen value', async () => {
  const onLayout = jest.fn();
  const onFont = jest.fn();
  await render(
    <>
      <LayoutPicker value="text" onValueChange={onLayout} />
      <FontPicker value="gothic" onValueChange={onFont} sample="Aa" />
    </>
  );
  await fireEvent.press(screen.getByLabelText('카드'));
  await fireEvent.press(screen.getByLabelText('명조'));
  expect(onLayout).toHaveBeenCalledWith('card');
  expect(onFont).toHaveBeenCalledWith('serif');
});

it('compare slider labels the comparison', async () => {
  await render(
    <CompareSlider before="https://x.test/a.jpg" after="https://x.test/b.jpg" />
  );
  expect(screen.getByLabelText('원본과 비교')).toBeTruthy();
});

describe('detail spacing', () => {
  it('keeps the old look by default and clamps slider values', () => {
    expect(detailLineHeight()).toBeCloseTo(1.45, 5);
    expect(detailTracking()).toBe(0);
    expect(detailBlockSpace()).toBe(0);
    expect(detailLineHeight(12)).toBeCloseTo(1.85, 5);
    expect(detailTracking(-9)).toBeCloseTo(-0.05, 5);
    expect(detailBlockSpace(2.5)).toBe(20);
  });
});
