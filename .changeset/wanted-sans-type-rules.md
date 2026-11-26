---
'@ezpg/app-ui': minor
---

글자를 Wanted Sans 와 글자 규칙으로 바꿈. 테마 fontFamily 기본값 Wanted Sans(iOS · Android 는 앱이 등록한 'Wanted Sans', 웹은 "Wanted Sans Variable" 스택), typography 토큰마다 fontFamily 와 크기 연동 자간을 실음. 굵기 700 을 600 으로, 숫자만으로 된 글자는 500 상한(Text 자동 · 금액 자리). 금액 단위를 줄여 그리는 Won, 문장 속 숫자를 강조하는 Figures(scope all · more), ListRow titleFigures, 테마 figure 토큰 추가. 금액 · 개수의 tabular-nums 제거(입력 글자 수 · 진행 숫자 · 선택 개수 · 다이얼 값만 유지). Text 기본 lineBreakStrategyIOS hangul-word.
