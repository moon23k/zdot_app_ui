import { View, type StyleProp, type ViewStyle } from 'react-native';
import { renderIcon, type IconSlot } from '../../internal/icon';
import { PressableBase } from '../../internal/pressable-base';
import { useTheme } from '../../theme/theme-provider';
import { makeStyles } from '../../utils/styles';
import { Text } from '../text/text';

export type PageHeaderAction = {
  icon?: IconSlot;
  label: string;
  badge?: boolean;
  framed?: boolean;
  onPress: () => void;
};

export type PageHeaderProps = {
  title: string;
  action?: PageHeaderAction;
  topInset?: number;
  style?: StyleProp<ViewStyle>;
};

const DOT = 6;

const useStyles = makeStyles((t) => ({
  root: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingTop: t.space[5],
    paddingBottom: t.space[2],
    paddingHorizontal: t.layout.screenX,
  },
  title: {
    fontSize: t.typography.screenTitle.fontSize,
    lineHeight: t.typography.screenTitle.lineHeight,
    fontWeight: t.typography.screenTitle.fontWeight,
    letterSpacing: t.typography.screenTitle.letterSpacing,
    color: t.colors.title,
  },
  action: {
    width: t.minTouchSize,
    height: t.minTouchSize,
    marginRight: -t.space[2],
    alignItems: 'center',
    justifyContent: 'center',
  },
  text: { paddingHorizontal: t.space[2], width: 'auto' },
  framed: {
    height: t.space[8] + t.space[1],
    marginVertical: -(t.space[1] / 2),
    flexDirection: 'row',
    alignItems: 'center',
    gap: t.space[2],
    paddingHorizontal: t.space[3],
    borderRadius: t.radius.lg,
    backgroundColor: t.colors.surface,
  },
  dot: {
    position: 'absolute',
    top: t.space[2] + t.space[1],
    right: t.space[2] + t.space[1],
    width: DOT,
    height: DOT,
    borderRadius: t.radius.full,
    backgroundColor: t.colors.primary,
  },
}));

export type HeaderButtonProps = {
  label: string;
  primary?: boolean;
  disabled?: boolean;
  onPress: () => void;
};

export function HeaderButton({
  label,
  primary,
  disabled,
  onPress,
}: HeaderButtonProps) {
  const s = useStyles();
  return (
    <PressableBase
      onPress={onPress}
      disabled={disabled}
      accessibilityRole="button"
      accessibilityLabel={label}
      style={[s.action, s.text]}
    >
      <Text
        variant="bodyLg"
        weight="medium"
        tone={disabled ? 'muted' : primary ? 'primary' : undefined}
      >
        {label}
      </Text>
    </PressableBase>
  );
}

export function headerButton(props: HeaderButtonProps) {
  return function HeaderSlot() {
    return <HeaderButton {...props} />;
  };
}

export function PageHeader({
  title,
  action,
  topInset = 0,
  style,
}: PageHeaderProps) {
  const t = useTheme();
  const s = useStyles();
  return (
    <View style={[s.root, { paddingTop: t.space[5] + topInset }, style]}>
      <Text accessibilityRole="header" style={s.title}>
        {title}
      </Text>
      {action?.icon && action.framed ? (
        <PressableBase
          onPress={action.onPress}
          accessibilityRole="button"
          accessibilityLabel={action.label}
          feedback="small"
          style={s.framed}
        >
          {renderIcon(action.icon, {
            color: t.colors.title,
            size: t.iconSize.md,
          })}
          <Text variant="body" weight="medium">
            {action.label}
          </Text>
        </PressableBase>
      ) : action && !action.icon ? (
        <HeaderButton label={action.label} onPress={action.onPress} />
      ) : action ? (
        <PressableBase
          onPress={action.onPress}
          accessibilityRole="button"
          accessibilityLabel={action.label}
          style={s.action}
        >
          {renderIcon(action.icon, {
            color: t.colors.mutedForeground,
            size: t.iconSize.md,
          })}
          {action.badge ? <View style={s.dot} /> : null}
        </PressableBase>
      ) : null}
    </View>
  );
}
