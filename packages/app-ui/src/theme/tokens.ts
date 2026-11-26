import { Platform } from 'react-native';
import type {
  ColorScheme,
  ThemeColors,
  ThemeTokens,
  TypographyKey,
  TypographyToken,
} from '../types';
import {
  controlSize,
  frame,
  iconSize,
  layout,
  motion,
  opacity,
  press,
  radius,
  semantic,
  shadow,
  space,
  touch,
  typography,
} from './base';

export const colors: Record<ColorScheme, ThemeColors> = semantic;

export const fontFamily = Platform.select({
  ios: 'Wanted Sans',
  android: 'Wanted Sans',
  default: '"Wanted Sans Variable", "Wanted Sans", sans-serif',
});

export function withFontFamily(
  scale: Record<TypographyKey, TypographyToken>,
  family: string | undefined
): Record<TypographyKey, TypographyToken> {
  return Object.fromEntries(
    Object.entries(scale).map(([key, token]) => [
      key,
      { ...token, fontFamily: family },
    ])
  ) as Record<TypographyKey, TypographyToken>;
}

export const tokens: ThemeTokens = {
  space,
  radius,
  typography: withFontFamily(typography, fontFamily),
  fontFamily,
  figure: {
    weight: '500',
    unitScale: 0.88,
    unitGap: 0.03,
    unitWeight: '400',
    unitTracking: 0,
    emphasisWeight: '600',
    emphasisTracking: -0.01,
    emphasisMinSize: 15,
  },
  maxFontScale: 1.3,
  shadow,
  motion,
  opacity,
  press,
  iconSize,
  minTouchSize: Platform.OS === 'ios' ? touch.ios : touch.android,
  layout,
  controlSize,
  headerHeight: frame.header,
  listRow: {
    oneLine: frame.listRow,
    twoLine: frame.listRow2,
    threeLine: frame.listRow3,
  },
};
