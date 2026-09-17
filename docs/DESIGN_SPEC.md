# Developer's Room Portfolio — Codex 설계 문서 v3

> Updated: 2026-09-17  |  3D source of truth: `assets/3d/developer_room_concept_v3.glb`

## 1. 프로젝트 개요

### 프로젝트명
Developer's Room Portfolio

### 목적
3년차 프론트엔드 개발자의 기술력과 문제 해결 역량을 보여주는 인터랙티브 포트폴리오 사이트를 제작한다.

흔한 '중앙 3D 오브젝트 + 파티클' 방식은 피하고, 하나의 개발자 작업실을 2.5D 공간으로 구성한다. 사용자는 방 안의 사물을 클릭해 포트폴리오 콘텐츠를 탐색한다.

핵심은 '3D 모델 감상'이 아니라 **공간과 인터페이스가 하나로 연결되는 경험**이다.

---

## 2. 핵심 콘셉트

### Developer's Room
한 명의 프론트엔드 개발자가 실제로 사용하는 듯한 작업실을 하나의 인터랙티브 포트폴리오로 만든다.

- 모니터 → Projects
- 노트 → About
- 벽/보드 → Experience
- 서랍 → Playground
- 스피커 → Sound
- 조명 스위치 → Light/Dark Theme
- 창문 → 현재 시간 + 날씨 기반 Environment

사용자는 자유 이동형 FPS처럼 방을 돌아다니지 않는다. 카메라는 미리 정의된 포지션 사이를 이동한다.

이 구조를 통해 3D는 배경이 아니라 Navigation System이 된다.

---

## 3. 디자인 방향

### 기본 무드
- 2.5D cinematic room
- 현실적인 개발자의 작업실 + 약간의 비현실적 인터랙션
- 과도하게 미래적이거나 사이버펑크스럽지 않음
- 실제 사람이 사용하는 공간처럼 생활감이 있어야 함
- 밤/낮, 날씨, 조명 상태에 따라 분위기가 크게 달라짐

### 권장 스타일
기본 방향은 **Stylized Semi-realistic + Warm Cinematic**이다. `concept-art.png`의 공간감과 조명을 참고하되, 실제 구현 구조와 치수는 v3 GLB를 우선한다.

- 따뜻한 책상 조명
- 도시가 보이는 창문
- 실제 모니터/키보드/노트/스피커/식물
- 어두운 배경에서도 텍스트 가독성 유지
- UI는 미니멀하고 정돈된 스타일

---

## 4. 핵심 사용자 경험

### 4.1 최초 진입

최초에는 가벼운 HTML 기반 부팅 화면을 보여준다.

```text
> booting workspace...
> loading room...
> loading projects...
> almost there...

workspace ready.

[ ENTER ]
```

이 화면 뒤에서 초기 3D Scene을 로딩한다.

ENTER 선택 후 기존 HTML 화면이 모니터 영역으로 축소되는 듯한 transition을 거쳐 전체 Room Scene을 보여준다.

목표:
- 빈 로딩 화면을 보여주지 않는다.
- 로딩 자체를 포트폴리오 경험의 일부로 만든다.

---

### 4.2 Home / Room Scene

최초 카메라는 방 전체를 볼 수 있는 고정된 Hero View에 위치한다.

방 안에는 다음 사물이 있다.

- 책상
- 모니터
- 키보드
- 마우스
- 노트
- 스피커
- 벽/화이트보드 또는 핀보드
- 조명 스위치
- 창문
- 서랍
- 작은 소품

모든 물건이 클릭 가능할 필요는 없다.

#### Interaction 분류

**Navigation**
- Monitor
- Notebook
- Wall
- Drawer

**Environment**
- Light Switch
- Window
- Speaker
- Blind / Curtain (optional)

**Easter Egg**
- Coffee
- Plant
- Keyboard
- Small objects

---


## 4.3 v3 실제 3D Scene 계약

구현 초기부터 primitive placeholder를 새로 만들지 말고 `assets/3d/developer_room_concept_v3.glb`를 사용한다. 방 크기는 약 **4.8 × 3.6 × 2.7m**, 현재 전체 씬은 약 **16.1K triangles / 294KB**로 웹용 성능 여유가 충분하다.

### Interaction node contract

```text
Projects     → monitor_monitor_screen
About        → notebook_page_left / notebook_page_right
Theme        → switch_switch_toggle
Environment  → window_glass
Sound        → speakerL_woofer / speakerR_woofer
```

노드 이름은 Three.js/R3F 구현 계약이므로 특별한 이유 없이 변경하지 않는다. `SCENE_SPEC_V3.json`을 런타임 상수의 기준으로 삼는다.

### Render baseline

- Tone mapping: ACESFilmic
- Exposure baseline: 1.05
- Output color space: sRGB
- Shadow: PCF soft 계열
- Night practical lights: monitor + desk lamp + city/window
- Window glass: rain/refraction/fog shader hook
- Monitor: CRT/noise/dissolve shader hook
- Notebook: 3D page reveal → DOM/SVG handoff
- Speaker woofer: Web Audio FFT 기반 미세 scale animation

---

## 5. 메뉴 및 카메라 시스템

### Camera Presets

```ts
export type CameraView =
  | 'home'
  | 'projects'
  | 'about'
  | 'experience'
  | 'playground'
  | 'sound'
  | 'environment';
```

각 View는 position / target / FOV를 가진다.

예시:

```ts
const cameraPresets = {
  home:       { position: [0, -3.55, 1.42], target: [0, 0.75, 1.10], fov: 42 },
  projects:   { position: [0, -1.05, 1.20], target: [0, 0.76, 1.15], fov: 36 },
  about:      { position: [-0.62, -0.15, 1.32], target: [-0.50, 0.47, 0.82], fov: 32 },
  experience: { position: [-1.15, -1.00, 1.65], target: [-1.85, 0.78, 1.75], fov: 36 },
  environment:{ position: [0.45, -0.55, 1.55], target: [0.45, 1.74, 1.72], fov: 38 },
};
```

Camera transition은 GSAP 또는 자체 damp interpolation으로 처리한다.

### Navigation 원칙
- 자유 orbit controls는 기본 비활성화
- 사용자가 길을 잃지 않도록 제한된 camera movement 사용
- 메뉴 클릭과 3D 오브젝트 클릭은 동일한 route/action으로 연결
- 브라우저 back/forward 동작과 URL 상태를 동기화

---

## 6. 조명 스위치 = Theme System

조명 스위치 클릭 시 단순히 CSS theme만 변경하지 않는다.

### Light ON
- 방 ambient light 증가
- desk lamp 활성
- UI Light Theme 또는 밝은 Neutral Theme
- monitor glow 상대적으로 감소
- window reflection 감소

### Light OFF
- 방 ambient light 감소
- monitor/emissive glow 강조
- UI Dark Theme
- 창문 반사 증가
- LED / accent light 강조
- sound ambience 약간 변화

### 접근성
- 최초 테마는 `prefers-color-scheme` 참조
- UI에서 명시적인 theme toggle도 제공
- 3D 스위치는 재미 요소이자 동일 상태를 변경하는 다른 입력 방식

---

## 7. Environment System — 시간 + 날씨

환경 관련 상태를 하나로 통합한다.

```ts
interface EnvironmentState {
  localTime: Date;
  timePhase: 'dawn' | 'day' | 'sunset' | 'night';
  weather: 'clear' | 'cloudy' | 'rain' | 'snow';
  theme: 'light' | 'dark';
  soundEnabled: boolean;
}
```

### 시간 구간
- 05:00–07:00 Dawn
- 07:00–17:00 Day
- 17:00–19:00 Sunset
- 19:00–05:00 Night

정확한 경계는 디자인 단계에서 조정 가능.

### 날씨
기본 위치는 Seoul.

권장 방식:
1. 사용자 위치 권한 없이 Seoul weather 사용
2. 사용자가 직접 'Use my location' 선택 시에만 위치 요청
3. weather API 실패 시 clear/default fallback

### Weather Visuals

**Clear**
- clear sky
- stronger directional light

**Cloudy**
- lower contrast
- softer light

**Rain**
- rain layer
- window rain GLSL distortion
- rain ambience
- city blur/reflection

**Snow**
- snowfall
- cooler ambient color

---

## 8. GLSL 활용

GLSL은 별도 기술 데모가 아니라 공간 안에 자연스럽게 녹인다.

### 우선 적용
1. Window Rain Shader
2. Glass Refraction / Reflection
3. Monitor CRT / Scanline / Noise
4. Scene transition distortion
5. Light glow / emissive response
6. Mouse proximity distortion (limited)
7. Notebook page transition

### 원칙
- 장식적인 noise sphere 금지
- shader는 UI/환경과 연결되어 의미를 가져야 함
- mobile / low GPU에서는 단순 버전으로 fallback

---

## 9. About — Notebook Interaction

노트를 클릭하면 camera가 노트로 이동한다.

노트가 충분히 확대된 시점에 3D scene 위에 DOM/SVG layer를 자연스럽게 overlay한다.

### SVG Animation

손으로 그리는 듯한 path animation:

```text
Frontend Developer
       │
       ├── UI
       ├── Performance
       ├── Architecture
       └── Interaction
```

구현:
- SVG path
- `stroke-dasharray`
- `stroke-dashoffset`
- GSAP 또는 Motion

노트에는 다음 내용을 표시한다.

- 짧은 자기소개
- 현재 관심사
- 일하는 방식
- 문제 해결 원칙
- 기술적 강점

---

## 10. Projects — Monitor

모니터 클릭 시 camera가 monitor 방향으로 이동한다.

3D monitor frame이 화면 가장자리에 닿을 때 실제 DOM 기반 project UI로 seamless transition한다.

### 목적
3D 내부에서 텍스트를 모두 렌더링하지 않는다.

프로젝트 상세는 반드시 HTML/DOM 기반으로 만든다.

이유:
- SEO
- 접근성
- 텍스트 가독성
- 유지보수
- 반응형 대응

### Project Detail 구조

1. Overview
2. Problem
3. My Role
4. Technical Decisions
5. Architecture
6. Key Challenges
7. Result / Impact
8. Retrospective

### 권장 표현
Before → Decision → After 구조를 적극 활용한다.

단순 기술 스택 나열보다 문제 해결 중심으로 작성한다.

---

## 11. Experience — Wall

벽이나 보드에는 Git history 형태로 3년의 경험을 표현한다.

예시:

```text
2026 ●────────────── Design system / architecture
      \
2025   ●──────────── Performance / product ownership
        \
2024     ●────────── Feature implementation / fundamentals
```

각 연도/commit을 클릭하면 상세 경험이 나타난다.

가능하면 `git diff` 형식으로 성장 과정을 표현한다.

```diff
- 기능 구현 중심
+ 유지보수 가능한 구조 고려

- 화면 단위 개발
+ 사용자 흐름과 제품 관점 고려

- 동작하면 완료
+ 성능, 접근성, 테스트까지 확인
```

---

## 12. Playground — Drawer

서랍을 클릭하면 열리며 Playground 진입.

실험 기능:
- Liquid Typography
- Image Dissolve
- GPU Layout Physics
- Audio Reactive UI
- Shader transition
- DOM ↔ WebGL transition

WebGPU는 이 영역에서 적극적으로 사용 가능.

단, 초기 landing bundle에는 포함하지 않는다.

---

## 13. Sound System

최초 음소거.

사용자가 Speaker를 클릭하거나 Sound On을 명시적으로 선택해야 활성화한다.

### Sound types
- room ambience
- rain
- keyboard
- switch
- drawer
- page flip
- camera transition
- UI feedback

### Web Audio 활용
사용자 행동을 parameter에 연결할 수 있다.

- mouse X → filter/pan
- interaction intensity → volume
- transition progress → pitch

과도한 음악 재생은 피한다.

---

## 14. Parallax

Parallax는 보조 효과로 제한한다.

추천:

```text
Foreground  +8px
Desk        +4px
Window       0px
City        -3px
Sky         -6px
```

카메라 이동과 동시에 과한 parallax를 사용하지 않는다.

목표는 깊이감이며, 멀미를 유발하지 않아야 한다.

---

## 15. 반응형 설계

### Desktop
- full room composition
- camera preset navigation
- rich shader
- full environment effects

### Tablet
- cropped room composition
- simplified camera transition
- reduced shader quality

### Mobile
데스크톱 방을 축소하지 않는다.

세로형 cinematic scroll layout으로 재구성한다.

예:

```text
Window
↓
Monitor / Projects
↓
Notebook / About
↓
Wall / Experience
↓
Drawer / Playground
```

동일한 asset과 theme을 사용하지만 interaction model은 다르게 한다.

---

## 16. 성능 전략

### 초기 목표
첫 화면에 필요한 리소스는 최대한 가볍게 구성한다.

권장 목표:
- initial 3D payload: 약 1–2 MB 수준을 지향
- 나머지는 lazy loading

### Initial Load
- room geometry
- desk
- monitor
- notebook
- basic lighting
- low-resolution environment texture

### Lazy Load
- books
- decorative objects
- playground assets
- project assets
- high quality shaders
- audio
- additional textures

### Asset Pipeline
AI generated model → Blender cleanup → retopology → bake → GLB → Meshopt/Draco → KTX2

### 필수 최적화
- KTX2 textures
- Meshopt preferred
- GLB splitting by interaction group
- lazy loading
- dynamic DPR
- visibility based render pause
- page hidden 시 render loop throttle/pause
- mobile shader fallback
- prefers-reduced-motion 지원

---

## 17. 기술 스택

### Core
- Next.js
- TypeScript
- React

### 3D
- Three.js
- React Three Fiber
- Drei
- WebGPU Renderer (지원 환경)
- WebGL fallback

### Animation
- GSAP
- Framer Motion 또는 Motion

### Shader
- GLSL
- WGSL (WebGPU Playground용)

### Sound
- Web Audio API
- Howler.js 또는 Tone.js (필요 시)

### Content
- MDX or typed static content

### State
- Zustand 권장

### Quality / Monitoring
- Web Vitals
- Sentry optional
- GPU tier / reduced motion detection

---

## 18. 권장 프로젝트 구조

```text
src/
├─ app/
│  ├─ page.tsx
│  ├─ projects/
│  │  └─ [slug]/page.tsx
│  └─ layout.tsx
├─ components/
│  ├─ room/
│  │  ├─ RoomScene.tsx
│  │  ├─ Desk.tsx
│  │  ├─ Monitor.tsx
│  │  ├─ Notebook.tsx
│  │  ├─ Wall.tsx
│  │  ├─ Window.tsx
│  │  └─ LightSwitch.tsx
│  ├─ camera/
│  ├─ environment/
│  ├─ overlays/
│  ├─ projects/
│  └─ ui/
├─ shaders/
│  ├─ rain/
│  ├─ glass/
│  ├─ monitor/
│  └─ transitions/
├─ stores/
│  ├─ useNavigationStore.ts
│  ├─ useEnvironmentStore.ts
│  └─ useAudioStore.ts
├─ lib/
│  ├─ weather.ts
│  ├─ time.ts
│  └─ performance.ts
├─ content/
│  ├─ projects/
│  └─ experience/
└─ assets/
```

---

## 19. 상태 설계

### Navigation Store

```ts
interface NavigationState {
  view: CameraView;
  isTransitioning: boolean;
  setView(view: CameraView): void;
}
```

### Environment Store

```ts
interface EnvironmentStore {
  timePhase: 'dawn' | 'day' | 'sunset' | 'night';
  weather: 'clear' | 'cloudy' | 'rain' | 'snow';
  theme: 'light' | 'dark';
  setTheme(theme: 'light' | 'dark'): void;
}
```

3D scene / DOM / audio가 동일 상태를 공유해야 한다.

---

## 20. MVP 범위

### Phase 1 — Room Foundation
- Next.js setup
- R3F room
- camera presets
- monitor/notebook/light/window
- desktop hero composition

### Phase 2 — Signature Interactions
- light switch theme
- time based environment
- weather environment
- notebook SVG animation
- monitor → projects transition

### Phase 3 — Content
- projects
- about
- experience
- contact

### Phase 4 — Advanced Graphics
- rain shader
- glass shader
- monitor shader
- transition shader
- WebGPU Playground

### Phase 5 — Polish
- audio
- easter eggs
- responsive redesign
- performance tuning
- accessibility

---

## 21. 반드시 피할 것

- 중앙에 의미 없는 3D 오브젝트를 띄우고 회전시키는 랜딩
- 배경에 의미 없는 particle field
- FPS 방식 자유 이동
- 읽기 어려운 3D text 남발
- 모든 물건을 클릭 가능하게 만들어 게임처럼 만드는 것
- 기술을 보여주기 위한 기술 데모
- 초기 번들에 모든 모델/사운드/shader 포함
- 모바일에 desktop scene 그대로 축소

---

## 22. 완료 기준

이 포트폴리오는 다음 인상을 주어야 한다.

> "Three.js를 쓸 줄 아는 사람"이 아니라
> "인터페이스, 공간, 성능, UX를 하나의 제품 경험으로 설계할 수 있는 프론트엔드 개발자"

사용자는 첫 10초 안에 컨셉을 이해할 수 있어야 하고, 채용 담당자는 3D 인터랙션을 생략하더라도 1–2번의 클릭으로 프로젝트 정보를 읽을 수 있어야 한다.
