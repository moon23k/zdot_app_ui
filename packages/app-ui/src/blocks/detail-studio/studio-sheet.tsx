import type { ReactNode } from 'react';
import { Animated } from 'react-native';
import { useOverlayTransition } from '../../internal/overlay';
import { SheetHead } from '../../internal/sheet-head';
import { useTheme } from '../../theme/theme-provider';
import { makeStyles } from '../../utils/styles';

export type StudioSheetProps = {
  open: boolean;
  title: string;
  onClose: () => void;
  ai?: boolean;
  end?: ReactNode;
  bottomInset?: number;
  closeLabel?: string;
  children: ReactNode;
};

const useStyles = makeStyles((t) => ({
  sheet: {
    paddingTop: t.space[2],
    borderTopLeftRadius: t.radius.lg,
    borderTopRightRadius: t.radius.lg,
    backgroundColor: t.colors.surface,
    boxShadow: t.shadow.lift,
  },
}));

export function StudioSheet({
  open,
  title,
  onClose,
  ai,
  end,
  bottomInset = 0,
  closeLabel,
  children,
}: StudioSheetProps) {
  const t = useTheme();
  const s = useStyles();
  const { mounted, progress } = useOverlayTransition(open);
  if (!mounted) return null;
  return (
    <Animated.View
      style={[
        s.sheet,
        {
          paddingBottom: bottomInset + t.space[3],
          opacity: progress,
          transform: [
            {
              translateY: progress.interpolate({
                inputRange: [0, 1],
                outputRange: [t.space[6], 0],
              }),
            },
          ],
        },
      ]}
    >
      <SheetHead
        title={title}
        onClose={onClose}
        ai={ai}
        end={end}
        closeLabel={closeLabel}
      />
      {children}
    </Animated.View>
  );
}
