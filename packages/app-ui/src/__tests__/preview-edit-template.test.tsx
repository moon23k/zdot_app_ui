import { fireEvent, render, screen } from '@testing-library/react-native';
import { Button as RNButton, StyleSheet, Text } from 'react-native';
import {
  ButtonArt,
  ButtonGlyph,
  ChoiceChips,
  FieldArt,
  FoldArt,
  FormThumb,
  MailGlyph,
  TicketGlyph,
  CloseGlyph,
  FooterArt,
  OverlayGlyph,
  PlacementArt,
  PlacementThumb,
  PositionGlyph,
  ResizeGlyph,
  ColumnsArt,
  ColumnsGlyph,
  LevelsArt,
  PageHeader,
  PreviewEditTemplate,
  RatioArt,
  SampleArt,
  SlashArt,
  SortGlyph,
  TagGlyph,
  ToastProvider,
  TwoColumnsGlyph,
  useToast,
} from '../index';

const tools = [
  { key: 'columns', label: '한 줄 개수', icon: ColumnsGlyph },
  { key: 'sort', label: '정렬', icon: SortGlyph },
];

function setup(over: Partial<Parameters<typeof PreviewEditTemplate>[0]> = {}) {
  const props = {
    title: '상품 진열',
    saveAction: { label: '저장', onPress: jest.fn() },
    onBack: jest.fn(),
    device: 'web' as const,
    onDeviceChange: jest.fn(),
    onToolChange: jest.fn(),
    onCompareChange: jest.fn(),
    tools,
    tool: 'columns',
    children: <Text>미리보기</Text>,
    ...over,
  };
  return { props, view: render(<PreviewEditTemplate {...props} />) };
}

describe('PreviewEditTemplate', () => {
  it('shows the title, preview, device notes and the selected tool', async () => {
    const { view } = setup({ deviceNotes: { web: '4개', mobile: '2개' } });
    await view;
    expect(screen.getByText('상품 진열')).toBeTruthy();
    expect(screen.getByText('미리보기')).toBeTruthy();
    expect(screen.getByText('4개')).toBeTruthy();
    expect(
      screen.getByRole('tab', { name: '웹 4개' }).props.accessibilityState
    ).toMatchObject({ selected: true });
    expect(
      screen.getByRole('tab', { name: '한 줄 개수' }).props.accessibilityState
    ).toMatchObject({ selected: true });
  });

  it('switches device and tool, goes back and saves', async () => {
    const { props, view } = setup();
    await view;
    await fireEvent.press(screen.getByRole('tab', { name: '웹' }));
    await fireEvent.press(screen.getByRole('tab', { name: '모바일' }));
    expect(props.onDeviceChange).toHaveBeenCalledTimes(1);
    expect(props.onDeviceChange).toHaveBeenCalledWith('mobile');
    await fireEvent.press(screen.getByRole('tab', { name: '한 줄 개수' }));
    await fireEvent.press(screen.getByRole('tab', { name: '정렬' }));
    expect(props.onToolChange).toHaveBeenCalledTimes(1);
    expect(props.onToolChange).toHaveBeenCalledWith('sort');
    await fireEvent.press(screen.getByLabelText('뒤로'));
    expect(props.onBack).toHaveBeenCalledTimes(1);
    await fireEvent.press(screen.getByRole('button', { name: '저장' }));
    expect(props.saveAction.onPress).toHaveBeenCalledTimes(1);
  });

  it('holds compare only while pressed and marks the button meanwhile', async () => {
    const { props, view } = setup();
    await view;
    const button = () => screen.getByRole('button', { name: '원래와 비교' });
    expect(button().props.accessibilityState).toMatchObject({
      selected: false,
    });
    await fireEvent(button(), 'pressIn');
    expect(props.onCompareChange).toHaveBeenLastCalledWith(true);
    expect(button().props.accessibilityState).toMatchObject({
      selected: true,
    });
    await fireEvent(button(), 'pressOut');
    expect(props.onCompareChange).toHaveBeenLastCalledWith(false);
    expect(button().props.accessibilityState).toMatchObject({
      selected: false,
    });
  });

  it('shows toasts above the floating bar instead of over the choices', async () => {
    function Shout() {
      const toast = useToast();
      return (
        <RNButton
          title="알림"
          onPress={() => toast.show({ message: '저장했어요' })}
        />
      );
    }
    const tree = (open: boolean) => (
      <ToastProvider bottomInset={100}>
        {open ? (
          <PreviewEditTemplate
            title="상품 진열"
            saveAction={{ label: '저장', onPress: () => {} }}
            device="web"
            onDeviceChange={() => {}}
            tools={tools}
            tool="columns"
            onToolChange={() => {}}
            bottomInset={10}
          >
            <Shout />
          </PreviewEditTemplate>
        ) : null}
      </ToastProvider>
    );
    await render(tree(false));
    await screen.rerender(tree(true));
    await fireEvent.press(screen.getByText('알림'));
    expect(screen.getAllByText('저장했어요')).toHaveLength(1);
    let node = screen.getByText('저장했어요').parent;
    let bottom: unknown;
    while (node && bottom === undefined) {
      bottom = StyleSheet.flatten(node.props.style)?.bottom;
      node = node.parent;
    }
    expect(bottom).toBe(10 + 16 + 12);
  });

  it('dims a disabled tool and ignores presses on it', async () => {
    const { props, view } = setup({
      tools: [
        { key: 'position', label: '위치', icon: PositionGlyph },
        { key: 'size', label: '크기', icon: ResizeGlyph, disabled: true },
        { key: 'close', label: '닫기 문구', icon: CloseGlyph },
      ],
      tool: 'position',
    });
    await view;
    expect(
      screen.getByRole('tab', { name: '크기' }).props.accessibilityState
    ).toMatchObject({ disabled: true });
    await fireEvent.press(screen.getByRole('tab', { name: '크기' }));
    expect(props.onToolChange).not.toHaveBeenCalled();
    await fireEvent.press(screen.getByRole('tab', { name: '닫기 문구' }));
    expect(props.onToolChange).toHaveBeenCalledWith('close');
  });

  it('marks the selected choice tile and presses others', async () => {
    const pick = jest.fn();
    const { view } = setup({
      choices: [
        { key: '3', label: '3개', selected: false, onPress: pick },
        { key: '4', label: '4개', selected: true, onPress: () => {} },
      ],
    });
    await view;
    expect(
      screen.getByRole('button', { name: '4개' }).props.accessibilityState
    ).toMatchObject({ selected: true });
    await fireEvent.press(screen.getByRole('button', { name: '3개' }));
    expect(pick).toHaveBeenCalledTimes(1);
  });

  it('shows a custom tray instead of tiles and blocks save while disabled', async () => {
    const save = jest.fn();
    const { view } = setup({
      saveAction: { label: '저장', onPress: save, disabled: true },
      choices: [{ key: 'a', label: '타일', selected: true, onPress: () => {} }],
      tray: <Text>칩 줄</Text>,
    });
    await view;
    expect(screen.getByText('칩 줄')).toBeTruthy();
    expect(screen.queryByText('타일')).toBeNull();
    await fireEvent.press(screen.getByRole('button', { name: '저장' }));
    expect(save).not.toHaveBeenCalled();
  });
});

describe('choice art and framed header action', () => {
  it('draws the art pieces', async () => {
    await render(
      <>
        <ColumnsArt count={3} color="red" />
        <RatioArt width={4} height={5} color="red" />
        <LevelsArt levels={[1, 2, 3]} color="red" />
        <SampleArt text="20%" strike color="red" />
        <SlashArt color="red" />
        <PlacementArt spot="center" color="red" />
        <PlacementArt spot="corner" scale={1.2} dim color="red" />
        <PlacementArt spot="band" color="red" />
        <PlacementThumb spot="center" />
        <FooterArt text color="red" />
        <FooterArt text={false} color="red" />
        <PositionGlyph color="red" size={20} />
        <ResizeGlyph color="red" size={20} />
        <OverlayGlyph color="red" size={20} />
        <TagGlyph color="red" size={20} />
        <TwoColumnsGlyph color="red" size={20} />
        <FieldArt shown color="red" />
        <FieldArt shown={false} color="red" />
        <FoldArt open color="red" />
        <FoldArt open={false} color="red" />
        <ButtonArt text={0.7} color="red" />
        <ButtonArt text={2} color="red" />
        <FormThumb />
        <MailGlyph color="red" size={20} />
        <TicketGlyph color="red" size={20} />
        <ButtonGlyph color="red" size={20} />
      </>
    );
    expect(screen.getByText('20%')).toBeTruthy();
  });

  it('toggles choice chips and marks the selected ones', async () => {
    const door = jest.fn();
    const box = jest.fn();
    await render(
      <ChoiceChips
        items={[
          {
            key: 'door',
            label: '문 앞에 놓아 주세요',
            selected: true,
            onPress: door,
          },
          {
            key: 'box',
            label: '택배함에 넣어 주세요',
            selected: false,
            onPress: box,
          },
          {
            key: 'off',
            label: '직접 입력',
            selected: false,
            disabled: true,
            onPress: box,
          },
        ]}
      />
    );
    expect(
      screen.getByRole('checkbox', { name: '문 앞에 놓아 주세요' }).props
        .accessibilityState
    ).toMatchObject({ checked: true });
    expect(
      screen.getByRole('checkbox', { name: '택배함에 넣어 주세요' }).props
        .accessibilityState
    ).toMatchObject({ checked: false });
    await fireEvent.press(
      screen.getByRole('checkbox', { name: '택배함에 넣어 주세요' })
    );
    await fireEvent.press(
      screen.getByRole('checkbox', { name: '문 앞에 놓아 주세요' })
    );
    await fireEvent.press(screen.getByRole('checkbox', { name: '직접 입력' }));
    expect(box).toHaveBeenCalledTimes(1);
    expect(door).toHaveBeenCalledTimes(1);
  });

  it('shows the framed action with its label and presses it', async () => {
    const onPress = jest.fn();
    await render(
      <PageHeader
        title="상품"
        action={{ icon: ColumnsGlyph, label: '진열', framed: true, onPress }}
      />
    );
    expect(screen.getByText('진열')).toBeTruthy();
    await fireEvent.press(screen.getByRole('button', { name: '진열' }));
    expect(onPress).toHaveBeenCalledTimes(1);
  });
});
