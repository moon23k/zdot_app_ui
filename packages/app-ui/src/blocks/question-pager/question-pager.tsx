import { View, type StyleProp, type ViewStyle } from 'react-native';
import { Text } from '../../components/text/text';
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

const useStyles = makeStyles((t) => ({
  root: { gap: t.space[3] },
  tabs: {
    flexDirection: 'row',
    borderBottomWidth: 1,
    borderBottomColor: t.colors.border,
  },
  tab: {
    flex: 1,
    minWidth: 0,
    height: t.controlSize.sm,
    marginBottom: -1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: t.space[1],
    borderBottomWidth: LINE,
    borderBottomColor: 'transparent',
  },
  tabActive: { borderBottomColor: t.colors.primary },
  tabText: { flexShrink: 1 },
  tabActiveText: { color: t.colors.title },
  tabDoneText: { color: t.colors.selectForeground },
  questions: { gap: t.space[3] },
  question: { gap: t.space[1] },
  grid: { gap: t.space[1] },
  row: { flexDirection: 'row', gap: t.space[2] },
  cell: { flex: 1, minWidth: 0 },
  tile: {
    flex: 1,
    minWidth: 0,
    height: t.controlSize.sm,
    justifyContent: 'center',
    paddingHorizontal: t.space[3],
    borderRadius: t.radius.lg,
    backgroundColor: t.colors.surface,
  },
  tilePicked: { backgroundColor: t.colors.primaryTint },
  tileText: { color: t.colors.title },
  tilePickedText: { color: t.colors.selectForeground },
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
              style={[s.tab, selected && s.tabActive]}
            >
              {done ? (
                <CheckGlyph
                  color={t.colors.selectForeground}
                  size={t.iconSize.sm}
                />
              ) : null}
              <Text
                tone="muted"
                weight={selected ? 'semibold' : undefined}
                numberOfLines={1}
                style={[
                  s.tabText,
                  selected && s.tabActiveText,
                  done && s.tabDoneText,
                ]}
              >
                {g.label}
              </Text>
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
