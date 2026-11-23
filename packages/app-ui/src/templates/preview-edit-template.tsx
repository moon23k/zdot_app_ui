import { useState, type ReactNode } from 'react';
import { Text as RNText, View, type LayoutChangeEvent } from 'react-native';
import Animated, {
  interpolateColor,
  useAnimatedStyle,
} from 'react-native-reanimated';
import { HeaderButton } from '../components/page-header/page-header';
import { Text } from '../components/text/text';
import { ToastHost } from '../components/toast/toast';
import { ChevronGlyph, MobileGlyph, MonitorGlyph } from '../internal/glyphs';
import { haptic } from '../internal/haptics';
import { renderIcon, type IconSlot } from '../internal/icon';
import { useSwitch } from '../internal/motion';
import { PressableBase } from '../internal/pressable-base';
import { SteadyText } from '../internal/steady-text';
import { useSlide } from '../internal/use-slide';
import { useTheme } from '../theme/theme-provider';
import { makeStyles } from '../utils/styles';
import { HeaderIconButton, type TemplateAction } from './parts';

export type PreviewDevice = 'web' | 'mobile';

export type PreviewEditChoice = {
  key: string;
  label: string;
  art?: IconSlot;
  selected: boolean;
  disabled?: boolean;
  onPress: () => void;
};

export type PreviewEditTool = {
  key: string;
  label: string;
  icon: IconSlot;
  disabled?: boolean;
};

export type PreviewEditTemplateProps = {
  title: string;
  saveAction: TemplateAction;
  onBack?: () => void;
  backLabel?: string;
  device: PreviewDevice;
  onDeviceChange: (device: PreviewDevice) => void;
  deviceNotes?: Partial<Record<PreviewDevice, string>>;
  compareLabel?: string;
  onCompareChange?: (comparing: boolean) => void;
  children: ReactNode;
  choices?: readonly PreviewEditChoice[];
  tray?: ReactNode;
  tools: readonly PreviewEditTool[];
  tool: string;
  onToolChange: (key: string) => void;
  topInset?: number;
  bottomInset?: number;
};

const DEVICES: readonly {
  value: PreviewDevice;
  label: string;
  icon: IconSlot;
}[] = [
  { value: 'web', label: '웹', icon: MonitorGlyph },
  { value: 'mobile', label: '모바일', icon: MobileGlyph },
];

const EDGE = 1.5;

const useStyles = makeStyles((t) => ({
  root: { flex: 1, backgroundColor: t.colors.background },
  head: {
    height: t.headerHeight,
    flexDirection: 'row',
    alignItems: 'center',
    paddingLeft: t.space[1],
    paddingRight: t.space[2],
  },
  title: { flex: 1 },
  titleAlone: { paddingLeft: t.space[4] },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: t.layout.groupGap,
    paddingBottom: t.space[2],
  },
  segment: {
    height: t.space[10],
    flexDirection: 'row',
    padding: t.space[1],
    borderRadius: t.radius.full,
    backgroundColor: t.colors.border,
  },
  option: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: t.space[1],
    minWidth: t.space[16],
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
  optionLabel: {
    fontFamily: t.fontFamily,
    fontSize: t.typography.eyebrow.fontSize,
    lineHeight: t.typography.eyebrow.lineHeight,
    fontWeight: '500',
    color: t.colors.mutedForeground,
  },
  strong: { fontWeight: '600' },
  note: {
    fontFamily: t.fontFamily,
    fontSize: t.typography.eyebrow.fontSize,
    lineHeight: t.typography.eyebrow.lineHeight,
    fontWeight: '500',
    color: t.colors.faint,
  },
  noteOn: { color: t.colors.primary },
  compare: {
    height: t.space[8],
    justifyContent: 'center',
    paddingHorizontal: t.space[3],
    borderRadius: t.radius.full,
    borderWidth: EDGE,
    borderColor: t.colors.surface,
    backgroundColor: t.colors.surface,
    boxShadow: t.shadow.sm,
  },
  compareOn: {
    borderColor: t.colors.primaryEdge,
    backgroundColor: t.colors.selectSurface,
  },
  compareLabelOn: { color: t.colors.selectForeground },
  card: {
    flex: 1,
    minHeight: 0,
    marginHorizontal: t.layout.groupGap,
    borderRadius: t.radius.lg,
    backgroundColor: t.colors.surface,
    boxShadow: t.shadow.lift,
  },
  stage: { flex: 1, borderRadius: t.radius.lg, overflow: 'hidden' },
  bar: {
    marginTop: t.space[3],
    marginHorizontal: t.layout.groupGap,
    paddingTop: t.space[3],
    paddingHorizontal: t.space[3],
    borderRadius: t.radius.xl,
    backgroundColor: t.colors.surface,
    boxShadow: t.shadow.md,
  },
  choices: {
    height: t.space[16] + t.space[5],
    flexDirection: 'row',
    gap: t.space[2],
  },
  tile: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    gap: t.space[2],
    borderRadius: t.radius.lg,
    borderWidth: EDGE,
    borderColor: t.colors.background,
    backgroundColor: t.colors.background,
  },
  tileOn: {
    borderColor: t.colors.primaryEdge,
    backgroundColor: t.colors.selectSurface,
  },
  tileLabel: {
    fontFamily: t.fontFamily,
    fontSize: t.typography.eyebrow.fontSize,
    lineHeight: t.typography.eyebrow.lineHeight,
    fontWeight: '400',
    color: t.colors.title,
  },
  tileLabelOn: { fontWeight: '600', color: t.colors.selectForeground },
  tabs: {
    flexDirection: 'row',
    marginTop: t.space[2],
    borderTopWidth: 1,
    borderTopColor: t.colors.line,
  },
  tabOff: { opacity: 1 },
  tab: {
    flex: 1,
    minHeight: t.space[16],
    alignItems: 'center',
    justifyContent: 'center',
    gap: t.space[1],
  },
}));

function DeviceOption({
  label,
  icon,
  note,
  selected,
  onPress,
  onLayout,
}: {
  label: string;
  icon: IconSlot;
  note?: string;
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
      accessibilityLabel={note ? `${label} ${note}` : label}
      feedback="none"
      onPress={onPress}
      onLayout={onLayout}
      style={s.option}
    >
      {renderIcon(icon, {
        color: selected ? ink : idle,
        size: t.iconSize.sm,
      })}
      <SteadyText
        selected={selected}
        style={s.optionLabel}
        strongStyle={s.strong}
        animatedStyle={tone}
      >
        {label}
      </SteadyText>
      {note ? (
        <RNText
          numberOfLines={1}
          maxFontSizeMultiplier={t.maxFontScale}
          style={[s.note, selected && s.noteOn]}
        >
          {note}
        </RNText>
      ) : null}
    </PressableBase>
  );
}

function ChoiceTile({ choice }: { choice: PreviewEditChoice }) {
  const t = useTheme();
  const s = useStyles();
  const { selected } = choice;
  return (
    <PressableBase
      accessibilityRole="button"
      accessibilityLabel={choice.label}
      accessibilityState={{ selected, disabled: choice.disabled }}
      feedback="small"
      disabled={choice.disabled}
      onPress={() => {
        haptic('select');
        choice.onPress();
      }}
      style={[s.tile, selected && s.tileOn]}
    >
      {choice.art
        ? renderIcon(choice.art, {
            color: selected ? t.colors.primaryEdge : t.colors.input,
            size: t.space[6],
          })
        : null}
      <RNText
        numberOfLines={1}
        maxFontSizeMultiplier={t.maxFontScale}
        style={[s.tileLabel, selected && s.tileLabelOn]}
      >
        {choice.label}
      </RNText>
    </PressableBase>
  );
}

function ToolTab({
  tool,
  selected,
  onPress,
}: {
  tool: PreviewEditTool;
  selected: boolean;
  onPress: () => void;
}) {
  const t = useTheme();
  const s = useStyles();
  const off = !!tool.disabled;
  const color = off
    ? t.colors.disabledForeground
    : selected
      ? t.colors.primary
      : t.colors.mutedForeground;
  return (
    <PressableBase
      accessibilityRole="tab"
      accessibilityLabel={tool.label}
      accessibilityState={{ selected, disabled: off }}
      feedback="small"
      disabled={off}
      disabledStyle={s.tabOff}
      onPress={onPress}
      style={s.tab}
    >
      {renderIcon(tool.icon, { color, size: t.iconSize.md })}
      <Text
        variant="caption"
        weight={selected ? 'semibold' : 'regular'}
        numberOfLines={1}
        style={{ color }}
      >
        {tool.label}
      </Text>
    </PressableBase>
  );
}

export function PreviewEditTemplate({
  title,
  saveAction,
  onBack,
  backLabel = '뒤로',
  device,
  onDeviceChange,
  deviceNotes,
  compareLabel = '원래와 비교',
  onCompareChange,
  children,
  choices,
  tray,
  tools,
  tool,
  onToolChange,
  topInset = 0,
  bottomInset = 0,
}: PreviewEditTemplateProps) {
  const t = useTheme();
  const s = useStyles();
  const slide = useSlide(device);
  const [comparing, setComparing] = useState(false);
  const [barHeight, setBarHeight] = useState(0);
  const barBottom = bottomInset + t.space[4];
  const hold = (next: boolean) => {
    setComparing(next);
    onCompareChange?.(next);
  };
  return (
    <View style={[s.root, { paddingTop: topInset }]}>
      <View style={s.head}>
        {onBack ? (
          <HeaderIconButton
            icon={ChevronGlyph}
            label={backLabel}
            onPress={onBack}
            size={24}
            mirror
          />
        ) : null}
        <Text
          variant="title"
          accessibilityRole="header"
          numberOfLines={1}
          style={[s.title, !onBack && s.titleAlone]}
        >
          {title}
        </Text>
        <HeaderButton
          label={saveAction.label}
          primary
          disabled={saveAction.disabled || saveAction.loading}
          onPress={saveAction.onPress}
        />
      </View>
      <View style={s.row}>
        <View accessibilityRole="tablist" style={s.segment}>
          <Animated.View pointerEvents="none" style={[s.thumb, slide.box]} />
          {DEVICES.map((option) => {
            const selected = option.value === device;
            return (
              <DeviceOption
                key={option.value}
                label={option.label}
                icon={option.icon}
                note={deviceNotes?.[option.value]}
                selected={selected}
                onPress={() => {
                  if (selected) return;
                  haptic('select');
                  onDeviceChange(option.value);
                }}
                onLayout={slide.measure(option.value)}
              />
            );
          })}
        </View>
        {onCompareChange ? (
          <PressableBase
            onPress={() => {}}
            onPressIn={() => hold(true)}
            onPressOut={() => hold(false)}
            accessibilityRole="button"
            accessibilityLabel={compareLabel}
            accessibilityState={{ selected: comparing }}
            feedback="small"
            style={[s.compare, comparing && s.compareOn]}
          >
            <Text
              variant="caption"
              weight={comparing ? 'semibold' : 'medium'}
              style={comparing ? s.compareLabelOn : undefined}
            >
              {compareLabel}
            </Text>
          </PressableBase>
        ) : null}
      </View>
      <View style={s.card}>
        <View style={s.stage}>{children}</View>
      </View>
      <View
        onLayout={(event) => setBarHeight(event.nativeEvent.layout.height)}
        style={[s.bar, { marginBottom: barBottom }]}
      >
        {tray ??
          (choices?.length ? (
            <View style={s.choices}>
              {choices.map((choice) => (
                <ChoiceTile key={choice.key} choice={choice} />
              ))}
            </View>
          ) : null)}
        <View accessibilityRole="tablist" style={s.tabs}>
          {tools.map((item) => (
            <ToolTab
              key={item.key}
              tool={item}
              selected={item.key === tool}
              onPress={() => {
                if (item.key !== tool) onToolChange(item.key);
              }}
            />
          ))}
        </View>
      </View>
      <ToastHost bottom={barBottom + barHeight + t.space[3]} />
    </View>
  );
}
