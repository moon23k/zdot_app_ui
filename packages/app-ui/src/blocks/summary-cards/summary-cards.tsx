import type { ReactNode } from 'react';
import { View, type StyleProp, type ViewStyle } from 'react-native';
import { Avatar } from '../../components/avatar/avatar';
import { Button } from '../../components/button/button';
import { Photo } from '../../components/photo/photo';
import { ProgressBar } from '../../components/progress-bar/progress-bar';
import { StatusBadge } from '../../components/status-badge/status-badge';
import { Switch } from '../../components/switch/switch';
import { Text } from '../../components/text/text';
import { UsersGlyph } from '../../internal/glyphs';
import { PressableBase } from '../../internal/pressable-base';
import { useTheme } from '../../theme/theme-provider';
import { makeStyles } from '../../utils/styles';

const useStyles = makeStyles((t) => ({
  panel: {
    marginTop: t.space[2],
    paddingHorizontal: t.layout.screenX,
    paddingVertical: t.space[5],
    gap: t.space[3],
    backgroundColor: t.colors.surface,
  },
  row: { flexDirection: 'row', alignItems: 'center', gap: t.space[3] },
  between: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: t.space[3],
  },
  grow: { flex: 1, gap: t.space[1] },
  buttons: { flexDirection: 'row', gap: t.space[2] },
  meta: { flexDirection: 'row', alignItems: 'center', gap: t.space[1] },
  thumb: { width: 72 },
  side: { flex: 1, gap: t.space[1] },
  end: { alignItems: 'flex-end' },
  tiles: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: t.layout.itemGap,
    marginTop: t.layout.groupGap,
    paddingHorizontal: t.layout.screenX,
  },
  tile: {
    flexBasis: '48%',
    flexGrow: 1,
    gap: t.space[1],
    padding: t.space[3],
    borderRadius: t.radius.lg,
    backgroundColor: t.colors.surface,
  },
  band: { flexDirection: 'row', gap: t.space[1] },
  month: { flex: 1, alignItems: 'center', gap: t.space[1] },
  cell: { alignSelf: 'stretch', height: 28, borderRadius: t.radius.sm },
  on: { backgroundColor: t.colors.primary },
  off: { backgroundColor: t.colors.muted },
}));

export type PanelProps = {
  children: ReactNode;
  onPress?: () => void;
  accessibilityLabel?: string;
  style?: StyleProp<ViewStyle>;
};

export function Panel({
  children,
  onPress,
  accessibilityLabel,
  style,
}: PanelProps) {
  const s = useStyles();
  if (onPress) {
    return (
      <PressableBase
        onPress={onPress}
        accessibilityLabel={accessibilityLabel}
        style={[s.panel, style]}
        feedback="row"
      >
        {children}
      </PressableBase>
    );
  }
  return <View style={[s.panel, style]}>{children}</View>;
}

export type SummaryHeaderProps = {
  title: string;
  image?: string | null;
  seed?: string;
  avatar?: string;
  badge?: string;
  subtitle?: string;
  people?: string;
  actions?: readonly { key: string; label: string; onPress: () => void }[];
  onPress?: () => void;
  children?: ReactNode;
};

export function SummaryHeader({
  title,
  image,
  seed,
  avatar,
  badge,
  subtitle,
  people,
  actions,
  onPress,
  children,
}: SummaryHeaderProps) {
  const t = useTheme();
  const s = useStyles();
  return (
    <Panel onPress={onPress} accessibilityLabel={onPress ? title : undefined}>
      <View style={s.row}>
        {image !== undefined ? (
          <Photo
            source={{ uri: image ?? '' }}
            seed={seed ?? title}
            radius={t.radius.md}
            style={s.thumb}
          />
        ) : null}
        {avatar !== undefined ? <Avatar size="md" uri={avatar} /> : null}
        <View style={s.grow}>
          <Text variant="title" weight="bold" numberOfLines={1}>
            {title}
          </Text>
          {subtitle ? (
            <Text variant="label" tone="muted" numberOfLines={1}>
              {subtitle}
            </Text>
          ) : null}
          {people ? (
            <View style={s.meta}>
              <UsersGlyph
                color={t.colors.mutedForeground}
                size={t.iconSize.sm}
              />
              <Text variant="label" tone="muted" numberOfLines={1}>
                {people}
              </Text>
            </View>
          ) : null}
        </View>
        {badge ? <StatusBadge tone="point">{badge}</StatusBadge> : null}
      </View>
      {actions?.length ? (
        <View style={s.buttons}>
          {actions.map((item) => (
            <Button
              key={item.key}
              variant="outline"
              size="sm"
              style={s.side}
              onPress={item.onPress}
            >
              {item.label}
            </Button>
          ))}
        </View>
      ) : null}
      {children}
    </Panel>
  );
}

export type MetricCardProps = {
  label: string;
  value: string;
  caption?: string;
  aside?: string;
  emphasis?: boolean;
  action?: ReactNode;
  children?: ReactNode;
};

export function MetricCard({
  label,
  value,
  caption,
  aside,
  emphasis = false,
  action,
  children,
}: MetricCardProps) {
  const s = useStyles();
  return (
    <Panel>
      <View style={s.between}>
        <View style={s.grow}>
          <Text variant="label" tone="muted">
            {label}
          </Text>
          <Text
            variant={emphasis ? 'screenTitle' : 'title'}
            weight="bold"
            tone={emphasis ? 'point' : undefined}
          >
            {value}
          </Text>
          {caption ? (
            <Text variant="label" tone="muted">
              {caption}
            </Text>
          ) : null}
        </View>
        {aside ? (
          <Text variant="bodyLg" weight="bold" tone="point">
            {aside}
          </Text>
        ) : null}
        {action}
      </View>
      {children}
    </Panel>
  );
}

export type ValueTile = {
  key: string;
  label: string;
  value: string;
  emphasis?: boolean;
  onPress?: () => void;
};

export type ValueTilesProps = { items: readonly ValueTile[] };

export function ValueTiles({ items }: ValueTilesProps) {
  const s = useStyles();
  return (
    <View style={s.tiles}>
      {items.map((item) => {
        const body = (
          <>
            <Text variant="label" tone="muted" numberOfLines={1}>
              {item.label}
            </Text>
            <Text
              variant="bodyLg"
              weight="bold"
              tone={item.emphasis ? 'point' : undefined}
              numberOfLines={1}
            >
              {item.value}
            </Text>
          </>
        );
        return item.onPress ? (
          <PressableBase
            key={item.key}
            accessibilityRole="button"
            accessibilityLabel={`${item.label} ${item.value}`}
            onPress={item.onPress}
            feedback="row"
            style={s.tile}
          >
            {body}
          </PressableBase>
        ) : (
          <View key={item.key} style={s.tile}>
            {body}
          </View>
        );
      })}
    </View>
  );
}

export type TimeSpanCardProps = {
  startLabel: string;
  start: string;
  endLabel: string;
  end: string;
  middle: string;
  onStartPress?: () => void;
  onEndPress?: () => void;
  onMiddlePress?: () => void;
};

export function TimeSpanCard({
  startLabel,
  start,
  endLabel,
  end,
  middle,
  onStartPress,
  onEndPress,
  onMiddlePress,
}: TimeSpanCardProps) {
  const s = useStyles();
  return (
    <Panel>
      <View style={s.row}>
        <PressableBase
          accessibilityRole="button"
          accessibilityLabel={`${startLabel} ${start}`}
          onPress={onStartPress}
          style={s.side}
        >
          <Text variant="label" tone="muted">
            {startLabel}
          </Text>
          <Text variant="title" weight="bold">
            {start}
          </Text>
        </PressableBase>
        <PressableBase
          accessibilityRole="button"
          accessibilityLabel={middle}
          onPress={onMiddlePress}
        >
          <StatusBadge>{middle}</StatusBadge>
        </PressableBase>
        <PressableBase
          accessibilityRole="button"
          accessibilityLabel={`${endLabel} ${end}`}
          onPress={onEndPress}
          style={[s.side, s.end]}
        >
          <Text variant="label" tone="muted">
            {endLabel}
          </Text>
          <Text variant="title" weight="bold">
            {end}
          </Text>
        </PressableBase>
      </View>
    </Panel>
  );
}

export type YearBandProps = {
  label: string;
  months: readonly boolean[];
};

export function YearBand({ label, months }: YearBandProps) {
  const s = useStyles();
  return (
    <Panel>
      <Text variant="label" tone="muted">
        {label}
      </Text>
      <View style={s.band}>
        {months.map((on, index) => (
          <View key={index} style={s.month}>
            <View style={[s.cell, on ? s.on : s.off]} />
            <Text variant="caption" tone="muted">
              {`${index + 1}`}
            </Text>
          </View>
        ))}
      </View>
    </Panel>
  );
}

export type UsageCardProps = {
  title: string;
  used: number;
  total: number;
  caption: string;
};

export function UsageCard({ title, used, total, caption }: UsageCardProps) {
  const s = useStyles();
  return (
    <Panel>
      <View style={s.between}>
        <Text variant="bodyLg" weight="semibold">
          {title}
        </Text>
        <Text variant="label" tone="muted">
          {caption}
        </Text>
      </View>
      <ProgressBar done={used} total={total} plain />
    </Panel>
  );
}

export type ToggleCardProps = {
  title: string;
  description?: string;
  value: boolean;
  disabled?: boolean;
  onValueChange: (value: boolean) => void;
};

export function ToggleCard({
  title,
  description,
  value,
  disabled,
  onValueChange,
}: ToggleCardProps) {
  const s = useStyles();
  return (
    <Panel>
      <View style={s.between}>
        <View style={s.grow}>
          <Text variant="bodyLg" weight="bold">
            {title}
          </Text>
          {description ? (
            <Text variant="label" tone="muted">
              {description}
            </Text>
          ) : null}
        </View>
        <Switch
          accessibilityLabel={title}
          value={value}
          disabled={disabled}
          onValueChange={onValueChange}
        />
      </View>
    </Panel>
  );
}
