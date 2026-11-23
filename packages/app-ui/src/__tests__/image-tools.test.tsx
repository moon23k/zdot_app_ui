import { fireEvent, render, screen } from '@testing-library/react-native';
import { Text } from 'react-native';
import {
  AssetGrid,
  DetailCanvas,
  ImagePrompt,
  Sheet,
  SparklesGlyph,
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
      ],
    },
  ],
};

function uris(tree: unknown) {
  const found: string[] = [];
  const walk = (node: unknown) => {
    if (!node || typeof node !== 'object') return;
    if (Array.isArray(node)) {
      node.forEach(walk);
      return;
    }
    const n = node as {
      props?: { source?: { uri?: string } };
      children?: unknown[] | null;
    };
    if (n.props?.source?.uri) found.push(n.props.source.uri);
    (n.children ?? []).forEach(walk);
  };
  walk(tree);
  return found;
}

it('image prompt fills the request from chips and typing, and edits from the pencil', async () => {
  const onChangeText = jest.fn();
  const view = await render(
    <ImagePrompt
      source="https://example.test/a.jpg"
      value=""
      onChangeText={onChangeText}
      suggestions={['나무 식탁', '리넨 천']}
    />
  );
  await fireEvent.press(screen.getByText('나무 식탁'));
  expect(onChangeText).toHaveBeenLastCalledWith('나무 식탁');
  await fireEvent.changeText(screen.getByLabelText('요청'), '창가');
  expect(onChangeText).toHaveBeenLastCalledWith('창가');

  const onEdit = jest.fn();
  await view.rerender(
    <ImagePrompt source={null} value="나무 식탁" onEdit={onEdit} />
  );
  expect(screen.queryByLabelText('요청')).toBeNull();
  await fireEvent.press(screen.getByLabelText('수정'));
  expect(onEdit).toHaveBeenCalledTimes(1);

  await view.rerender(
    <ImagePrompt source={null} value="나무 식탁" onEdit={onEdit} editDisabled />
  );
  await fireEvent.press(screen.getByLabelText('수정'));
  expect(onEdit).toHaveBeenCalledTimes(1);
});

it('asset row picks one of four results and ignores pending cells', async () => {
  const onValueChange = jest.fn();
  const items = ['a', 'b', 'c', 'd'].map((key) => ({
    key,
    uri: `https://example.test/${key}.jpg`,
  }));
  const view = await render(
    <AssetGrid
      variant="row"
      items={items}
      value={null}
      onValueChange={onValueChange}
    />
  );
  const cells = screen.getAllByRole('radio');
  expect(cells).toHaveLength(4);
  await fireEvent.press(cells[2]!);
  expect(onValueChange).toHaveBeenLastCalledWith('c');

  await view.rerender(
    <AssetGrid
      variant="row"
      items={items.map((item) => ({ ...item, uri: null, pending: true }))}
      onValueChange={onValueChange}
    />
  );
  expect(screen.queryAllByRole('radio')).toHaveLength(0);
  expect(onValueChange).toHaveBeenCalledTimes(1);
});

it('canvas previews the picked result in the focused photo without the ring', async () => {
  const view = await render(
    <DetailCanvas
      doc={doc}
      mode="edit"
      onSelect={() => {}}
      focus={{
        block: 'b1',
        layer: 'p1',
        preview: 'https://example.test/c.jpg',
      }}
    />
  );
  expect(uris(screen.toJSON())).toContain('https://example.test/c.jpg');
  expect(uris(screen.toJSON())).not.toContain('https://example.test/a.jpg');
  expect(screen.queryByTestId('detail-photo-ring')).toBeNull();

  await view.rerender(
    <DetailCanvas
      doc={doc}
      mode="edit"
      onSelect={() => {}}
      focus={{ block: 'b1', layer: 'p1', preview: null }}
    />
  );
  expect(uris(screen.toJSON())).toContain('https://example.test/a.jpg');
  expect(screen.getAllByTestId('detail-photo-ring')).toHaveLength(1);
});

it('compact sheet head shows the end slot and runs its action', async () => {
  const onPress = jest.fn();
  await render(
    <Sheet
      open
      compact
      ai
      title="보관함"
      end={<Text>126</Text>}
      action={{ icon: SparklesGlyph, label: 'AI 이미지', onPress }}
      onOpenChange={() => {}}
    >
      {null}
    </Sheet>
  );
  expect(screen.getByText('126')).toBeTruthy();
  await fireEvent.press(screen.getByLabelText('AI 이미지'));
  expect(onPress).toHaveBeenCalledTimes(1);
});
