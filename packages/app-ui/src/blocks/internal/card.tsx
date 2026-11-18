import type { ReactNode } from 'react';
import { View, type StyleProp, type ViewStyle } from 'react-native';
import { PressableBase } from '../../internal/pressable-base';
import { makeStyles } from '../../utils/styles';

const useStyles = makeStyles((t) => ({
  card: {
    gap: t.space[3],
    padding: t.space[4],
    borderRadius: t.radius.lg,
    borderWidth: 1,
    borderColor: t.colors.border,
    backgroundColor: t.colors.surface,
  },
}));

export function Card({
  children,
  onPress,
  accessibilityLabel,
  style,
}: {
  children: ReactNode;
  onPress?: () => void;
  accessibilityLabel?: string;
  style?: StyleProp<ViewStyle>;
}) {
  const s = useStyles();
  if (!onPress) return <View style={[s.card, style]}>{children}</View>;
  return (
    <PressableBase
      onPress={onPress}
      accessibilityLabel={accessibilityLabel}
      feedback="row"
      style={[s.card, style]}
    >
      {children}
    </PressableBase>
  );
}
