import {
  isValidElement,
  useMemo,
  type ComponentRef,
  type ReactNode,
  type Ref,
} from 'react';
import {
  StyleSheet,
  Text as RNText,
  type TextProps as RNTextProps,
  type TextStyle,
} from 'react-native';
import type { TypographyVariant } from '../../types';
import { useTheme } from '../../theme/theme-provider';
import { makeStyles } from '../../utils/styles';
import { TextMetricsContext } from './metrics';
import { Won, isFigureText } from './figures';

export type TextTone =
  'default' | 'muted' | 'primary' | 'point' | 'warning' | 'danger' | 'success';

export type TextProps = RNTextProps & {
  ref?: Ref<ComponentRef<typeof RNText>>;
  variant?: TypographyVariant;
  tone?: TextTone;
  weight?: TextWeight;
};

export type TextWeight = 'regular' | 'medium' | 'semibold';

const useStyles = makeStyles((t) => ({
  caption: t.typography.caption,
  label: t.typography.label,
  body: t.typography.body,
  bodyLg: t.typography.bodyLg,
  title: t.typography.title,
  screenTitle: t.typography.screenTitle,
  display: t.typography.display,
  default: { color: t.colors.foreground },
  heading: { color: t.colors.title },
  muted: { color: t.colors.mutedForeground },
  primary: { color: t.colors.primary },
  point: { color: t.colors.point },
  warning: { color: t.colors.warningText },
  danger: { color: t.colors.danger },
  success: { color: t.colors.success },
  font: { fontFamily: t.fontFamily },
  regular: { fontWeight: '400' },
  medium: { fontWeight: '500' },
  semibold: { fontWeight: '600' },
  figure: { fontWeight: t.figure.weight },
}));

const HEAVY = new Set(['600', '700', '800', '900', 'bold', 600, 700, 800, 900]);

function figureOf(children: ReactNode): string | null {
  if (typeof children === 'string') return children;
  if (typeof children === 'number') return String(children);
  if (isValidElement<{ children?: unknown }>(children) && children.type === Won)
    return typeof children.props.children === 'string'
      ? children.props.children
      : null;
  return null;
}

export function Text({
  variant = 'body',
  tone = 'default',
  weight,
  style,
  children,
  ...rest
}: TextProps) {
  const t = useTheme();
  const s = useStyles();
  const styles = [
    s.font,
    s[variant],
    s[tone],
    tone === 'default' &&
      (variant === 'screenTitle' ||
        variant === 'title' ||
        variant === 'display' ||
        weight === 'semibold') &&
      s.heading,
    weight && s[weight],
    style,
  ];
  const flat: TextStyle = StyleSheet.flatten(styles as TextStyle[]) ?? {};
  const shown = figureOf(children);
  const capped =
    shown !== null && isFigureText(shown) && HEAVY.has(flat.fontWeight ?? '');
  const size = flat.fontSize ?? t.typography[variant].fontSize;
  const tracking = flat.letterSpacing ?? 0;
  const metrics = useMemo(() => ({ size, tracking }), [size, tracking]);
  return (
    <RNText
      maxFontSizeMultiplier={t.maxFontScale}
      lineBreakStrategyIOS="hangul-word"
      {...rest}
      style={capped ? [...styles, s.figure] : styles}
    >
      {typeof children === 'string' || typeof children === 'number' ? (
        children
      ) : (
        <TextMetricsContext.Provider value={metrics}>
          {children}
        </TextMetricsContext.Provider>
      )}
    </RNText>
  );
}
