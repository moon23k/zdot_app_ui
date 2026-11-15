import type { ReactNode } from 'react';
import { View } from 'react-native';
import { Button } from '../components/button/button';
import { useTheme } from '../theme/theme-provider';
import { makeStyles } from '../utils/styles';
import type { TemplateAction } from './parts';

export type CalendarTemplateProps = {
  calendar: ReactNode;
  panel?: { field: ReactNode; rows?: ReactNode; action?: TemplateAction };
  bottomInset?: number;
};

const useStyles = makeStyles((t) => ({
  root: { flex: 1, backgroundColor: t.colors.background },
  panel: {
    borderTopWidth: 1,
    borderTopColor: t.colors.border,
    paddingTop: t.space[3],
    backgroundColor: t.colors.background,
  },
  field: { paddingHorizontal: t.layout.screenX },
  action: { paddingHorizontal: t.layout.screenX, paddingTop: t.space[3] },
}));

export function CalendarTemplate({
  calendar,
  panel,
  bottomInset = 0,
}: CalendarTemplateProps) {
  const t = useTheme();
  const s = useStyles();
  return (
    <View style={s.root}>
      {calendar}
      {panel ? (
        <View
          style={[
            s.panel,
            { paddingBottom: t.layout.footerBottom + bottomInset },
          ]}
        >
          <View style={s.field}>{panel.field}</View>
          {panel.rows}
          {panel.action ? (
            <View style={s.action}>
              <Button
                size="lg"
                onPress={panel.action.onPress}
                disabled={panel.action.disabled}
                loading={panel.action.loading}
              >
                {panel.action.label}
              </Button>
            </View>
          ) : null}
        </View>
      ) : null}
    </View>
  );
}
