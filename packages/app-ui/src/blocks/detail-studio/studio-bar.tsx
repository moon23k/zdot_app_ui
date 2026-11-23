import type { ReactNode } from 'react';
import { View } from 'react-native';
import { Button } from '../../components/button/button';
import { Text } from '../../components/text/text';
import { ChevronGlyph, CloseGlyph } from '../../internal/glyphs';
import { PressableBase } from '../../internal/pressable-base';
import { useTheme } from '../../theme/theme-provider';
import { makeStyles } from '../../utils/styles';

export type StudioBarProps = {
  title: string;
  onClose: () => void;
  closeLabel?: string;
  leading?: 'close' | 'back';
  topInset?: number;
  tone?: 'background' | 'surface';
  tag?: ReactNode;
  action?: {
    label: string;
    onPress: () => void;
    disabled?: boolean;
    loading?: boolean;
  };
};

const useStyles = makeStyles((t) => ({
  bar: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: t.space[2],
  },
  surface: {
    backgroundColor: t.colors.surface,
    borderBottomWidth: 1,
    borderBottomColor: t.colors.border,
  },
  icon: {
    width: t.minTouchSize,
    height: t.minTouchSize,
    borderRadius: t.radius.full,
    alignItems: 'center',
    justifyContent: 'center',
  },
  mirror: { transform: [{ scaleX: -1 }] },
  center: {
    position: 'absolute',
    left: t.space[16] + t.space[8],
    right: t.space[16] + t.space[8],
    top: 0,
    bottom: 0,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: t.space[2],
  },
  title: {
    ...t.typography.bodyLg,
    fontWeight: '600',
    color: t.colors.title,
    flexShrink: 1,
  },
  end: { marginLeft: 'auto', paddingRight: t.space[2] },
}));

export function StudioBar({
  title,
  onClose,
  closeLabel,
  leading = 'close',
  topInset = 0,
  tone = 'background',
  tag,
  action,
}: StudioBarProps) {
  const t = useTheme();
  const s = useStyles();
  const back = leading === 'back';
  const Glyph = back ? ChevronGlyph : CloseGlyph;
  return (
    <View
      style={[
        s.bar,
        {
          height: t.headerHeight + topInset,
          paddingTop: topInset,
          backgroundColor: t.colors.background,
        },
        tone === 'surface' && s.surface,
      ]}
    >
      <View style={[s.center, { top: topInset }]} pointerEvents="box-none">
        <Text accessibilityRole="header" numberOfLines={1} style={s.title}>
          {title}
        </Text>
        {tag}
      </View>
      <PressableBase
        onPress={onClose}
        accessibilityLabel={closeLabel ?? (back ? '뒤로' : '닫기')}
        style={s.icon}
      >
        <View style={back && s.mirror}>
          <Glyph color={t.colors.title} size={t.iconSize.md} />
        </View>
      </PressableBase>
      {action ? (
        <View style={s.end}>
          <Button
            size="sm"
            onPress={action.onPress}
            disabled={action.disabled}
            loading={action.loading}
          >
            {action.label}
          </Button>
        </View>
      ) : null}
    </View>
  );
}
