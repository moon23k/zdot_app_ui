import { fireEvent, render, screen } from '@testing-library/react-native';
import { CalendarTemplate, FormTemplate, NoticeTemplate } from '../index';

describe('template actions pass every TemplateAction field to the button', () => {
  it('NoticeTemplate calls onBlocked on a disabled primary action', async () => {
    const onBlocked = jest.fn();
    await render(
      <NoticeTemplate
        title="동의가 필요해요"
        primaryAction={{
          label: '시작',
          onPress: () => {},
          disabled: true,
          onBlocked,
        }}
      />
    );
    await fireEvent.press(screen.getByText('시작'));
    expect(onBlocked).toHaveBeenCalledTimes(1);
  });

  it('NoticeTemplate shows loading on the secondary action', async () => {
    await render(
      <NoticeTemplate
        title="동의가 필요해요"
        primaryAction={{ label: '시작', onPress: () => {} }}
        secondaryAction={{ label: '나중에', onPress: () => {}, loading: true }}
      />
    );
    expect(
      screen.getByRole('button', { name: '나중에' }).props.accessibilityState
        .busy
    ).toBe(true);
  });

  it('CalendarTemplate calls onBlocked on a disabled action', async () => {
    const onBlocked = jest.fn();
    await render(
      <CalendarTemplate
        calendar={null}
        panel={{
          field: null,
          action: {
            label: '저장',
            onPress: () => {},
            disabled: true,
            onBlocked,
          },
        }}
      />
    );
    await fireEvent.press(screen.getByText('저장'));
    expect(onBlocked).toHaveBeenCalledTimes(1);
  });

  it('split bottom bar calls onBlocked on the secondary action', async () => {
    const onBlocked = jest.fn();
    await render(
      <FormTemplate
        saveAction={{ label: '저장', onPress: () => {} }}
        secondaryAction={{
          label: '임시 저장',
          onPress: () => {},
          disabled: true,
          onBlocked,
          beside: true,
        }}
      >
        {null}
      </FormTemplate>
    );
    await fireEvent.press(screen.getByText('임시 저장'));
    expect(onBlocked).toHaveBeenCalledTimes(1);
  });
});
