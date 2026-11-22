import { act, fireEvent, render, screen } from '@testing-library/react-native';
import { Text } from 'react-native';
import {
  AdjustTemplate,
  AxisDial,
  AxisDialGroup,
  ColorAdjustNote,
  ColorTrack,
  DialStrip,
  FontControls,
  hexToHsl,
  hslToHex,
  ScrubRuler,
} from '../adjust';

describe('hsl helpers', () => {
  it('round-trips', () => {
    expect(hslToHex(0, 100, 50)).toBe('#FF0000');
    const [h, s, l] = hexToHsl('#4D291C');
    expect(hslToHex(h, s, l)).toBe('#4D291C');
  });
});

describe('DialStrip', () => {
  it('shows signed values and selects', async () => {
    const onSelect = jest.fn();
    await render(
      <DialStrip
        items={[
          { key: 'a', label: '온도', value: -1 },
          { key: 'b', label: '활기', value: 2 },
          { key: 'c', label: '대표 색', color: '#336699' },
        ]}
        selected="a"
        onSelect={onSelect}
      />
    );
    expect(screen.getByText('+2')).toBeTruthy();
    await fireEvent.press(screen.getByLabelText('활기 +2'));
    expect(onSelect).toHaveBeenCalledWith('b');
  });
});

describe('DialStrip percent', () => {
  it('shows 0 to 100 values without signs', async () => {
    const onSelect = jest.fn();
    await render(
      <DialStrip
        percent
        items={[
          { key: 'a', label: '색감', value: 86 },
          { key: 'b', label: '모양', value: 32 },
        ]}
        selected="a"
        onSelect={onSelect}
      />
    );
    expect(screen.getByText('86')).toBeTruthy();
    expect(screen.queryByText('+2')).toBeNull();
    await fireEvent.press(screen.getByLabelText('모양 32'));
    expect(onSelect).toHaveBeenCalledWith('b');
  });
});

describe('AxisDial', () => {
  it('shows the number and word and steps by five inside 0 to 100', async () => {
    const onChange = jest.fn();
    await render(
      <AxisDial
        value={98}
        onChange={onChange}
        startLabel="은은한"
        endLabel="강한"
        accessibilityLabel="존재감"
      />
    );
    const dial = screen.getByLabelText('존재감');
    expect(dial.props.accessibilityValue).toEqual({
      min: 0,
      max: 100,
      now: 98,
      text: '98 강한',
    });
    await fireEvent(dial, 'accessibilityAction', {
      nativeEvent: { actionName: 'increment' },
    });
    expect(onChange).toHaveBeenLastCalledWith(100);
    await fireEvent(dial, 'accessibilityAction', {
      nativeEvent: { actionName: 'decrement' },
    });
    expect(onChange).toHaveBeenLastCalledWith(93);
  });

  it('names the middle with the center label', async () => {
    await render(
      <AxisDial
        value={50}
        onChange={jest.fn()}
        startLabel="은은한"
        endLabel="강한"
        accessibilityLabel="존재감"
      />
    );
    expect(screen.getByLabelText('존재감').props.accessibilityValue.text).toBe(
      '50 중간'
    );
  });
});

describe('AxisDialGroup', () => {
  it('switches the dial to the picked axis and reports its key', async () => {
    const onChange = jest.fn();
    await render(
      <AxisDialGroup
        items={[
          { key: 'a', label: '색감', startLabel: '시원한', endLabel: '따뜻한' },
          {
            key: 'b',
            label: '움직임',
            startLabel: '차분한',
            endLabel: '활기찬',
          },
        ]}
        values={{ a: 74, b: 20 }}
        onChange={onChange}
      />
    );
    expect(screen.getByLabelText('색감').props.accessibilityValue.text).toBe(
      '74 따뜻한'
    );
    await fireEvent.press(screen.getByLabelText('움직임 20'));
    const dial = screen.getByLabelText('움직임');
    expect(dial.props.accessibilityValue.text).toBe('20 차분한');
    await fireEvent(dial, 'accessibilityAction', {
      nativeEvent: { actionName: 'increment' },
    });
    expect(onChange).toHaveBeenLastCalledWith('b', 25);
  });
});

describe('ScrubRuler', () => {
  it('steps with accessibility actions inside range', async () => {
    const onChange = jest.fn();
    await render(
      <ScrubRuler
        value={2}
        onChange={onChange}
        accessibilityLabel="온도"
        startLabel="차가운"
        endLabel="따뜻한"
      />
    );
    const ruler = screen.getByLabelText('온도');
    await act(() =>
      ruler.props.onAccessibilityAction({
        nativeEvent: { actionName: 'increment' },
      })
    );
    expect(onChange).toHaveBeenLastCalledWith(2);
    await act(() =>
      ruler.props.onAccessibilityAction({
        nativeEvent: { actionName: 'decrement' },
      })
    );
    expect(onChange).toHaveBeenLastCalledWith(1);
    expect(screen.getByText('차가운')).toBeTruthy();
  });
});

describe('ColorTrack', () => {
  it('adjusts by accessibility steps', async () => {
    const onChange = jest.fn();
    await render(
      <ColorTrack
        kind="hue"
        hue={355}
        saturation={80}
        onChange={onChange}
        label="색상"
      />
    );
    const track = screen.getByLabelText('색상');
    await act(() =>
      track.props.onAccessibilityAction({
        nativeEvent: { actionName: 'increment' },
      })
    );
    expect(onChange).toHaveBeenLastCalledWith(360);
  });
});

describe('ColorAdjustNote', () => {
  it('announces title and detail', async () => {
    await render(
      <ColorAdjustNote
        original="#FFD400"
        applied="#8A7400"
        title="명도 자동 조정"
        detail="바탕 대비 3.1:1"
      />
    );
    expect(
      screen.getByLabelText('명도 자동 조정, 바탕 대비 3.1:1')
    ).toBeTruthy();
  });
});

describe('AdjustTemplate', () => {
  it('reports compare press and runs primary action', async () => {
    const onCompare = jest.fn();
    const onPress = jest.fn();
    await render(
      <AdjustTemplate
        preview={<Text>미리보기</Text>}
        label="온도 -1"
        onCompareChange={onCompare}
        controls={<Text>조정</Text>}
        primaryAction={{ label: '사이트에 반영', onPress }}
      />
    );
    await fireEvent(screen.getByLabelText('원래와 비교'), 'pressIn');
    expect(onCompare).toHaveBeenCalledWith(true);
    await fireEvent(screen.getByLabelText('원래와 비교'), 'pressOut');
    expect(onCompare).toHaveBeenLastCalledWith(false);
    await fireEvent.press(screen.getByText('사이트에 반영'));
    expect(onPress).toHaveBeenCalled();
  });
});

describe('FontControls', () => {
  const sets = [
    { value: 'gothic', label: '고딕' },
    { value: 'hand', label: '손글씨' },
  ];
  const levels = [{ key: 'title', label: '제목', bold: true, italic: false }];

  it('picks a set and toggles a level style', async () => {
    const onSelect = jest.fn();
    const onToggle = jest.fn();
    await render(
      <FontControls
        sets={sets}
        selected="gothic"
        onSelect={onSelect}
        levels={levels}
        onToggle={onToggle}
      />
    );
    await fireEvent.press(screen.getByText('손글씨'));
    await fireEvent.press(screen.getByLabelText('제목 굵게'));
    await fireEvent.press(screen.getByLabelText('제목 기울임'));
    expect(onSelect).toHaveBeenCalledWith('hand');
    expect(onToggle).toHaveBeenCalledWith('title', 'bold');
    expect(onToggle).toHaveBeenCalledWith('title', 'italic');
  });

  it('blocks italic when the set has none', async () => {
    const onToggle = jest.fn();
    await render(
      <FontControls
        sets={sets}
        selected="hand"
        onSelect={jest.fn()}
        levels={levels}
        italicAvailable={false}
        onToggle={onToggle}
      />
    );
    await fireEvent.press(screen.getByLabelText('제목 기울임'));
    expect(onToggle).not.toHaveBeenCalled();
  });
});
