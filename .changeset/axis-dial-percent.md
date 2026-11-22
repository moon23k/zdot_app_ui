---
'@zdot/app-ui': minor
---

AxisDial — 값 범위 0~100 고정, 50 이 기준점(min · max · valueLabel 삭제, centerLabel 추가 · 기본 '중간'). 끄는 동안 점 · 눈금 · 숫자가 반올림 전 실수 값으로 손을 따라 연속으로 움직이고 onChange 는 0~100 정수가 바뀔 때마다, 손을 뗄 때 48~52 면 50 으로 붙임. 눈금 51개(2 단위, 5개마다 긴 눈금 124→138 · 2.5, 짧은 눈금 129→138 · 1.8), 기준점 → 값 primary, 나머지 긴 눈금 arcMuted · 짧은 눈금 input. 값 점 지름 14. 원판 가운데 큰 숫자(46/50 · 700 · 자간 −1.5 · 숫자 폭 고정 · title) + 낱말(bodyLg 600 · mutedForeground, 50 초과 endLabel · 미만 startLabel · 50 centerLabel). adjustable 값 텍스트 '74 강한', 증감 5. AxisDialGroup — values 0~100, min · max 삭제, DialStrip percent 로 축 링 표시. DialStrip 에 percent(선택) — 링 글자를 0~100 정수로, 호는 위에서 |값−50|/50 만큼, 고른 링 숫자 700. 기본은 기존 모양 · 부호 표기.
