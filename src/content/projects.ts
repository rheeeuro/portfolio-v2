export const projects = [
  {
    id: '01',
    title: 'Jongalab',
    category: 'AI · PERSONAL PROJECT',
    period: '2026.03 — 현재',
    role: '개인 프로젝트 · 설계, 개발, 배포 및 운영',
    stack: 'Next.js · FastAPI · Ollama · 증권 REST API',
    description:
      '정제된 공개 콘텐츠를 활용한 AI 주식 분석에서 출발해, 분석 결과를 실거래로 검증하는 자동매매 서비스로 확장했습니다.',
    problem:
      '주식 원천 데이터의 수집·가공 비용과 유지보수 부담이 컸고, 영상 요약과 종목 점수만으로는 분석 결과의 실제 의미를 검증하기 어려웠습니다.',
    decision:
      'YouTube 자동 생성 자막 등 정제된 정보원을 수집·요약하고 종목별로 평가했습니다. 종목 선정·주문·청산까지 연결한 뒤 승률뿐 아니라 손익비·거래비용·MDD를 함께 추적해 가설과 전략 변경의 근거를 기록합니다.',
    implementation:
      '시장·뉴스·수급을 조합한 분석 리포트와 종가 매수 → 익일 매도 파이프라인을 구현했습니다. 키움 REST API·한국투자증권 API·yfinance를 활용하고 Ubuntu 홈서버, PM2, Cloudflare Tunnel로 운영합니다.',
    result:
      '2026년 9월 기준, 51거래일 동안 295건의 실거래를 운영했습니다. 기능 변경과 실험 결과를 Threads·LinkedIn에 지속 공개하며 개선하고 있습니다.',
    highlight: '51거래일 · 295건 실거래',
    image: {
      src: '/assets/projects/jongalab.webp',
      width: 706,
      height: 420,
      alt: '종가랩의 종목 추천 카드와 콘텐츠 분석 화면',
      caption: '종목 추천과 콘텐츠 분석',
    },
    links: [{ label: '서비스 보기', href: 'https://jongalab.com' }],
  },
  {
    id: '02',
    title: 'SmartOffer',
    category: 'B2B · PERSONALIZATION',
    period: '2024.07 — 현재',
    role: '넷스루 · 2인 개발 · 프론트엔드 및 성능 개선',
    stack: 'React 18 · TypeScript · React Query · Redux Toolkit · Highcharts',
    description:
      '실시간 데이터 기반 추천 엔진으로 상품과 콘텐츠를 적시에 제공하는 개인화 추천 솔루션입니다.',
    problem:
      '목록 조회 시 상세·연관 데이터를 한 번에 불러오는 구조가 병목이었습니다. 서버 데이터와 UI 상태가 Redux에 혼재하고 페이지마다 구현 방식이 달라 유지보수 비용도 커졌습니다.',
    decision:
      '목록 전용 DTO, 쿼리 개선, pagination으로 응답을 경량화했습니다. 서버 상태는 React Query, 필터 상태는 URL Search Params로 분리했습니다. Hackle·Amplitude의 실험 구조를 분석해 결합도·확장성·운영 복잡도를 비교하고 사내 구조에 맞는 A/B 테스트를 설계했습니다.',
    implementation:
      'A/B 테스트 고도화, 신규 디자인 가이드 적용과 주요 화면 재설계, Highcharts 기반 추천 모니터링을 담당했습니다. Formatter·Linter와 팀 컨벤션을 도입하고 금융권 고객 요구사항을 제품 기능으로 구체화했습니다.',
    result:
      'API 응답 시간을 190ms → 14ms로 개선했습니다(약 13.6배). 코드 컨벤션과 상태 관리 경계를 정리해 유지보수성을 높였습니다.',
    highlight: 'API 응답 190ms → 14ms',
    image: {
      src: '/assets/projects/smartoffer.webp',
      width: 685,
      height: 382,
      alt: '추천 영역별 상태와 조건을 관리하는 SmartOffer 목록 화면',
      caption: '디자인 가이드를 적용한 추천 영역 관리',
    },
    links: [
      {
        label: '제품 소개',
        href: 'https://www.nethru.co.kr/CEP/smartoffer.html',
      },
    ],
  },
  {
    id: '03',
    title: 'Comeet',
    category: 'REALTIME · COLLABORATION',
    period: '2024.01 — 2024.02',
    role: 'SSAFY 10기 · 6인 팀 · 프론트엔드 구조 및 스터디방 기능',
    stack:
      'React · TypeScript · OpenVidu · WebSocket · Monaco Editor · Three.js',
    description:
      '스터디 모집과 진행을 하나로 연결하고 화상 회의·채팅·코드 공동 편집·스터디 메타데이터를 제공하는 개발자 스터디 플랫폼입니다.',
    problem:
      '스터디 모집과 진행이 여러 도구로 분리되어 있었습니다. 제한된 일정 안에 공동 편집과 실시간 방 정보 변경을 구현하면서 운영 부담도 관리해야 했습니다.',
    decision:
      'Yjs를 추가하는 대신 기존 OpenVidu 메시징을 Monaco Editor 편집 이벤트에 연결했습니다. 방 정보 변경에는 Polling·Message Queue·Kafka를 비교한 뒤 기존 WebSocket 연결을 재사용했습니다.',
    implementation:
      '캠·화면·음성 공유, 마크다운 채팅, 방 정보 변경 이벤트를 구현했습니다. Three.js·GLSL 메인페이지와 프론트엔드 구조 설계, 리팩토링, UI 개선 및 API 연동도 담당했습니다.',
    result:
      'SSAFY 10기 서울캠퍼스 공통 프로젝트 우수상(1위)을 수상했습니다. 새 기술의 도입보다 기존 구조의 재사용 가능성, 구현 비용과 운영 부담을 함께 비교하며 기술을 선택했습니다.',
    highlight: 'SSAFY 공통 프로젝트 1위',
    image: {
      src: '/assets/projects/comeet.webp',
      width: 707,
      height: 441,
      alt: '학습 키워드, 활동 시간과 캘린더를 보여주는 Comeet 스터디 통계',
      caption: '함께 공부한 기록을 보여주는 스터디 메타데이터',
    },
    links: [
      {
        label: 'GitHub · 시연 영상',
        href: 'https://github.com/rheeeuro/comeet',
      },
    ],
  },
];

export const otherProjects = [
  {
    title: 'SpineSlicer',
    category: 'MEDICAL NAVIGATION',
    period: '2021.01 — 2021.08',
    stack: 'C++ · Python · 3D Slicer',
    description:
      '가천대학교 VMR 연구실·지메디텍의 척추 수술용 내비게이션 모듈. 병원·연구팀 회의와 수술 현장 참관을 통해 요구사항을 확인하고, 기존 팀이 약 2년에 걸쳐 개발한 기능을 혼자 4개월 만에 확장 가능한 플랫폼 모듈로 재개발했습니다. 관련 논문 제3저자로 참여했습니다.',
    links: [
      {
        label: '관련 논문',
        href: 'https://link.springer.com/chapter/10.1007/978-3-030-89029-2_47',
      },
    ],
  },
  {
    title: 'ScenarioBuilder',
    category: 'B2B · AICC',
    period: '카카오엔터프라이즈 인턴 프로젝트',
    stack: 'React · Spring Boot · Frontend Architecture',
    description:
      'AICC 보이스봇 시나리오 작성·편집 플랫폼. 프론트엔드 전체 기획·설계·개발과 일부 테스트 기능을 담당했습니다. 반복 작업을 하나의 흐름으로 통합해 기존 프로세스 대비 생산성을 70% 향상했습니다.',
    links: [],
  },
  {
    title: 'Profile Finder',
    category: 'AI · GRADUATION PROJECT',
    period: '졸업 프로젝트',
    stack: 'Node.js · Crawling · Google Teachable Machine',
    description:
      '영상 제작팀 경험에서 발견한 문제를 AI 키워드 기반 배우 구인 플랫폼으로 구현했습니다. 졸업작품 평가 최고점을 받았습니다.',
    links: [
      { label: 'GitHub', href: 'https://github.com/rheeeuro/profile-finder' },
    ],
  },
  {
    title: 'Gitmagotchi',
    category: 'GENERATIVE AI · AWS',
    period: 'AWS Korea 기업 연계 프로젝트',
    stack: 'React · TypeScript · AWS · Bedrock · Stable Diffusion',
    description:
      'Git Commit 기반 캐릭터 성장 서비스. Bedrock·Stable Diffusion 기반 생성형 AI 기능과 S3·CloudFront 자동배포를 경험했습니다.',
    links: [
      { label: 'GitHub', href: 'https://github.com/rheeeuro/gitmagotchi' },
    ],
  },
];
