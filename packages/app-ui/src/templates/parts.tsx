import { Children, Fragment, type ReactNode } from 'react';
import { View, type StyleProp, type ViewStyle } from 'react-native';
import {
  Button,
  type ButtonSize,
  type ButtonVariant,
} from '../components/button/button';
import { Text } from '../components/text/text';
import { AlertGlyph } from '../internal/glyphs';
import { renderIcon, type IconSlot } from '../internal/icon';
import { PressableBase } from '../internal/pressable-base';
import { useTheme } from '../theme/theme-provider';
import { makeStyles } from '../utils/styles';

export type TemplateAction = {
  label: string;
  onPress: () => void;
  disabled?: boolean;
  loading?: boolean;
  done?: boolean;
  onBlocked?: () => void;
  icon?: IconSlot;
  outline?: boolean;
  beside?: boolean;
  quiet?: boolean;
};

export type NoticeReason = 'error' | 'money' | 'irreversible' | 'legal';

export type TemplateNotice = { reason: NoticeReason; text: string };

const useStyles = makeStyles((t) => ({
  bar: {
    gap: t.layout.itemGap,
    paddingHorizontal: t.layout.screenX,
    paddingTop: t.layout.footerTop,
    backgroundColor: t.colors.background,
  },
  notice: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: t.space[2],
    marginHorizontal: t.layout.screenX,
    paddingVertical: t.space[3],
    paddingHorizontal: t.space[4],
    borderRadius: t.radius.md,
    backgroundColor: t.colors.muted,
  },
  noticeText: { flex: 1 },
  section: { paddingBottom: t.space[2] },
  sectionHead: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingTop: t.space[4],
    paddingBottom: t.space[2],
    paddingHorizontal: t.layout.screenX,
  },
  inset: { paddingHorizontal: t.layout.screenX },
  card: {
    marginTop: t.space[2],
    paddingBottom: t.space[2],
    overflow: 'hidden',
    backgroundColor: t.colors.surface,
  },
  cardHead: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: t.layout.screenX,
    paddingTop: t.space[5],
    paddingBottom: t.space[1],
  },
  cardLine: { height: 1, backgroundColor: t.colors.muted },
  split: {
    flexDirection: 'row',
    backgroundColor: t.colors.surface,
    borderTopWidth: 1,
    borderTopColor: t.colors.border,
  },
  side: { flex: 1 },
  main: { flex: 2 },
  headerIcon: {
    width: t.minTouchSize,
    height: t.minTouchSize,
    alignItems: 'center',
    justifyContent: 'center',
  },
  mirror: { transform: [{ scaleX: -1 }] },
  dots: {
    flexDirection: 'row',
    justifyContent: 'center',
    gap: t.space[2],
  },
  dot: {
    width: t.space[2],
    height: t.space[2],
    borderRadius: t.radius.full,
    backgroundColor: t.colors.input,
  },
  dotOn: { width: t.space[5], backgroundColor: t.colors.primary },
}));

export function HeaderIconButton({
  icon,
  label,
  onPress,
  size,
  mirror = false,
}: {
  icon: IconSlot;
  label: string;
  onPress: () => void;
  size?: number;
  mirror?: boolean;
}) {
  const t = useTheme();
  const s = useStyles();
  return (
    <PressableBase
      accessibilityLabel={label}
      onPress={onPress}
      style={[s.headerIcon, mirror && s.mirror]}
    >
      {renderIcon(icon, {
        color: t.colors.foreground,
        size: size ?? t.iconSize.md,
      })}
    </PressableBase>
  );
}

export function PageDots({
  keys,
  index,
  style,
}: {
  keys: readonly string[];
  index: number;
  style?: StyleProp<ViewStyle>;
}) {
  const s = useStyles();
  return (
    <View style={[s.dots, style]}>
      {keys.map((key, i) => (
        <View key={key} style={[s.dot, i === index && s.dotOn]} />
      ))}
    </View>
  );
}

export function ActionButton({
  action,
  variant,
  size = 'lg',
  style,
}: {
  action: TemplateAction;
  variant?: ButtonVariant;
  size?: ButtonSize;
  style?: StyleProp<ViewStyle>;
}) {
  return (
    <Button
      size={size}
      variant={variant ?? (action.quiet ? 'secondary' : 'primary')}
      style={style}
      onPress={action.onPress}
      disabled={action.disabled}
      loading={action.loading}
      done={action.done}
      onBlocked={action.onBlocked}
      leftIcon={action.icon}
    >
      {action.label}
    </Button>
  );
}

export function BottomBar({
  primaryAction,
  secondaryAction,
  bottomInset = 0,
  split = false,
}: {
  primaryAction: TemplateAction;
  secondaryAction?: TemplateAction;
  bottomInset?: number;
  split?: boolean;
}) {
  const t = useTheme();
  const s = useStyles();
  if (split || secondaryAction?.outline || secondaryAction?.beside) {
    return (
      <View
        style={[
          s.bar,
          s.split,
          { paddingBottom: t.layout.footerBottom + bottomInset },
        ]}
      >
        {secondaryAction ? (
          <View style={s.side}>
            <ActionButton action={secondaryAction} variant="secondary" />
          </View>
        ) : null}
        <View style={s.main}>
          <ActionButton action={primaryAction} />
        </View>
      </View>
    );
  }
  return (
    <View
      style={[s.bar, { paddingBottom: t.layout.footerBottom + bottomInset }]}
    >
      <ActionButton action={primaryAction} />
      {secondaryAction ? (
        <ActionButton action={secondaryAction} variant="ghost" size="md" />
      ) : null}
    </View>
  );
}

export function Notice({ notice }: { notice: TemplateNotice }) {
  const t = useTheme();
  const s = useStyles();
  const danger = notice.reason === 'error';
  return (
    <View accessibilityRole={danger ? 'alert' : undefined} style={s.notice}>
      <AlertGlyph
        color={danger ? t.colors.danger : t.colors.mutedForeground}
        size={t.iconSize.md}
      />
      <Text
        variant="label"
        tone={danger ? 'danger' : 'default'}
        style={s.noticeText}
      >
        {notice.text}
      </Text>
    </View>
  );
}

export function ListSection({
  title,
  count,
  action,
  inset,
  card,
  children,
}: {
  title?: string;
  count?: number | string;
  action?: ReactNode;
  inset?: boolean;
  card?: boolean;
  children: ReactNode;
}) {
  const s = useStyles();
  if (card) {
    const rows = Children.toArray(children);
    return (
      <View style={s.card}>
        {title ? (
          <View style={s.cardHead}>
            <Text variant="body" weight="semibold" accessibilityRole="header">
              {title}
              {count !== undefined ? (
                <Text variant="body" tone="muted">
                  {` ${count}`}
                </Text>
              ) : null}
            </Text>
            {action}
          </View>
        ) : null}
        {rows.map((row, index) => (
          <Fragment key={index}>
            {index ? <View style={s.cardLine} /> : null}
            {row}
          </Fragment>
        ))}
      </View>
    );
  }
  return (
    <View style={s.section}>
      {title ? (
        <View style={s.sectionHead}>
          <Text
            variant="label"
            tone="muted"
            weight="semibold"
            accessibilityRole="header"
          >
            {title}
          </Text>
          {action}
        </View>
      ) : null}
      {inset ? <View style={s.inset}>{children}</View> : children}
    </View>
  );
}
