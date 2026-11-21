---
'@zdot/app-ui': minor
---

AxisDial — 한 축 값을 고르는 큰 다이얼(폭에 맞춰 최대 300 정사각). 위쪽 기준점에서 좌우 135°까지 눈금(정수 칸마다 긴 눈금 ring · 사이 8칸 짧은 눈금 input), 기준점에서 값까지 primary, 가운데 surface 원판(shadow md) 위 값 위치 점(지름 12 primary)과 valueLabel(title), 호의 양 끝 아래 startLabel · endLabel(label, 기운 쪽만 foreground semibold). 원판을 돌리는 손 움직임(중심 24 안쪽 무시)으로 정수 칸씩 바뀜, adjustable · 증감 1. AxisDialGroup — SliderList 와 같은 items · values · onChange(key, value)로 위에 DialStrip(spread) 축 고르기, 아래 고른 축의 AxisDial(사이 sectionGap), 값이 기준점이면 centerLabel(기본 '중간'). DialStrip 에 spread(선택) — 칸을 폭에 고르게 펴고 좌우 여백 없음, 기본은 기존 모양.
