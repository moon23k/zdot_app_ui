import { View, type StyleProp, type ViewStyle } from 'react-native';
import { Text } from '../components/text/text';
import { PressableBase } from '../internal/pressable-base';
import { useTheme } from '../theme/theme-provider';
import { makeStyles } from '../utils/styles';

export type AxisTab = { key: string; label: string; changed?: boolean };

export type AxisTabsProps = {
  items: readonly AxisTab[];
  selected: string | null;
  onSelect: (key: string) => void;
  style?: StyleProp<ViewStyle>;
};

export const AXIS_TAB_SIZE = 62;

const DOT = 4;

const useStyles = makeStyles((t) => ({
  root: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: t.space[4],
  },
  tab: {
    width: AXIS_TAB_SIZE,
    height: AXIS_TAB_SIZE,
    borderRadius: AXIS_TAB_SIZE / 2,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: t.colors.recess,
  },
  on: { backgroundColor: t.colors.raised, boxShadow: t.shadow.lift },
  label: { letterSpacing: t.typography.body.letterSpacing },
  dot: {
    position: 'absolute',
    bottom: t.space[2],
    width: DOT,
    height: DOT,
    borderRadius: DOT / 2,
    backgroundColor: t.colors.arc,
  },
  dotOn: { backgroundColor: t.colors.primary },
}));

export function AxisTabs({ items, selected, onSelect, style }: AxisTabsProps) {
  const t = useTheme();
  const s = useStyles();
  return (
    <View accessibilityRole="tablist" style={[s.root, style]}>
      {items.map((item) => {
        const on = item.key === selected;
        return (
          <PressableBase
            key={item.key}
            onPress={() => onSelect(item.key)}
            accessibilityRole="tab"
            accessibilityLabel={item.label}
            accessibilityState={{ selected: on }}
            style={[s.tab, on && s.on]}
          >
            <Text
              variant="body"
              weight={on ? 'semibold' : 'medium'}
              numberOfLines={1}
              maxFontSizeMultiplier={1}
              style={[
                s.label,
                { color: on ? t.colors.title : t.colors.mutedForeground },
              ]}
            >
              {item.label}
            </Text>
            {item.changed ? <View style={[s.dot, on && s.dotOn]} /> : null}
          </PressableBase>
        );
      })}
    </View>
  );
}
