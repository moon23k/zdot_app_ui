---
'@zdot/app-ui': minor
---

컬러 상세 화면 부품. ColorTune 추가 — 견본 카드 · 조절 띠 · 스토어 미리보기(남는 높이 모두) · 조합 띠를 세로로 묶음, 끄는 동안 카드 색 면은 양옆 색을 섞은 색, 처음 색과 다르면 카드에 되돌리기 버튼, 톤이 하나면 띠 없음. SwatchCard — 반경 22 raised + shadow.lift, 위 104 색 면, 아래 76 코드(13/18 · 600 · faint) · 이름(22/28 · 600 · title), onReset 이 있으면 지름 36 recess 원형 되돌리기 버튼. ToneSlider — 높이 10 그라데이션 트랙 위 같은 간격 자리, 지름 22 raised 손잡이 + shadow.liftSm, 터치 높이 44, 손을 따라 연속 이동 · 놓으면 가장 가까운 자리로 이동, origin 자리에 지름 4 점, adjustable(한 번에 한 칸, 값 텍스트 labels), onScrub 으로 연속 위치. StoreSample — 다섯 역할 색을 입힌 예시 스토어(눌리지 않음 · 접근성 숨김). PaletteStrips — 98×40 다섯 칸 띠(34 · 20 · 16 · 20 · 10) 한 줄 양끝 정렬, 고른 띠는 4 raised 테 + shadow.lift + 지름 20 체크 원, radiogroup · radio. StepScreen fill — 본문을 스크롤 없이 남는 높이에 채움(위 8 · 아래 4).
