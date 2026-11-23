# @ezpg/app-ui

## 0.20.0

### Minor Changes

- 14f7417: AxisDial — 값 범위 0~100 고정, 50 이 기준점(min · max · valueLabel 삭제, centerLabel 추가 · 기본 '중간'). 끄는 동안 점 · 눈금 · 숫자가 반올림 전 실수 값으로 손을 따라 연속으로 움직이고 onChange 는 0~100 정수가 바뀔 때마다, 손을 뗄 때 48~52 면 50 으로 붙임. 눈금 51개(2 단위, 5개마다 긴 눈금 124→138 · 2.5, 짧은 눈금 129→138 · 1.8), 기준점 → 값 primary, 나머지 긴 눈금 arcMuted · 짧은 눈금 input. 값 점 지름 14. 원판 가운데 큰 숫자(46/50 · 700 · 자간 −1.5 · 숫자 폭 고정 · title) + 낱말(bodyLg 600 · mutedForeground, 50 초과 endLabel · 미만 startLabel · 50 centerLabel). adjustable 값 텍스트 '74 강한', 증감 5. AxisDialGroup — values 0~100, min · max 삭제, DialStrip percent 로 축 링 표시. DialStrip 에 percent(선택) — 링 글자를 0~100 정수로, 호는 위에서 |값−50|/50 만큼, 고른 링 숫자 700. 기본은 기존 모양 · 부호 표기.
- 6c183e5: AxisDial — 한 축 값을 고르는 큰 다이얼(폭에 맞춰 최대 300 정사각). 위쪽 기준점에서 좌우 135°까지 눈금(정수 칸마다 긴 눈금 ring · 사이 8칸 짧은 눈금 input), 기준점에서 값까지 primary, 가운데 surface 원판(shadow md) 위 값 위치 점(지름 12 primary)과 valueLabel(title), 호의 양 끝 아래 startLabel · endLabel(label, 기운 쪽만 foreground semibold). 원판을 돌리는 손 움직임(중심 24 안쪽 무시)으로 정수 칸씩 바뀜, adjustable · 증감 1. AxisDialGroup — SliderList 와 같은 items · values · onChange(key, value)로 위에 DialStrip(spread) 축 고르기, 아래 고른 축의 AxisDial(사이 sectionGap), 값이 기준점이면 centerLabel(기본 '중간'). DialStrip 에 spread(선택) — 칸을 폭에 고르게 펴고 좌우 여백 없음, 기본은 기존 모양.
- 6803eee: 컬러 상세 화면 부품. ColorTune 추가 — 견본 카드 · 조절 띠 · 스토어 미리보기(남는 높이 모두) · 조합 띠를 세로로 묶음, 끄는 동안 카드 색 면은 양옆 색을 섞은 색, 처음 색과 다르면 카드에 되돌리기 버튼, 톤이 하나면 띠 없음. SwatchCard — 반경 22 raised + shadow.lift, 위 104 색 면, 아래 76 코드(13/18 · 600 · faint) · 이름(22/28 · 600 · title), onReset 이 있으면 지름 36 recess 원형 되돌리기 버튼. ToneSlider — 높이 10 그라데이션 트랙 위 같은 간격 자리, 지름 22 raised 손잡이 + shadow.liftSm, 터치 높이 44, 손을 따라 연속 이동 · 놓으면 가장 가까운 자리로 이동, origin 자리에 지름 4 점, adjustable(한 번에 한 칸, 값 텍스트 labels), onScrub 으로 연속 위치. StoreSample — 다섯 역할 색을 입힌 예시 스토어(눌리지 않음 · 접근성 숨김). PaletteStrips — 98×40 다섯 칸 띠(34 · 20 · 16 · 20 · 10) 한 줄 양끝 정렬, 고른 띠는 4 raised 테 + shadow.lift + 지름 20 체크 원, radiogroup · radio. StepScreen fill — 본문을 스크롤 없이 남는 높이에 채움(위 8 · 아래 4).
- 8cdbb9b: designPickBarSpace(bottomInset) — DesignPickTemplate 의 뜬 바가 화면 아래에서 가리는 높이(bottomInset + space 2 × 3 + border 1 × 2 + controlSize lg). 미리보기 안 페이지 끝에 같은 높이의 빈칸을 두는 데 씀.
- 57ce02d: DesignPickTemplate — 디자인 고르기 화면 틀. 위 줄은 topInset 아래 headerHeight 높이에 왼쪽 뒤로 버튼(HeaderIconButton, 선택)과 가운데 안 고르기 칸(높이 controlSize sm · radius full · border 바탕, 고른 칸은 surface + shadow sm 이 미끄러져 이동, label 글자 mutedForeground → title semibold, tablist · tab), 아래는 preview 칸이 화면 끝까지(ScrollView 로 감싸지 않음, 바탕 background). 미리보기 위에 뜬 바(좌우 space 4 · bottomInset + space 2, padding space 2 · radius xl · surface · border 1 · shadow md) 안에 한 줄로 tools(아이콘 위 caption 이름, 너비 space 16 · 높이 controlSize lg · radius lg, 고른 것은 muted 바탕 + semibold, button · selected)와 primaryAction(lg 버튼, 남은 폭), tray 가 있으면 그 줄 위에 border 1 구분선과 함께 표시. tools · tray 가 없으면 primaryAction 만.
- fb8a114: 상세페이지 스튜디오(구획 목록형) 부품.

  - 구획 목록: SectionBoard(끌어서 순서 · 대기 줄 pending) · SectionThumb · StudioBar(tools) · StudioDock · SectionKindGrid · DetailStudioTemplate · DropdownMenu · SectionAnchor.
  - 블록 배치 표(table) · 순서(steps) — DetailCanvas · LayoutPicker(items · detailLayoutsFor · value null 허용).
  - 구획 편집: DetailCanvas 편집 모드(mode · focus — 글 레이어 그 자리 입력, AI 결과 꼬리표 · 쪽 표시 점, 사진 선택 테두리 · 전후 비교 compare · 미리보기 preview, 숨긴 빈 글 · 숨긴 사진 표시) · SectionEditTemplate · KeyboardBar · TextFormatPanel · SectionSettings · StudioSheet(덮개 없는 낮은 시트) · RewriteTray · ConfirmRow · EffectPicker · SegmentedControl.
  - 사진: PhotoToolBar(칸 비용 표시 cost) · AdjustTiles · AssetGrid(variant grid · row) · ImagePrompt · CompareSlider labels.
  - 크레딧 표시: CreditPill · CreditCost(채운 마름모 + 숫자) · Button cost.
  - 기존 부품의 새 선택 사항: Sheet compact · tall · ai · end · action, Slider start · end, FontPicker variant, ColorSwatchPicker variant row.
  - 글리프: Grip · EyeOff · Trash · Wand · Images · Keyboard · Layout · AlignLeft · AlignRight · Gem · Sliders · Crop · Eraser · Bucket.

  삭제(옛 상세페이지 편집기 전용): DetailComposer · DetailEditorTemplate · EditorPanel · EditorBar · ToolRow · DraftStrip · DRAFT_THUMB_WIDTH · BlockStrip.

- 10a0fa6: 업종 고르기 2열 칸 개편. TileGrid 추가 — 2열 칸(간격 8, 높이 112, 반경 xl), 안 고른 칸 recess · 고른 칸 raised + shadow.lift, 왼쪽 위 분류 이름(caption, faint) · 업종 이름(16/21 · 600, 고르면 700, 최대 2줄), 오른쪽 아래 지름 104 받침 위 68 사진, 고른 칸 지름 22 체크 원, 칸은 radio(이름은 label 만). FilterTabs 추가 — 가로로 넘기는 밑줄 탭(14px, 지금 탭 700 · title, 나머지 500 · faint, 사이 22, 높이 44, 글자 폭 2px primary 밑줄, 아래 0.5px 옅은 선, 더 넘길 탭이 있으면 오른쪽 72 흐림), bleed 로 화면 좌우 끝까지. SearchField variant 'recess'(recess 면 · 높이 50 · 자리 글자 faint, 입력 중 raised + 1px primary + focusRing), 기본은 그대로. StepScreen — 3px 진행 막대 대신 머리줄 오른쪽 '1 / 3'(지금 숫자 title · 나머지 faint), 제목 26/34 · 600 · −0.8, compact(위 12 · 사이 16), chosen(floatingAction 과 함께: null 이면 전체 폭 '다음', 값이 있으면 고른 사진 · 이름 · '다음' 을 담은 떠 있는 막대, 위로 바탕색 흐림). chosen 을 주지 않는 화면의 아래 버튼은 그대로.
- 969abef: PaletteThumbs — 팔레트 고르기 칸(작은 PaletteBlock 높이 64 + 아래 이름 label, 순서 고정 · 균등 칸 · 사이 space 3), 선택은 바탕 틈 3 + primary 2 테 · 이름 semibold, 미선택 이름 mutedForeground, radiogroup · radio. PaletteLegend — 역할 범례 한 줄(지름 12 색 점 + label mutedForeground, 사이 space 4). ColorSystem PalettePick 스토리를 StepScreen + 큰 PaletteBlock · 범례 · 고르기 칸으로 교체.
- 796906f: QuestionPager — 묶음별 넘김 선택 블록. 위에 묶음 띠(같은 폭 한 줄, 높이 controlSize sm, 아래 border 1, 지금 묶음은 title 글자 semibold + primary 2 줄, 다 답한 묶음은 selectForeground 글자 + 체크 iconSize sm, 나머지 mutedForeground, tablist · tab), 아래에 지금 묶음 질문만(질문 이름 body semibold + 보기 2열 타일 높이 controlSize sm · radius lg · surface, 고른 타일은 primaryTint + selectForeground semibold, radiogroup · radio). 고른 보기를 다시 눌러도 해제되지 않음, 이번 선택으로 지금 묶음이 처음 다 채워졌고 마지막 묶음이 아니면 onValueChange 뒤 onActiveGroupChange 로 다음 묶음. QuestionAccordion 은 그대로.
- 6f35bc7: 포인트 컬러 절제를 나머지 부품으로 확대. StageBar — 바탕 recess, 고른 단계 raised + liftSm + title 숫자 · 600 글자(주황 글자 없음). StatusSteps — 끝난 구간 선 primary, 지금 단계 표시는 옅은 주황 대신 raised + liftSm(가운데 primary 점 그대로). InviteCard — 머리 글자 칸 recess, compact 카드 surface + 1px line, 화살표 mutedForeground. ListRow highlighted — recess. Pill · StatusBadge point — raised + liftSm + 지름 6 primary 점 + title 글자. Calendar — 고른 날 raised + liftSm + title 600, 기간 띠 recess, 오늘은 테 없이 primary 600 숫자, 표시 점 faint. FloatingTabBar — 고른 탭 바탕 recess(아이콘 primary 유지). Bubble — 받은 말 recess, 보낸 말 raised + liftSm. QuestionAccordion — 고른 칸 recess + title 600(primary 점 유지). DraftBox — 테두리 line. DetailComposer — 참고 사진 raised 테 + liftSm + 지름 16 체크 원, 빼기 버튼 raised + liftSm, 첨부 열림 raised + liftSm, 만들기 비활성 disabledSurface + disabledForeground. SendBar — 비활성 disabledSurface + disabledForeground(흐림 없음). SegmentedTabs — 지금 탭 글자 title, 밑줄 2px. SectionTabs — 밑줄 primary. SetupGuide — 진행 막대 primary. ResultMark — 검정 테 대신 recess 원, 완료 체크 primary. RollText 바뀜 강조 recess. props · 동작 · 접근성 변경 없음, 옅은 주황 토큰은 남김.
- 235dff3: 포인트 컬러 절제 · 선택 표시 개편. 새 색 토큰 recess(가라앉은 면) · raised(떠오른 면) · line(옅은 선) · faint(흐린 글자) · disabledSurface · disabledForeground · arc · arcMuted · focusRing, 새 그림자 shadow.lift · shadow.liftSm. Button — 주 버튼 · 위험 버튼 비활성은 disabledSurface 바탕 + disabledForeground 글자(흐림 없음, 줄어듦 유지), sm 주 버튼도 primary 채움 + 흰 글자. Field — 반경 lg, 평소 surface + 1px line, 입력 중 1px primary + 4px focusRing 번짐 · primary 커서(오류 · 경고는 그대로). SearchField — 테두리 없는 raised + lift. Chip · ChipGroup — 안 고른 칩 recess + mutedForeground, 고른 칩 raised + liftSm + 600 + 글자 앞 지름 6 primary 점(check 칩은 체크 그대로). CircleGrid — 고른 원은 primary 테 대신 4px raised 테 + lift, 오른쪽 아래 지름 24 체크 원(바탕색 테 2.5). QuestionPager — 탭 아래 line, 지금 탭 title + primary 밑줄, 끝난 탭 mutedForeground + primary 체크, 남은 탭 faint, 타일은 recess + mutedForeground, 고른 타일 raised + liftSm + 600 + 지름 18 체크 원. DialStrip · AxisRing — 링 바탕 recess · 테 line, 고른 축만 raised + liftSm, 호 arc(고른 축) · arcMuted, 색 링은 고른 것 raised 테 + liftSm. ColorFamilyTabs — 고른 견본은 4px raised 테 + liftSm. PaletteThumbs · DraftStrip — 고른 썸네일은 raised 테 + lift + 체크 원. BlockStrip — 번호 배지 raised + liftSm + title 글자(고른 블록은 primary 배지 · raised 테 + lift). ToolRow 켜짐 raised + liftSm + title 아이콘, EditorBar · FontPicker 켜짐 recess, ColorSwatchPicker · LayoutPicker · StructurePicker 고른 것 raised 테 + 그림자. props · 동작 · 접근성 변경 없음.
- cbd5ac2: Slider 모양 — 줄 높이 6 · input 색, 기준점(범위에 0이 있으면 0, 아니면 min)에서 손잡이까지 primary 채움, 기준점이 범위 안쪽이면 눈금(폭 2 · 높이 16 · ring), 손잡이 지름 28 surface · shadow.md. SliderList — 구분선 없이 위 한 줄(끝 낱말 label · 가운데 축 이름 semibold title 색) · 아래 양옆 낱말 없는 슬라이더, 값이 기운 쪽 끝 낱말만 foreground · semibold, 줄 사이 space 4 · 머리줄과 슬라이더 사이 space 1. props 변경 없음.

### Patch Changes

- 11bca84: QuestionPager: 묶음을 한 흐름으로 잇는 스크롤, 탭은 위치 표시와 이동, 묶음을 다 고르면 잠시 뒤 다음 묶음으로 부드럽게 스크롤, StepScreen fill 제목 여백
- d6a5096: QuestionPager 다듬기: 탭을 왼쪽 정렬 · 글자 폭 밑줄 · 화면 끝까지 가는 선으로, 끝난 탭의 체크는 글자 뒤로, 칸 높이 48 · 칸 사이 8 · 문항 사이 20

## 0.19.1

### Patch Changes

- DetailCanvas: 블록 누름 영역을 레이어 옆 바탕으로 옮겨 누름 요소가 겹치지 않게(웹 button 안 button 경고)

## 0.19.0

### Minor Changes

- QuestionAccordion: 펼치기형 질문(접힌 줄 번호 · 섹션 · 고른 값, 펼친 질문 흰 패널 · 2열 칸 · 선택 연한 브랜드 바탕 + 점 · 기타 직접 입력)
- 제목 톤: screenTitle 600 · 자간 -0.6 · 차콜 title 색(StepScreen · PageHeader · ResultTemplate · Text screenTitle)
- 토큰: title · selectSurface · selectForeground · radius.xl · shadow.panel · typography eyebrow · question

## 0.18.0

### Minor Changes

- SliderList: 축 이름 아래 슬라이더 한 줄을 구분선으로 촘촘히 쌓는 묶음
- 상품 시트: SheetFormTemplate(뒤로 · 제목 · 글자 버튼 위 막대 · 탭 자리 · 회색 바탕 블록 스크롤 · 임시저장 + 등록 나란히) · SheetBlock(흰 블록, 안의 ListRow 좌우 여백 없음) · SectionTabs(구역 탭 · 확인 필요 점) · CoverPhotos(대표 2×2 · 추가 칸 · 업로드 상태)
- 상세페이지: StructurePicker(구성 그림 고르기) · DraftPreview(초안 미리보기 자르기)
- BottomBar split(두 버튼 나란히)

## 0.17.0

### Minor Changes

- 상세페이지 편집기 2차: 페이지 배경 하나 · 선택 표시 겹쳐 그리기 · 줄 간격 · 자간 · 블록 위아래 여백 · 고른 블록 자동 스크롤 · EditorPanel 좌우 여백 · DETAIL_COLORS
- Slider: 눈금 없는 연속 슬라이더(접근성 증감 10분의 1) · onSlidingStart
- Button: 주 버튼 테두리형(흰 바탕 · 1.5 주황 테두리 · 주황 글자), 비활성은 회색 테두리 · 회색 글자
- 주황 줄이기: 섹션 제목 · 목록 앞 아이콘 · 할 일 아이콘 회색
- FloatingTabBar: 떠 있는 아래 탭(높이 64 · 가장자리 16 · 선택 칸 48 옅은 브랜드색 · 선택 아이콘 채움 · 할 일 점 배지 6), floatingTabBarSpace
- 아이콘 Phosphor 2.1.1(MIT) 선 · 채움 5종
- 상세페이지 편집기: DetailCanvas(블록 그리기 · 선택 핸들) · DetailComposer(첨부 · 요청 입력) · DraftStrip(초안 썸네일 줄) · LayoutPicker(블록 배치 7종) · ToolRow · FontPicker(글꼴 4종) · EditorBar · DetailEditorTemplate

## 0.16.0

### Minor Changes

- 자사닷 브랜드 색: 로고 주황 #ED6431 · 잉크 #1A1A1A · 바탕 #FAFAFA
- 주황 위 글자와 작은 강조 글자는 잉크, 아이콘 · 버튼 면은 로고 주황

## 0.15.0

### Minor Changes

- CircleGrid 여러 개 선택(multiple · max)
- SummaryHeader 누르기(onPress)

## 0.14.0

### Minor Changes

- SplitPreviewTemplate(위 미리보기 · 아래 편집)

## 0.13.0

### Minor Changes

- 주문 처리: Dialog 본문, ListRow 선택 표시(라디오 · 체크), Field 뒤쪽 버튼, ScanGlyph, ScanModal, SelectionTemplate, BulkShipList 한 줄 입력
- 요약 카드: Panel, SummaryHeader, MetricCard, ValueTiles, TimeSpanCard, YearBand, AnswerChips, HistoryList, UsageCard, ToggleCard
- Stepper, RequestCard, PhotoGrid, PreviewTemplate
- ListRow 아이콘 강조, StatusBadge point, ListSection boxed, ProgressBar 숫자 숨김

## 0.12.1

### Patch Changes

- QuickActions · ActionGrid 칸을 회색에서 바탕 위 흰 면(surface)으로, TaskTiles와 통일

## 0.12.0

### Minor Changes

- 색을 스톤 바탕 · 잉크 글자 · 주황 포인트로: background #f5f5f4, foreground #2a2622, primary #c2410c
  - 색 역할 surface(바탕 위 흰 면) · point(글자용 주황) 추가, Text tone `point` 추가
  - 카드 · 입력칸 · 시트 · 대화상자 · 선택 칸은 surface, ListRow · ProductRow · 외곽선 Button은 투명
  - 섹션 제목 · 상세 큰 제목 · 합계 금액 · 건수는 point, ListRow 값은 잉크
  - TaskTiles는 1건 이상일 때만 point, StageBar는 흰 면에 현재 단계 옅은 주황

## 0.11.0

### Minor Changes

- 운영 화면 개편 부품: StoreHeader · StoreMark · StoreSheet(스토어 이름 ▾ → 전환 시트), TaskTiles(할 일 4칸), StageBar(주문 단계 띠), StatusSteps(진행 단계), ProductTile · ProductTileSpacer, InboxRow(받은편지함 행), QuickActions(바로가기 칸), SiteSummary(폰 모양 사이트 미리보기 머리), ActionGrid(편집 2열 칸)
  - ListTemplate columns(격자) · floatingAction(떠 있는 알약 버튼), StatCard meta 줄, `@ezpg/app-ui/charts` MiniBars(7일 막대)
  - 사진 없는 Photo · ListRow 이미지를 웹과 같은 타일 색 + 사진 아이콘으로(Photo seed · tileColor, 토큰 tile)
  - 선 아이콘 Truck · Return · Star · Image · Globe · Palette · Chart · Card · Clock · Sparkles · Store · File · Wallet · Link · Users · Phone · Eye · Share

## 0.10.0

### Minor Changes

- `@ezpg/app-ui/adjust` 새 입구: AdjustTemplate(미리보기 + 조정 칸 + 원래와 비교), DialStrip(원 테두리로 값 표시하는 항목 줄), ScrubRuler(좌우로 미는 눈금, 단계 맞춤), ColorTrack(색상 · 채도 트랙), ColorAdjustNote(자동 대비 조정 전후 색), hslToHex · hexToHsl

## 0.9.0

### Minor Changes

- IntroTemplate(첫 실행 소개 넘김 화면 — 장마다 그림 · 제목, 넘김 점, 다음 · 시작하기 주 버튼, 마지막 장 전까지 작은 Skip)

## 0.8.0

### Minor Changes

- 주색을 검정에서 다크 브라운으로(라이트 #4d291c · 다크 #caada3, Fluent darkBrown)
- 색 역할 primaryTint · primaryContainer · primaryEdge 추가
- 선택 표현을 채움 · 굵은 테두리에서 옅은 면으로: Chip(옅은 갈색 면 + 갈색 글자 + 체크, 미선택은 회색 면), Card · PlanCard 추천 · CopyVariantPicker · ColorSwatchPicker 카드(옅은 면 + 작은 표시 점), LogoCandidateGrid(테두리 없이 표시 점)
- Field 포커스 1px primaryEdge, ColorSwatchPicker 고리 · ResultTemplate 넘김 점 갈색, Text tone primary

## 0.7.0

### Minor Changes

- Calendar(월 달력 — 날짜 하나 · 기간 선택, 날짜별 보조 표시(요금 등), 판매 중지 날짜, 이전 · 다음 달)

## 0.6.0

### Minor Changes

- f0128d4: ProductRow(상품 목록 행: 썸네일 · 이름 · 가격(할인 전 가격) · 상태 배지 · 오른쪽 자리). 썸네일은 목록 행 한 줄 높이(Material 3 목록 앞 이미지 56).

## 0.5.0

### Minor Changes

- ac190f6: Group(제목 · 옆 글자 · 내용 묶음, 질문 화면 안의 묶음용). ResultTemplate — 미리보기 render(mode: 'card' | 'full'), 미리보기 1개면 점 숨김, 진행 중에도 호출하는 쪽이 준 하단 행동을 보여 줌(실패 · 다시 만들기).

## 0.4.0

### Minor Changes

- 2817c7b: DS2 역할 토큰 — 글자 단계 label(14/20) · screenTitle(24/32), layout(화면 여백 · 묶음 간격), controlSize · headerHeight · listRowHeight 추가. 부품 안 숫자 글자 크기 27곳 · 간격 · 모서리 · 높이를 토큰으로 교체(13 → 14, 16 → 17, 18 → 20, 36 → 28, 간격 4 단위, 모서리 10 → 8 · 12), StepScreen 제목과 본문 사이 20 → 24. 숫자 글자 크기 · 간격 · 모서리 lint 추가.
- e468e14: DS3 토큰 보정 — layout.screenX 20 → 16, listRowHeight → listRow { oneLine 56 · twoLine 72 · threeLine 88 }(Material 3 목록).
- fc79451: DS3 화면 템플릿 9종 시안(src/templates, 아직 내보내지 않음)과 기준 스토리. ListRow — overline(윗줄) · 두 줄 72 · 세 줄 88 높이 · 제목 bodyLg · 설명 label · 좌우 screenX. Field — 단위(trailing)가 있을 때 입력이 줄어들지 않아 단위 글자가 깨지던 문제(minWidth 0).
- 8aa08c9: DS4 화면 템플릿 내보내기 — ListTemplate · ResultTemplate · DetailTemplate · FormTemplate · MenuTemplate · DashboardTemplate · EditorTemplate · SystemTemplate · ListSection과 타입(TemplateAction · TemplateNotice · NoticeReason 등). 보조 문구는 notice 자리 하나, 사유는 error · money · irreversible · legal만. 동작 테스트 11개.
- 8626eb5: DS5 패턴 정리 — ListTemplate 빈 · 오류 화면을 EmptyState로, 기한 색 한 규칙(평소 muted · 오늘 마감 warningText · 지남 danger, deadlineTone), Text tone warning, Field 경고 테두리 · 아이콘 warningText(비텍스트 대비 3:1), 주문 상태 이름을 손님 웹과 같은 말로(상품 준비 중 · 주문 취소, orderStatusText: 입금 대기 · 픽업 준비 완료 · 수령 완료), orderStatusTone, OrderFulfillment에 visit.
- 0887336: StepScreen notice — 질문 화면에도 보조 문구 자리 하나(사유 error · money · irreversible · legal).
- a8122c3: 부품 규칙 통일: Button variant `solid` → `primary`, ButtonVariant · ButtonSize · StatusBadgeTone · ToastTone을 공통 규칙(theme/contract.ts, design/contract.json 생성)에서 가져옴.
- 597ebb9: ThemeColors `warningText` 추가(light #b45309 · dark #fbbf24). 경고를 글자 · 아이콘으로 쓸 때 사용, `warning`은 채움 배경 전용.

### Patch Changes

- 7e926f0: danger(light)를 #dc2626에서 #b91c1c(red-700)로 바꿈. 연한 빨강 바탕(#fef2f2) 위 대비 4.41 → 5.91.

## 0.3.0

### Minor Changes

- c4dbf77: 테마 값을 EZPG 공통 토큰 원본(design/base_tokens.json)에서 생성한 theme/base.ts로 읽음. `destructive` 이름을 `danger`로 바꿈: ThemeColors `danger`·`dangerForeground`, Button variant `danger`, StatusBadge·Toast tone `danger`, Dialog `danger` prop.

## 0.2.0

### Minor Changes

- 817e226: 새 부품 GenerationProgress · ProgressBar · SelectionBar · BulkShipList(trackingIssues 포함).

  깨지는 변경
  - OrderStatus · orderStatusLabel 키를 API 상태 문자열 7종(pending_payment · paid · preparing · shipped · delivered · completed · canceled)으로 바꿈. 취소·반품·교환 요청 계열 키 삭제.
  - ClaimRow 상태 7종(requested · collecting · collected · held · completed · rejected · withdrawn), reason 선택, onApprove · onReject 삭제(행은 onPress로 상세만 엶), dueInDays 대신 dueAt으로 D-n 계산. claimStatusLabel 추가.

  확장
  - OrderCard · Card onLongPress · selected, Chip · ChipGroup count, Field hint · warning, SitePreviewFrame publishDisabled · blockedReason.
  - PlanCard 상태 none · trial, PlanCard · CreditWallet dailyLimit null(무제한).
  - ServiceStateBanner stopped · reason, OptionEditor onActiveChange · note.

  수정
  - 다크 테마 Switch 색, ImageGrid 업로드 실패 표시, LineChart 세로축 라벨 폭, OptionEditor 음수 가격 표시.
  - src 주석 삭제와 주석 검사(lint).

## 0.1.0

### Minor Changes

- d816bb2: 첫 공개 배포
