import { fireEvent, render, screen } from '@testing-library/react-native';
import { Text, View } from 'react-native';
import {
  DetailCanvas,
  DetailStudioTemplate,
  DropdownMenu,
  SectionKindGrid,
  SectionThumb,
  StudioBar,
  StudioDock,
  PlusGlyph,
  CopyGlyph,
  TrashGlyph,
  EyeOffGlyph,
  type DetailDocValue,
} from '../index';
import { SectionBoard } from '../sortable';

const doc: DetailDocValue = {
  blocks: [
    {
      id: 'b1',
      layout: 'text_top',
      layers: [
        { id: 't1', type: 'text', text: '', style: { size: 8 } },
        { id: 't2', type: 'text', text: '본문' },
        { id: 'p1', type: 'image', asset_id: null },
      ],
    },
  ],
};

type Measurable = {
  measureInWindow: (
    cb: (x: number, y: number, width: number, height: number) => void
  ) => void;
};

const items = [
  {
    key: 'a',
    title: '인트로',
    snippet: '첫 줄',
    thumb: <SectionThumb doc={doc} />,
  },
  { key: 'b', title: '특징', thumb: <View />, hidden: true },
  { key: 'c', title: '연출', thumb: <View /> },
];

describe('SectionBoard', () => {
  const props = () => ({
    items,
    onPress: jest.fn(),
    onMore: jest.fn(),
    onReorder: jest.fn(),
  });

  it('opens a section when its row is pressed', async () => {
    const p = props();
    await render(<SectionBoard {...p} />);
    await fireEvent.press(screen.getByLabelText('특징'));
    expect(p.onPress).toHaveBeenCalledWith('b');
  });

  it('reports the more button position', async () => {
    const p = props();
    const measure = jest
      .spyOn(View.prototype as unknown as Measurable, 'measureInWindow')
      .mockImplementation((cb) => cb(300, 120, 44, 44));
    await render(<SectionBoard {...p} />);
    await fireEvent.press(screen.getAllByLabelText('더보기')[2]!);
    expect(p.onMore).toHaveBeenCalledWith('c', {
      x: 300,
      y: 120,
      width: 44,
      height: 44,
    });
    measure.mockRestore();
  });

  it('marks hidden rows only', async () => {
    await render(<SectionBoard {...props()} />);
    expect(screen.getAllByLabelText('숨김')).toHaveLength(1);
    expect(screen.getByText('첫 줄')).toBeTruthy();
  });

  it('moves a row with accessibility actions', async () => {
    const p = props();
    await render(<SectionBoard {...p} />);
    await fireEvent(screen.getByLabelText('인트로'), 'accessibilityAction', {
      nativeEvent: { actionName: 'increment' },
    });
    expect(p.onReorder).toHaveBeenLastCalledWith(['b', 'a', 'c']);
    await fireEvent(screen.getByLabelText('인트로'), 'accessibilityAction', {
      nativeEvent: { actionName: 'decrement' },
    });
    expect(p.onReorder).toHaveBeenCalledTimes(1);
  });
});

it('menu runs the item and closes', async () => {
  const hide = jest.fn();
  const onOpenChange = jest.fn();
  await render(
    <DropdownMenu
      open
      anchor={{ x: 300, y: 100, width: 44, height: 44 }}
      onOpenChange={onOpenChange}
      items={[
        { key: 'hide', icon: EyeOffGlyph, label: '숨기기', onPress: hide },
        { key: 'copy', icon: CopyGlyph, label: '복제', onPress: jest.fn() },
        {
          key: 'remove',
          icon: TrashGlyph,
          label: '삭제',
          tone: 'danger',
          separated: true,
          onPress: jest.fn(),
        },
      ]}
    />
  );
  await fireEvent.press(screen.getByLabelText('숨기기'));
  expect(hide).toHaveBeenCalled();
  expect(onOpenChange).toHaveBeenCalledWith(false);
});

it('menu renders nothing while closed', async () => {
  await render(
    <DropdownMenu
      open={false}
      anchor={null}
      onOpenChange={jest.fn()}
      items={[{ key: 'x', icon: CopyGlyph, label: '복제', onPress: jest.fn() }]}
    />
  );
  expect(screen.queryByLabelText('복제')).toBeNull();
});

it('kind grid picks a kind', async () => {
  const onPick = jest.fn();
  await render(
    <SectionKindGrid
      items={[
        { key: 'intro', label: '인트로', blocks: doc.blocks },
        { key: 'points', label: '특징', blocks: doc.blocks },
        { key: 'scene', label: '연출', blocks: doc.blocks },
        { key: 'care', label: '관리 방법', blocks: doc.blocks },
      ]}
      onPick={onPick}
    />
  );
  await fireEvent.press(screen.getByLabelText('관리 방법'));
  expect(onPick).toHaveBeenCalledWith('care');
});

it('dock and bar buttons respond', async () => {
  const add = jest.fn();
  const close = jest.fn();
  const done = jest.fn();
  await render(
    <DetailStudioTemplate
      bar={
        <StudioBar
          title="상세페이지"
          onClose={close}
          action={{ label: '완료', onPress: done }}
        />
      }
      dock={
        <StudioDock
          items={[{ key: 'add', icon: PlusGlyph, label: '추가', onPress: add }]}
        />
      }
    >
      <Text>본문</Text>
    </DetailStudioTemplate>
  );
  await fireEvent.press(screen.getByLabelText('추가'));
  await fireEvent.press(screen.getByLabelText('닫기'));
  await fireEvent.press(screen.getByText('완료'));
  expect(add).toHaveBeenCalled();
  expect(close).toHaveBeenCalled();
  expect(done).toHaveBeenCalled();
  expect(screen.getByText('상세페이지')).toBeTruthy();
});

it('canvas draws empty text bars only while selectable', async () => {
  const view = await render(<DetailCanvas doc={doc} />);
  expect(screen.queryByTestId('detail-blank-text')).toBeNull();
  expect(screen.getByText('본문')).toBeTruthy();
  const onSelect = jest.fn();
  await view.rerender(<DetailCanvas doc={doc} onSelect={onSelect} />);
  expect(screen.getAllByTestId('detail-blank-text')).toHaveLength(1);
  await fireEvent.press(screen.getByLabelText('글'));
  expect(onSelect).toHaveBeenLastCalledWith({ block: 'b1', layer: 't1' });
});
