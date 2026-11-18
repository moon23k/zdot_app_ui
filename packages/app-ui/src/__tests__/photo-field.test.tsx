import { fireEvent, render, screen } from '@testing-library/react-native';
import { PhotoField, type FieldPhoto } from '../sortable';

const three: FieldPhoto[] = [
  { id: 'a', uri: 'https://example.com/a.jpg' },
  { id: 'b', uri: 'https://example.com/b.jpg' },
  { id: 'c', uri: 'https://example.com/c.jpg', status: 'failed' },
];

type Node = ReturnType<typeof screen.getByLabelText>;

function grouped(node: Node): boolean {
  let parent = node.parent;
  while (parent) {
    if (parent.props.accessible === true) return true;
    parent = parent.parent;
  }
  return false;
}

describe('PhotoField', () => {
  it('keeps remove and retry outside any accessibility group', async () => {
    await render(
      <PhotoField
        photos={three}
        onAdd={() => {}}
        onRemove={() => {}}
        onRetry={() => {}}
        onPhotosChange={() => {}}
      />
    );
    expect(grouped(screen.getByLabelText('사진 1 삭제'))).toBe(false);
    expect(
      grouped(screen.getByLabelText('사진 3 업로드 실패, 다시 시도'))
    ).toBe(false);
  });

  it('shows the add tile first with the count, and 대표 on the first photo', async () => {
    const onAdd = jest.fn();
    await render(<PhotoField photos={three} max={10} onAdd={onAdd} />);
    const add = screen.getByLabelText('사진 추가, 10장 중 3장');
    expect(screen.getByText('3/10')).toBeTruthy();
    expect(screen.getAllByText('대표')).toHaveLength(1);
    expect(screen.getByLabelText('사진 1, 대표')).toBeTruthy();
    expect(screen.getAllByLabelText(/^사진/)[0]).toBe(add);
    await fireEvent.press(add);
    expect(onAdd).toHaveBeenCalled();
  });

  it('hides the add tile at the limit', async () => {
    await render(<PhotoField photos={three} max={3} onAdd={() => {}} />);
    expect(screen.queryByLabelText(/사진 추가/)).toBeNull();
  });

  it('moves photos with accessibility actions, not the add tile', async () => {
    const onPhotosChange = jest.fn();
    await render(
      <PhotoField
        photos={three}
        onAdd={() => {}}
        onPhotosChange={onPhotosChange}
      />
    );
    expect(
      screen.getByLabelText('사진 추가, 10장 중 3장').props.accessibilityActions
    ).toBeUndefined();
    await fireEvent(
      screen.getByLabelText('사진 1, 대표'),
      'accessibilityAction',
      {
        nativeEvent: { actionName: 'increment' },
      }
    );
    expect(onPhotosChange).toHaveBeenCalledWith([three[1], three[0], three[2]]);
  });

  it('presses, removes and retries by id', async () => {
    const onPress = jest.fn();
    const onRemove = jest.fn();
    const onRetry = jest.fn();
    await render(
      <PhotoField
        photos={three}
        onPress={onPress}
        onRemove={onRemove}
        onRetry={onRetry}
      />
    );
    await fireEvent.press(screen.getByLabelText('사진 2'));
    await fireEvent.press(screen.getByLabelText('사진 2 삭제'));
    await fireEvent.press(
      screen.getByLabelText('사진 3 업로드 실패, 다시 시도')
    );
    expect(onPress).toHaveBeenCalledWith('b');
    expect(onRemove).toHaveBeenCalledWith('b');
    expect(onRetry).toHaveBeenCalledWith('c');
  });

  it('shows one photo without 대표 or numbers when it holds one', async () => {
    const onAdd = jest.fn();
    const onRemove = jest.fn();
    const { rerender } = await render(
      <PhotoField label="사진" photos={[]} max={1} onAdd={onAdd} />
    );
    await fireEvent.press(screen.getByLabelText('사진 추가'));
    expect(onAdd).toHaveBeenCalled();
    await rerender(
      <PhotoField
        label="사진"
        photos={[{ id: 'a', uri: 'https://example.com/a.jpg' }]}
        max={1}
        onAdd={onAdd}
        onRemove={onRemove}
      />
    );
    expect(screen.queryByLabelText(/사진 추가/)).toBeNull();
    expect(screen.queryByText('대표')).toBeNull();
    await fireEvent.press(screen.getByLabelText('사진 삭제'));
    expect(onRemove).toHaveBeenCalledWith('a');
    const onRetry = jest.fn();
    await rerender(
      <PhotoField
        label="사진"
        photos={[{ id: 'a', uri: 'x', status: 'failed' }]}
        max={1}
        onRetry={onRetry}
      />
    );
    await fireEvent.press(screen.getByLabelText('사진 업로드 실패, 다시 시도'));
    expect(onRetry).toHaveBeenCalledWith('a');
  });

  it('hides remove while uploading', async () => {
    await render(
      <PhotoField
        photos={[{ id: 'a', uri: 'x', status: 'uploading' }]}
        onRemove={() => {}}
      />
    );
    expect(screen.getByLabelText('사진 1, 대표, 업로드 중')).toBeTruthy();
    expect(screen.queryByLabelText('사진 1 삭제')).toBeNull();
  });
});
