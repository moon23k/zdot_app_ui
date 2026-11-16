import { Text } from 'react-native';
import Animated from 'react-native-reanimated';
import { DrawnCheck } from '../../internal/drawn-check';
import { FILL_FROM, usePop } from '../../internal/motion';
import {
  PressableBase,
  type PressableBaseProps,
} from '../../internal/pressable-base';
import { useTheme } from '../../theme/theme-provider';
import { makeStyles } from '../../utils/styles';

export type CheckboxProps = Omit<
  PressableBaseProps,
  'children' | 'onPress' | 'touchHeight'
> & {
  value: boolean;
  onValueChange: (value: boolean) => void;
  label?: string;
};

const BOX = 20;

const useStyles = makeStyles((t) => ({
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: t.space[2],
    alignSelf: 'flex-start',
  },
  box: {
    width: BOX,
    height: BOX,
    borderRadius: t.radius.sm,
    borderWidth: 1,
    borderColor: t.colors.border,
    backgroundColor: t.colors.surface,
    alignItems: 'center',
    justifyContent: 'center',
  },
  checked: { backgroundColor: t.colors.primary, borderColor: t.colors.primary },
  label: {
    ...t.typography.body,
    fontFamily: t.fontFamily,
    color: t.colors.foreground,
  },
}));

export function Checkbox({
  value,
  onValueChange,
  label,
  style,
  accessibilityState,
  ...rest
}: CheckboxProps) {
  const t = useTheme();
  const s = useStyles();
  const pop = usePop(value, FILL_FROM);
  return (
    <PressableBase
      accessibilityRole="checkbox"
      accessibilityLabel={label}
      {...rest}
      accessibilityState={{ ...accessibilityState, checked: value }}
      touchHeight={label ? t.typography.body.lineHeight : BOX}
      feedback="row"
      onPress={() => onValueChange(!value)}
      style={[s.row, style]}
    >
      <Animated.View style={[s.box, value && s.checked, pop]}>
        <DrawnCheck on={value} color={t.colors.primaryForeground} size={14} />
      </Animated.View>
      {label ? (
        <Text maxFontSizeMultiplier={t.maxFontScale} style={s.label}>
          {label}
        </Text>
      ) : null}
    </PressableBase>
  );
}
