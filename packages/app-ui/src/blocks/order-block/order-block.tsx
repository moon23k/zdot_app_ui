import type { ReactNode } from 'react';
import Animated from 'react-native-reanimated';
import { DrawnCheck } from '../../internal/drawn-check';
import { FILL_FROM, usePop } from '../../internal/motion';
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
  onLongPress?: () => void;
  selected?: boolean;
  style?: StyleProp<ViewStyle>;
};

const MARK = 22;
const PHOTO = 72;

const useStyles = makeStyles((t) => ({
  root: {
    marginTop: t.space[2],
    backgroundColor: t.colors.surface,
  },
  mid: {
    flexDirection: 'row',
    gap: t.space[3],
    paddingHorizontal: t.layout.screenX,
    paddingVertical: t.space[4],
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
    paddingHorizontal: t.layout.screenX,
    paddingBottom: t.space[4],
  },
  tall: { minHeight: t.controlSize.sm },
  mark: {
    alignSelf: 'center',
    width: MARK,
    height: MARK,
    borderRadius: t.radius.sm,
    borderWidth: 1.5,
    borderColor: t.colors.input,
    backgroundColor: t.colors.surface,
    alignItems: 'center',
    justifyContent: 'center',
  },
  markOn: { borderColor: t.colors.primary, backgroundColor: t.colors.primary },
  swipe: {
    flex: 1,
    marginTop: t.space[2],
    alignItems: 'flex-end',
    justifyContent: 'center',
    paddingHorizontal: t.layout.screenX,
    backgroundColor: t.colors.primary,
  },
  swipeLabel: {
    fontFamily: t.fontFamily,
    fontSize: t.typography.body.fontSize,
    lineHeight: t.typography.body.lineHeight,
    fontWeight: '600',
    color: t.colors.primaryForeground,
  },
}));

export function SwipeAction({ label }: { label: string }) {
  const t = useTheme();
  const s = useStyles();
  return (
    <View style={s.swipe}>
      <Text style={s.swipeLabel} maxFontSizeMultiplier={t.maxFontScale}>
        {label}
      </Text>
    </View>
  );
}

export function OrderBlock({
  title,
  meta,
  amount,
  image,
  overline,
  badge,
  action,
  onPress,
  onLongPress,
  selected,
  style,
}: OrderBlockProps) {
  const t = useTheme();
  const s = useStyles();
  const picking = selected !== undefined;
  const pop = usePop(!!selected, FILL_FROM);
  return (
    <View style={[s.root, style]}>
      <PressableBase
        onPress={onPress}
        onLongPress={onLongPress}
        accessibilityRole={picking ? 'checkbox' : 'button'}
        accessibilityState={picking ? { checked: !!selected } : undefined}
        accessibilityLabel={[overline, title, meta, amount]
          .filter(Boolean)
          .join(', ')}
        feedback="row"
        style={s.mid}
      >
        {picking ? (
          <Animated.View style={[s.mark, selected && s.markOn, pop]}>
            <DrawnCheck
              on={!!selected}
              color={t.colors.primaryForeground}
              size={t.iconSize.sm}
            />
          </Animated.View>
        ) : null}
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
      {(badge || action) && !picking ? (
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
