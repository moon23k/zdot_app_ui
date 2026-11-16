import type { ReactNode } from 'react';
import { Text, View, type StyleProp, type ViewStyle } from 'react-native';
import { Button } from '../../components/button/button';
import { Photo } from '../../components/photo/photo';
import type { IconSlot } from '../../internal/icon';
import { PressableBase } from '../../internal/pressable-base';
import { useTheme } from '../../theme/theme-provider';
import { makeStyles } from '../../utils/styles';

export type OrderBlockAction = {
  label: string;
  icon?: IconSlot;
  loading?: boolean;
  onPress: () => void;
};

export type OrderBlockProps = {
  title: string;
  meta: string;
  amount: string;
  image?: string | null;
  overline?: string;
  badge?: ReactNode;
  action?: OrderBlockAction;
  onPress?: () => void;
  style?: StyleProp<ViewStyle>;
};

const PHOTO = 76;

const useStyles = makeStyles((t) => ({
  root: {
    marginHorizontal: t.layout.screenX,
    marginBottom: t.space[2],
    borderRadius: t.radius.lg,
    backgroundColor: t.colors.surface,
  },
  pressed: { backgroundColor: t.colors.muted },
  mid: {
    flexDirection: 'row',
    gap: t.space[3],
    paddingHorizontal: t.layout.screenX,
    paddingVertical: t.space[3],
  },
  photo: { width: PHOTO, height: PHOTO },
  body: { flex: 1, minWidth: 0 },
  overline: {
    fontFamily: t.fontFamily,
    fontSize: t.typography.eyebrow.fontSize,
    lineHeight: t.typography.eyebrow.lineHeight,
    fontWeight: '500',
    color: t.colors.mutedForeground,
  },
  title: {
    fontFamily: t.fontFamily,
    fontSize: t.typography.bodyLg.fontSize,
    lineHeight: t.typography.bodyLg.lineHeight,
    fontWeight: '500',
    color: t.colors.title,
  },
  meta: {
    fontFamily: t.fontFamily,
    fontSize: t.typography.label.fontSize,
    lineHeight: t.typography.label.lineHeight,
    color: t.colors.mutedForeground,
  },
  amount: {
    marginTop: 'auto',
    fontFamily: t.fontFamily,
    fontSize: t.typography.bodyLg.fontSize,
    lineHeight: t.typography.bodyLg.lineHeight,
    fontWeight: '600',
    color: t.colors.title,
    fontVariant: ['tabular-nums'],
  },
  bottom: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: t.space[2],
    paddingLeft: t.layout.screenX,
    paddingRight: t.space[3],
    paddingVertical: t.space[2],
    borderTopWidth: 1,
    borderTopColor: t.colors.muted,
  },
  tall: { minHeight: t.controlSize.sm + t.space[4] },
}));

export function OrderBlock({
  title,
  meta,
  amount,
  image,
  overline,
  badge,
  action,
  onPress,
  style,
}: OrderBlockProps) {
  const t = useTheme();
  const s = useStyles();
  return (
    <View style={[s.root, style]}>
      <PressableBase
        onPress={onPress}
        disabled={!onPress}
        accessibilityRole={onPress ? 'button' : undefined}
        accessibilityLabel={[overline, title, meta, amount]
          .filter(Boolean)
          .join(', ')}
        pressedStyle={s.pressed}
        style={s.mid}
      >
        <Photo
          source={{ uri: image ?? '' }}
          seed={title}
          radius={t.radius.md}
          style={s.photo}
        />
        <View style={s.body}>
          {overline ? (
            <Text style={s.overline} maxFontSizeMultiplier={t.maxFontScale}>
              {overline}
            </Text>
          ) : null}
          <Text
            style={s.title}
            numberOfLines={1}
            maxFontSizeMultiplier={t.maxFontScale}
          >
            {title}
          </Text>
          <Text
            style={s.meta}
            numberOfLines={1}
            maxFontSizeMultiplier={t.maxFontScale}
          >
            {meta}
          </Text>
          <Text style={s.amount} maxFontSizeMultiplier={t.maxFontScale}>
            {amount}
          </Text>
        </View>
      </PressableBase>
      {badge || action ? (
        <View style={[s.bottom, action && s.tall]}>
          {badge ?? <View />}
          {action ? (
            <Button
              size="sm"
              leftIcon={action.icon}
              loading={action.loading}
              onPress={action.onPress}
            >
              {action.label}
            </Button>
          ) : null}
        </View>
      ) : null}
    </View>
  );
}
