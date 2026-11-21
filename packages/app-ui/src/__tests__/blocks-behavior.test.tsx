import { fireEvent, render, screen } from '@testing-library/react-native';
import { StyleSheet } from 'react-native';
import {
  defaultThemes,
  OrderBlock,
  PaletteLegend,
  PaletteThumbs,
  QuestionAccordion,
  QuestionPager,
  SliderList,
  StageBar,
} from '../index';

describe('OrderBlock', () => {
  it('reads as a checkbox while picking and reports long press', async () => {
    const onLongPress = jest.fn();
    await render(
      <OrderBlock
        title="머그컵"
        meta="1개"
        amount="12,000원"
        selected
        onPress={() => {}}
        onLongPress={onLongPress}
      />
    );
    const row = screen.getByRole('checkbox');
    expect(row.props.accessibilityState).toMatchObject({ checked: true });
    await fireEvent(row, 'longPress');
    expect(onLongPress).toHaveBeenCalledTimes(1);
  });

  it('reads as a button outside picking', async () => {
    await render(
      <OrderBlock
        title="머그컵"
        meta="1개"
        amount="12,000원"
        onPress={() => {}}
      />
    );
    expect(
      screen.getByRole('button', { name: '머그컵, 1개, 12,000원' })
    ).toBeTruthy();
  });
});

describe('StageBar', () => {
  const items = [
    { value: 'paid', label: '신규', count: 2 },
    { value: 'preparing', label: '배송 준비', count: 0 },
  ] as const;

  it('clears the filter when the chosen stage is pressed again', async () => {
    const onValueChange = jest.fn();
    await render(
      <StageBar items={items} value="paid" onValueChange={onValueChange} />
    );
    await fireEvent.press(screen.getByLabelText('신규 2'));
    expect(onValueChange).toHaveBeenLastCalledWith(null);
    await fireEvent.press(screen.getByLabelText('배송 준비 0'));
    expect(onValueChange).toHaveBeenLastCalledWith('preparing');
  });
});

describe('QuestionAccordion', () => {
  const section = {
    key: 'mood',
    label: '분위기',
    question: '어떤 분위기인가요?',
    options: [
      { value: 'a', label: '따뜻한' },
      { value: 'b', label: '차분한' },
      { value: 'c', label: '활기찬' },
    ],
    value: ['a', 'b'],
    max: 2,
  };

  it('does not add past max but still removes', async () => {
    const onValueChange = jest.fn();
    await render(
      <QuestionAccordion
        sections={[section]}
        openKey="mood"
        onOpenChange={() => {}}
        onValueChange={onValueChange}
      />
    );
    await fireEvent.press(screen.getByLabelText('활기찬'));
    expect(onValueChange).toHaveBeenLastCalledWith('mood', ['a', 'b']);
    await fireEvent.press(screen.getByLabelText('따뜻한'));
    expect(onValueChange).toHaveBeenLastCalledWith('mood', ['b']);
  });
});

describe('SliderList', () => {
  const items = [
    {
      key: 'temperature',
      label: '색감',
      startLabel: '시원한',
      endLabel: '따뜻한',
    },
    {
      key: 'energy',
      label: '움직임',
      startLabel: '차분한',
      endLabel: '활기찬',
    },
  ];
  const { foreground, mutedForeground } = defaultThemes.light.colors;

  it('emphasizes only the end the value leans to', async () => {
    await render(
      <SliderList
        items={items}
        values={{ temperature: 0.8, energy: 0 }}
        min={-2}
        max={2}
        onChange={() => {}}
      />
    );
    expect(screen.getByText('따뜻한')).toHaveStyle({
      color: foreground,
      fontWeight: '600',
    });
    expect(screen.getByText('시원한')).toHaveStyle({ color: mutedForeground });
    expect(screen.getByText('차분한')).toHaveStyle({ color: mutedForeground });
    expect(screen.getByText('활기찬')).toHaveStyle({ color: mutedForeground });
  });

  it('reports changes by key from a full width slider', async () => {
    const onChange = jest.fn();
    await render(
      <SliderList
        items={items}
        values={{ temperature: 0, energy: 0 }}
        min={-2}
        max={2}
        onChange={onChange}
      />
    );
    await fireEvent(screen.getByLabelText('움직임'), 'accessibilityAction', {
      nativeEvent: { actionName: 'increment' },
    });
    expect(onChange).toHaveBeenLastCalledWith('energy', expect.closeTo(0.4, 5));
    expect(screen.getAllByText('시원한')).toHaveLength(1);
  });
});

describe('PaletteThumbs', () => {
  const colors = {
    main: '#9D6038',
    secondary: '#F7E0CC',
    accent: '#5B2F12',
    background: '#FBF0EA',
    text: '#1E130E',
  };
  const items = [
    { key: 'tonal', label: '톤 온 톤', colors },
    { key: 'analogous', label: '유사색', colors },
    { key: 'complementary', label: '보색', colors },
  ] as const;
  const { mutedForeground } = defaultThemes.light.colors;

  it('keeps order and marks only the chosen palette', async () => {
    await render(
      <PaletteThumbs items={items} value="analogous" onValueChange={() => {}} />
    );
    const radios = screen.getAllByRole('radio');
    expect(radios.map((radio) => radio.props.accessibilityLabel)).toEqual([
      '톤 온 톤',
      '유사색',
      '보색',
    ]);
    expect(radios[1]!.props.accessibilityState).toMatchObject({
      checked: true,
    });
    expect(radios[0]!.props.accessibilityState).toMatchObject({
      checked: false,
    });
    expect(screen.getByText('유사색')).toHaveStyle({ fontWeight: '600' });
    expect(screen.getByText('보색')).toHaveStyle({ color: mutedForeground });
  });

  it('reports the pressed palette', async () => {
    const onValueChange = jest.fn();
    await render(
      <PaletteThumbs
        items={items}
        value="tonal"
        onValueChange={onValueChange}
      />
    );
    await fireEvent.press(screen.getByRole('radio', { name: '보색' }));
    expect(onValueChange).toHaveBeenLastCalledWith('complementary');
  });

  it('labels legend roles in muted text of at least 14px', async () => {
    await render(
      <PaletteLegend
        items={[
          { key: 'main', label: '메인', color: colors.main },
          { key: 'text', label: '글자', color: colors.text },
        ]}
      />
    );
    expect(screen.getByText('메인')).toHaveStyle({
      color: mutedForeground,
      fontSize: 14,
    });
  });
});

describe('QuestionPager', () => {
  const question = (key: string) => ({
    key,
    label: `${key} 질문`,
    options: ['a', 'b', 'c', 'd'].map((o) => ({
      value: o,
      label: `${key}-${o}`,
    })),
  });
  const groups = [
    { key: 'g1', label: '손님', questions: [question('q1'), question('q2')] },
    { key: 'g2', label: '구매', questions: [question('q3'), question('q4')] },
  ];

  function setup(active: string, value: Record<string, string | undefined>) {
    const onValueChange = jest.fn();
    const onActiveGroupChange = jest.fn();
    const view = render(
      <QuestionPager
        groups={groups}
        value={value}
        onValueChange={onValueChange}
        activeGroup={active}
        onActiveGroupChange={onActiveGroupChange}
      />
    );
    return { view, onValueChange, onActiveGroupChange };
  }

  it('shows only the active group as one-of radios', async () => {
    const { view } = setup('g1', { q1: 'b' });
    await view;
    expect(screen.getAllByRole('radio')).toHaveLength(8);
    expect(screen.getByText('q2 질문')).toBeTruthy();
    expect(screen.queryByLabelText('q3-a')).toBeNull();
    expect(
      screen.getByRole('radio', { name: 'q1-b' }).props.accessibilityState
    ).toMatchObject({ checked: true });
    expect(
      screen.getByRole('tab', { name: '손님' }).props.accessibilityState
    ).toMatchObject({ selected: true });
  });

  it('picks one option and ignores pressing the chosen one', async () => {
    const { view, onValueChange, onActiveGroupChange } = setup('g1', {
      q1: 'b',
    });
    await view;
    await fireEvent.press(screen.getByRole('radio', { name: 'q1-b' }));
    expect(onValueChange).not.toHaveBeenCalled();
    await fireEvent.press(screen.getByRole('radio', { name: 'q1-c' }));
    expect(onValueChange).toHaveBeenLastCalledWith('q1', 'c');
    expect(onActiveGroupChange).not.toHaveBeenCalled();
  });

  it('moves to any group from the strip', async () => {
    const { view, onActiveGroupChange } = setup('g1', {});
    await view;
    await fireEvent.press(screen.getByRole('tab', { name: '구매' }));
    expect(onActiveGroupChange).toHaveBeenLastCalledWith('g2');
  });

  it('advances when the pick just completes the group', async () => {
    const { view, onValueChange, onActiveGroupChange } = setup('g1', {
      q1: 'a',
    });
    await view;
    await fireEvent.press(screen.getByRole('radio', { name: 'q2-d' }));
    expect(onValueChange).toHaveBeenLastCalledWith('q2', 'd');
    expect(onActiveGroupChange).toHaveBeenLastCalledWith('g2');
    expect(onValueChange.mock.invocationCallOrder[0]).toBeLessThan(
      onActiveGroupChange.mock.invocationCallOrder[0]!
    );
  });

  it('stays when changing an answer in a finished group', async () => {
    const { view, onValueChange, onActiveGroupChange } = setup('g1', {
      q1: 'a',
      q2: 'b',
    });
    await view;
    await fireEvent.press(screen.getByRole('radio', { name: 'q2-c' }));
    expect(onValueChange).toHaveBeenLastCalledWith('q2', 'c');
    expect(onActiveGroupChange).not.toHaveBeenCalled();
  });

  it('stays on the last group when it is completed', async () => {
    const { view, onValueChange, onActiveGroupChange } = setup('g2', {
      q1: 'a',
      q2: 'b',
      q3: 'a',
    });
    await view;
    await fireEvent.press(screen.getByRole('radio', { name: 'q4-a' }));
    expect(onValueChange).toHaveBeenLastCalledWith('q4', 'a');
    expect(onActiveGroupChange).not.toHaveBeenCalled();
  });

  it('marks a finished group that is not active', async () => {
    const { mutedForeground } = defaultThemes.light.colors;
    const { view } = setup('g1', { q3: 'a', q4: 'b' });
    await view;
    expect(screen.getByText('구매')).toHaveStyle({ color: mutedForeground });
  });

  it('sinks open tiles and lifts the picked one', async () => {
    const { recess, raised, faint } = defaultThemes.light.colors;
    const { view } = setup('g1', { q1: 'b' });
    await view;
    const flat = (name: string) =>
      StyleSheet.flatten(screen.getByRole('radio', { name }).props.style);
    expect(flat('q1-a').backgroundColor).toBe(recess);
    expect(flat('q1-b')).toMatchObject({
      backgroundColor: raised,
      boxShadow: defaultThemes.light.shadow.liftSm,
    });
    expect(screen.getByText('구매')).toHaveStyle({ color: faint });
  });
});
