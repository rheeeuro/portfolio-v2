// Career dates follow the supplied resume; email follows the latest user instruction.
export const profile = {
  name: '이유로',
  englishName: 'RHEE EURO',
  role: 'Frontend Developer',
  email: 'rheeeuro@gmail.com',
  phone: '010-9930-6272',
  introduction:
    '비용·성능·운영 복잡도를 함께 비교해 문제를 구조화하고, 측정 가능한 결과로 선택을 검증하는 프론트엔드 개발자입니다.',
  focus:
    'B2B 솔루션의 기능 설계와 성능 개선부터 AI 기반 개발·업무 자동화까지, 기존 아키텍처와 실제 운영 환경에 무리 없이 적용되는 해법을 만듭니다.',
  links: [
    { label: 'GitHub', href: 'https://github.com/rheeeuro' },
    { label: 'LinkedIn', href: 'https://www.linkedin.com/in/rheeeuro/' },
    { label: 'Threads', href: 'https://www.threads.com/@rheeeuro' },
  ],
};

export const skills = [
  {
    category: 'Frontend',
    items:
      'React · TypeScript · JavaScript · HTML · CSS · Next.js · TanStack Query · Highcharts',
  },
  {
    category: 'Backend / Data',
    items: 'Node.js · Spring Boot · Python · REST API · MariaDB · ClickHouse',
  },
  {
    category: 'Infra / Tools',
    items: 'Docker · AWS · Git · CI/CD · Formatter / Linter',
  },
  {
    category: 'AI-assisted development',
    items: 'Codex · Claude Code · 프로젝트 룰 · 하네스 · 반복 업무용 스킬',
  },
];

export const experiences = [
  {
    company: '넷스루',
    role: '연구소 프론트엔드 개발자',
    period: '2024.07 — 현재',
    description: '디지털 데이터 수집·분석·감지·활용 분야 전문 기업',
    achievements: [
      'Hackle·Amplitude의 실험 구조를 분석하고 결합도·확장성·운영 복잡도를 비교해 A/B 테스트 고도화 구조를 설계·개발했습니다.',
      '지연 구간과 불필요한 데이터 처리를 점검하고 응답 구조를 경량화해 API 응답 시간을 190ms에서 14ms로 개선했습니다.',
      '프로젝트 룰·하네스와 반복 업무용 스킬을 구성해 회의록 작성·정리 시간을 약 2시간에서 10분으로 단축했습니다.',
      'Formatter·Linter와 팀 컨벤션을 도입해 코드 스타일과 검증 절차를 표준화했습니다.',
      '우리은행·BC카드·NH은행 등 금융권 고객 요구를 분석하고 제품 구조와 개발 범위를 고려해 반영 방안을 조율했습니다.',
    ],
  },
  {
    company: '카카오엔터프라이즈',
    role: '솔루션플랫폼팀 인턴',
    period: '2021.12 — 2022.06',
    description: '인공지능 기반 플랫폼·솔루션을 개발하는 B2B 전문 기업',
    achievements: [
      '보이스봇 시나리오 작성·편집 플랫폼의 프론트엔드 기획·설계·개발을 담당하고 반복 작업을 통합해 기존 프로세스 대비 생산성을 70% 향상했습니다.',
      '의존성 설치와 빌드 구간을 분석하고 캐싱·병렬 처리를 적용해 프론트엔드 배포 시간을 기존의 1/3 수준으로 단축했습니다.',
      '카카오 챗봇 내부 이미지 전송 방식의 적용 가능성을 검증하는 프로젝트를 구현했습니다.',
    ],
  },
  {
    company: '지메디텍',
    role: '학부생 연구원',
    period: '2021.01 — 2022.08',
    description: '의료 소프트웨어 연구·개발',
    achievements: [
      '서울대·병원·연구팀과 요구사항 및 개선안을 논의하고 개발 모듈 데모를 시연했습니다.',
      '사내 3D Slicer 관련 의존성 모듈을 도입하고 척추 수술용 내비게이션 모듈을 개발했습니다.',
    ],
  },
  {
    company: '조이펀',
    role: '산학협력 인턴',
    period: '2020.07 — 2020.08',
    description: '전시회용 인터랙티브 게임 개발',
    achievements: [
      'Azure Kinect Depth 센서를 연동하고 반응 속도를 개선했습니다.',
      '인턴 프로젝트와 스터디 팀을 리딩했습니다.',
    ],
  },
];

export const education = [
  {
    title: '삼성청년소프트웨어아카데미',
    period: '2023.07 — 2024.06',
    description: '10기 · Java 전공반 · 서울캠퍼스',
  },
  {
    title: '가천대학교 소프트웨어학과',
    period: '2016.03 — 2022.02',
    description: '졸업 · 경기도 성남',
  },
];
export const awards = [
  {
    title: 'SSAFY 공통 프로젝트 우수상',
    period: '2024.02',
    description: '최우수 1위 · SSAFY 10기 서울캠퍼스 · Comeet',
  },
  {
    title: '학과의날 최우수 프로젝트',
    period: '2020.11',
    description: '최우수상 · 가천대학교 소프트웨어학과',
  },
  {
    title: '학과의날 우수 프로젝트 선정',
    period: '2019',
    description: '가천대학교 소프트웨어학과',
  },
];
