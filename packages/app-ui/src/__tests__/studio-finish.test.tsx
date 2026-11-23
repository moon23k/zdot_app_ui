import { fireEvent, render, screen } from '@testing-library/react-native';
import { StyleSheet, type ViewStyle } from 'react-native';
import {
  Button,
  ChipGroup,
  CopyGlyph,
  DropdownMenu,
  EyeOffGlyph,
  PhotoToolBar,
  SegmentedControl,
  TrashGlyph,
  defaultThemes,
} from '../index';
import { keepWords } from '../blocks/detail-editor/keep-words';
import { sectionThumbFrame } from '../blocks/detail-studio/section-thumb';
import { sheetEdge } from '../blocks/detail-studio/section-edit-template';
import type { DetailPart } from '../blocks/detail-editor/focus-context';

const WJ = '\u2060';
const NBSP = '\u00A0';

type Node = { props: Record<string, unknown>; children?: unknown[] | null };

function findMenu(node: unknown): Node | null {
  if (!node || typeof node !== 'object') return null;
  if (Array.isArray(node)) {
    for (const child of node) {
      const hit = findMenu(child);
      if (hit) return hit;
    }
    return null;
  }
  const host = node as Node;
  if (host.props?.accessibilityRole === 'menu') return host;
  return findMenu(host.children ?? null);
}

const part = (
  kind: DetailPart['kind'],
  y: number,
  height: number,
  line = 0
): DetailPart => ({ key: `${kind}${y}`, kind, y, height, line });

describe('keepWords', () => {
  it('joins the letters of a Korean word and leaves spaces breakable', () => {
    const out = keepWords('지름 17cm · 높이 7.5cm · 용량 750ml · 무게 약 420g');
    expect(out).toContain(`용${WJ}량`);
    expect(out).toContain(`7.5cm${NBSP}·`);
    expect(out.replace(new RegExp(WJ, 'g'), '')).toContain(`약${NBSP}420g`);
    expect(out.replace(new RegExp(`[${WJ}]`, 'g'), '')).toBe(
      `지름 17cm${NBSP}· 높이 7.5cm${NBSP}· 용량 750ml${NBSP}· 무게 약${NBSP}420g`
    );
  });

  it('keeps line breaks and leaves text without Korean as it was', () => {
    expect(keepWords('Hello world')).toBe('Hello world');
    expect(keepWords('살펴보세요\n가까이')).toBe(
      `살${WJ}펴${WJ}보${WJ}세${WJ}요\n가${WJ}까${WJ}이`
    );
  });
});

describe('sectionThumbFrame', () => {
  it('centers a leading photo', () => {
    expect(
      sectionThumbFrame(
        [part('image', 0, 130), part('text', 136, 10, 10)],
        80,
        6
      )
    ).toEqual({ top: 25, height: 80 });
  });

  it('starts at the first text and drops a line cut by the bottom edge', () => {
    const frame = sectionThumbFrame(
      [part('text', 6, 8, 8), part('image', 20, 50), part('text', 76, 20, 5)],
      80,
      6
    );
    expect(frame.top).toBe(0);
    expect(frame.height).toBe(76);
  });
});

describe('sheetEdge', () => {
  it('keeps an edge that falls between texts', () => {
    expect(sheetEdge(300, [part('text', 100, 40, 20)], 8)).toBe(300);
  });

  it('moves an edge off a text to the nearest gap or line', () => {
    expect(sheetEdge(104, [part('text', 100, 40, 20)], 8)).toBe(92);
    expect(sheetEdge(118, [part('text', 100, 40, 20)], 8)).toBe(120);
    expect(sheetEdge(146, [part('text', 100, 40, 20)], 8)).toBe(148);
  });
});

it('fills the anchor width and rests both menu edges between rows', async () => {
  await render(
    <DropdownMenu
      open
      anchor={{ x: 164, y: 200, width: 231, height: 96, fill: true, pitch: 96 }}
      onOpenChange={jest.fn()}
      items={[
        { key: 'hide', icon: EyeOffGlyph, label: '숨기기', onPress: jest.fn() },
        { key: 'copy', icon: CopyGlyph, label: '복제', onPress: jest.fn() },
        {
          key: 'remove',
          icon: TrashGlyph,
          label: '삭제',
          separated: true,
          onPress: jest.fn(),
        },
      ]}
    />
  );
  const style = StyleSheet.flatten(
    findMenu(screen.toJSON())?.props.style as ViewStyle
  );
  expect(style?.width).toBe(231);
  expect(style?.top).toBe(200 + 96 + (192 - 161) / 2);
});

it('a steady disabled button keeps its size and turns soft grey', async () => {
  const { muted, disabledForeground } = defaultThemes.light.colors;
  await render(
    <Button pill steady disabled onPress={jest.fn()}>
      넣기
    </Button>
  );
  const face = StyleSheet.flatten(screen.getByRole('button').props.style);
  expect(face.backgroundColor).toBe(muted);
  expect(face.opacity).toBeUndefined();
  const scales = ((face.transform ?? []) as Record<string, number>[])
    .filter((step) => 'scale' in step)
    .map((step) => step.scale);
  expect(scales.every((value) => value === 1)).toBe(true);
  expect(screen.getByText('넣기')).toHaveStyle({ color: disabledForeground });
});

it('a chip carries its own credit cost', async () => {
  await render(
    <ChipGroup
      items={[
        { value: 'price_big', label: '가격 크게' },
        { value: 'shorten', label: '더 짧게', cost: 1 },
      ]}
      value={null}
      onValueChange={jest.fn()}
    />
  );
  expect(screen.getByLabelText('더 짧게, 크레딧 1')).toBeTruthy();
  expect(screen.getByText('1')).toBeTruthy();
  expect(screen.queryByLabelText('가격 크게, 크레딧 1')).toBeNull();
});

it('segment labels can carry their own weight', async () => {
  await render(
    <SegmentedControl
      items={[
        { value: 'regular', label: '보통', weight: '400' },
        { value: 'heavy', label: '아주 굵게', weight: '700' },
      ]}
      value="regular"
      onValueChange={jest.fn()}
    />
  );
  expect(screen.getByText('보통')).toHaveStyle({ fontWeight: '400' });
  expect(screen.getByText('아주 굵게')).toHaveStyle({ fontWeight: '700' });
});

it('PhotoToolBar stops on whole tools when they overflow', async () => {
  await render(
    <PhotoToolBar
      items={['a', 'b', 'c', 'd', 'e', 'f'].map((key) => ({
        key,
        icon: null,
        label: key,
        onPress: () => {},
      }))}
      action={{ label: '완료', onPress: () => {} }}
    />
  );
  const scroller = screen.getByTestId('photo-tools');
  await fireEvent(scroller, 'layout', {
    nativeEvent: { layout: { width: 300, height: 64 } },
  });
  const now = screen.getByTestId('photo-tools');
  expect(now.props.snapToInterval).toBe(64);
  expect(StyleSheet.flatten(now.props.contentContainerStyle).paddingRight).toBe(
    44
  );
});
