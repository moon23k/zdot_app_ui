import { fireEvent, render, screen } from '@testing-library/react-native';
import { Text } from 'react-native';
import { DesignPickTemplate, designPickBarSpace } from '../index';

const options = [
  { value: 'a', label: '1안' },
  { value: 'b', label: '2안' },
  { value: 'c', label: '3안' },
] as const;

describe('DesignPickTemplate', () => {
  it('shows the preview and only the primary action without tools', async () => {
    await render(
      <DesignPickTemplate
        options={options}
        value="a"
        onValueChange={() => {}}
        preview={<Text>사이트</Text>}
        primaryAction={{ label: '이 디자인으로 만들기', onPress: () => {} }}
      />
    );
    expect(screen.getByText('사이트')).toBeTruthy();
    expect(
      screen.getByRole('tab', { name: '1안' }).props.accessibilityState
    ).toMatchObject({ selected: true });
    expect(screen.queryByText('색')).toBeNull();
  });

  it('changes the option, goes back and builds', async () => {
    const onValueChange = jest.fn();
    const onBack = jest.fn();
    const onBuild = jest.fn();
    await render(
      <DesignPickTemplate
        options={options}
        value="a"
        onValueChange={onValueChange}
        onBack={onBack}
        preview={null}
        primaryAction={{ label: '이 디자인으로 만들기', onPress: onBuild }}
      />
    );
    await fireEvent.press(screen.getByRole('tab', { name: '3안' }));
    await fireEvent.press(screen.getByRole('tab', { name: '1안' }));
    expect(onValueChange).toHaveBeenCalledTimes(1);
    expect(onValueChange).toHaveBeenCalledWith('c');
    await fireEvent.press(screen.getByLabelText('뒤로'));
    expect(onBack).toHaveBeenCalledTimes(1);
    await fireEvent.press(screen.getByText('이 디자인으로 만들기'));
    expect(onBuild).toHaveBeenCalledTimes(1);
  });

  it('presses tools and shows the tray above them', async () => {
    const onColor = jest.fn();
    await render(
      <DesignPickTemplate
        options={options}
        value="b"
        onValueChange={() => {}}
        preview={null}
        primaryAction={{ label: '이 디자인으로 만들기', onPress: () => {} }}
        tools={[
          { key: 'color', label: '색', icon: null, onPress: onColor },
          {
            key: 'font',
            label: '글꼴',
            icon: null,
            selected: true,
            onPress: () => {},
          },
        ]}
        tray={<Text>고딕</Text>}
      />
    );
    expect(screen.getByText('고딕')).toBeTruthy();
    expect(
      screen.getByRole('button', { name: '글꼴' }).props.accessibilityState
    ).toMatchObject({ selected: true });
    await fireEvent.press(screen.getByRole('button', { name: '색' }));
    expect(onColor).toHaveBeenCalledTimes(1);
  });

  it('reports the height the floating bar covers above the bottom edge', () => {
    expect(designPickBarSpace()).toBe(78);
    expect(designPickBarSpace(34)).toBe(112);
  });
});
