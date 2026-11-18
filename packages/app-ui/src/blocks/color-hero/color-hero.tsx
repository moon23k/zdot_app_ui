import { View } from 'react-native';
import { Text } from '../../components/text/text';
import { ChevronGlyph } from '../../internal/glyphs';
import { HeaderIconButton } from '../../templates/parts';
import { useTheme } from '../../theme/theme-provider';
import { pickForeground } from '../../utils/color';
import { makeStyles } from '../../utils/styles';

export type ColorHeroProps = {
  color: string;
  code: string;
  name: string;
  line?: string;
  keywords?: string;
  topInset?: number;
  onBack?: () => void;
  backLabel?: string;
};

const FACE = 250;
const WHITE = '#FFFFFF';

const useStyles = makeStyles((t) => ({
  root: { justifyContent: 'space-between' },
  note: {
    gap: t.space[1],
    paddingTop: t.space[5],
    paddingHorizontal: t.layout.screenX,
  },
  header: {
    height: t.headerHeight,
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: t.space[1],
  },
  name: {
    gap: t.space[1],
    paddingHorizontal: t.layout.screenX,
    paddingBottom: t.space[5],
  },
  soft: { opacity: 0.85 },
}));

export function ColorHero({
  color,
  code,
  name,
  line,
  keywords,
  topInset = 0,
  onBack,
  backLabel = '이전',
}: ColorHeroProps) {
  const t = useTheme();
  const s = useStyles();
  const ink = { color: pickForeground(color, t.colors.foreground, WHITE) };
  return (
    <View>
      <View
        style={[
          s.root,
          {
            height: FACE + topInset,
            paddingTop: topInset,
            backgroundColor: color,
          },
        ]}
      >
        <View style={s.header}>
          {onBack ? (
            <HeaderIconButton
              icon={ChevronGlyph}
              label={backLabel}
              onPress={onBack}
              size={24}
              color={ink.color}
              mirror
            />
          ) : null}
        </View>
        <View style={s.name}>
          <Text variant="label" weight="medium" style={[ink, s.soft]}>
            {code}
          </Text>
          <Text variant="screenTitle" accessibilityRole="header" style={ink}>
            {name}
          </Text>
        </View>
      </View>
      {line ? (
        <View style={s.note}>
          <Text variant="bodyLg">{line}</Text>
          {keywords ? (
            <Text variant="label" tone="muted">
              {keywords}
            </Text>
          ) : null}
        </View>
      ) : null}
    </View>
  );
}
