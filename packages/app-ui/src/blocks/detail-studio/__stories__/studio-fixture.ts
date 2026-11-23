import { demoPhotoIds, sample } from '../../../__stories__/helpers';
import type {
  DetailBlock,
  DetailDocValue,
  DetailLayer,
  DetailTextStyle,
} from '../../detail-editor/detail-types';

const photo = (id: number): DetailLayer => ({
  id: `p${id}`,
  type: 'image',
  url: sample(id, 720, 900).uri,
});

const text = (
  id: string,
  value: string,
  style: DetailTextStyle = {}
): DetailLayer => ({
  id,
  type: 'text',
  text: value,
  style: { size: 5, ...style },
});

const title = (value: string, align: 'center' | 'left' = 'center') =>
  text('t0', value, { size: 8, weight: 'bold', align });

export type StudioSection = {
  key: string;
  name: string;
  snippet: string;
  hidden?: boolean;
  doc: DetailDocValue;
};

const page = (blocks: DetailBlock[]): DetailDocValue => ({
  version: 2,
  blocks,
});

export const studioSections: StudioSection[] = [
  {
    key: 'intro',
    name: '인트로',
    snippet: '매일 쓰는 그릇을 손으로 빚었습니다',
    doc: page([
      {
        id: 'b1',
        layout: 'image_top',
        layers: [
          photo(demoPhotoIds.mug),
          title('매일 쓰는 그릇을\n손으로 빚었습니다'),
          text(
            't1',
            '무광 유약으로 마감한 면기입니다. 국수 한 그릇, 덮밥 한 그릇에 맞는 크기로 만들었습니다.',
            { align: 'center' }
          ),
        ],
      },
    ]),
  },
  {
    key: 'points',
    name: '특징',
    snippet: '세 가지를 지켰습니다',
    doc: page([
      {
        id: 'b1',
        layout: 'text_top',
        layers: [title('세 가지를 지켰습니다'), photo(demoPhotoIds.flatlay)],
      },
      {
        id: 'b2',
        layout: 'text',
        layers: [
          text('t1', '무광 유약', { size: 6, weight: 'bold' }),
          text('t2', '빛 반사가 적어 음식 색이 그대로 보입니다.'),
          text('t3', '전자레인지 · 식기세척기', { size: 6, weight: 'bold' }),
          text('t4', '1,250도에서 두 번 구워 매일 써도 됩니다.'),
          text('t5', '하나씩 다른 결', { size: 6, weight: 'bold' }),
          text('t6', '물레로 빚어 그릇마다 선이 조금씩 다릅니다.'),
        ],
      },
    ]),
  },
  {
    key: 'scene',
    name: '연출',
    snippet: '식탁 위에서',
    doc: page([
      {
        id: 'b1',
        layout: 'text_top',
        layers: [
          title('식탁 위에서'),
          text('t1', '국수, 덮밥, 샐러드까지 한 그릇 음식에 두루 씁니다.', {
            align: 'center',
          }),
          photo(demoPhotoIds.latte),
        ],
      },
    ]),
  },
  {
    key: 'detail',
    name: '디테일',
    snippet: '가까이 보기',
    doc: page([
      {
        id: 'b1',
        layout: 'text_top',
        layers: [title('가까이 보기'), photo(demoPhotoIds.cafe)],
      },
      {
        id: 'b2',
        layout: 'text',
        layers: [
          text(
            't1',
            '입술이 닿는 테두리는 얇게, 손에 쥐는 굽은 두껍게 깎았습니다.'
          ),
        ],
      },
    ]),
  },
  {
    key: 'spec',
    name: '사이즈와 소재',
    snippet: '지름 17cm · 높이 7.5cm · 750ml',
    doc: page([
      {
        id: 'b1',
        layout: 'text_top',
        layers: [title('사이즈와 소재'), photo(demoPhotoIds.desk)],
      },
      {
        id: 'b2',
        layout: 'text',
        layers: [
          text(
            't1',
            '지름 17cm · 높이 7.5cm · 750ml\n무게 · 약 420g\n소재 · 백자토 · 무광 유약'
          ),
        ],
      },
    ]),
  },
  {
    key: 'making',
    name: '만드는 과정',
    snippet: '물레 성형 · 초벌 800도 · 유약',
    doc: page([
      {
        id: 'b1',
        layout: 'text_top',
        layers: [title('만드는 과정'), photo(demoPhotoIds.camera)],
      },
      {
        id: 'b2',
        layout: 'text',
        layers: [text('t1', '물레 성형 · 초벌 800도 · 유약\n재벌 1,250도')],
      },
    ]),
  },
  {
    key: 'care',
    name: '관리 방법',
    snippet: '첫 사용 전 · 세척',
    hidden: true,
    doc: page([
      {
        id: 'b1',
        layout: 'text',
        layers: [
          title('관리 방법'),
          text('t1', '첫 사용 전 · 세척', { size: 6, weight: 'bold' }),
          text('t2', '쌀뜨물에 한 번 끓이면 물듦이 줄어듭니다.'),
          text('t3', '세척', { size: 6, weight: 'bold' }),
          text('t4', '부드러운 수세미로 닦고 완전히 말려 보관하세요.'),
        ],
      },
    ]),
  },
  {
    key: 'notice',
    name: '배송과 교환',
    snippet: '주문 후 2 ~ 3일 · 3,000원',
    doc: page([
      {
        id: 'b1',
        layout: 'text_top',
        layers: [title('배송과 교환'), photo(demoPhotoIds.keyboard)],
      },
      {
        id: 'b2',
        layout: 'text',
        layers: [
          text(
            't1',
            '주문 후 2 ~ 3일 · 3,000원\n완충 상자 포장\n수령 후 7일 이내'
          ),
        ],
      },
    ]),
  },
];

export const studioKinds = studioSections.map((section) => ({
  key: section.key,
  label: section.name,
  blocks: section.doc.blocks.map((block) => ({
    ...block,
    layers: block.layers.map((layer) =>
      layer.type === 'text'
        ? { ...layer, text: '' }
        : { ...layer, url: null, asset_id: null }
    ),
  })),
}));

export const studioPage: DetailDocValue = {
  version: 2,
  blocks: studioSections.flatMap((section) =>
    section.hidden
      ? []
      : section.doc.blocks.map((block) => ({
          ...block,
          id: `${section.key}-${block.id}`,
        }))
  ),
};
