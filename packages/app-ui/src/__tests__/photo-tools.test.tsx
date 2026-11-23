import { fireEvent, render, screen } from '@testing-library/react-native';
import {
  AdjustTiles,
  AssetGrid,
  DetailCanvas,
  PhotoToolBar,
  type DetailDocValue,
} from '../index';

const doc: DetailDocValue = {
  blocks: [
    {
      id: 'b1',
      layout: 'image_top',
      layers: [
        { id: 'p1', type: 'image', url: 'https://example.test/a.jpg' },
        {
          id: 'p2',
          type: 'image',
          url: 'https://example.test/b.jpg',
          hidden: true,
        },
        { id: 't1', type: 'text', text: '본문' },
      ],
    },
  ],
};

type Node = {
  props?: { accessibilityRole?: string };
  children?: unknown[] | null;
};

function nested(tree: unknown) {
  let count = 0;
  const walk = (node: unknown, inside: boolean) => {
    if (!node || typeof node !== 'object') return;
    if (Array.isArray(node)) {
      node.forEach((n) => walk(n, inside));
      return;
    }
    const n = node as Node;
    const button = n.props?.accessibilityRole === 'button';
    if (button && inside) count += 1;
    (n.children ?? []).forEach((c) => walk(c, inside || button));
  };
  walk(tree, false);
  return count;
}

it('canvas marks the focused photo, compares it and shows hidden photos only while editing', async () => {
  const onSelect = jest.fn();
  const view = await render(
    <DetailCanvas
      doc={doc}
      mode="edit"
      onSelect={onSelect}
      focus={{ block: 'b1', layer: 'p1' }}
    />
  );
  expect(screen.getAllByTestId('detail-photo-ring')).toHaveLength(1);
  const photos = screen.getAllByLabelText('사진');
  expect(photos).toHaveLength(2);
  await fireEvent.press(photos[0]!);
  expect(onSelect).toHaveBeenLastCalledWith({ block: 'b1', layer: 'p1' });
  await fireEvent.press(photos[1]!);
  expect(onSelect).toHaveBeenLastCalledWith({ block: 'b1', layer: 'p2' });

  await view.rerender(
    <DetailCanvas
      doc={doc}
      mode="edit"
      onSelect={onSelect}
      focus={{
        block: 'b1',
        layer: 'p1',
        compare: {
          before: 'https://example.test/a.jpg',
          after: 'https://example.test/c.jpg',
          labels: { before: '전', after: '후' },
        },
      }}
    />
  );
  expect(screen.getByRole('adjustable', { name: '원본과 비교' })).toBeTruthy();
  expect(screen.getByText('전')).toBeTruthy();
  expect(screen.getByText('후')).toBeTruthy();
  expect(screen.getAllByLabelText('사진')).toHaveLength(1);
  expect(nested(screen.toJSON())).toBe(0);

  await view.rerender(<DetailCanvas doc={doc} onSelect={onSelect} />);
  expect(screen.getAllByLabelText('사진')).toHaveLength(1);
  expect(screen.queryByTestId('detail-photo-ring')).toBeNull();
});

it('asset grid picks, clears, long presses and adds', async () => {
  const onValueChange = jest.fn();
  const onLongPress = jest.fn();
  const onAdd = jest.fn();
  const items = [
    { key: 'a', uri: 'https://example.test/a.jpg' },
    { key: 'b', uri: 'https://example.test/b.jpg', made: true },
  ];
  const view = await render(
    <AssetGrid
      items={items}
      value="b"
      onValueChange={onValueChange}
      onLongPress={onLongPress}
      onAdd={onAdd}
    />
  );
  const radios = screen.getAllByRole('radio');
  expect(radios).toHaveLength(2);
  await fireEvent.press(radios[0]!);
  expect(onValueChange).toHaveBeenLastCalledWith('a');
  await fireEvent.press(radios[1]!);
  expect(onValueChange).toHaveBeenLastCalledWith(null);
  await fireEvent(radios[0]!, 'longPress');
  expect(onLongPress).toHaveBeenCalledWith('a');
  await fireEvent.press(screen.getByLabelText('사진 올리기'));
  expect(onAdd).toHaveBeenCalled();

  await view.rerender(<AssetGrid items={items} onLongPress={onLongPress} />);
  expect(screen.queryAllByRole('radio')).toHaveLength(0);
  expect(screen.queryByLabelText('사진 올리기')).toBeNull();
});

it('adjust tiles show the cost and the tool bar reports presses', async () => {
  const onPick = jest.fn();
  const onCrop = jest.fn();
  const onDone = jest.fn();
  await render(
    <>
      <AdjustTiles
        items={[
          { value: 'remove_background', icon: null, label: '배경 지우기' },
          { value: 'enhance', icon: null, label: '선명하게' },
        ]}
        cost={1}
        onPick={onPick}
      />
      <PhotoToolBar
        items={[
          {
            key: 'crop',
            icon: null,
            label: '자르기',
            onPress: onCrop,
            cost: 2,
          },
          {
            key: 'hide',
            icon: null,
            label: '숨기기',
            onPress: () => {},
            active: true,
          },
        ]}
        action={{ label: '완료', onPress: onDone }}
      />
    </>
  );
  expect(screen.getAllByText('1')).toHaveLength(2);
  expect(screen.getByText('2')).toBeTruthy();
  await fireEvent.press(screen.getByLabelText('선명하게'));
  expect(onPick).toHaveBeenCalledWith('enhance');
  await fireEvent.press(screen.getByLabelText('자르기'));
  expect(onCrop).toHaveBeenCalled();
  expect(
    screen.getByLabelText('숨기기').props.accessibilityState
  ).toMatchObject({
    selected: true,
  });
  await fireEvent.press(screen.getByText('완료'));
  expect(onDone).toHaveBeenCalled();
});
