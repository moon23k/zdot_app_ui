import { fireEvent, render, screen } from '@testing-library/react-native';
import { OrderBlock, QuestionAccordion, StageBar } from '../index';

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
