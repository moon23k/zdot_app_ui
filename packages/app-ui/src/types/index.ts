import type { TextStyle } from 'react-native';
import type { semantic, space, typography } from '../theme/base';

export type ColorScheme = 'light' | 'dark';

export type ThemeColors = { [K in keyof typeof semantic.light]: string };

export type TypographyKey = keyof typeof typography;

export type TypographyVariant = Exclude<TypographyKey, 'eyebrow' | 'question'>;

export type TypographyToken = {
  fontSize: number;
  lineHeight: number;
  fontWeight: TextStyle['fontWeight'];
  letterSpacing?: number;
};

export type ThemeTokens = {
  space: { [K in keyof typeof space]: number };
  radius: { sm: number; md: number; lg: number; xl: number; full: number };
  typography: Record<TypographyKey, TypographyToken>;
  fontFamily: string | undefined;
  maxFontScale: number;
  shadow: { sm: string; md: string; panel: string };
  motion: {
    duration: Record<
      'short' | 'press' | 'base' | 'move' | 'long' | 'spring' | 'xlong',
      number
    >;
    easing: Record<
      'standard' | 'decelerate' | 'accelerate' | 'spring',
      readonly [number, number, number, number]
    >;
  };
  opacity: { pressed: number; disabled: number };
  press: { layer: number; shrink: number; scale: number; disabled: number };
  iconSize: { sm: number; md: number };
  minTouchSize: number;
  layout: {
    screenX: number;
    screenTop: number;
    titleGap: number;
    sectionGap: number;
    groupGap: number;
    itemGap: number;
    footerTop: number;
    footerBottom: number;
  };
  controlSize: { sm: number; md: number; lg: number };
  headerHeight: number;
  listRow: { oneLine: number; twoLine: number; threeLine: number };
};

export type Theme = ThemeTokens & {
  scheme: ColorScheme;
  colors: ThemeColors;
};

export type Themes = Record<ColorScheme, Theme>;

type DeepPartial<T> = {
  [K in keyof T]?: T[K] extends object ? DeepPartial<T[K]> : T[K];
};

export type ThemeOverrides = DeepPartial<ThemeTokens> & {
  colors?: Partial<ThemeColors>;
  dark?: { colors?: Partial<ThemeColors> };
};
