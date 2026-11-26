import { render, screen } from '@testing-library/react-native';
import { Figures, Text, Won, createTheme, defaultThemes } from '../index';

type Node = { type: string; props: { style?: unknown }; children: unknown };

function spans(node: unknown): Node[] {
  if (!node || typeof node !== 'object') return [];
  if (Array.isArray(node)) return node.flatMap(spans);
  const n = node as Node;
  return [...(n.type === 'Text' ? [n] : []), ...spans(n.children)];
}

function inner() {
  return spans(screen.toJSON()).slice(1);
}

describe('figures', () => {
  it('shrinks only the won unit and keeps the reading text', async () => {
    await render(
      <Text variant="bodyLg">
        <Won>35,000원</Won>
      </Text>
    );
    expect(screen.getByText('35,000원')).toBeTruthy();
    const unit = inner().at(-1)!;
    expect(unit.children).toEqual(['원']);
    expect(unit.props.style).toMatchObject({
      fontSize: 14.96,
      fontWeight: '400',
      letterSpacing: 0,
    });
  });

  it('leaves non-amount text as it is', async () => {
    await render(
      <Text>
        <Won>무료</Won>
      </Text>
    );
    expect(inner()).toEqual([]);
  });

  it('emphasizes only the count after 외 in more scope', async () => {
    await render(
      <Text variant="bodyLg">
        <Figures scope="more">원두 200g 외 1건</Figures>
      </Text>
    );
    expect(inner().map((n) => n.children)).toEqual([['1']]);
  });

  it('skips emphasis below the minimum size', async () => {
    await render(
      <Text variant="label">
        <Figures>발송할 주문 3건</Figures>
      </Text>
    );
    expect(inner()).toEqual([]);
  });

  it('caps number-only text at the figure weight', async () => {
    await render(<Text weight="semibold">4.5</Text>);
    expect(screen.getByText('4.5')).toHaveStyle({ fontWeight: '500' });
  });

  it('carries the font family on every typography token', () => {
    const t = defaultThemes.light;
    for (const token of Object.values(t.typography)) {
      expect(token.fontFamily).toBe(t.fontFamily);
    }
    const custom = createTheme({ fontFamily: 'Custom' }).light;
    expect(custom.typography.body.fontFamily).toBe('Custom');
  });
});
