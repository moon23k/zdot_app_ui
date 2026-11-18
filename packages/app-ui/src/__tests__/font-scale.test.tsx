import { render, screen } from '@testing-library/react-native';
import { Calendar, OAuthButtons, defaultThemes } from '../index';

const cap = defaultThemes.light.maxFontScale;

type Node = { type: string; props: Record<string, unknown>; children: unknown };

function texts(node: unknown): Node[] {
  if (!node || typeof node !== 'object') return [];
  if (Array.isArray(node)) return node.flatMap(texts);
  const n = node as Node;
  return [...(n.type === 'Text' ? [n] : []), ...texts(n.children)];
}

function capped() {
  const found = texts(screen.toJSON());
  return (
    found.length > 0 &&
    found.every((node) => node.props.maxFontSizeMultiplier === cap)
  );
}

describe('text keeps the font scale cap', () => {
  it('Calendar', async () => {
    await render(
      <Calendar
        days={[{ date: '2026-11-06', label: '12만' }]}
        mode="range"
        value={{ start: '2026-11-06' }}
        onValueChange={() => {}}
      />
    );
    expect(capped()).toBe(true);
  });

  it('OAuthButtons', async () => {
    await render(<OAuthButtons providers={['kakao']} onPress={() => {}} />);
    expect(capped()).toBe(true);
  });
});
