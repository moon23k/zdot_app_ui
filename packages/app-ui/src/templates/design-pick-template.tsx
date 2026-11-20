import type { ReactNode } from 'react';
import { View, type LayoutChangeEvent } from 'react-native';
import Animated, {
  interpolateColor,
  useAnimatedStyle,
} from 'react-native-reanimated';
import { Text } from '../components/text/text';
import { ChevronGlyph } from '../internal/glyphs';
import { haptic } from '../internal/haptics';
import { useSwitch } from '../internal/motion';
import { PressableBase } from '../internal/pressable-base';
import { SteadyText } from '../internal/steady-text';
import { useSlide } from '../internal/use-slide';
import { useTheme } from '../theme/theme-provider';
import { tokens } from '../theme/tokens';
import { makeStyles } from '../utils/styles';
import { ActionButton, HeaderIconButton, type TemplateAction } from './parts';

export type DesignPickOption<T extends string> = {
  value: T;
  label: string;
};

export type DesignPickTool = {
  key: string;
  label: string;
  icon: ReactNode;
  selected?: boolean;
  onPress: () => void;
};

export type DesignPickTemplateProps<T extends string> = {
  options: readonly DesignPickOption<T>[];
  value: T;
  onValueChange: (value: T) => void;
  preview: ReactNode;
  primaryAction: TemplateAction;
  tools?: readonly DesignPickTool[];
  tray?: ReactNode;
  onBack?: () => void;
  backLabel?: string;
  topInset?: number;
  bottomInset?: number;
};

const BAR_BORDER = 1;

export function designPickBarSpace(bottomInset = 0): number {
  const gap = tokens.space[2];
  return bottomInset + gap * 3 + BAR_BORDER * 2 + tokens.controlSize.lg;
}

const useStyles = makeStyles((t) => ({
  root: { flex: 1, backgroundColor: t.colors.background },
  top: {
    height: t.headerHeight,
    alignItems: 'center',
    justifyContent: 'center',
  },
  back: {
    position: 'absolute',
    left: t.space[1],
    top: 0,
    bottom: 0,
    justifyContent: 'center',
  },
  segment: {
    height: t.controlSize.sm,
    flexDirection: 'row',
    padding: t.space[1],
    borderRadius: t.radius.full,
    backgroundColor: t.colors.border,
  },
  option: {
    minWidth: t.space[16],
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: t.space[3],
    borderRadius: t.radius.full,
  },
  thumb: {
    position: 'absolute',
    left: 0,
    top: 0,
    borderRadius: t.radius.full,
    backgroundColor: t.colors.surface,
    boxShadow: t.shadow.sm,
  },
  label: {
    fontFamily: t.fontFamily,
    fontSize: t.typography.label.fontSize,
    lineHeight: t.typography.label.lineHeight,
    fontWeight: '500',
    color: t.colors.mutedForeground,
  },
  strong: { fontWeight: '600' },
  stage: { flex: 1, overflow: 'hidden' },
  bar: {
    position: 'absolute',
    left: t.space[4],
    right: t.space[4],
    padding: t.space[2],
    borderRadius: t.radius.xl,
    borderWidth: BAR_BORDER,
    borderColor: t.colors.border,
    backgroundColor: t.colors.surface,
    boxShadow: t.shadow.md,
  },
  tray: {
    paddingTop: t.space[2],
    paddingHorizontal: t.space[2],
    paddingBottom: t.space[4],
    marginBottom: t.space[2],
    borderBottomWidth: 1,
    borderBottomColor: t.colors.border,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: t.space[1],
  },
  tool: {
    width: t.space[16],
    height: t.controlSize.lg,
    alignItems: 'center',
    justifyContent: 'center',
    gap: t.space[1],
    borderRadius: t.radius.lg,
  },
  toolOn: { backgroundColor: t.colors.muted },
  go: { flex: 1 },
}));

function Option({
  label,
  selected,
  onPress,
  onLayout,
}: {
  label: string;
  selected: boolean;
  onPress: () => void;
  onLayout: (event: LayoutChangeEvent) => void;
}) {
  const t = useTheme();
  const s = useStyles();
  const on = useSwitch(selected, 'base');
  const idle = t.colors.mutedForeground;
  const ink = t.colors.title;
  const tone = useAnimatedStyle(() => ({
    color: interpolateColor(on.value, [0, 1], [idle, ink]),
  }));
  return (
    <PressableBase
      accessibilityRole="tab"
      accessibilityState={{ selected }}
      accessibilityLabel={label}
      feedback="none"
      onPress={onPress}
      onLayout={onLayout}
      style={s.option}
    >
      <SteadyText
        selected={selected}
        style={s.label}
        strongStyle={s.strong}
        animatedStyle={tone}
      >
        {label}
      </SteadyText>
    </PressableBase>
  );
}

function Tool({ tool }: { tool: DesignPickTool }) {
  const s = useStyles();
  const selected = !!tool.selected;
  return (
    <PressableBase
      accessibilityRole="button"
      accessibilityLabel={tool.label}
      accessibilityState={{ selected }}
      feedback="small"
      onPress={tool.onPress}
      style={[s.tool, selected && s.toolOn]}
    >
      {tool.icon}
      <Text
        variant="caption"
        tone={selected ? 'default' : 'muted'}
        weight={selected ? 'semibold' : 'regular'}
        numberOfLines={1}
      >
        {tool.label}
      </Text>
    </PressableBase>
  );
}

export function DesignPickTemplate<T extends string>({
  options,
  value,
  onValueChange,
  preview,
  primaryAction,
  tools,
  tray,
  onBack,
  backLabel = '뒤로',
  topInset = 0,
  bottomInset = 0,
}: DesignPickTemplateProps<T>) {
  const t = useTheme();
  const s = useStyles();
  const slide = useSlide(value);
  return (
    <View style={[s.root, { paddingTop: topInset }]}>
      <View style={s.top}>
        {onBack ? (
          <View style={s.back}>
            <HeaderIconButton
              icon={ChevronGlyph}
              label={backLabel}
              onPress={onBack}
              size={24}
              mirror
            />
          </View>
        ) : null}
        <View accessibilityRole="tablist" style={s.segment}>
          <Animated.View pointerEvents="none" style={[s.thumb, slide.box]} />
          {options.map((option) => {
            const selected = option.value === value;
            return (
              <Option
                key={option.value}
                label={option.label}
                selected={selected}
                onPress={() => {
                  if (selected) return;
                  haptic('select');
                  onValueChange(option.value);
                }}
                onLayout={slide.measure(option.value)}
              />
            );
          })}
        </View>
      </View>
      <View style={s.stage}>{preview}</View>
      <View style={[s.bar, { bottom: bottomInset + t.space[2] }]}>
        {tray ? <View style={s.tray}>{tray}</View> : null}
        <View style={s.row}>
          {tools?.map((tool) => (
            <Tool key={tool.key} tool={tool} />
          ))}
          <ActionButton action={primaryAction} style={s.go} />
        </View>
      </View>
    </View>
  );
}
