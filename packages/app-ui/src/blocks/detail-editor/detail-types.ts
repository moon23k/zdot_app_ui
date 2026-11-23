export type DetailFont = 'gothic' | 'serif' | 'display' | 'hand';
export type DetailWeight = 'regular' | 'bold' | 'heavy';
export type DetailEffect = 'none' | 'shadow' | 'outline' | 'band';
export type DetailLayout =
  | 'text'
  | 'image'
  | 'image_top'
  | 'text_top'
  | 'side'
  | 'two_images'
  | 'card'
  | 'table'
  | 'steps';

export type DetailTextStyle = {
  font?: DetailFont;
  size?: number;
  weight?: DetailWeight;
  color?: string;
  align?: 'left' | 'center' | 'right';
  effect?: DetailEffect;
  line?: number;
  tracking?: number;
};

export type DetailLayer = {
  id: string;
  type: 'text' | 'image';
  text?: string | null;
  url?: string | null;
  asset_id?: string | null;
  style?: DetailTextStyle | null;
  hidden?: boolean;
};

export type DetailBlock = {
  id: string;
  layout: DetailLayout;
  background?: {
    color?: string | null;
    url?: string | null;
    asset_id?: string | null;
  };
  space_top?: number;
  space_bottom?: number;
  layers: DetailLayer[];
};

export type DetailDocValue = {
  version?: number;
  background?: string | null;
  blocks: DetailBlock[];
};

export type DetailSelection = { block: string; layer?: string } | null;

export const DETAIL_LAYOUTS: readonly DetailLayout[] = [
  'image_top',
  'text_top',
  'side',
  'image',
  'two_images',
  'card',
  'text',
];

export const DETAIL_LIST_LAYOUTS: readonly DetailLayout[] = ['table', 'steps'];

export function detailLayoutsFor(block: DetailBlock): readonly DetailLayout[] {
  return block.layers.some((l) => l.type === 'image')
    ? DETAIL_LAYOUTS
    : [...DETAIL_LAYOUTS, ...DETAIL_LIST_LAYOUTS];
}

const LINE_INK = '#1A1A1A';

export function detailLineColor(color?: string | null): string {
  return `${color && /^#[0-9a-fA-F]{6}$/.test(color) ? color : LINE_INK}33`;
}

export type DetailTableRow = {
  label: DetailLayer | null;
  value: DetailLayer | null;
};

const visible = (layer: DetailLayer | null) =>
  !!layer && !layer.hidden && !!layer.text?.trim();

export function detailTableRows(
  block: DetailBlock,
  editing = false
): DetailTableRow[] {
  const texts = block.layers.filter((l) => l.type === 'text');
  const rows: DetailTableRow[] = [];
  for (let i = 0; i < texts.length; i += 2) {
    const label = texts[i] ?? null;
    const value = texts[i + 1] ?? null;
    const open = (l: DetailLayer | null) => !!l && !l.hidden;
    if (editing ? open(label) || open(value) : visible(label) || visible(value))
      rows.push({ label, value });
  }
  return rows;
}

export function detailSteps(
  block: DetailBlock,
  editing = false
): DetailLayer[] {
  return block.layers.filter(
    (l) => l.type === 'text' && (editing ? !l.hidden : visible(l))
  );
}

export const DETAIL_STEP_COLUMNS = 4;
export const DETAIL_TABLE_LABEL = '28%';
export const DETAIL_STEP_DOT = 2.4;

export const DETAIL_FONT_FAMILY: Record<
  DetailFont,
  Record<DetailWeight, string>
> = {
  gothic: {
    regular: 'Pretendard-Regular',
    bold: 'Pretendard-Bold',
    heavy: 'Pretendard-ExtraBold',
  },
  serif: {
    regular: 'NanumMyeongjo',
    bold: 'NanumMyeongjoBold',
    heavy: 'NanumMyeongjoBold',
  },
  display: {
    regular: 'BlackHanSans-Regular',
    bold: 'BlackHanSans-Regular',
    heavy: 'BlackHanSans-Regular',
  },
  hand: {
    regular: 'NanumPen-Regular',
    bold: 'NanumPen-Regular',
    heavy: 'NanumPen-Regular',
  },
};

const clamp = (value: number, lo: number, hi: number) =>
  Math.min(hi, Math.max(lo, value));

export function detailFontSize(size = 5): number {
  return 12 + (clamp(size, 1, 10) - 1) * 2;
}

export function detailLineHeight(line = 5): number {
  return 1.05 + clamp(line, 1, 10) * 0.08;
}

export function detailTracking(tracking = 0): number {
  return clamp(tracking, -5, 10) * 0.01;
}

export function detailBlockSpace(space = 0): number {
  return clamp(space, 0, 10) * 8;
}

export const DETAIL_COLORS: readonly { value: string; label: string }[] = [
  { value: '#1A1A1A', label: '잉크' },
  { value: '#FFFFFF', label: '흰색' },
  { value: '#F4F4F5', label: '연회색' },
  { value: '#EFE7DC', label: '베이지' },
  { value: '#3B2F25', label: '고동' },
  { value: '#C54211', label: '주황' },
  { value: '#2F4A2B', label: '초록' },
  { value: '#1F3A5F', label: '남색' },
];

export const DETAIL_HEAD_SIZE = 7;
export const DETAIL_TITLE_SIZE = 6;

export function detailIsTitle(style?: DetailTextStyle | null): boolean {
  const size = style?.size ?? 5;
  const weight = style?.weight ?? 'regular';
  return (
    size >= DETAIL_HEAD_SIZE ||
    (size >= DETAIL_TITLE_SIZE && weight !== 'regular')
  );
}

export const DETAIL_TEXT_COLORS: readonly { value: string; label: string }[] = [
  { value: '#1A1A1A', label: '검정' },
  { value: '#626262', label: '회색' },
  { value: '#FFFFFF', label: '흰색' },
  { value: '#8A6A4A', label: '갈색' },
  { value: '#B5651D', label: '황토색' },
  { value: '#3F5D45', label: '초록' },
  { value: '#2F4A6B', label: '남색' },
  { value: '#9A3412', label: '벽돌색' },
];

export const DETAIL_BACKGROUND_COLORS: readonly {
  value: string;
  label: string;
}[] = [
  { value: '#FFFFFF', label: '흰색' },
  { value: '#F3EFE7', label: '크림색' },
  { value: '#E6E1D8', label: '연회색' },
  { value: '#D6C7B2', label: '베이지' },
  { value: '#8A6A4A', label: '갈색' },
  { value: '#3F5D45', label: '초록' },
  { value: '#2F4A6B', label: '남색' },
  { value: '#2A2D33', label: '먹색' },
];
