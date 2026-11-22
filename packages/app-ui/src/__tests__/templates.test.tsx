import { fireEvent, render, screen } from '@testing-library/react-native';
import { Text } from 'react-native';
import {
  DetailTemplate,
  FormTemplate,
  Group,
  ListRow,
  ListSection,
  ListTemplate,
  ResultTemplate,
  StepScreen,
  SystemTemplate,
  IntroTemplate,
} from '../index';

const rows = [
  { id: '1', title: '머그컵 2개' },
  { id: '2', title: '원목 트레이' },
];

function List(
  props: Partial<Parameters<typeof ListTemplate<(typeof rows)[number]>>[0]>
) {
  return (
    <ListTemplate
      data={rows}
      keyExtractor={(row) => row.id}
      renderItem={({ item }) => <ListRow title={item.title} />}
      empty={{ title: '발송할 주문이 없어요' }}
      {...props}
    />
  );
}

describe('ListTemplate', () => {
  it('renders rows when ready', async () => {
    await render(<List />);
    expect(screen.getByText('머그컵 2개')).toBeTruthy();
    expect(screen.queryByText('발송할 주문이 없어요')).toBeNull();
  });

  it('shows the empty state and its action when there is no data', async () => {
    const onPress = jest.fn();
    await render(
      <List
        data={[]}
        empty={{
          title: '발송할 주문이 없어요',
          action: { label: '상품 등록하기', onPress },
        }}
      />
    );
    await fireEvent.press(screen.getByText('상품 등록하기'));
    expect(onPress).toHaveBeenCalledTimes(1);
  });

  it('hides rows while loading', async () => {
    await render(<List status="loading" />);
    expect(screen.queryByText('머그컵 2개')).toBeNull();
  });

  it('shows the error state and retries', async () => {
    const onRetry = jest.fn();
    await render(
      <List status="error" error={{ title: '불러오지 못했어요', onRetry }} />
    );
    expect(screen.queryByText('머그컵 2개')).toBeNull();
    await fireEvent.press(screen.getByText('다시 시도'));
    expect(onRetry).toHaveBeenCalledTimes(1);
  });

  it('keeps pinned rows above the list', async () => {
    await render(<List pinned={<ListRow title="오늘 발송 마감" />} />);
    expect(screen.getByText('오늘 발송 마감')).toBeTruthy();
  });
});

describe('ResultTemplate', () => {
  const previews = ['1안', '2안', '3안'].map((label) => ({
    key: label,
    label,
    render: () => <Text>{`${label} 사이트`}</Text>,
  }));

  it('opens the full preview of the pressed result and builds from it', async () => {
    const onIndexChange = jest.fn();
    const onBuild = jest.fn();
    await render(
      <ResultTemplate
        previews={previews}
        index={1}
        onIndexChange={onIndexChange}
        primaryAction={{ label: '이 디자인으로 만들기', onPress: onBuild }}
      />
    );
    await fireEvent.press(screen.getByLabelText('2안 크게 보기'));
    expect(onIndexChange).toHaveBeenCalledWith(1);
    expect(screen.getByText('2안 · 2 / 3')).toBeTruthy();
    const builds = screen.getAllByText('이 디자인으로 만들기');
    await fireEvent.press(builds[builds.length - 1]!);
    expect(onBuild).toHaveBeenCalledTimes(1);
  });

  it('shows progress instead of results with the action the caller gives', async () => {
    const onRetry = jest.fn();
    const view = await render(
      <ResultTemplate
        previews={previews}
        index={0}
        onIndexChange={() => {}}
        progress={<Text>문구 쓰기</Text>}
      />
    );
    expect(screen.getByText('문구 쓰기')).toBeTruthy();
    expect(screen.queryByText('1안 사이트')).toBeNull();
    expect(screen.queryByText('다시 만들기')).toBeNull();
    await view.rerender(
      <ResultTemplate
        previews={previews}
        index={0}
        onIndexChange={() => {}}
        progress={<Text>문구 쓰기</Text>}
        primaryAction={{ label: '다시 만들기', onPress: onRetry }}
      />
    );
    await fireEvent.press(screen.getByText('다시 만들기'));
    expect(onRetry).toHaveBeenCalledTimes(1);
  });

  it('renders cards and the full preview in their own mode', async () => {
    await render(
      <ResultTemplate
        previews={[
          { key: 'a', label: '1안', render: (mode) => <Text>{mode}</Text> },
        ]}
        index={0}
        onIndexChange={() => {}}
      />
    );
    expect(screen.getByText('card')).toBeTruthy();
    await fireEvent.press(screen.getByLabelText('1안 크게 보기'));
    expect(screen.getByText('full')).toBeTruthy();
  });
});

describe('DetailTemplate · FormTemplate', () => {
  it('shows the notice and sections with the primary action', async () => {
    const onPress = jest.fn();
    await render(
      <DetailTemplate
        notice={{ reason: 'money', text: '17:00까지 입금이 없으면 취소돼요' }}
        primaryAction={{ label: '송장 입력', onPress }}
      >
        <ListSection title="상품">
          <ListRow title="원목 트레이" />
        </ListSection>
      </DetailTemplate>
    );
    expect(screen.getByText('17:00까지 입금이 없으면 취소돼요')).toBeTruthy();
    expect(screen.getByText('상품')).toBeTruthy();
    await fireEvent.press(screen.getByText('송장 입력'));
    expect(onPress).toHaveBeenCalledTimes(1);
  });

  it('does not save while the save action is disabled', async () => {
    const onSave = jest.fn();
    await render(
      <FormTemplate
        saveAction={{ label: '저장', onPress: onSave, disabled: true }}
      >
        <ListRow title="택배" />
      </FormTemplate>
    );
    await fireEvent.press(screen.getByText('저장'));
    expect(onSave).not.toHaveBeenCalled();
  });
});

describe('SystemTemplate', () => {
  it('announces the title as a header and runs the action', async () => {
    const onPress = jest.fn();
    await render(
      <SystemTemplate
        title="새 버전으로 업데이트해 주세요"
        primaryAction={{ label: '업데이트', onPress }}
      />
    );
    expect(screen.getByRole('header')).toBeTruthy();
    await fireEvent.press(screen.getByText('업데이트'));
    expect(onPress).toHaveBeenCalledTimes(1);
  });
});

describe('StepScreen', () => {
  it('shows the step count in the header instead of a bar', async () => {
    await render(<StepScreen title="어떤 업종인가요?" total={3} current={0} />);
    const count = screen.getByRole('progressbar');
    expect(count.props.accessibilityLabel).toBe('3단계 중 1단계');
    expect(screen.getByText('1')).toBeTruthy();
  });

  it('docks the chosen item beside the action once something is chosen', async () => {
    const onPress = jest.fn();
    const action = { label: '다음', onPress };
    const view = await render(
      <StepScreen
        title="어떤 업종인가요?"
        floatingAction
        chosen={null}
        primaryAction={{ ...action, disabled: true }}
      />
    );
    expect(screen.queryByText('베이커리')).toBeNull();
    expect(screen.getAllByRole('button', { name: '다음' })).toHaveLength(1);
    await view.rerender(
      <StepScreen
        title="어떤 업종인가요?"
        floatingAction
        chosen={{ label: '베이커리' }}
        primaryAction={action}
      />
    );
    expect(screen.getByText('베이커리')).toBeTruthy();
    await fireEvent.press(screen.getByRole('button', { name: '다음' }));
    expect(onPress).toHaveBeenCalledTimes(1);
  });

  it('shows a notice above the action only when given', async () => {
    const view = await render(
      <StepScreen
        title="사이트 만드는 중"
        primaryAction={{ label: '다시 만들기', onPress: () => {} }}
      />
    );
    expect(screen.queryByText('쓴 크레딧은 돌려드려요')).toBeNull();
    await view.rerender(
      <StepScreen
        title="사이트 만드는 중"
        notice={{ reason: 'money', text: '쓴 크레딧은 돌려드려요' }}
        primaryAction={{ label: '다시 만들기', onPress: () => {} }}
      />
    );
    expect(screen.getByText('쓴 크레딧은 돌려드려요')).toBeTruthy();
  });
});

describe('Group', () => {
  it('labels its content as a header with an optional aside', async () => {
    await render(
      <Group title="분위기" aside="선택">
        <Text>포근한</Text>
      </Group>
    );
    expect(screen.getByRole('header')).toBeTruthy();
    expect(screen.getByText('선택')).toBeTruthy();
    expect(screen.getByText('포근한')).toBeTruthy();
  });
});

describe('IntroTemplate', () => {
  const pages = [
    { key: 'a', title: '첫 장', art: () => null },
    { key: 'b', title: '둘째 장', art: () => null },
  ];

  it('skips to done from the first page', async () => {
    const onDone = jest.fn();
    await render(<IntroTemplate pages={pages} onDone={onDone} />);
    await fireEvent.press(screen.getByLabelText('건너뛰기'));
    expect(onDone).toHaveBeenCalledTimes(1);
  });

  it('pages forward and finishes on the last page', async () => {
    const onDone = jest.fn();
    await render(<IntroTemplate pages={pages} onDone={onDone} />);
    await fireEvent.press(screen.getByText('다음'));
    expect(screen.queryByLabelText('건너뛰기')).toBeNull();
    await fireEvent.press(screen.getByText('시작하기'));
    expect(onDone).toHaveBeenCalledTimes(1);
  });
});
