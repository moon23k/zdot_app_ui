import { render, screen } from '@testing-library/react-native';
import { StyleSheet } from 'react-native';
import {
  DetailTemplate,
  ListRow,
  OrderBlock,
  PressableBase,
  ThumbStrip,
  ValueRows,
  defaultThemes,
} from '../index';

const dim = defaultThemes.light.opacity.disabled;

function holder(text: string) {
  let node = screen.getByText(text).parent;
  while (node && node.props.accessible !== true) node = node.parent;
  return node!;
}

describe('rows without a press handler', () => {
  it('ValueRows reads only pressable rows as buttons', async () => {
    await render(
      <ValueRows
        rows={[
          { label: '결제 금액', value: '10,000원' },
          { label: '정산 계좌', value: '변경', onPress: () => {} },
        ]}
      />
    );
    expect(screen.getAllByRole('button')).toHaveLength(1);
    const still = holder('결제 금액');
    expect(still.props.accessibilityRole).toBeUndefined();
    expect(still.props.accessibilityState?.disabled).toBeUndefined();
  });

  it('ThumbStrip without onPress is not a dimmed disabled image button', async () => {
    await render(<ThumbStrip images={['a.jpg', 'b.jpg']} />);
    expect(screen.queryAllByRole('imagebutton')).toHaveLength(0);
    const thumb = screen.getByLabelText('사진 1');
    expect(thumb.props.accessibilityState?.disabled).toBeUndefined();
    expect(StyleSheet.flatten(thumb.props.style).opacity).not.toBe(dim);
  });

  it('hero caption without copy is plain text', async () => {
    await render(
      <DetailTemplate hero={{ title: '배송 준비', caption: '20261028-0001' }}>
        {null}
      </DetailTemplate>
    );
    expect(screen.queryAllByRole('button')).toHaveLength(0);
  });

  it('OrderBlock without onPress is not a disabled button', async () => {
    await render(<OrderBlock title="머그컵" meta="1개" amount="12,000원" />);
    expect(screen.queryAllByRole('button')).toHaveLength(0);
  });

  it('ListRow without onPress keeps testID and accessibilityLabel', async () => {
    await render(
      <ListRow
        title="배송비"
        testID="fee-row"
        accessibilityLabel="배송비 3,000원"
      />
    );
    expect(screen.getByTestId('fee-row')).toBeTruthy();
    expect(screen.getByLabelText('배송비 3,000원')).toBeTruthy();
  });

  it('keeps a real disabled button readable as disabled', async () => {
    await render(
      <PressableBase disabled accessibilityLabel="실행 취소">
        {null}
      </PressableBase>
    );
    const node = screen.getByLabelText('실행 취소');
    expect(node.props.accessibilityRole).toBe('button');
    expect(node.props.accessibilityState.disabled).toBe(true);
  });
});
