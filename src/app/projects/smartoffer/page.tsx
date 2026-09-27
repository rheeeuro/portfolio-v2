import type { Metadata } from 'next';
import Image from 'next/image';
import Link from 'next/link';
import { projects } from '@/content/projects';
import { profile } from '@/content/profile';
import styles from './page.module.css';

const project = projects[1];
export const metadata: Metadata = {
  title: 'SmartOffer — 조회 성능과 상태 관리 개선 | 이유로',
  description:
    'API 응답 190ms에서 14ms로. SmartOffer의 목록 조회 구조, 상태 관리 경계와 A/B 테스트 설계에 관한 프론트엔드 개발 사례.',
};

export default function SmartOfferPage() {
  return (
    <main className={styles.page}>
      <a className={styles.skip} href="#case-study">
        본문 바로 가기
      </a>
      <header className={styles.header}>
        <Link href="/">
          RHEE EURO <span>/ FRONTEND DEVELOPER</span>
        </Link>
        <Link href="/#projects">전체 프로젝트 ↗</Link>
      </header>
      <article id="case-study" className={styles.article}>
        <div className={styles.hero}>
          <p className={styles.eyebrow}>
            SELECTED WORK / B2B · PERSONALIZATION
          </p>
          <h1>
            SmartOffer
            <span>
              필요한 데이터에 집중한
              <br />
              조회 성능과 상태 관리 개선.
            </span>
          </h1>
          <p className={styles.lead}>{project.description}</p>
          <dl className={styles.facts}>
            <div>
              <dt>PERIOD</dt>
              <dd>{project.period}</dd>
            </div>
            <div>
              <dt>MY ROLE</dt>
              <dd>{project.role}</dd>
            </div>
            <div>
              <dt>STACK</dt>
              <dd>{project.stack}</dd>
            </div>
          </dl>
        </div>
        <div className={styles.outcome}>
          <p className={styles.eyebrow}>KEY RESULT / API RESPONSE TIME</p>
          <p>
            <span>190ms</span>
            <span aria-hidden="true"> → </span>
            <strong>14ms</strong>
          </p>
          <span>목록 조회 구조와 응답 경량화를 통한 개선</span>
        </div>
        <figure className={styles.figure}>
          <Image
            src={project.image.src}
            width={project.image.width}
            height={project.image.height}
            alt={project.image.alt}
            sizes="(max-width: 900px) 90vw, 860px"
          />
          <figcaption>{project.image.caption}</figcaption>
        </figure>
        <nav className={styles.toc} aria-label="사례 목차">
          <a href="#problem">01 문제</a>
          <a href="#decisions">02 기술 선택</a>
          <a href="#scope">03 기여 범위</a>
          <a href="#result">04 결과</a>
        </nav>
        <section id="problem" className={styles.section}>
          <p className={styles.eyebrow}>01 / PROBLEM</p>
          <h2>
            목록을 보여주기 위해,
            <br />
            너무 많은 데이터를 읽고 있었습니다.
          </h2>
          <p>{project.problem}</p>
          <p>
            조회에 필요한 데이터의 범위와 화면 상태의 책임을 각각 정리하는 것이
            개선의 출발점이었습니다.
          </p>
        </section>
        <section id="decisions" className={styles.section}>
          <p className={styles.eyebrow}>02 / TECHNICAL DECISIONS</p>
          <h2>
            데이터는 필요한 만큼,
            <br />
            상태는 책임에 맞게.
          </h2>
          <div className={styles.decision}>
            <h3>목록 조회의 범위를 줄이기</h3>
            <p>
              목록 전용 DTO와 쿼리 개선, pagination을 적용해 응답을
              경량화했습니다. 목록에서 상세·연관 데이터를 함께 불러오던 구조의
              병목을 개선했습니다.
            </p>
          </div>
          <div className={styles.flow} aria-label="목록 조회 개선 전후 개념도">
            <div>
              <span>BEFORE</span>
              <h3>목록 조회</h3>
              <p>상세·연관 데이터까지 함께 조회</p>
            </div>
            <span className={styles.flowArrow} aria-hidden="true">
              →
            </span>
            <div>
              <span>AFTER</span>
              <h3>목록 전용 응답</h3>
              <p>목록 전용 DTO · 쿼리 개선 · pagination</p>
            </div>
          </div>
          <div className={styles.decision}>
            <h3>서버 상태와 화면 상태의 경계 세우기</h3>
            <p>
              Redux에 혼재하던 서버 데이터와 UI 상태를 구분했습니다. 서버 상태는
              React Query로, 필터 상태는 URL Search Params로 분리했습니다.
            </p>
            <dl className={styles.stateMap}>
              <div>
                <dt>서버 데이터</dt>
                <dd>React Query</dd>
              </div>
              <div>
                <dt>목록 필터</dt>
                <dd>URL Search Params</dd>
              </div>
            </dl>
          </div>
          <div className={styles.decision}>
            <h3>기존 제품의 맥락에 맞는 A/B 테스트 설계</h3>
            <p>
              Hackle·Amplitude의 실험 구조를 분석하고 결합도·확장성·운영
              복잡도를 비교했습니다. 이를 바탕으로 사내 구조에 맞는 A/B 테스트
              고도화를 설계·개발했습니다.
            </p>
          </div>
        </section>
        <section id="scope" className={styles.section}>
          <p className={styles.eyebrow}>03 / CONTRIBUTION</p>
          <h2>기능 구현에서 팀의 개발 방식까지.</h2>
          <p>2인 개발 환경에서 프론트엔드와 성능 개선을 담당했습니다.</p>
          <ul>
            <li>
              A/B 테스트 고도화와 주요 화면 재설계, 신규 디자인 가이드 적용
            </li>
            <li>Highcharts 기반 추천 모니터링 구현</li>
            <li>Formatter·Linter와 팀 컨벤션 도입</li>
            <li>금융권 고객 요구사항 분석 및 제품 기능 구체화</li>
          </ul>
        </section>
        <section id="result" className={styles.section}>
          <p className={styles.eyebrow}>04 / RESULT & REFLECTION</p>
          <h2>
            응답은 가벼워지고,
            <br />
            코드의 책임은 명확해졌습니다.
          </h2>
          <p>{project.result}</p>
          <p>
            이 작업에서 보여주고 싶은 것은 데이터 흐름의 병목과 상태 관리의
            경계를 함께 살피는 접근입니다. 기능을 추가할 때도 기존 제품의 구조와
            운영 부담을 함께 고려했습니다.
          </p>
          <aside className={styles.note}>
            수치는 제공된 포트폴리오에 기재된 API 응답 시간입니다. 측정
            환경·반복 횟수·통계 기준은 자료에 포함되어 있지 않아 전체 서비스의
            속도 개선율로 일반화하지 않았습니다.
          </aside>
          <a
            className={styles.textLink}
            href={project.links[0].href}
            target="_blank"
            rel="noopener noreferrer"
          >
            SmartOffer 제품 소개 · 새 탭 ↗
          </a>
        </section>
        <footer className={styles.contact}>
          <p className={styles.eyebrow}>LET’S BUILD SOMETHING USEFUL</p>
          <h2>함께 풀어볼 문제가 있나요?</h2>
          <p>
            제품과 운영 맥락을 이해하고, 결과로 검증하는 개발을 하고 싶습니다.
          </p>
          <a className={styles.contactLink} href={`mailto:${profile.email}`}>
            {profile.email} ↗
          </a>
          <Link className={styles.textLink} href="/#projects">
            다른 프로젝트 둘러보기 →
          </Link>
        </footer>
      </article>
    </main>
  );
}
