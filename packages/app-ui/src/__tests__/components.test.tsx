import { act, fireEvent, render, screen } from '@testing-library/react-native';
import { StyleSheet } from 'react-native';
import {
  Button,
  defaultThemes,
  FINISH_HOLD,
  useFinish,
  Calendar,
  Checkbox,
  Dialog,
  EmptyState,
  FloatingTabBar,
  formatPrice,
  SegmentedTabs,
  Switch,
  ToastProvider,
  useToast,
  Field,
  ListRow,
  ScanGlyph,
  Slider,
} from '../index';

describe('Button', () => {
  it('does not fire onPress while loading or disabled', async () => {
    const onPress = jest.fn();
    await render(
      <>
        <Button onPress={onPress} loading>
          로딩
        </Button>
        <Button onPress={onPress} disabled>
          비활성
        </Button>
      </>
    );
    await fireEvent.press(screen.getByText('로딩'));
    await fireEvent.press(screen.getByText('비활성'));
    expect(onPress).not.toHaveBeenCalled();
  });

  it('greys out a disabled primary button without dimming it', async () => {
    const { disabledSurface, disabledForeground } = defaultThemes.light.colors;
    await render(
      <Button onPress={jest.fn()} disabled>
        다음
      </Button>
    );
    const face = StyleSheet.flatten(screen.getByRole('button').props.style);
    expect(face.backgroundColor).toBe(disabledSurface);
    expect(face.opacity).toBeUndefined();
    expect(screen.getByText('다음')).toHaveStyle({ color: disabledForeground });
  });

  it('fills a small primary button', async () => {
    const { primary, primaryForeground } = defaultThemes.light.colors;
    await render(
      <Button size="sm" onPress={jest.fn()}>
        완료
      </Button>
    );
    const face = StyleSheet.flatten(screen.getByRole('button').props.style);
    expect(face.backgroundColor).toBe(primary);
    expect(screen.getByText('완료')).toHaveStyle({ color: primaryForeground });
  });

  it('keeps the disabled state for assistive tech while it can be nudged', async () => {
    await render(
      <Button onPress={jest.fn()} disabled>
        다음
      </Button>
    );
    expect(screen.getByRole('button')).toBeDisabled();
  });

  it('moves on only after the finish hold', async () => {
    jest.useFakeTimers();
    const next = jest.fn();
    function Finish() {
      const { done, finish } = useFinish();
      return (
        <Button done={done} onPress={() => finish(next)}>
          발송 처리
        </Button>
      );
    }
    await render(<Finish />);
    await fireEvent.press(screen.getByText('발송 처리'));
    await act(() => jest.advanceTimersByTime(FINISH_HOLD - 1));
    expect(next).not.toHaveBeenCalled();
    await act(() => jest.advanceTimersByTime(1));
    expect(next).toHaveBeenCalledTimes(1);
    jest.useRealTimers();
  });
});

describe('Checkbox', () => {
  it('reports the toggled value', async () => {
    const onValueChange = jest.fn();
    await render(
      <Checkbox value={false} onValueChange={onValueChange} label="약관 동의" />
    );
    await fireEvent.press(screen.getByRole('checkbox'));
    expect(onValueChange).toHaveBeenCalledWith(true);
  });
});

describe('Switch', () => {
  it('reports the new value', async () => {
    const onValueChange = jest.fn();
    await render(
      <Switch
        value={false}
        onValueChange={onValueChange}
        accessibilityLabel="알림"
      />
    );
    await fireEvent(screen.getByLabelText('알림'), 'valueChange', true);
    expect(onValueChange).toHaveBeenCalledWith(true);
  });
});

describe('formatPrice', () => {
  it.each([
    [0, '0원'],
    [999, '999원'],
    [35000, '35,000원'],
    [1280000.4, '1,280,000원'],
    [-4500, '-4,500원'],
  ])('%p → %s', (value, expected) => {
    expect(formatPrice(value)).toBe(expected);
  });
});

describe('Dialog', () => {
  it('calls onConfirm and closes on cancel', async () => {
    const onConfirm = jest.fn();
    const onOpenChange = jest.fn();
    await render(
      <Dialog
        open
        onOpenChange={onOpenChange}
        title="삭제할까요?"
        onConfirm={onConfirm}
        confirmLabel="삭제"
      />
    );
    await fireEvent.press(screen.getByText('삭제'));
    expect(onConfirm).toHaveBeenCalledTimes(1);
    await fireEvent.press(screen.getByText('취소'));
    expect(onOpenChange).toHaveBeenCalledWith(false);
  });
});

describe('SegmentedTabs', () => {
  it('reports the pressed tab only when it changes', async () => {
    const onValueChange = jest.fn();
    await render(
      <SegmentedTabs
        items={[
          { value: 'day', label: '오늘' },
          { value: 'week', label: '이번 주' },
        ]}
        value="day"
        onValueChange={onValueChange}
      />
    );
    await fireEvent.press(screen.getByText('오늘'));
    await fireEvent.press(screen.getByText('이번 주'));
    expect(onValueChange).toHaveBeenCalledTimes(1);
    expect(onValueChange).toHaveBeenCalledWith('week');
  });
});

describe('FloatingTabBar', () => {
  const items = [
    { key: 'home', label: '홈', icon: 'home' },
    { key: 'orders', label: '주문', icon: 'orders', badge: '신규 주문 1건' },
  ] as const;

  it('reports the pressed tab only when it changes', async () => {
    const onValueChange = jest.fn();
    await render(
      <FloatingTabBar
        items={items}
        value="home"
        onValueChange={onValueChange}
      />
    );
    await fireEvent.press(screen.getByLabelText('홈'));
    await fireEvent.press(screen.getByLabelText('주문, 신규 주문 1건'));
    expect(onValueChange).toHaveBeenCalledTimes(1);
    expect(onValueChange).toHaveBeenCalledWith('orders');
  });

  it('marks the selected tab and shows a dot only for badged tabs', async () => {
    await render(
      <FloatingTabBar items={items} value="home" onValueChange={() => {}} />
    );
    expect(screen.getByLabelText('홈').props.accessibilityState).toMatchObject({
      selected: true,
    });
    expect(screen.getAllByTestId('tab-badge')).toHaveLength(1);
  });
});

describe('Toast', () => {
  beforeEach(() => jest.useFakeTimers());
  afterEach(() => jest.useRealTimers());

  function Trigger() {
    const toast = useToast();
    return (
      <Button onPress={() => toast.show({ message: '저장했어요' })}>
        저장
      </Button>
    );
  }

  it('shows a message and hides it after the duration', async () => {
    await render(
      <ToastProvider>
        <Trigger />
      </ToastProvider>
    );
    await fireEvent.press(screen.getByText('저장'));
    expect(screen.getByText('저장했어요')).toBeTruthy();
    await act(async () => {
      jest.advanceTimersByTime(2500);
    });
    await act(async () => {
      jest.advanceTimersByTime(defaultThemes.light.motion.duration.short);
    });
    expect(screen.queryByText('저장했어요')).toBeNull();
  });
});

describe('EmptyState', () => {
  it('announces errors and shows one action', async () => {
    const onPress = jest.fn();
    await render(
      <EmptyState
        variant="error"
        title="리뷰를 불러오지 못했어요"
        action={{ label: '다시 불러오기', onPress }}
      />
    );
    expect(screen.toJSON()).toMatchObject({
      props: { accessibilityRole: 'alert' },
    });
    await fireEvent.press(screen.getByText('다시 불러오기'));
    expect(onPress).toHaveBeenCalledTimes(1);
  });

  it('renders the section variant action as a link', async () => {
    await render(
      <EmptyState
        variant="section"
        title="아직 없어요"
        action={{ label: '링크 공유', onPress: () => {} }}
      />
    );
    expect(screen.getByRole('link')).toBeTruthy();
  });
});

describe('Calendar', () => {
  const days = ['2026-11-06', '2026-11-07', '2026-11-08', '2026-11-09'].map(
    (date, i) => ({
      date,
      label: '12만',
      disabled: i === 2,
    })
  );

  it('ends a range on a closed night but not across one', async () => {
    const onValueChange = jest.fn();
    const view = await render(
      <Calendar
        days={days}
        mode="range"
        value={{ start: '2026-11-06' }}
        onValueChange={onValueChange}
      />
    );
    await fireEvent.press(screen.getByLabelText('11월 8일 일요일 12만'));
    expect(onValueChange).toHaveBeenLastCalledWith({
      start: '2026-11-06',
      end: '2026-11-08',
    });
    await view.rerender(
      <Calendar
        days={days}
        mode="range"
        value={{ start: '2026-11-06' }}
        onValueChange={onValueChange}
      />
    );
    await fireEvent.press(screen.getByLabelText('11월 9일 월요일 12만'));
    expect(onValueChange).toHaveBeenLastCalledWith({ start: '2026-11-09' });
  });

  it('clears a lone start when it is pressed again', async () => {
    const onValueChange = jest.fn();
    await render(
      <Calendar
        days={days}
        mode="range"
        value={{ start: '2026-11-06' }}
        onValueChange={onValueChange}
      />
    );
    await fireEvent.press(screen.getByLabelText('11월 6일 금요일 12만'));
    expect(onValueChange).toHaveBeenLastCalledWith({});
  });
});

describe('selection and trailing action', () => {
  it('marks list rows as radio or checkbox', async () => {
    const onPress = jest.fn();
    await render(
      <>
        <ListRow
          title="상품 품절"
          selection="radio"
          selected
          onPress={onPress}
        />
        <ListRow title="전체 선택" selection="check" onPress={onPress} />
      </>
    );
    expect(screen.getByRole('radio', { checked: true })).toBeTruthy();
    expect(screen.getByRole('checkbox', { checked: false })).toBeTruthy();
    await fireEvent.press(screen.getByText('상품 품절'));
    expect(onPress).toHaveBeenCalledTimes(1);
  });

  it('keeps the trailing action available beside an error', async () => {
    const onScan = jest.fn();
    await render(
      <Field
        label="송장 번호"
        error="숫자만 입력해 주세요"
        trailing={ScanGlyph}
        onTrailingPress={onScan}
        trailingLabel="송장 스캔"
      />
    );
    await fireEvent.press(screen.getByLabelText('송장 스캔'));
    expect(onScan).toHaveBeenCalledTimes(1);
  });

  it('shows the dialog description', async () => {
    await render(
      <Dialog
        open
        onOpenChange={() => {}}
        title="주문을 취소할까요?"
        description="취소하면 되돌릴 수 없어요."
        onConfirm={() => {}}
      />
    );
    expect(screen.getByText('취소하면 되돌릴 수 없어요.')).toBeTruthy();
  });
});

describe('Slider', () => {
  it('moves by fractions and stays within range', async () => {
    const onChange = jest.fn();
    const onSlidingStart = jest.fn();
    await render(
      <Slider
        value={1.95}
        min={-2}
        max={2}
        onChange={onChange}
        onSlidingStart={onSlidingStart}
        accessibilityLabel="온도"
      />
    );
    const slider = screen.getByLabelText('온도');
    await fireEvent(slider, 'accessibilityAction', {
      nativeEvent: { actionName: 'decrement' },
    });
    expect(onChange).toHaveBeenLastCalledWith(expect.closeTo(1.55, 5));
    await fireEvent(slider, 'accessibilityAction', {
      nativeEvent: { actionName: 'increment' },
    });
    expect(onChange).toHaveBeenLastCalledWith(2);
    expect(onSlidingStart).toHaveBeenCalledTimes(2);
  });
  it('fills from zero and marks it when the range spans both sides', async () => {
    await render(
      <Slider
        value={-2}
        min={-5}
        max={10}
        onChange={jest.fn()}
        accessibilityLabel="자간"
      />
    );
    await fireEvent(screen.getByLabelText('자간'), 'layout', {
      nativeEvent: { layout: { width: 328 } },
    });
    const fill = StyleSheet.flatten(
      screen.getByTestId('slider-fill').props.style
    );
    expect(fill.left).toBeCloseTo(74);
    expect(fill.width).toBeCloseTo(40);
    expect(screen.getByTestId('slider-origin')).toBeTruthy();
  });

  it('fills from the start without a mark when zero is an end', async () => {
    await render(
      <Slider
        value={5}
        min={0}
        max={10}
        onChange={jest.fn()}
        accessibilityLabel="위 여백"
      />
    );
    await fireEvent(screen.getByLabelText('위 여백'), 'layout', {
      nativeEvent: { layout: { width: 328 } },
    });
    const fill = StyleSheet.flatten(
      screen.getByTestId('slider-fill').props.style
    );
    expect(fill.left).toBe(0);
    expect(fill.width).toBeCloseTo(164);
    expect(screen.queryByTestId('slider-origin')).toBeNull();
  });
});
