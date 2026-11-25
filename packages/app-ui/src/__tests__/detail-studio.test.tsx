import { fireEvent, render, screen } from '@testing-library/react-native';
import { Text, View } from 'react-native';
import {
  DETAIL_LAYOUTS,
  DetailCanvas,
  DetailStudioTemplate,
  LayoutPicker,
  detailLayoutsFor,
  DropdownMenu,
  SectionKindGrid,
  SectionCover,
  SectionSettings,
  StudioBar,
  StudioDock,
  StudioSteps,
  RewriteTray,
  TextFormatPanel,
  ImageGlyph,
  MinusGlyph,
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
    thumb: <SectionCover uri="https://example.test/a.jpg" icon={ImageGlyph} />,
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

  it('anchors the more menu to the row from the card and the row index', async () => {
    const p = props();
    const measure = jest
      .spyOn(View.prototype as unknown as Measurable, 'measureInWindow')
      .mockImplementation((cb) => cb(16, 120, 358, 288));
    await render(<SectionBoard {...p} />);
    await fireEvent.press(screen.getAllByLabelText('더보기')[2]!);
    expect(p.onMore).toHaveBeenCalledWith('c', {
      x: 16,
      y: 296,
      width: 358,
      height: 88,
      pitch: 88,
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
  const preview = jest.fn();
  await render(
    <DetailStudioTemplate
      bar={
        <StudioBar
          title="상세페이지"
          onClose={close}
          tools={[
            { key: 'eye', icon: null, label: '미리보기', onPress: preview },
          ]}
          action={{ label: '저장', onPress: done }}
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
  await fireEvent.press(screen.getByText('저장'));
  await fireEvent.press(screen.getByLabelText('미리보기'));
  expect(add).toHaveBeenCalled();
  expect(close).toHaveBeenCalled();
  expect(done).toHaveBeenCalled();
  expect(preview).toHaveBeenCalled();
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

const listDoc: DetailDocValue = {
  blocks: [
    {
      id: 'tb',
      layout: 'table',
      layers: [
        { id: 'k0', type: 'text', text: '크기' },
        { id: 'v0', type: 'text', text: '지름 17cm' },
        { id: 'k1', type: 'text', text: '' },
        { id: 'v1', type: 'text', text: '' },
        { id: 'k2', type: 'text', text: '무게', hidden: true },
        { id: 'v2', type: 'text', text: '420g', hidden: true },
        { id: 'k3', type: 'text', text: '소재' },
        { id: 'v3', type: 'text', text: '백자토', hidden: true },
        { id: 'k4', type: 'text', text: '제조' },
      ],
    },
    {
      id: 'st',
      layout: 'steps',
      layers: [
        { id: 's0', type: 'text', text: '물레 성형' },
        { id: 's1', type: 'text', text: '', hidden: false },
        { id: 's2', type: 'text', text: '초벌', hidden: true },
        { id: 's3', type: 'text', text: '유약' },
        { id: 'sp', type: 'image', url: 'x' },
      ],
    },
  ],
};

describe('table and steps', () => {
  it('draws filled rows and steps in the view', async () => {
    await render(<DetailCanvas doc={listDoc} />);
    expect(screen.getByText('크기')).toBeTruthy();
    expect(screen.getByText('지름 17cm')).toBeTruthy();
    expect(screen.getByText('소재')).toBeTruthy();
    expect(screen.getByText('제조')).toBeTruthy();
    expect(screen.queryByText('무게')).toBeNull();
    expect(screen.queryByText('백자토')).toBeNull();
    expect(screen.queryByText('초벌')).toBeNull();
    expect(screen.queryByTestId('detail-blank-text')).toBeNull();
    expect(screen.getByText('1')).toBeTruthy();
    expect(screen.getByText('2')).toBeTruthy();
    expect(screen.queryByText('3')).toBeNull();
  });

  it('selects cells and steps and shows empty bars while editing', async () => {
    const onSelect = jest.fn();
    await render(<DetailCanvas doc={listDoc} onSelect={onSelect} />);
    expect(screen.getAllByTestId('detail-blank-text')).toHaveLength(3);
    await fireEvent.press(screen.getByLabelText('지름 17cm'));
    expect(onSelect).toHaveBeenLastCalledWith({ block: 'tb', layer: 'v0' });
    await fireEvent.press(screen.getByLabelText('유약'));
    expect(onSelect).toHaveBeenLastCalledWith({ block: 'st', layer: 's3' });
    await fireEvent.press(screen.getAllByLabelText('글')[2]!);
    expect(onSelect).toHaveBeenLastCalledWith({ block: 'st', layer: 's1' });
    expect(screen.getByText('3')).toBeTruthy();
    expect(screen.queryByText('초벌')).toBeNull();
  });

  it('offers list layouts only for blocks without photos', async () => {
    expect(detailLayoutsFor(doc.blocks[0]!)).toEqual(DETAIL_LAYOUTS);
    expect(detailLayoutsFor(listDoc.blocks[0]!)).toHaveLength(9);
    const onValueChange = jest.fn();
    await render(
      <LayoutPicker
        value="table"
        onValueChange={onValueChange}
        items={detailLayoutsFor(listDoc.blocks[0]!)}
      />
    );
    expect(screen.getAllByRole('radio')).toHaveLength(9);
    await fireEvent.press(screen.getByLabelText('순서'));
    expect(onValueChange).toHaveBeenCalledWith('steps');
    expect(screen.getByLabelText('표')).toBeTruthy();
  });

  it('kind grid draws table rows and steps', async () => {
    await render(
      <SectionKindGrid
        items={[
          { key: 'spec', label: '사이즈와 소재', blocks: [listDoc.blocks[0]!] },
          { key: 'making', label: '만드는 과정', blocks: [listDoc.blocks[1]!] },
        ]}
        onPick={jest.fn()}
      />
    );
    expect(screen.getAllByTestId('kind-table-row')).toHaveLength(5);
    expect(screen.getAllByTestId('kind-step')).toHaveLength(4);
  });
});

it('pending rows wait without actions', async () => {
  const onPress = jest.fn();
  const onReorder = jest.fn();
  await render(
    <SectionBoard
      items={[
        { key: 'intro', title: '인트로', thumb: null, pending: true },
        { key: 'points', title: '특징', thumb: null, pending: true },
      ]}
      onPress={onPress}
      onMore={jest.fn()}
      onReorder={onReorder}
    />
  );
  expect(screen.getByText('인트로')).toBeTruthy();
  expect(screen.getByText('특징')).toBeTruthy();
  expect(screen.queryByLabelText('더보기')).toBeNull();
  const row = screen.getByLabelText('특징');
  expect(row.props.onPress).toBeUndefined();
  expect(row.props.onClick).toBeUndefined();
  expect(row.props.accessibilityActions).toBeUndefined();
  await fireEvent(screen.getByLabelText('인트로'), 'accessibilityAction', {
    nativeEvent: { actionName: 'increment' },
  });
  expect(onPress).not.toHaveBeenCalledWith('points');
  expect(onReorder).not.toHaveBeenCalled();
});

it('pending rows show a given thumb and wait for the rest', async () => {
  await render(
    <SectionBoard
      items={[
        {
          key: 'intro',
          title: '인트로',
          thumb: <View testID="cover" />,
          pending: true,
        },
        { key: 'points', title: '특징', thumb: null, pending: true },
      ]}
      onPress={jest.fn()}
      onMore={jest.fn()}
      onReorder={jest.fn()}
    />
  );
  expect(screen.getAllByTestId('cover')).toHaveLength(1);
});

it('bar shows a check that confirms after the tools', async () => {
  const confirm = jest.fn();
  await render(
    <StudioBar
      title="인트로"
      leading="back"
      onClose={jest.fn()}
      tools={[{ key: 'undo', icon: null, label: '실행 취소' }]}
      confirm={{ label: '완료', onPress: confirm }}
    />
  );
  await fireEvent.press(screen.getByLabelText('완료'));
  expect(confirm).toHaveBeenCalled();
  expect(screen.getByLabelText('실행 취소')).toBeTruthy();
});

it('section settings show layout, color and space in one sheet', async () => {
  const onLayoutChange = jest.fn();
  const onSpaceChange = jest.fn();
  await render(
    <SectionSettings
      layout="image_top"
      layouts={DETAIL_LAYOUTS}
      onLayoutChange={onLayoutChange}
      background="#FFFFFF"
      onBackgroundChange={jest.fn()}
      space={{ top: 3, bottom: 3 }}
      onSpaceChange={onSpaceChange}
    />
  );
  expect(screen.queryByText('배치')).toBeNull();
  expect(screen.queryByText('사진 위 · 글 아래')).toBeNull();
  expect(
    screen.getByLabelText('사진 위 · 글 아래').props.accessibilityState
  ).toMatchObject({ selected: true });
  await fireEvent.press(screen.getByLabelText('나란히'));
  expect(onLayoutChange).toHaveBeenCalledWith('side');
  expect(
    screen.getByLabelText('여백 보통').props.accessibilityState
  ).toMatchObject({ selected: true });
  await fireEvent.press(screen.getByLabelText('여백 넓게'));
  expect(onSpaceChange).toHaveBeenCalledWith({ top: 6, bottom: 6 });
});

it('rewrite tray shows one cost over the request tools', async () => {
  const onPick = jest.fn();
  await render(
    <RewriteTray
      cost={50}
      items={[
        { value: 'short', label: '더 짧게', icon: MinusGlyph },
        { value: 'long', label: '더 자세히', icon: PlusGlyph },
      ]}
      onPick={onPick}
    />
  );
  expect(screen.getAllByText('50')).toHaveLength(1);
  expect(screen.queryByLabelText('직접 고치기')).toBeNull();
  await fireEvent.press(screen.getByLabelText('더 자세히'));
  expect(onPick).toHaveBeenCalledWith('long');
});

it('format panel hides the tabs for a single tab', async () => {
  const props = {
    value: {},
    onChange: jest.fn(),
    tab: 'font' as const,
    onTabChange: jest.fn(),
  };
  const view = await render(<TextFormatPanel {...props} tabs={['font']} />);
  expect(screen.queryByText('글꼴')).toBeNull();
  await view.rerender(
    <TextFormatPanel
      {...props}
      tab="spacing"
      tabs={['spacing', 'align', 'effect']}
    />
  );
  expect(screen.getByText('간격')).toBeTruthy();
  expect(screen.getByText('효과')).toBeTruthy();
  expect(screen.queryByText('글꼴')).toBeNull();
});

it('steps fill the finished step and half of the current one', async () => {
  await render(
    <StudioSteps
      steps={[
        { key: 'writing', label: '글 쓰기' },
        { key: 'composing', label: '구획 만들기' },
      ]}
      current="composing"
    />
  );
  const bar = screen.getByRole('progressbar');
  expect(bar.props.accessibilityLabel).toBe('구획 만들기');
  expect(bar.props.accessibilityValue).toMatchObject({ now: 1, max: 2 });
});
