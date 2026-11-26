import { useContext } from 'react';
import { Text as RNText } from 'react-native';
import { useTheme } from '../../theme/theme-provider';
import { TextMetricsContext } from './metrics';

const MONEY = /^([+\-−]?\d[\d,]*(?:\.\d+)?)(만원|원)$/;
const FIGURE =
  /^[₩$]?[+\-−]?\d[\d,.:\-–~/\s]*(원|%|개|명|박|인|점|건|회|일|분|시간|만원|P)?$/;
const RUN = /(\d[\d,.:]*)/;
const MORE = /^(.*\s외\s)(\d[\d,]*)(건|개)$/;

export type FigureProps = {
  children: string;
  size?: number;
  tracking?: number;
};

export type FiguresScope = 'all' | 'more';

function px(value: number) {
  return Math.round(value * 100) / 100;
}

function useMetrics(size?: number, tracking?: number) {
  const t = useTheme();
  const context = useContext(TextMetricsContext);
  return {
    t,
    size: size ?? context?.size ?? t.typography.body.fontSize,
    tracking: tracking ?? context?.tracking ?? 0,
  };
}

export function isFigureText(text: string | undefined | null): boolean {
  return !!text && FIGURE.test(text.trim());
}

export function Won({ children, size, tracking }: FigureProps) {
  const m = useMetrics(size, tracking);
  const match = MONEY.exec(children.trim());
  if (!match) return <>{children}</>;
  const [, amount = '', unit = ''] = match;
  const f = m.t.figure;
  return (
    <>
      {amount.slice(0, -1)}
      <RNText style={{ letterSpacing: px(m.tracking + f.unitGap * m.size) }}>
        {amount.slice(-1)}
      </RNText>
      <RNText
        style={{
          fontSize: px(m.size * f.unitScale),
          fontWeight: f.unitWeight,
          letterSpacing: f.unitTracking,
        }}
      >
        {unit}
      </RNText>
    </>
  );
}

export function Figures({
  children,
  size,
  tracking,
  scope = 'all',
}: FigureProps & { scope?: FiguresScope }) {
  const m = useMetrics(size, tracking);
  const f = m.t.figure;
  if (m.size < f.emphasisMinSize) return <>{children}</>;
  const style = {
    fontWeight: f.emphasisWeight,
    letterSpacing: px(f.emphasisTracking * m.size),
  };
  const more = scope === 'more' ? MORE.exec(children) : null;
  if (scope === 'more' && !more) return <>{children}</>;
  const parts = more ? more.slice(1) : children.split(RUN);
  return (
    <>
      {parts.map((part, i) =>
        i % 2 === 1 ? (
          <RNText key={i} style={style}>
            {part}
          </RNText>
        ) : (
          part
        )
      )}
    </>
  );
}
