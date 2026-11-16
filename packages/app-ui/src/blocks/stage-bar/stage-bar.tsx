import { Fragment } from 'react';
import { View, type StyleProp, type ViewStyle } from 'react-native';
import { Text } from '../../components/text/text';
import { ChevronGlyph } from '../../internal/glyphs';
import { PressableBase } from '../../internal/pressable-base';
import { useTheme } from '../../theme/theme-provider';
import { makeStyles } from '../../utils/styles';

export type StageBarItem<T extends string> = {
  value: T;
  label: string;
  count?: number;
  flow?: boolean;
};

export type StageBarProps<T extends string> = {
  items: readonly StageBarItem<T>[];
  value: T | null;
  onValueChange: (value: T | null) => void;
  style?: StyleProp<ViewStyle>;
};

const useStyles = makeStyles((t) => ({
  root: {
    flexDirection: 'row',
    alignItems: 'center',
    marginHorizontal: t.layout.screenX,
    padding: t.space[1] + t.space[1] / 2,
    borderRadius: t.radius.lg,
    backgroundColor: t.colors.surface,
  },
  stage: {
    flex: 1,
    alignItems: 'center',
    gap: t.space[1] / 2,
    paddingVertical: t.space[2],
    borderRadius: t.radius.md,
  },
  on: {
    backgroundColor: t.colors.primaryTint,
    borderWidth: 1.5,
    borderColor: t.colors.primary,
  },
  count: {
    fontSize: t.typography.title.fontSize,
    lineHeight: t.typography.title.lineHeight,
    fontWeight: '600',
    color: t.colors.title,
    fontVariant: ['tabular-nums'],
  },
  zero: { fontWeight: '400', color: t.colors.input },
  countOn: { color: t.colors.primary },
  label: {
    fontSize: t.typography.eyebrow.fontSize,
    lineHeight: t.typography.eyebrow.lineHeight,
    color: t.colors.mutedForeground,
  },
  labelOn: { fontWeight: '500', color: t.colors.selectForeground },
  split: {
    width: 1,
    alignSelf: 'stretch',
    marginVertical: t.space[2],
    backgroundColor: t.colors.border,
  },
}));

export function StageBar<T extends string>({
  items,
  value,
  onValueChange,
  style,
}: StageBarProps<T>) {
  const t = useTheme();
  const s = useStyles();
  return (
    <View style={[s.root, style]} accessibilityRole="tablist">
      {items.map((item, i) => {
        const on = item.value === value;
        const next = items[i + 1];
        const live = (item.count ?? 0) > 0;
        return (
          <Fragment key={item.value}>
            <PressableBase
              accessibilityRole="tab"
              accessibilityState={{ selected: on }}
              accessibilityLabel={`${item.label} ${item.count ?? 0}`}
              onPress={() => onValueChange(on ? null : item.value)}
              style={[s.stage, on && s.on]}
            >
              <Text style={[s.count, !live && s.zero, on && s.countOn]}>
                {item.count ?? 0}
              </Text>
              <Text numberOfLines={1} style={[s.label, on && s.labelOn]}>
                {item.label}
              </Text>
            </PressableBase>
            {next ? (
              next.flow === false ? (
                <View style={s.split} />
              ) : (
                <ChevronGlyph color={t.colors.input} size={t.iconSize.sm} />
              )
            ) : null}
          </Fragment>
        );
      })}
    </View>
  );
}
