import { Text, View, type StyleProp, type ViewStyle } from 'react-native';
import { IconButton } from '../../components/icon-button/icon-button';
import { Photo } from '../../components/photo/photo';
import { ChevronGlyph, ClockGlyph } from '../../internal/glyphs';
import { renderIcon, type IconSlot } from '../../internal/icon';
import { PressableBase } from '../../internal/pressable-base';
import { useTheme } from '../../theme/theme-provider';
import { makeStyles } from '../../utils/styles';

export type StoreTopAction = {
  icon: IconSlot;
  label: string;
  dot?: boolean;
  onPress: () => void;
};

export type StoreTopCell = {
  key: string;
  icon: IconSlot;
  label: string;
  count: number;
  urgent?: number;
  onPress?: () => void;
};

export type StoreTopProps = {
  name: string;
  logo?: string | null;
  status?: { label: string; live: boolean };
  onSwitch?: () => void;
  actions?: readonly StoreTopAction[];
  cells: readonly StoreTopCell[];
  topInset?: number;
  style?: StyleProp<ViewStyle>;
};

const LOGO = 40;
const LIVE = 6;
const CELL_ICON = 14;
const URGENT_ICON = 12;

const useStyles = makeStyles((t) => ({
  root: {
    paddingHorizontal: t.layout.screenX,
    paddingBottom: t.space[4],
    gap: t.space[4],
    backgroundColor: t.colors.surface,
    borderBottomLeftRadius: t.radius.xl,
    borderBottomRightRadius: t.radius.xl,
  },
  head: { flexDirection: 'row', alignItems: 'center', gap: t.space[3] },
  logo: {
    width: LOGO,
    height: LOGO,
    borderRadius: t.radius.full,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: t.colors.muted,
    overflow: 'hidden',
  },
  initial: {
    fontFamily: t.fontFamily,
    fontSize: t.typography.bodyLg.fontSize,
    lineHeight: t.typography.bodyLg.lineHeight,
    fontWeight: '600',
    color: t.colors.title,
  },
  photo: { width: LOGO, height: LOGO },
  body: { flex: 1, minWidth: 0 },
  nameRow: { flexDirection: 'row', alignItems: 'center', gap: t.space[1] / 2 },
  name: {
    flexShrink: 1,
    fontFamily: t.fontFamily,
    fontSize: t.typography.bodyLg.fontSize,
    lineHeight: t.typography.bodyLg.lineHeight,
    fontWeight: '600',
    color: t.colors.title,
  },
  chevron: { transform: [{ rotate: '90deg' }] },
  status: { flexDirection: 'row', alignItems: 'center', gap: t.space[1] },
  dot: { width: LIVE, height: LIVE, borderRadius: t.radius.full },
  statusText: {
    fontFamily: t.fontFamily,
    fontSize: t.typography.caption.fontSize,
    lineHeight: t.typography.caption.lineHeight,
    color: t.colors.mutedForeground,
  },
  actions: { flexDirection: 'row', gap: t.space[2] },
  cells: { flexDirection: 'row' },
  cell: { flex: 1, alignItems: 'center', gap: t.space[1] / 2 },
  divider: { borderLeftWidth: 1, borderLeftColor: t.colors.muted },
  pressed: { opacity: t.opacity.pressed },
  key: { flexDirection: 'row', alignItems: 'center', gap: t.space[1] },
  keyText: {
    fontFamily: t.fontFamily,
    fontSize: t.typography.eyebrow.fontSize,
    lineHeight: t.typography.eyebrow.lineHeight,
    color: t.colors.mutedForeground,
  },
  count: {
    fontFamily: t.fontFamily,
    fontSize: t.typography.display.fontSize,
    lineHeight: t.typography.display.lineHeight,
    fontWeight: '600',
    color: t.colors.primary,
    fontVariant: ['tabular-nums'],
  },
  zero: { fontWeight: '400', color: t.colors.input },
  urgent: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: t.space[1] / 2,
    minHeight: t.typography.caption.lineHeight,
  },
  urgentText: {
    fontFamily: t.fontFamily,
    fontSize: t.typography.caption.fontSize,
    lineHeight: t.typography.caption.lineHeight,
    fontWeight: '600',
    color: t.colors.warningText,
  },
}));

export function StoreTop({
  name,
  logo,
  status,
  onSwitch,
  actions = [],
  cells,
  topInset = 0,
  style,
}: StoreTopProps) {
  const t = useTheme();
  const s = useStyles();
  return (
    <View style={[s.root, { paddingTop: topInset + t.space[3] }, style]}>
      <View style={s.head}>
        <View style={s.logo}>
          {logo ? (
            <Photo source={{ uri: logo }} style={s.photo} />
          ) : (
            <Text style={s.initial} maxFontSizeMultiplier={t.maxFontScale}>
              {name.slice(0, 1)}
            </Text>
          )}
        </View>
        <View style={s.body}>
          <PressableBase
            onPress={onSwitch}
            disabled={!onSwitch}
            accessibilityRole={onSwitch ? 'button' : undefined}
            accessibilityLabel={name}
            pressedStyle={s.pressed}
            style={s.nameRow}
          >
            <Text
              style={s.name}
              numberOfLines={1}
              maxFontSizeMultiplier={t.maxFontScale}
            >
              {name}
            </Text>
            {onSwitch ? (
              <View style={s.chevron}>
                <ChevronGlyph
                  color={t.colors.mutedForeground}
                  size={t.iconSize.sm}
                />
              </View>
            ) : null}
          </PressableBase>
          {status ? (
            <View style={s.status}>
              <View
                style={[
                  s.dot,
                  {
                    backgroundColor: status.live
                      ? t.colors.success
                      : t.colors.input,
                  },
                ]}
              />
              <Text style={s.statusText} maxFontSizeMultiplier={t.maxFontScale}>
                {status.label}
              </Text>
            </View>
          ) : null}
        </View>
        {actions.length ? (
          <View style={s.actions}>
            {actions.map((action) => (
              <IconButton
                key={action.label}
                icon={action.icon}
                accessibilityLabel={action.label}
                dot={action.dot}
                onPress={action.onPress}
              />
            ))}
          </View>
        ) : null}
      </View>
      <View style={s.cells}>
        {cells.map((cell, i) => (
          <PressableBase
            key={cell.key}
            onPress={cell.onPress}
            disabled={!cell.onPress}
            accessibilityRole={cell.onPress ? 'button' : undefined}
            accessibilityLabel={`${cell.label} ${cell.count}`}
            pressedStyle={s.pressed}
            style={[s.cell, i > 0 && s.divider]}
          >
            <View style={s.key}>
              {renderIcon(cell.icon, {
                color: t.colors.mutedForeground,
                size: CELL_ICON,
              })}
              <Text style={s.keyText} maxFontSizeMultiplier={t.maxFontScale}>
                {cell.label}
              </Text>
            </View>
            <Text
              style={[s.count, cell.count === 0 && s.zero]}
              maxFontSizeMultiplier={t.maxFontScale}
            >
              {cell.count}
            </Text>
            <View style={s.urgent}>
              {cell.urgent ? (
                <>
                  <ClockGlyph color={t.colors.warningText} size={URGENT_ICON} />
                  <Text
                    style={s.urgentText}
                    maxFontSizeMultiplier={t.maxFontScale}
                  >
                    {cell.urgent}
                  </Text>
                </>
              ) : null}
            </View>
          </PressableBase>
        ))}
      </View>
    </View>
  );
}
