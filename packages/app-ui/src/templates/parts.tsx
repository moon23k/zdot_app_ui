import { Children, Fragment, type ReactNode } from 'react';
import { View } from 'react-native';
import { Button } from '../components/button/button';
import { Text } from '../components/text/text';
import { AlertGlyph } from '../internal/glyphs';
import type { IconSlot } from '../internal/icon';
import { useTheme } from '../theme/theme-provider';
import { makeStyles } from '../utils/styles';

export type TemplateAction = {
  label: string;
  onPress: () => void;
  disabled?: boolean;
  loading?: boolean;
  done?: boolean;
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
}));

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
            <Button
              size="lg"
              variant="secondary"
              onPress={secondaryAction.onPress}
              disabled={secondaryAction.disabled}
              loading={secondaryAction.loading}
            >
              {secondaryAction.label}
            </Button>
          </View>
        ) : null}
        <View style={s.main}>
          <Button
            size="lg"
            variant={primaryAction.quiet ? 'secondary' : 'primary'}
            onPress={primaryAction.onPress}
            disabled={primaryAction.disabled}
            loading={primaryAction.loading}
            done={primaryAction.done}
            leftIcon={primaryAction.icon}
          >
            {primaryAction.label}
          </Button>
        </View>
      </View>
    );
  }
  return (
    <View
      style={[s.bar, { paddingBottom: t.layout.footerBottom + bottomInset }]}
    >
      <Button
        size="lg"
        variant={primaryAction.quiet ? 'secondary' : 'primary'}
        onPress={primaryAction.onPress}
        disabled={primaryAction.disabled}
        loading={primaryAction.loading}
        done={primaryAction.done}
        leftIcon={primaryAction.icon}
      >
        {primaryAction.label}
      </Button>
      {secondaryAction ? (
        <Button
          variant="ghost"
          onPress={secondaryAction.onPress}
          disabled={secondaryAction.disabled}
          loading={secondaryAction.loading}
        >
          {secondaryAction.label}
        </Button>
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
  boxed,
  children,
}: {
  title?: string;
  count?: number | string;
  action?: ReactNode;
  inset?: boolean;
  card?: boolean;
  boxed?: boolean;
  children: ReactNode;
}) {
  const s = useStyles();
  if (boxed) {
    return (
      <ListSection card title={title} count={count} action={action}>
        {children}
      </ListSection>
    );
  }
  if (card) {
    const rows = Children.toArray(children);
    return (
      <View style={s.card}>
        {title ? (
          <View style={s.cardHead}>
            <Text variant="body" weight="bold" accessibilityRole="header">
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
