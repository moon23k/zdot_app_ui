import {
  act,
  fireEvent,
  render,
  screen,
  waitFor,
} from '@testing-library/react-native';
import { useState } from 'react';
import { ColorTune, PaletteStrips, ToneSlider } from '../index';
import { mixHex } from '../utils/color';

const tones = [
  { key: 'a', color: '#FFDBD3', code: 'RR 80', name: 'PALE', label: '페일' },
  { key: 'b', color: '#F69D88', code: 'RR 65', name: 'SOFT', label: '소프트' },
  { key: 'c', color: '#C8654F', code: 'RR 50', name: 'MID', label: '미드' },
  { key: 'd', color: '#933521', code: 'RR 40', name: 'DEEP', label: '딥' },
  { key: 'e', color: '#601000', code: 'RR 32', name: 'VELVET', label: '벨벳' },
];

const palettes = [
  {
    key: 'tonal',
    label: '톤 온 톤',
    colors: {
      main: '#601000',
      secondary: '#DFAA90',
      accent: '#973100',
      background: '#FBEEE5',
      text: '#140601',
    },
  },
  {
    key: 'complementary',
    label: '보색',
    colors: {
      main: '#601000',
      secondary: '#DFAA90',
      accent: '#00504D',
      background: '#FDF7ED',
      text: '#1C1001',
    },
  },
];

const sample = {
  name: '소담',
  categories: ['전체', '컵'],
  badge: 'NEW',
  hero: { uri: 'https://example.com/hero.jpg' },
  items: [
    {
      key: 'oil',
      name: '앰버 오일 병',
      price: '24,000원',
      source: { uri: 'https://example.com/oil.jpg' },
    },
  ],
};

function touch(x: number, start: number, time: number) {
  return {
    touchHistory: {
      numberActiveTouches: 1,
      indexOfSingleActiveTouch: 0,
      mostRecentTimeStamp: time,
      touchBank: [
        {
          touchActive: true,
          startPageX: start,
          startPageY: 0,
          startTimeStamp: 0,
          currentPageX: x,
          currentPageY: 0,
          currentTimeStamp: time,
          previousPageX: start,
          previousPageY: 0,
          previousTimeStamp: 0,
        },
      ],
    },
    nativeEvent: { locationX: x, pageX: x, pageY: 0, touches: [] },
  };
}

describe('mixHex', () => {
  it('mixes two colors by share', () => {
    expect(mixHex('#000000', '#ffffff', 0.5)).toBe('#808080');
    expect(mixHex('#601000', '#933521', 0)).toBe('#601000');
    expect(mixHex('#601000', '#933521', 1)).toBe('#933521');
  });
});

describe('ToneSlider', () => {
  it('steps one color per accessibility action and speaks the name', async () => {
    const onValueChange = jest.fn();
    await render(
      <ToneSlider
        colors={tones.map((t) => t.color)}
        value={4}
        labels={tones.map((t) => t.label)}
        accessibilityLabel="톤"
        onValueChange={onValueChange}
      />
    );
    const slider = screen.getByRole('adjustable');
    expect(slider.props.accessibilityValue).toMatchObject({
      now: 4,
      max: 4,
      text: '벨벳',
    });
    await fireEvent(slider, 'accessibilityAction', {
      nativeEvent: { actionName: 'increment' },
    });
    expect(onValueChange).not.toHaveBeenCalled();
    await fireEvent(slider, 'accessibilityAction', {
      nativeEvent: { actionName: 'decrement' },
    });
    expect(onValueChange).toHaveBeenCalledWith(3);
  });

  it('follows the finger, picks the nearest color and settles', async () => {
    const onValueChange = jest.fn();
    const onScrub = jest.fn();
    await render(
      <ToneSlider
        colors={tones.map((t) => t.color)}
        value={4}
        origin={4}
        accessibilityLabel="톤"
        onValueChange={onValueChange}
        onScrub={onScrub}
      />
    );
    const slider = screen.getByRole('adjustable');
    await fireEvent(slider, 'layout', {
      nativeEvent: { layout: { width: 222, height: 44 } },
    });
    await act(() => {
      slider.props.onResponderGrant(touch(111, 111, 1));
    });
    expect(onScrub).toHaveBeenLastCalledWith(2);
    expect(onValueChange).toHaveBeenLastCalledWith(2);
    await act(() => {
      slider.props.onResponderMove(touch(171, 111, 2));
    });
    expect(onScrub.mock.calls.at(-1)?.[0]).toBeCloseTo(3.2);
    expect(onValueChange).toHaveBeenLastCalledWith(3);
    await act(() => {
      slider.props.onResponderRelease(touch(171, 111, 3));
    });
    await waitFor(() => expect(onScrub).toHaveBeenLastCalledWith(null));
    expect(onValueChange).toHaveBeenCalledTimes(2);
  });
});

describe('ColorTune', () => {
  function Harness({ single = false }: { single?: boolean }) {
    const [value, setValue] = useState('e');
    const [palette, setPalette] = useState('tonal');
    return (
      <ColorTune
        tones={single ? tones.slice(4) : tones}
        value={value}
        origin="e"
        onValueChange={setValue}
        palettes={palettes}
        palette={palette}
        onPaletteChange={setPalette}
        sample={sample}
      />
    );
  }

  it('shows the reset only after the color moved away', async () => {
    await render(<Harness />);
    expect(screen.getByText('VELVET')).toBeTruthy();
    expect(screen.queryByLabelText('처음 색으로')).toBeNull();
    await fireEvent(screen.getByRole('adjustable'), 'accessibilityAction', {
      nativeEvent: { actionName: 'decrement' },
    });
    expect(screen.getByText('DEEP')).toBeTruthy();
    expect(screen.getByTestId('swatch-card-face')).toHaveStyle({
      backgroundColor: '#933521',
    });
    await fireEvent.press(screen.getByLabelText('처음 색으로'));
    expect(screen.getByText('VELVET')).toBeTruthy();
    expect(screen.queryByLabelText('처음 색으로')).toBeNull();
  });

  it('picks a palette strip as a radio', async () => {
    await render(<Harness />);
    const strip = screen.getByRole('radio', { name: '보색' });
    expect(strip.props.accessibilityState).toMatchObject({ checked: false });
    await fireEvent.press(strip);
    expect(
      screen.getByRole('radio', { name: '보색' }).props.accessibilityState
    ).toMatchObject({ checked: true });
  });

  it('drops the slider when the row has one color', async () => {
    await render(<Harness single />);
    expect(screen.queryByRole('adjustable')).toBeNull();
    expect(screen.getByText('VELVET')).toBeTruthy();
  });
});

describe('PaletteStrips', () => {
  it('ignores a press on the picked strip', async () => {
    const onValueChange = jest.fn();
    await render(
      <PaletteStrips
        items={palettes}
        value="tonal"
        onValueChange={onValueChange}
      />
    );
    await fireEvent.press(screen.getByRole('radio', { name: '톤 온 톤' }));
    expect(onValueChange).not.toHaveBeenCalled();
    await fireEvent.press(screen.getByRole('radio', { name: '보색' }));
    expect(onValueChange).toHaveBeenCalledWith('complementary');
  });
});
