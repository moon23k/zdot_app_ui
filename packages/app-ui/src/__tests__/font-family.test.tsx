import { render, screen } from '@testing-library/react-native';
import path from 'node:path';
import { StyleSheet } from 'react-native';
import { storyCases } from '../../../../jest/render-stories';
import { ThemeProvider } from '../index';

type Node = {
  type: string;
  props: { style?: unknown; value?: unknown; placeholder?: unknown };
  children: unknown;
};

function words(node: unknown): string {
  if (typeof node === 'string') return node;
  if (!node || typeof node !== 'object') return '';
  if (Array.isArray(node)) return node.map(words).join('');
  return words((node as Node).children);
}

function bare(node: unknown, found: string[] = []): string[] {
  if (!node || typeof node !== 'object') return found;
  if (Array.isArray(node)) {
    node.forEach((child) => bare(child, found));
    return found;
  }
  const n = node as Node;
  if (n.type === 'Text' || n.type === 'TextInput') {
    const style = StyleSheet.flatten(n.props.style as never) as
      { fontFamily?: string } | undefined;
    if (!style?.fontFamily) {
      found.push(
        `${n.type}: ${words(n) || String(n.props.value ?? n.props.placeholder ?? '')}`
      );
    }
    return found;
  }
  bare(n.children, found);
  return found;
}

const cases = storyCases(path.resolve(__dirname, '..'));

describe('every text carries the theme font family', () => {
  it.each(cases)('%s', async (_, element) => {
    await render(<ThemeProvider>{element}</ThemeProvider>);
    expect(bare(screen.toJSON())).toEqual([]);
  });
});
