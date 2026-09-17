# Codex 시작 프롬프트

아래 프로젝트를 새로 구현해줘.

## 목표

3년차 프론트엔드 개발자의 인터랙티브 포트폴리오 사이트를 만든다.
프로젝트의 핵심 콘셉트는 **Developer's Room**이다.

흔한 중앙 3D 오브젝트 + 파티클 포트폴리오를 만들지 말고, 개발자의 작업실 자체를 Navigation UI로 사용한다.

반드시 같은 폴더의 `DESIGN_SPEC.md`를 먼저 읽고 해당 문서를 source of truth로 사용해라.
`concept-art.png`는 비주얼 방향 참고용이다. 실제 3D 구현은 `assets/3d/developer_room_concept_v3.glb`와 `assets/3d/SCENE_SPEC_V3.json`을 우선 source of truth로 사용해라.

---

## 기술 스택

- Next.js 최신 stable
- React
- TypeScript strict mode
- Three.js
- React Three Fiber
- Drei
- GSAP
- Zustand
- GLSL
- WebGPU 지원 브라우저에서는 WebGPU 활용 가능
- WebGL fallback 필수
- Web Audio API

스타일링은 Tailwind CSS 또는 CSS Modules 중 프로젝트 구조에 더 적합한 방식을 선택하되 일관성을 유지해라.

---

## 첫 구현 범위

처음부터 전체 사이트를 만들지 말고 아래 순서로 진행한다.

### 1. App foundation
- Next.js 프로젝트 구조
- TypeScript strict
- ESLint / formatting
- 기본 metadata
- responsive root layout

### 2. Loading / Boot Screen

최초 진입 시 가벼운 HTML UI를 만든다.

```text
> booting workspace...
> loading room...
> loading projects...
> almost there...

workspace ready.

[ ENTER ]
```

3D scene이 준비된 뒤 ENTER가 활성화된다.

### 3. Room Scene MVP

방 전체를 보는 고정된 2.5D hero camera를 만든다.

v3 Scene에서 반드시 연결할 핵심 노드:
- `monitor_monitor_screen` → Projects
- `notebook_page_left`, `notebook_page_right` → About
- `switch_switch_toggle` → Theme
- `window_glass` → Environment
- `speakerL_woofer`, `speakerR_woofer` → Sound

이미 완성된 v3 GLB가 있으므로 primitive/placeholder room을 새로 만들지 마라. `assets/3d/developer_room_concept_v3.glb`를 GLTFLoader/useGLTF로 로드하고 실제 노드 구조를 기준으로 구현해라.


### 3D Scene baseline

- Room: 약 4.8 × 3.6 × 2.7m
- v3 GLB: 약 16.1K triangles / 294KB
- ACESFilmic tone mapping
- exposure baseline 1.05
- sRGB output
- warm-neutral ambient + practical lighting
- night: monitor + desk lamp + city/window 중심

카메라 좌표를 임의로 다시 추측하지 말고 `SCENE_SPEC_V3.json`의 `camera_positions` 값을 그대로 시작점으로 사용한다.

### 4. Camera Navigation

다음 preset 구현:

- home
- projects → monitor
- about → notebook
- experience → wall placeholder

GSAP 또는 damp interpolation을 이용해 cinematic하게 이동한다.
OrbitControls로 자유 탐색하는 UX는 만들지 않는다.

### 5. Light Switch

light switch 클릭 시:
- room lighting 변경
- DOM theme 변경
- dark/light 상태 global store 동기화

`prefers-color-scheme`을 초기값으로 사용한다.

### 6. Window Environment

현재 local time 기반으로:
- dawn
- day
- sunset
- night

4가지 상태를 구현한다.

처음에는 weather API를 붙이지 말고 mock weather state로 clear/rain 전환이 가능하도록 만든다.

### 7. Notebook About Prototype

노트 클릭 → camera zoom → DOM/SVG overlay 표시.

SVG 선이 손으로 그려지는 듯한 animation을 구현한다.

예시 내용:

```text
Frontend Developer
       │
       ├── UI
       ├── Performance
       ├── Architecture
       └── Interaction
```

### 8. Monitor Projects Prototype

monitor 클릭 → camera zoom → 실제 HTML 기반 Projects overlay로 transition.

3D 안에 프로젝트 상세 text를 넣지 않는다.

---

## 아키텍처 원칙

### 상태 분리

Zustand store를 최소 다음과 같이 분리한다.

- navigation
- environment
- audio

Three.js scene과 DOM UI가 동일한 상태를 참조하도록 만든다.

### Component separation

3D 오브젝트 하나당 역할이 명확한 컴포넌트를 만든다.

예:

```text
RoomScene
Desk
Monitor
Notebook
Window
LightSwitch
CameraController
EnvironmentController
```

### Shader

Shader는 처음부터 남발하지 않는다.
MVP가 동작한 후 다음 순서로 추가한다.

1. rain window
2. glass refraction
3. monitor scanline/noise
4. transition distortion

### Performance

- initial scene은 최대한 가볍게
- 무거운 asset은 lazy load
- texture는 추후 KTX2 대응 가능하게 설계
- GLB asset은 interaction group 단위로 분리할 수 있게 설계
- mobile에서는 DPR 제한
- reduced motion 대응
- hidden tab에서는 animation/rendering 최소화

---

## 디자인 원칙

- 현실적인 개발자 작업실
- 따뜻하고 영화적인 lighting
- 과도한 cyberpunk 금지
- UI 텍스트는 항상 읽기 쉬워야 함
- 3D보다 콘텐츠가 우선
- 사용자가 어디를 클릭해야 하는지 명확해야 함
- 재미있는 인터랙션은 있지만 게임처럼 느껴지지 않아야 함

---

## 반응형

Desktop과 Mobile을 동일하게 축소하지 마라.

Desktop:
- room scene 중심
- camera navigation

Mobile:
- 세로 스크롤 기반으로 재구성 가능한 구조
- 동일 asset/theme을 사용하되 interaction model은 단순화

초기 구현에서는 desktop을 우선 완성하되 mobile breakpoint에서 레이아웃이 깨지지 않게 해라.

---

## 작업 방식

1. 먼저 `DESIGN_SPEC.md`를 읽는다.
2. 구현 계획을 `IMPLEMENTATION_PLAN.md`로 작성한다.
3. Phase 1 MVP를 구현한다.
4. 각 단계마다 TypeScript / lint / build 오류를 확인한다.
5. 기능을 한꺼번에 크게 만들지 말고 작은 단위로 구현한다.
6. placeholder를 적극 사용하고 구조를 먼저 안정화한다.
7. 기능 구현 후 README에 실행 방법과 현재 구현 범위를 기록한다.

---

## 첫 목표

첫 번째 milestone에서는 아래 흐름이 실제로 동작하면 된다.

```text
Boot Screen
   ↓
ENTER
   ↓
Developer's Room
   ├─ Light Switch → Theme 변경
   ├─ Window → 시간 환경 변화
   ├─ Notebook → About SVG animation
   └─ Monitor → Projects UI
```

이 milestone이 완성되기 전에는 Playground, 복잡한 WebGPU 효과, 많은 Easter Egg를 추가하지 마라.
