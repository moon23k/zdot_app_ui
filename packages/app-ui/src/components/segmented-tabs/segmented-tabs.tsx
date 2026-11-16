import {
  ScrollView,
  Text,
  View,
  type StyleProp,
  type ViewStyle,
} from 'react-native';
import { PressableBase } from '../../internal/pressable-base';
import { useTheme } from '../../theme/theme-provider';
import { makeStyles } from '../../utils/styles';

export type SegmentedTabsItem<T extends string> = {
  value: T;
  label: string;
  count?: number;
};

export type SegmentedTabsProps<T extends string> = {
  items: readonly SegmentedTabsItem<T>[];
  value: T;
  onValueChange: (value: T) => void;
  style?: StyleProp<ViewStyle>;
};

const BAR = 3;

const useStyles = makeStyles((t) => ({
  root: {
    backgroundColor: t.colors.surface,
    borderBottomWidth: 1,
    borderBottomColor: t.colors.border,
  },
  track: {
    flexDirection: 'row',
    gap: t.space[5],
    paddingHorizontal: t.layout.screenX,
  },
  tab: {
    flexDirection: 'row',
    alignItems: 'baseline',
    gap: t.space[1],
    paddingVertical: t.space[3],
  },
  label: {
    fontFamily: t.fontFamily,
    fontSize: t.typography.body.fontSize,
    lineHeight: t.typography.body.lineHeight,
    color: t.colors.mutedForeground,
  },
  count: {
    fontFamily: t.fontFamily,
    fontSize: t.typography.eyebrow.fontSize,
    lineHeight: t.typography.eyebrow.lineHeight,
    color: t.colors.mutedForeground,
    fontVariant: ['tabular-nums'],
  },
  on: { color: t.colors.primary, fontWeight: '600' },
  countOn: { color: t.colors.primary },
  bar: {
    position: 'absolute',
    left: 0,
    right: 0,
    bottom: 0,
    height: BAR,
    borderTopLeftRadius: BAR,
    borderTopRightRadius: BAR,
    backgroundColor: t.colors.primary,
  },
}));

export function SegmentedTabs<T extends string>({
  items,
  value,
  onValueChange,
  style,
}: SegmentedTabsProps<T>) {
  const t = useTheme();
  const s = useStyles();
  return (
    <View style={[s.root, style]}>
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={s.track}
        accessibilityRole="tablist"
      >
        {items.map((item) => {
          const selected = item.value === value;
          return (
            <PressableBase
              key={item.value}
              accessibilityRole="tab"
              accessibilityState={{ selected }}
              accessibilityLabel={
                item.count === undefined
                  ? item.label
                  : `${item.label} ${item.count}`
              }
              pressedStyle={{}}
              onPress={() => {
                if (!selected) onValueChange(item.value);
              }}
              style={s.tab}
            >
              <Text
                numberOfLines={1}
                maxFontSizeMultiplier={t.maxFontScale}
                style={[s.label, selected && s.on]}
              >
                {item.label}
              </Text>
              {item.count === undefined ? null : (
                <Text
                  maxFontSizeMultiplier={t.maxFontScale}
                  style={[s.count, selected && s.countOn]}
                >
                  {item.count}
                </Text>
              )}
              {selected ? <View style={s.bar} /> : null}
            </PressableBase>
          );
        })}
      </ScrollView>
    </View>
  );
}
