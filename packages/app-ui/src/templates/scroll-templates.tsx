import type { ReactNode } from 'react';
import {
  KeyboardAvoidingView,
  RefreshControl,
  ScrollView,
  View,
} from 'react-native';
import { Photo } from '../components/photo/photo';
import { Text } from '../components/text/text';
import { CopyGlyph } from '../internal/glyphs';
import { PressableBase } from '../internal/pressable-base';
import { useTheme } from '../theme/theme-provider';
import { makeStyles } from '../utils/styles';
import {
  BottomBar,
  Notice,
  type TemplateAction,
  type TemplateNotice,
} from './parts';

export type TemplateHero = {
  title: string;
  titleSuffix?: string;
  overline?: ReactNode;
  captionTone?: 'muted' | 'warning';
  aside?: ReactNode;
  caption?: string;
  onCopy?: () => void;
  copyLabel?: string;
  children?: ReactNode;
};

type ScrollTemplateProps = {
  hero?: TemplateHero;
  top?: ReactNode;
  heading?: { title: string; caption?: string; image?: string | null };
  notice?: TemplateNotice;
  primaryAction?: TemplateAction;
  secondaryAction?: TemplateAction;
  refreshing?: boolean;
  onRefresh?: () => void;
  bottomInset?: number;
  footer?: ReactNode;
  children: ReactNode;
};

const MEDIA = 64;

const useStyles = makeStyles((t) => ({
  root: { flex: 1, backgroundColor: t.colors.background },
  content: { flexGrow: 1, paddingBottom: t.layout.sectionGap },
  top: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: t.layout.itemGap,
    paddingTop: t.space[2],
    paddingHorizontal: t.layout.screenX,
  },
  notice: { paddingTop: t.layout.groupGap },
  heading: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: t.space[3],
    paddingTop: t.space[4],
    paddingBottom: t.space[2],
    paddingHorizontal: t.layout.screenX,
  },
  headingText: { flex: 1, gap: t.space[1] },
  hero: {
    paddingTop: t.space[1],
    paddingBottom: t.space[6],
    paddingHorizontal: t.layout.screenX,
    gap: t.space[1],
    backgroundColor: t.colors.surface,
  },
  heroHead: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: t.space[2] + t.space[1] / 2,
  },
  heroTitle: {
    flex: 1,
    fontFamily: t.fontFamily,
    fontSize: t.typography.screenTitle.fontSize,
    lineHeight: t.typography.screenTitle.lineHeight,
    fontWeight: '600',
    color: t.colors.title,
  },
  heroCaption: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: t.space[1] + t.space[1] / 2,
  },
  heroCaptionText: {
    fontFamily: t.fontFamily,
    fontSize: t.typography.eyebrow.fontSize,
    lineHeight: t.typography.eyebrow.lineHeight,
    color: t.colors.mutedForeground,
  },
  heroBody: { marginTop: t.space[4] },
  heroWarn: { color: t.colors.warningText, fontWeight: '500' },
  heroSuffix: {
    fontSize: t.typography.label.fontSize,
    fontWeight: '400',
    color: t.colors.mutedForeground,
  },
  media: { width: MEDIA },
}));

function ScrollTemplate({
  hero,
  top,
  heading,
  notice,
  primaryAction,
  secondaryAction,
  refreshing = false,
  onRefresh,
  bottomInset = 0,
  footer,
  children,
}: ScrollTemplateProps) {
  const t = useTheme();
  const s = useStyles();
  const heroCopyIcon = t.iconSize.sm;
  return (
    <KeyboardAvoidingView behavior="padding" style={s.root}>
      <ScrollView
        contentContainerStyle={[
          s.content,
          primaryAction || footer
            ? null
            : { paddingBottom: t.layout.sectionGap + bottomInset },
        ]}
        keyboardShouldPersistTaps="handled"
        refreshControl={
          onRefresh ? (
            <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
          ) : undefined
        }
      >
        {hero ? (
          <View style={s.hero}>
            {hero.overline}
            <View style={s.heroHead}>
              <Text accessibilityRole="header" style={s.heroTitle}>
                {hero.title}
                {hero.titleSuffix ? (
                  <Text style={s.heroSuffix}>{` ${hero.titleSuffix}`}</Text>
                ) : null}
              </Text>
              {hero.aside}
            </View>
            {hero.caption ? (
              <PressableBase
                accessibilityRole={hero.onCopy ? 'button' : undefined}
                accessibilityLabel={hero.onCopy ? hero.copyLabel : undefined}
                disabled={!hero.onCopy}
                onPress={hero.onCopy}
                style={s.heroCaption}
              >
                <Text
                  style={[
                    s.heroCaptionText,
                    hero.captionTone === 'warning' && s.heroWarn,
                  ]}
                >
                  {hero.caption}
                </Text>
                {hero.onCopy ? (
                  <CopyGlyph
                    color={t.colors.mutedForeground}
                    size={heroCopyIcon}
                  />
                ) : null}
              </PressableBase>
            ) : null}
            {hero.children ? (
              <View style={s.heroBody}>{hero.children}</View>
            ) : null}
          </View>
        ) : null}
        {heading ? (
          <View style={s.heading}>
            {heading.image !== undefined ? (
              <Photo
                source={{ uri: heading.image ?? '' }}
                radius={t.radius.md}
                style={s.media}
              />
            ) : null}
            <View style={s.headingText}>
              <Text
                variant="screenTitle"
                tone="point"
                accessibilityRole="header"
              >
                {heading.title}
              </Text>
              {heading.caption ? (
                <Text variant="label" tone="muted">
                  {heading.caption}
                </Text>
              ) : null}
            </View>
          </View>
        ) : null}
        {top ? <View style={s.top}>{top}</View> : null}
        {notice ? (
          <View style={s.notice}>
            <Notice notice={notice} />
          </View>
        ) : null}
        {children}
      </ScrollView>
      {footer ? (
        footer
      ) : primaryAction ? (
        <BottomBar
          primaryAction={primaryAction}
          secondaryAction={secondaryAction}
          bottomInset={bottomInset}
        />
      ) : null}
    </KeyboardAvoidingView>
  );
}

export type DetailTemplateProps = {
  hero?: TemplateHero;
  status?: ReactNode;
  title?: string;
  caption?: string;
  image?: string | null;
  notice?: TemplateNotice;
  primaryAction?: TemplateAction;
  secondaryAction?: TemplateAction;
  bottomInset?: number;
  footer?: ReactNode;
  children: ReactNode;
};

export function DetailTemplate({
  status,
  title,
  caption,
  image,
  ...rest
}: DetailTemplateProps) {
  return (
    <ScrollTemplate
      top={status}
      heading={title ? { title, caption, image } : undefined}
      {...rest}
    />
  );
}

export type FormTemplateProps = {
  notice?: TemplateNotice;
  saveAction: TemplateAction;
  bottomInset?: number;
  children: ReactNode;
};

export function FormTemplate({ saveAction, ...rest }: FormTemplateProps) {
  return <ScrollTemplate primaryAction={saveAction} {...rest} />;
}

export type MenuTemplateProps = {
  bottomInset?: number;
  children: ReactNode;
};

export function MenuTemplate(props: MenuTemplateProps) {
  return <ScrollTemplate {...props} />;
}

export type DashboardTemplateProps = {
  banner?: ReactNode;
  refreshing?: boolean;
  onRefresh?: () => void;
  bottomInset?: number;
  children: ReactNode;
};

export function DashboardTemplate({
  banner,
  children,
  ...rest
}: DashboardTemplateProps) {
  return (
    <ScrollTemplate {...rest}>
      {banner}
      {children}
    </ScrollTemplate>
  );
}
