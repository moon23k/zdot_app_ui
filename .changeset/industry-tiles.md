---
'@zdot/app-ui': minor
---

업종 고르기 2열 칸 개편. TileGrid 추가 — 2열 칸(간격 8, 높이 112, 반경 xl), 안 고른 칸 recess · 고른 칸 raised + shadow.lift, 왼쪽 위 분류 이름(caption, faint) · 업종 이름(16/21 · 600, 고르면 700, 최대 2줄), 오른쪽 아래 지름 104 받침 위 68 사진, 고른 칸 지름 22 체크 원, 칸은 radio(이름은 label 만). FilterTabs 추가 — 가로로 넘기는 밑줄 탭(14px, 지금 탭 700 · title, 나머지 500 · faint, 사이 22, 높이 44, 글자 폭 2px primary 밑줄, 아래 0.5px 옅은 선, 더 넘길 탭이 있으면 오른쪽 72 흐림), bleed 로 화면 좌우 끝까지. SearchField variant 'recess'(recess 면 · 높이 50 · 자리 글자 faint, 입력 중 raised + 1px primary + focusRing), 기본은 그대로. StepScreen — 3px 진행 막대 대신 머리줄 오른쪽 '1 / 3'(지금 숫자 title · 나머지 faint), 제목 26/34 · 600 · −0.8, compact(위 12 · 사이 16), chosen(floatingAction 과 함께: null 이면 전체 폭 '다음', 값이 있으면 고른 사진 · 이름 · '다음' 을 담은 떠 있는 막대, 위로 바탕색 흐림). chosen 을 주지 않는 화면의 아래 버튼은 그대로.
