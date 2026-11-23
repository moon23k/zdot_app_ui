import type { ReactNode } from 'react';
import { Text as RNText, View } from 'react-native';
import Animated, {
  interpolateColor,
  useAnimatedStyle,
} from 'react-native-reanimated';
import { haptic } from '../../internal/haptics';
import { useSwitch } from '../../internal/motion';
import { PressableBase } from '../../internal/pressable-base';
import { useTheme } from '../../theme/theme-provider';
import { makeStyles } from '../../utils/styles';

export type StudioToggleProps = {
  label: string;
  value: boolean;
  onValueChange: (value: boolean) => void;
  disabled?: boolean;
  children?: ReactNode;
};

export type StudioToggleListProps = {
  children: ReactNode;
};

const TRACK = 26;
const KNOB = 22;

const useStyles = makeStyles((t) => {
  const inset = (TRACK - KNOB) / 2;
  return {
    list: { marginHorizontal: -t.space[4] },
    row: {
      height: t.controlSize.lg,
      flexDirection: 'row',
      alignItems: 'center',
      gap: t.space[3],
      paddingHorizontal: t.space[5],
    },
    label: {
      ...t.typography.body,
      flex: 1,
      fontFamily: t.fontFamily,
      color: t.colors.title,
    },
    track: {
      width: t.controlSize.sm,
      height: TRACK,
      borderRadius: t.radius.full,
    },
    thumb: {
      position: 'absolute',
      top: inset,
      left: inset,
      width: KNOB,
      height: KNOB,
      borderRadius: t.radius.full,
      backgroundColor: t.colors.raised,
      boxShadow: t.shadow.sm,
    },
    extra: {
      paddingTop: t.space[1],
      paddingBottom: t.space[3],
      paddingHorizontal: t.space[5],
    },
    off: { opacity: t.opacity.disabled },
  };
});

function Knob({ on }: { on: boolean }) {
  const t = useTheme();
  const s = useStyles();
  const travel = t.controlSize.sm - TRACK;
  const off = t.colors.border;
  const lit = t.colors.primary;
  const progress = useSwitch(on, 'base');
  const track = useAnimatedStyle(() => ({
    backgroundColor: interpolateColor(progress.value, [0, 1], [off, lit]),
  }));
  const thumb = useAnimatedStyle(() => ({
    transform: [{ translateX: travel * progress.value }],
  }));
  return (
    <Animated.View testID="studio-switch" style={[s.track, track]}>
      <Animated.View style={[s.thumb, thumb]} />
    </Animated.View>
  );
}

export function StudioToggle({
  label,
  value,
  onValueChange,
  disabled,
  children,
}: StudioToggleProps) {
  const t = useTheme();
  const s = useStyles();
  return (
    <View>
      <PressableBase
        feedback="row"
        accessibilityRole="switch"
        accessibilityLabel={label}
        accessibilityState={{ checked: value, disabled }}
        disabled={disabled}
        disabledStyle={s.off}
        onPress={() => {
          haptic('select');
          onValueChange(!value);
        }}
        style={s.row}
      >
        <RNText
          numberOfLines={1}
          maxFontSizeMultiplier={t.maxFontScale}
          style={s.label}
        >
          {label}
        </RNText>
        <Knob on={value} />
      </PressableBase>
      {children ? <View style={s.extra}>{children}</View> : null}
    </View>
  );
}

export function StudioToggleList({ children }: StudioToggleListProps) {
  const s = useStyles();
  return <View style={s.list}>{children}</View>;
}
