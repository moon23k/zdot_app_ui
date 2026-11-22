import type { ReactNode } from 'react';
import {
  Image,
  type ImageSourcePropType,
  KeyboardAvoidingView,
  ScrollView,
  Text as RNText,
  View,
} from 'react-native';
import Animated, { FadeIn } from 'react-native-reanimated';
import { Button } from '../../components/button/button';
import { Text } from '../../components/text/text';
import { ChevronGlyph } from '../../internal/glyphs';
import { useReducedMotion } from '../../internal/use-reduced-motion';
import { useTheme } from '../../theme/theme-provider';
import { withAlpha } from '../../utils/color';
import { gradientStyle, makeStyles } from '../../utils/styles';
import {
  HeaderIconButton,
  Notice,
  type TemplateNotice,
} from '../../templates/parts';

export type StepAction = {
  label: string;
  onPress: () => void;
  disabled?: boolean;
  loading?: boolean;
};

export type StepChosen = {
  label: string;
  uri?: string | null;
  source?: ImageSourcePropType;
};

export type StepScreenProps = {
  top?: ReactNode;
  title?: string;
  total?: number;
  current?: number;
  onBack?: () => void;
  backLabel?: string;
  primaryAction?: StepAction;
  floatingAction?: boolean;
  chosen?: StepChosen | null;
  compact?: boolean;
  fill?: boolean;
  secondaryAction?: StepAction;
  actions?: ReactNode;
  notice?: TemplateNotice;
  bottomInset?: number;
  children?: ReactNode;
};

const TITLE_SIZE = 26;
const TITLE_LEADING = 34;
const TITLE_TRACKING = -0.8;
const DOCK = 68;
const DOCK_GO = 112;
const DOCK_RADIUS = 14;
const DOCK_THUMB = 44;
const DOCK_LABEL_SIZE = 16;
const DOCK_LABEL_LEADING = 22;
const THUMB_INSET = '14%';
const THUMB_PHOTO = '72%';

const useStyles = makeStyles((t) => ({
  root: { flex: 1, backgroundColor: t.colors.background },
  main: { flex: 1 },
  header: {
    height: t.headerHeight,
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: t.space[1],
  },
  count: {
    marginLeft: 'auto',
    paddingRight: t.layout.screenX - t.space[1],
  },
  countText: {
    fontFamily: t.fontFamily,
    fontSize: t.typography.body.fontSize,
    lineHeight: t.typography.body.lineHeight,
    fontWeight: '600',
    color: t.colors.faint,
  },
  countNow: { color: t.colors.title },
  body: {
    gap: t.layout.titleGap,
    paddingTop: t.layout.screenTop,
    paddingHorizontal: t.layout.screenX,
    paddingBottom: t.layout.footerBottom,
  },
  compact: { gap: t.space[4], paddingTop: t.space[3] },
  fill: {
    flex: 1,
    paddingTop: t.space[2],
    paddingHorizontal: t.layout.screenX,
    paddingBottom: t.space[1],
  },
  title: {
    fontFamily: t.fontFamily,
    fontSize: TITLE_SIZE,
    lineHeight: TITLE_LEADING,
    letterSpacing: TITLE_TRACKING,
    fontWeight: '600',
    color: t.colors.title,
  },
  footer: {
    gap: t.layout.itemGap,
    paddingHorizontal: t.layout.screenX,
    paddingTop: t.layout.footerTop,
    backgroundColor: t.colors.background,
  },
  floating: {
    position: 'absolute',
    left: 0,
    right: 0,
    bottom: 0,
    alignItems: 'center',
    backgroundColor: 'transparent',
  },
  wide: { alignItems: 'stretch' },
  docked: { paddingHorizontal: t.space[3] },
  veil: {
    position: 'absolute',
    left: 0,
    right: 0,
    bottom: 0,
  },
  pill: {
    borderRadius: t.controlSize.lg / 2,
    paddingHorizontal: t.space[10],
  },
  raised: { boxShadow: t.shadow.md },
  backing: {
    borderRadius: t.controlSize.lg / 2,
    backgroundColor: t.colors.background,
  },
  plain: {
    borderRadius: t.radius.lg,
    backgroundColor: t.colors.background,
  },
  dock: {
    height: DOCK,
    flexDirection: 'row',
    alignItems: 'center',
    gap: t.space[3],
    paddingLeft: t.space[3],
    paddingRight: t.space[2],
    borderRadius: t.radius.xl,
    backgroundColor: t.colors.raised,
    boxShadow: t.shadow.lift,
  },
  thumb: {
    width: DOCK_THUMB,
    height: DOCK_THUMB,
    borderRadius: DOCK_RADIUS,
    backgroundColor: t.colors.recess,
  },
  thumbPhoto: {
    position: 'absolute',
    left: THUMB_INSET,
    top: THUMB_INSET,
    width: THUMB_PHOTO,
    height: THUMB_PHOTO,
  },
  chosen: {
    flex: 1,
    fontFamily: t.fontFamily,
    fontSize: DOCK_LABEL_SIZE,
    lineHeight: DOCK_LABEL_LEADING,
    fontWeight: '600',
    color: t.colors.title,
  },
  go: { width: DOCK_GO, borderRadius: DOCK_RADIUS },
}));

function Dock({ chosen, action }: { chosen: StepChosen; action: StepAction }) {
  const t = useTheme();
  const s = useStyles();
  const reduced = useReducedMotion();
  const photo = chosen.uri ? { uri: chosen.uri } : chosen.source;
  return (
    <Animated.View
      entering={reduced ? undefined : FadeIn.duration(t.motion.duration.base)}
      style={s.dock}
    >
      <View style={s.thumb}>
        {photo ? (
          <Image source={photo} style={s.thumbPhoto} resizeMode="contain" />
        ) : null}
      </View>
      <RNText
        numberOfLines={1}
        maxFontSizeMultiplier={t.maxFontScale}
        style={s.chosen}
      >
        {chosen.label}
      </RNText>
      <Button
        size="lg"
        onPress={action.onPress}
        disabled={action.disabled}
        loading={action.loading}
        style={s.go}
      >
        {action.label}
      </Button>
    </Animated.View>
  );
}

export function StepScreen({
  top,
  title,
  total,
  current = 0,
  onBack,
  backLabel = '이전',
  primaryAction,
  floatingAction = false,
  chosen,
  compact = false,
  fill = false,
  secondaryAction,
  actions,
  notice,
  bottomInset = 0,
  children,
}: StepScreenProps) {
  const t = useTheme();
  const s = useStyles();
  const step = total ? Math.min(total, Math.max(1, current + 1)) : 0;
  const footerBottom = t.layout.footerBottom + bottomInset;
  const docked = floatingAction && chosen !== undefined;
  const dock = docked && chosen && primaryAction ? chosen : null;
  const dockBottom = t.space[5] + bottomInset;
  const control = dock ? DOCK : t.controlSize.lg;
  const below = dock ? dockBottom : footerBottom;
  const veil = below + control + t.space[16];
  const solid = Math.round(((veil - below - control / 2) / veil) * 100);
  const bg = t.colors.background;
  const content = (
    <>
      {top}
      {title ? (
        <Text accessibilityRole="header" style={s.title}>
          {title}
        </Text>
      ) : null}
      {children}
    </>
  );
  return (
    <KeyboardAvoidingView behavior="padding" style={s.root}>
      {onBack || total ? (
        <View style={s.header}>
          {onBack ? (
            <HeaderIconButton
              icon={ChevronGlyph}
              label={backLabel}
              onPress={onBack}
              size={24}
              mirror
            />
          ) : null}
          {total ? (
            <View
              accessible
              accessibilityRole="progressbar"
              accessibilityLabel={`${total}단계 중 ${step}단계`}
              accessibilityValue={{ min: 1, max: total, now: step }}
              style={s.count}
            >
              <RNText
                maxFontSizeMultiplier={t.maxFontScale}
                style={s.countText}
              >
                <RNText style={s.countNow}>{step}</RNText>
                {` / ${total}`}
              </RNText>
            </View>
          ) : null}
        </View>
      ) : null}
      <View style={s.main}>
        {fill ? (
          <View style={s.fill}>{content}</View>
        ) : (
          <ScrollView
            contentContainerStyle={[
              s.body,
              compact && s.compact,
              floatingAction && {
                paddingBottom: dock
                  ? dockBottom + DOCK + t.space[3]
                  : footerBottom + t.layout.footerTop * 2 + t.controlSize.lg,
              },
            ]}
            keyboardShouldPersistTaps="handled"
          >
            {content}
          </ScrollView>
        )}
        {notice ? <Notice notice={notice} /> : null}
        <View
          pointerEvents={floatingAction ? 'box-none' : 'auto'}
          style={[
            s.footer,
            floatingAction && s.floating,
            docked && s.wide,
            dock && s.docked,
            { paddingBottom: below },
          ]}
        >
          {docked ? (
            <View
              pointerEvents="none"
              style={[
                s.veil,
                { height: veil },
                gradientStyle(
                  `linear-gradient(180deg, ${withAlpha(bg, 0)}, ${bg} ${solid}%)`
                ),
              ]}
            />
          ) : null}
          {actions}
          {dock && primaryAction ? (
            <Dock chosen={dock} action={primaryAction} />
          ) : primaryAction ? (
            <View
              style={docked ? s.plain : floatingAction ? s.backing : undefined}
            >
              <Button
                size="lg"
                onPress={primaryAction.onPress}
                disabled={primaryAction.disabled}
                loading={primaryAction.loading}
                style={
                  floatingAction && !docked
                    ? [s.pill, !primaryAction.disabled && s.raised]
                    : undefined
                }
              >
                {primaryAction.label}
              </Button>
            </View>
          ) : null}
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
      </View>
    </KeyboardAvoidingView>
  );
}
