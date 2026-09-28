# Developer’s Room — Portfolio MVP

개발자의 작업실 사물을 탐색 UI로 사용하는 포트폴리오의 첫 구현입니다.

## 실행

Node.js 22.14 이상과 npm을 사용합니다.

```sh
npm ci
npm run dev
```

개발 서버: <http://localhost:3000>

```sh
npm run typecheck
npm run lint
npm test
npm run format:check
npm run build
npm start
```

Next.js 16.3.5 / React 19.2 / strict TypeScript / R3F / Drei / Three.js / GSAP / Zustand / CSS Modules를 사용합니다. React 19.3은 설치 시점 R3F peer dependency 범위 밖이므로 19.2 계열을 사용했습니다. 정확한 의존성은 `package-lock.json`에 고정됩니다.

## 구현 범위

- 소개·성과·SmartOffer/Jongalab 대표 카드를 보여주는 첫 화면. SmartOffer 상세는 3D 준비와 무관하게 접근 가능하며, GLB 첫 프레임 준비 후 작업실 둘러보기 활성화.
- `/projects/smartoffer`: 서버 렌더링되는 독립 사례 페이지. 문제·기술 선택·기여·결과, 조회 개선 개념도, 목차 및 이메일 연락 링크.
- 제공된 v4 GLB 로드. 기존 사물과 노드 이름 유지, 새로운 placeholder room 생성 없음.
- `SCENE_SPEC_V4.json`의 home/projects/about/experience/window 카메라 그대로 사용. Z-up 유지, damp 이동, 자유 OrbitControls 없음.
- 모니터 → Projects / 노트 → About / Experience → 실제 경력 콘텐츠.
- 조명 스위치와 DOM 버튼 → 공통 theme 상태 및 방 조명 변경. 초기값은 시스템 색상 설정.
- 창문 → 환경 패널. 기기 현지 시간 기준 dawn/day/sunset/night, 수동 시간 전환 및 현재 시간 복귀.
- Clear/Rain mock 상태, 창문 투명도·거칠기 및 조명 변화. 실제 날씨 API 사용 없음.
- 스피커 및 DOM 버튼 → 명시적 동의 후 Web Audio의 작은 합성 ambient sound. 초기 음소거.
- URL hash와 뒤로/앞으로 이동 동기화, Escape로 홈 복귀, 키보드 메뉴, 초점 이동.
- 모바일 세로 콘텐츠 섹션과 별도 scene viewport. DPR 최대 1.5, reduced motion, demand rendering, 숨겨진 탭 render/audio 일시 정지.
- 3D 로딩을 건너뛰는 Projects 접근, 오류 발생 시 HTML 탐색, JavaScript 비활성화 시 안내와 기본 콘텐츠.

프로젝트와 소개는 제공된 이력서·포트폴리오에서 가져옵니다(`docs/CONTENT_SOURCES.md`). SmartOffer 측정 환경 등 자료에 없는 사실은 추가하지 않았습니다. metadata의 기존 `noindex` 설정은 유지합니다.

## 소스 우선순위

기존 패키지 README의 명시적 지침에 따라 **v4 scene/camera가 문서에 남은 v3 값을 대체**합니다.

- 모델: `assets/3d/developer_room_concept_v4.glb`
- 카메라/노드 계약: `assets/3d/SCENE_SPEC_V4.json`
- 시각적 방향: `concept-art.png`의 Warm & Real
- 설계: `docs/DESIGN_SPEC.md`, `docs/CODEX_START_PROMPT.md`, `docs/SCENE_ALIGNMENT_V4.md`
- 서빙용 모델: `public/assets/3d/developer_room_concept_v4.glb` — 원본과 동일한지 테스트합니다.

v4 GLB는 약 294 KB, 16.1K triangles입니다. ACESFilmic / exposure 1.05 / sRGB를 적용합니다. Three.js 0.186에서 PCFSoftShadowMap이 제거되어 현재 지원되는 PCFShadowMap을 사용합니다. 원본 JSON은 수정하지 않았습니다.

## 구조

- `src/components/Workspace.tsx`: boot, HTML shell, responsive content, browser lifecycle.
- `src/components/room/`: 모델·노드 인터랙션, 카메라, 조명.
- `src/components/overlays/Content.tsx`: Projects/About/Experience/Environment.
- `src/stores/`: navigation, environment, audio를 분리한 공통 상태.
- `src/content/projects.ts`: 교체할 프로젝트 콘텐츠.
- `src/lib/scene.ts`: v4 계약을 직접 가져오는 단일 진입점.
- `tests/`: GLB 계약, 시간 경계, 중복 탐색 회귀 테스트.

## 검증과 남은 작업

타입·ESLint·production build 및 Node 테스트를 실행합니다. 3D 고도화 요청에서 브라우저 검증을 재개했습니다. 브라우저 자동화 파일은 `tests/browser/`에 분리되어 있으며 `npm test`에는 포함되지 않습니다. 로컬 Chrome의 소프트웨어 WebGL로 탐색·조명·환경·모바일·에셋 실패와 야간 화면을 검증합니다. 실제 모바일 GPU 성능은 별도 확인이 필요합니다.

후속 범위: 콘셉트와의 시각적 비교 및 조명 조정, 다른 프로젝트의 상세 URL, 빗방울·굴절·모니터 GLSL, WebGPU Playground, KTX2/Meshopt 및 고급 오디오 반응. 현재는 WebGL 기반 MVP이며 WebGPU와 추가 셰이더는 넣지 않았습니다.

`AGENTS.md`와 `CLAUDE.md`는 Next.js 개발 서버가 생성한 프로젝트 지침입니다.

## 3D lighting and monitor pass

- 기존 GLB와 카메라 계약을 보존하고 런타임 재질만 조정합니다. 나무·금속·플라스틱·종이·패브릭·도자기의 거칠기를 구분했습니다.
- 전구 위치에 맞춘 따뜻한 스포트라이트와 창가 보조광, 낮춘 주변광으로 빛의 역할을 분리했습니다. 그림자 맵은 창가 2048, 램프 512이며 DPR 상한과 demand rendering을 유지합니다.
- UV가 없는 모니터 지오메트리를 복제해 XZ 평면 UV를 만들고 기존 SmartOffer 스크린샷을 적용합니다. 이미지 로딩 실패 시 기존 발광 화면을 유지합니다.
- 화면 호버 시 발광을 조금 높이고 Projects 버튼을 화면 아래로 이동했습니다. 텍스처·복제 지오메트리는 해제 시 정리합니다.

창문 원경은 원본 도시 메쉬를 런타임에서 숨기고 기존 하늘 패널에 정적인 절차적 셰이더를 적용합니다. 낮은 도시 실루엣·원경 능선·하늘 그라데이션·구름과 시간대별 작은 야간 불빛을 표현하며, 비 설정에서는 대비를 낮춥니다. 원본 GLB와 창문 클릭 대상은 유지하고 추가 이미지 요청이나 지속 애니메이션은 사용하지 않습니다.

## Landing UX update

- 소개와 실시간 작업실 프리뷰를 한 화면에 배치하고, 대표 프로젝트를 실제 서비스 이미지·역할·성과 중심 카드로 구성했습니다.
- SmartOffer와 Jongalab 모두 내부 사례 페이지로 연결하며 외부 제품/서비스 방문은 별도 링크로 제공합니다.
- 모바일에서는 세로 탐색을 사용하며 3D 로딩 여부와 무관하게 사례 페이지에 접근할 수 있습니다.
