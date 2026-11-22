import {
  Text as RNText,
  View,
  type StyleProp,
  type ViewStyle,
} from 'react-native';
import { Text } from '../../components/text/text';
import { CheckDisc } from '../../internal/check-disc';
import { CheckGlyph } from '../../internal/glyphs';
import { haptic } from '../../internal/haptics';
import { PressableBase } from '../../internal/pressable-base';
import { useTheme } from '../../theme/theme-provider';
import { makeStyles } from '../../utils/styles';

export type QuestionPagerOption = { value: string; label: string };

export type QuestionPagerQuestion = {
  key: string;
  label: string;
  options: readonly QuestionPagerOption[];
};

export type QuestionPagerGroup = {
  key: string;
  label: string;
  questions: readonly QuestionPagerQuestion[];
};

export type QuestionPagerProps = {
  groups: readonly QuestionPagerGroup[];
  value: Readonly<Record<string, string | undefined>>;
  onValueChange: (questionKey: string, optionValue: string) => void;
  activeGroup: string;
  onActiveGroupChange: (groupKey: string) => void;
  style?: StyleProp<ViewStyle>;
};

const COLUMNS = 2;
const LINE = 2;
const MARK = 18;
const HAIR = 0.5;
const HAIR_ALPHA = 0.6;

const useStyles = makeStyles((t) => ({
  root: { gap: t.space[5] },
  tabs: {
    flexDirection: 'row',
    gap: t.space[6],
    marginHorizontal: -t.layout.screenX,
    paddingHorizontal: t.layout.screenX,
  },
  hair: {
    position: 'absolute',
    left: 0,
    right: 0,
    bottom: 0,
    height: HAIR,
    opacity: HAIR_ALPHA,
    backgroundColor: t.colors.input,
  },
  tab: {
    height: t.controlSize.sm,
    flexDirection: 'row',
    alignItems: 'center',
    gap: t.space[1],
  },
  tabLine: {
    position: 'absolute',
    left: 0,
    right: 0,
    bottom: 0,
    height: LINE,
    backgroundColor: t.colors.primary,
  },
  tabText: {
    fontFamily: t.fontFamily,
    fontSize: t.typography.label.fontSize,
    lineHeight: t.typography.label.lineHeight,
    fontWeight: '500',
    color: t.colors.faint,
  },
  tabActiveText: { fontWeight: '700', color: t.colors.title },
  tabDoneText: { color: t.colors.mutedForeground },
  questions: { gap: t.space[5] },
  question: { gap: t.space[2] },
  grid: { gap: t.space[2] },
  row: { flexDirection: 'row', gap: t.space[2] },
  cell: { flex: 1, minWidth: 0 },
  tile: {
    flex: 1,
    minWidth: 0,
    height: t.controlSize.md,
    flexDirection: 'row',
    alignItems: 'center',
    gap: t.space[2],
    paddingHorizontal: t.space[3],
    borderRadius: t.radius.lg,
    backgroundColor: t.colors.recess,
  },
  tilePicked: {
    backgroundColor: t.colors.raised,
    boxShadow: t.shadow.liftSm,
  },
  tileText: { flex: 1, color: t.colors.mutedForeground },
  tilePickedText: { flex: 1, color: t.colors.title },
}));

function answered(
  group: QuestionPagerGroup,
  value: QuestionPagerProps['value']
) {
  return group.questions.every((q) => Boolean(value[q.key]));
}

function rows<T>(items: readonly T[]) {
  const out: T[][] = [];
  for (let i = 0; i < items.length; i += COLUMNS) {
    out.push(items.slice(i, i + COLUMNS));
  }
  return out;
}

export function QuestionPager({
  groups,
  value,
  onValueChange,
  activeGroup,
  onActiveGroupChange,
  style,
}: QuestionPagerProps) {
  const t = useTheme();
  const s = useStyles();
  const index = Math.max(
    0,
    groups.findIndex((g) => g.key === activeGroup)
  );
  const group = groups[index];

  const pick = (questionKey: string, optionValue: string) => {
    if (!group || value[questionKey] === optionValue) return;
    const wasDone = answered(group, value);
    haptic('select');
    onValueChange(questionKey, optionValue);
    const next = groups[index + 1];
    if (
      !wasDone &&
      next &&
      answered(group, { ...value, [questionKey]: optionValue })
    ) {
      onActiveGroupChange(next.key);
    }
  };

  return (
    <View style={[s.root, style]}>
      <View accessibilityRole="tablist" style={s.tabs}>
        <View pointerEvents="none" style={s.hair} />
        {groups.map((g) => {
          const selected = g.key === group?.key;
          const done = !selected && answered(g, value);
          return (
            <PressableBase
              key={g.key}
              accessibilityRole="tab"
              accessibilityState={{ selected }}
              accessibilityLabel={g.label}
              feedback="row"
              onPress={() => {
                if (selected) return;
                haptic('select');
                onActiveGroupChange(g.key);
              }}
              style={s.tab}
            >
              <RNText
                numberOfLines={1}
                maxFontSizeMultiplier={t.maxFontScale}
                style={[
                  s.tabText,
                  selected && s.tabActiveText,
                  done && s.tabDoneText,
                ]}
              >
                {g.label}
              </RNText>
              {done ? (
                <CheckGlyph color={t.colors.primary} size={t.iconSize.sm} />
              ) : null}
              {selected ? (
                <View pointerEvents="none" style={s.tabLine} />
              ) : null}
            </PressableBase>
          );
        })}
      </View>
      {group ? (
        <View style={s.questions}>
          {group.questions.map((q) => (
            <View
              key={q.key}
              accessibilityRole="radiogroup"
              accessibilityLabel={q.label}
              style={s.question}
            >
              <Text weight="semibold">{q.label}</Text>
              <View style={s.grid}>
                {rows(q.options).map((row) => (
                  <View key={row[0]!.value} style={s.row}>
                    {row.map((option) => {
                      const picked = value[q.key] === option.value;
                      return (
                        <PressableBase
                          key={option.value}
                          accessibilityRole="radio"
                          accessibilityState={{ checked: picked }}
                          accessibilityLabel={option.label}
                          feedback="small"
                          onPress={() => pick(q.key, option.value)}
                          style={[s.tile, picked && s.tilePicked]}
                        >
                          <Text
                            weight={picked ? 'semibold' : 'medium'}
                            numberOfLines={1}
                            style={picked ? s.tilePickedText : s.tileText}
                          >
                            {option.label}
                          </Text>
                          {picked ? <CheckDisc size={MARK} /> : null}
                        </PressableBase>
                      );
                    })}
                    {row.length < COLUMNS ? <View style={s.cell} /> : null}
                  </View>
                ))}
              </View>
            </View>
          ))}
        </View>
      ) : null}
    </View>
  );
}
