import { fireEvent, render, screen } from '@testing-library/react-native';
import { StyleSheet } from 'react-native';
import {
  Button,
  CreditPill,
  DetailCanvas,
  type DetailDocValue,
} from '../index';

const doc: DetailDocValue = {
  blocks: [
    {
      id: 'b1',
      layout: 'image_top',
      layers: [
        { id: 'p1', type: 'image', url: 'https://example.test/a.jpg' },
        { id: 't1', type: 'text', text: '본문' },
        { id: 't2', type: 'text', text: '다른 글' },
      ],
    },
  ],
};

type Node = {
  props?: { accessibilityRole?: string };
  children?: unknown[] | null;
};

function nestedPressables(tree: unknown) {
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
  walk(tree, false);
  return { buttons, nested };
}

it('edit mode puts an input in place of the focused text', async () => {
  const onSelect = jest.fn();
  const onChangeText = jest.fn();
  await render(
    <DetailCanvas
      doc={doc}
      mode="edit"
      onSelect={onSelect}
      selection={{ block: 'b1' }}
      focus={{
        block: 'b1',
        layer: 't1',
        input: { value: '본문', onChangeText, active: false },
      }}
    />
  );
  const input = screen.getByDisplayValue('본문');
  await fireEvent.changeText(input, 'ABC');
  expect(onChangeText).toHaveBeenCalledWith('ABC');
  await fireEvent.press(screen.getByLabelText('다른 글'));
  expect(onSelect).toHaveBeenLastCalledWith({ block: 'b1', layer: 't2' });
  await fireEvent.press(screen.getByLabelText('사진'));
  expect(onSelect).toHaveBeenLastCalledWith({ block: 'b1', layer: 'p1' });
  expect(screen.queryByLabelText('블록')).toBeNull();
  expect(screen.queryByText('1')).toBeNull();
  const walk = nestedPressables(screen.toJSON());
  expect(walk.buttons).toBeGreaterThan(1);
  expect(walk.nested).toBe(0);
});

it('edit mode pages through rewrite results', async () => {
  const onIndexChange = jest.fn();
  await render(
    <DetailCanvas
      doc={doc}
      mode="edit"
      onSelect={jest.fn()}
      focus={{
        block: 'b1',
        layer: 't1',
        result: {
          text: '짧은 글',
          label: '더 짧게',
          index: 1,
          count: 3,
          onIndexChange,
        },
      }}
    />
  );
  expect(screen.getByText('짧은 글')).toBeTruthy();
  expect(screen.getByText('더 짧게')).toBeTruthy();
  expect(screen.queryByText('본문')).toBeNull();
  expect(screen.getAllByLabelText(/^\d\/3$/)).toHaveLength(3);
  await fireEvent.press(screen.getByLabelText('3/3'));
  expect(onIndexChange).toHaveBeenCalledWith(2);
});

it('edit view draws hidden empty text as a bar to tap', async () => {
  const hidden: DetailDocValue = {
    blocks: [
      {
        id: 'b1',
        layout: 'text',
        layers: [
          { id: 't1', type: 'text', text: ' ', hidden: true },
          { id: 't2', type: 'text', text: '숨긴 글', hidden: true },
        ],
      },
      {
        id: 'b2',
        layout: 'table',
        layers: [
          { id: 'k0', type: 'text', text: '크기' },
          { id: 'v0', type: 'text', text: '', hidden: true },
        ],
      },
    ],
  };
  const onSelect = jest.fn();
  const view = await render(
    <DetailCanvas doc={hidden} mode="edit" onSelect={onSelect} />
  );
  expect(screen.getAllByTestId('detail-blank-text')).toHaveLength(2);
  expect(screen.queryByText('숨긴 글')).toBeNull();
  await fireEvent.press(screen.getAllByLabelText('글')[0]!);
  expect(onSelect).toHaveBeenLastCalledWith({ block: 'b1', layer: 't1' });
  await fireEvent.press(screen.getAllByLabelText('글')[1]!);
  expect(onSelect).toHaveBeenLastCalledWith({ block: 'b2', layer: 'v0' });
  await view.rerender(<DetailCanvas doc={hidden} />);
  expect(screen.queryByTestId('detail-blank-text')).toBeNull();
});

it('credit marks show the number only', async () => {
  const view = await render(
    <Button cost={1} onPress={() => {}}>
      다시 만들기
    </Button>
  );
  expect(screen.getByText('1')).toBeTruthy();
  await view.rerender(<Button onPress={() => {}}>다시 만들기</Button>);
  expect(screen.queryByText('1')).toBeNull();
  await view.rerender(<CreditPill balance={126} />);
  expect(screen.getByLabelText(/126/)).toBeTruthy();
  expect(screen.queryByText(/크레딧/)).toBeNull();
  await view.rerender(<CreditPill balance={12950} />);
  expect(screen.getByText('12,950')).toBeTruthy();
  expect(screen.getByLabelText('크레딧 잔액 12,950')).toBeTruthy();
});

it('draws an empty bold step 5 text as a title bar and smaller bold text as a line', async () => {
  const empty: DetailDocValue = {
    blocks: [
      {
        id: 'b1',
        layout: 'text',
        layers: [
          {
            id: 't1',
            type: 'text',
            text: '',
            style: { size: 5, weight: 'bold' },
          },
          {
            id: 't2',
            type: 'text',
            text: '',
            style: { size: 3, weight: 'bold' },
          },
        ],
      },
    ],
  };
  await render(<DetailCanvas doc={empty} mode="edit" onSelect={jest.fn()} />);
  const [title, line] = screen
    .getAllByTestId('detail-blank-text')
    .map((n) => StyleSheet.flatten(n.props.style));
  expect(title?.width).toBe('60%');
  expect(line?.width).toBe('80%');
});
