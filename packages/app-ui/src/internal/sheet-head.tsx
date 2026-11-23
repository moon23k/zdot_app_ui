import type { ReactNode } from 'react';
import { Text, View } from 'react-native';
import { useTheme } from '../theme/theme-provider';
import { makeStyles } from '../utils/styles';
import { CloseGlyph, SparklesGlyph } from './glyphs';
import { renderIcon, type IconSlot } from './icon';
import { PressableBase } from './pressable-base';

export type SheetHeadAction = {
  icon: IconSlot;
  label: string;
  onPress: () => void;
};

export type SheetHeadProps = {
  title: string;
  onClose: () => void;
  ai?: boolean;
  end?: ReactNode;
  action?: SheetHeadAction;
  closeLabel?: string;
};

const useStyles = makeStyles((t) => ({
  handle: {
    alignSelf: 'center',
    width: 36,
    height: 4,
    borderRadius: t.radius.full,
    backgroundColor: t.colors.border,
  },
  head: {
    height: t.headerHeight,
    flexDirection: 'row',
    alignItems: 'center',
    gap: t.space[2],
    paddingLeft: t.space[5],
    paddingRight: t.space[2],
  },
  title: {
    ...t.typography.bodyLg,
    fontFamily: t.fontFamily,
    fontWeight: '600',
    color: t.colors.title,
    flexShrink: 1,
  },
  end: { marginLeft: 'auto', flexDirection: 'row', alignItems: 'center' },
  close: {
    width: t.minTouchSize,
    height: t.minTouchSize,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: t.radius.full,
  },
}));

export function SheetHead({
  title,
  onClose,
  ai,
  end,
  action,
  closeLabel = '닫기',
}: SheetHeadProps) {
  const t = useTheme();
  const s = useStyles();
  return (
    <View>
      <View style={s.handle} />
      <View style={s.head}>
        {ai ? (
          <SparklesGlyph color={t.colors.title} size={t.iconSize.md} />
        ) : null}
        <Text
          accessibilityRole="header"
          numberOfLines={1}
          maxFontSizeMultiplier={t.maxFontScale}
          style={s.title}
        >
          {title}
        </Text>
        <View style={s.end}>
          {end}
          {action ? (
            <PressableBase
              onPress={action.onPress}
              accessibilityLabel={action.label}
              style={s.close}
            >
              {renderIcon(action.icon, {
                color: t.colors.title,
                size: t.iconSize.md,
              })}
            </PressableBase>
          ) : null}
          <PressableBase
            onPress={onClose}
            accessibilityLabel={closeLabel}
            style={s.close}
          >
            <CloseGlyph color={t.colors.title} size={t.iconSize.md} />
          </PressableBase>
        </View>
      </View>
    </View>
  );
}
