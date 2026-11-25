import { useState, type ReactNode } from 'react';
import { View } from 'react-native';
import { Button } from '../../components/button/button';
import { Text } from '../../components/text/text';
import { CheckGlyph, ChevronGlyph, CloseGlyph } from '../../internal/glyphs';
import { renderIcon, type IconSlot } from '../../internal/icon';
import { PressableBase } from '../../internal/pressable-base';
import { useTheme } from '../../theme/theme-provider';
import { makeStyles } from '../../utils/styles';

export type StudioBarTool = {
  key: string;
  icon: IconSlot;
  label: string;
  onPress?: () => void;
  active?: boolean;
  mirror?: boolean;
};

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
  tools?: readonly StudioBarTool[];
  confirm?: { label: string; onPress: () => void };
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
  end: {
    marginLeft: 'auto',
    flexDirection: 'row',
    alignItems: 'center',
  },
  done: { paddingHorizontal: t.space[3] },
  tool: {
    width: t.minTouchSize,
    height: t.minTouchSize,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: t.radius.md,
  },
  toolOn: { backgroundColor: t.colors.muted },
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
  tools,
  confirm,
}: StudioBarProps) {
  const t = useTheme();
  const s = useStyles();
  const [width, setWidth] = useState(0);
  const [end, setEnd] = useState(0);
  const back = leading === 'back';
  const Glyph = back ? ChevronGlyph : CloseGlyph;
  const pad = t.space[2];
  const lead = pad + t.minTouchSize;
  const trail = pad + end;
  const side = Math.max(lead, trail);
  const even = width - side * 2 >= t.space[16] * 2;
  const center = even
    ? { left: side, right: side }
    : { left: lead, right: trail };
  return (
    <View
      onLayout={(e) => setWidth(e.nativeEvent.layout.width)}
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
      <View
        style={[s.center, center, { top: topInset }]}
        pointerEvents="box-none"
      >
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
      <View style={s.end} onLayout={(e) => setEnd(e.nativeEvent.layout.width)}>
        {tools?.map((tool) => (
          <PressableBase
            key={tool.key}
            onPress={tool.onPress}
            disabled={!tool.onPress}
            disabledStyle={{}}
            accessibilityLabel={tool.label}
            accessibilityState={
              tool.active === undefined ? undefined : { selected: tool.active }
            }
            style={[s.tool, tool.active && s.toolOn]}
          >
            <View style={tool.mirror && s.mirror}>
              {renderIcon(tool.icon, {
                color: tool.onPress
                  ? t.colors.title
                  : t.colors.disabledForeground,
                size: t.iconSize.md,
              })}
            </View>
          </PressableBase>
        ))}
        {action ? (
          <Button
            variant="ghost"
            point
            size="md"
            style={s.done}
            onPress={action.onPress}
            disabled={action.disabled}
            loading={action.loading}
          >
            {action.label}
          </Button>
        ) : null}
        {confirm ? (
          <PressableBase
            onPress={confirm.onPress}
            accessibilityLabel={confirm.label}
            style={s.tool}
          >
            <CheckGlyph color={t.colors.primary} size={t.iconSize.md} />
          </PressableBase>
        ) : null}
      </View>
    </View>
  );
}
