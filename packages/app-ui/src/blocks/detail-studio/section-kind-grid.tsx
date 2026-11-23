import { Fragment, type ReactNode } from 'react';
import { ScrollView, View } from 'react-native';
import { Text } from '../../components/text/text';
import { PressableBase } from '../../internal/pressable-base';
import { makeStyles } from '../../utils/styles';
import {
  DETAIL_STEP_COLUMNS,
  detailIsTitle,
  type DetailBlock,
  type DetailLayer,
} from '../detail-editor/detail-types';

export type SectionKindItem = {
  key: string;
  label: string;
  blocks: readonly DetailBlock[];
};

export type SectionKindGridProps = {
  items: readonly SectionKindItem[];
  onPick: (key: string) => void;
};

const COLUMNS = 3;
const ART = 128;
const TITLE_BAR = 6;
const LINE_BAR = 4;
const DOT = 10;
const MAX_ROWS = 6;

const useStyles = makeStyles((t) => ({
  scroll: { flexShrink: 1 },
  content: { gap: t.space[4], paddingTop: t.space[2] },
  row: { flexDirection: 'row', gap: t.space[2] },
  cell: { flex: 1, alignItems: 'center', gap: t.space[2] },
  art: {
    alignSelf: 'stretch',
    height: ART,
    overflow: 'hidden',
    borderRadius: t.radius.md,
    backgroundColor: t.colors.background,
    paddingVertical: t.space[3],
    paddingHorizontal: t.space[4],
    alignItems: 'center',
    gap: t.space[1],
  },
  gap: { height: t.space[1] },
  title: {
    width: '56%',
    height: TITLE_BAR,
    borderRadius: t.radius.full,
    backgroundColor: t.colors.input,
  },
  line: {
    width: '70%',
    height: LINE_BAR,
    borderRadius: t.radius.full,
    backgroundColor: t.colors.border,
  },
  bleed: {
    alignSelf: 'stretch',
    marginHorizontal: -t.space[4],
    flexGrow: 1,
    flexBasis: 0,
    backgroundColor: t.colors.border,
  },
  photo: { flex: 1, alignSelf: 'stretch', backgroundColor: t.colors.border },
  pair: {
    alignSelf: 'stretch',
    flexGrow: 1,
    flexBasis: 0,
    flexDirection: 'row',
    gap: t.space[1],
  },
  side: {
    alignSelf: 'stretch',
    flexGrow: 1,
    flexBasis: 0,
    flexDirection: 'row',
    alignItems: 'stretch',
    gap: t.space[1],
  },
  sideText: { flex: 1, justifyContent: 'center', gap: t.space[1] },
  card: {
    alignSelf: 'stretch',
    flexGrow: 1,
    flexBasis: 0,
    overflow: 'hidden',
    borderRadius: t.radius.sm,
    backgroundColor: t.colors.surface,
    alignItems: 'center',
    gap: t.space[1],
    paddingBottom: t.space[1],
  },
  table: { alignSelf: 'stretch' },
  tableRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: t.space[2],
    paddingVertical: t.space[1],
  },
  rule: { borderTopWidth: 1, borderColor: t.colors.border },
  cellShort: {
    width: '30%',
    height: LINE_BAR,
    borderRadius: t.radius.full,
    backgroundColor: t.colors.input,
  },
  cellLong: {
    width: '55%',
    height: LINE_BAR,
    borderRadius: t.radius.full,
    backgroundColor: t.colors.border,
  },
  steps: { alignSelf: 'stretch', flexDirection: 'row', gap: t.space[1] },
  step: { flex: 1, alignItems: 'center', gap: t.space[1] },
  dot: {
    width: DOT,
    height: DOT,
    borderRadius: t.radius.full,
    borderWidth: 1,
    borderColor: t.colors.input,
  },
  stepLine: {
    width: '70%',
    height: LINE_BAR,
    borderRadius: t.radius.full,
    backgroundColor: t.colors.border,
  },
  label: {
    fontSize: t.typography.eyebrow.fontSize,
    lineHeight: t.typography.eyebrow.lineHeight,
    color: t.colors.title,
  },
}));

type Styles = ReturnType<typeof useStyles>;

function bars(s: Styles, layers: readonly DetailLayer[], prefix: string) {
  return layers
    .filter((l) => l.type === 'text')
    .map((l) => (
      <View
        key={`${prefix}${l.id}`}
        style={detailIsTitle(l.style) ? s.title : s.line}
      />
    ));
}

function tableArt(s: Styles, block: DetailBlock): ReactNode {
  const texts = block.layers.filter((l) => l.type === 'text');
  const rows = Math.min(Math.ceil(texts.length / 2), MAX_ROWS);
  return (
    <View key="table" style={s.table}>
      {Array.from({ length: rows }, (_, i) => (
        <View
          key={texts[i * 2]?.id ?? i}
          testID="kind-table-row"
          style={[s.tableRow, i > 0 && s.rule]}
        >
          <View style={s.cellShort} />
          <View style={s.cellLong} />
        </View>
      ))}
    </View>
  );
}

function stepsArt(s: Styles, block: DetailBlock): ReactNode {
  const texts = block.layers
    .filter((l) => l.type === 'text')
    .slice(0, DETAIL_STEP_COLUMNS);
  return (
    <View key="steps" style={s.steps}>
      {texts.map((l) => (
        <View key={`s${l.id}`} testID="kind-step" style={s.step}>
          <View style={s.dot} />
          <View style={s.stepLine} />
        </View>
      ))}
    </View>
  );
}

function blockArt(s: Styles, block: DetailBlock): ReactNode {
  const shown = block.layers.filter((l) => !l.hidden);
  const images = shown.filter((l) => l.type === 'image');
  const photos = (style: object) =>
    images.map((l) => <View key={`p${l.id}`} style={style} />);
  switch (block.layout) {
    case 'text':
      return bars(s, shown, 't');
    case 'table':
      return tableArt(s, block);
    case 'steps':
      return stepsArt(s, block);
    case 'image':
      return photos(s.bleed);
    case 'text_top':
      return [...bars(s, shown, 't'), ...photos(s.bleed)];
    case 'side':
      return (
        <View key="side" style={s.side}>
          {images.slice(0, 1).map((l) => (
            <View key={`p${l.id}`} style={s.photo} />
          ))}
          <View style={s.sideText}>{bars(s, shown, 't')}</View>
        </View>
      );
    case 'two_images':
      return [
        <View key="pair" style={s.pair}>
          {images.slice(0, 2).map((l) => (
            <View key={`p${l.id}`} style={s.photo} />
          ))}
        </View>,
        ...bars(s, shown, 't'),
      ];
    case 'card':
      return (
        <View key="card" style={s.card}>
          {images.slice(0, 1).map((l) => (
            <View key={`p${l.id}`} style={s.photo} />
          ))}
          {bars(s, shown, 't')}
        </View>
      );
    default:
      return [...photos(s.bleed), ...bars(s, shown, 't')];
  }
}

function KindArt({ blocks }: { blocks: readonly DetailBlock[] }) {
  const s = useStyles();
  return (
    <View style={s.art}>
      {blocks.map((block, i) => (
        <Fragment key={block.id}>
          {i > 0 ? <View style={s.gap} /> : null}
          {blockArt(s, block)}
        </Fragment>
      ))}
    </View>
  );
}

export function SectionKindGrid({ items, onPick }: SectionKindGridProps) {
  const s = useStyles();
  const rows: (SectionKindItem | null)[][] = [];
  for (let i = 0; i < items.length; i += COLUMNS) {
    const row: (SectionKindItem | null)[] = items.slice(i, i + COLUMNS);
    while (row.length < COLUMNS) row.push(null);
    rows.push(row);
  }
  return (
    <ScrollView style={s.scroll} contentContainerStyle={s.content}>
      {rows.map((row, r) => (
        <View key={r} style={s.row}>
          {row.map((item, c) =>
            item ? (
              <PressableBase
                key={item.key}
                onPress={() => onPick(item.key)}
                accessibilityLabel={item.label}
                feedback="small"
                style={s.cell}
              >
                <KindArt blocks={item.blocks} />
                <Text numberOfLines={1} style={s.label}>
                  {item.label}
                </Text>
              </PressableBase>
            ) : (
              <View key={`empty-${c}`} style={s.cell} />
            )
          )}
        </View>
      ))}
    </ScrollView>
  );
}
