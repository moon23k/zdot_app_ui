import { fireEvent, render, screen } from '@testing-library/react-native';
import { CompareSlider } from '../index';

describe('CompareSlider', () => {
  it('moves the split with screen reader increment and decrement', async () => {
    await render(<CompareSlider before="a.jpg" after="b.jpg" />);
    const slider = screen.getByRole('adjustable', { name: '원본과 비교' });
    expect(slider.props.accessibilityValue).toEqual({
      min: 0,
      max: 100,
      now: 50,
    });
    await fireEvent(slider, 'accessibilityAction', {
      nativeEvent: { actionName: 'increment' },
    });
    expect(
      screen.getByRole('adjustable', { name: '원본과 비교' }).props
        .accessibilityValue.now
    ).toBe(60);
    await fireEvent(slider, 'accessibilityAction', {
      nativeEvent: { actionName: 'decrement' },
    });
    await fireEvent(slider, 'accessibilityAction', {
      nativeEvent: { actionName: 'decrement' },
    });
    expect(
      screen.getByRole('adjustable', { name: '원본과 비교' }).props
        .accessibilityValue.now
    ).toBe(40);
  });
});
