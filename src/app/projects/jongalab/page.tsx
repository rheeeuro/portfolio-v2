import type { Metadata } from 'next';
import Image from 'next/image';
import Link from 'next/link';
import { projects } from '@/content/projects';
import { profile } from '@/content/profile';
import styles from '../smartoffer/page.module.css';

const project = projects[0];
export const metadata: Metadata = {
  title: 'Jongalab — AI 분석부터 실거래 검증까지 | 이유로',
  description:
    '데이터 수집과 AI 분석에서 주문·청산까지, 개인 프로젝트 Jongalab의 설계와 운영 과정.',
};
export default function JongalabPage() {
  return (
    <main className={styles.page}>
      <a className={styles.skip} href="#case-study">
        본문 바로 가기
      </a>
      <header className={styles.header}>
        <Link href="/">
          RHEE EURO <span>/ FRONTEND DEVELOPER</span>
        </Link>
        <Link href="/">포트폴리오로 돌아가기 ↗</Link>
      </header>
      <article id="case-study" className={styles.article}>
        <div className={styles.hero}>
          <p className={styles.eyebrow}>SELECTED WORK / AI · BUILD & OPERATE</p>
          <h1>
            Jongalab
            <span>
              분석에서 멈추지 않고,
              <br />
              실제 운영으로 검증하기.
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
          <p className={styles.eyebrow}>OPERATING RECORD / 2026.09</p>
          <p>
            <strong>51</strong>
            <span>거래일 · </span>
            <strong>295</strong>
            <span>건</span>
          </p>
          <span>실거래 운영 규모</span>
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
          <a href="#scope">03 구현과 운영</a>
          <a href="#result">04 결과</a>
        </nav>
        <section id="problem" className={styles.section}>
          <p className={styles.eyebrow}>01 / PROBLEM</p>
          <h2>분석 결과를 어떻게 검증할 수 있을까?</h2>
          <p>{project.problem}</p>
        </section>
        <section id="decisions" className={styles.section}>
          <p className={styles.eyebrow}>02 / TECHNICAL DECISIONS</p>
          <h2>정보 수집부터 검증까지 하나의 흐름으로.</h2>
          <p>{project.decision}</p>
          <div className={styles.flow} aria-label="분석과 운영 흐름">
            <div>
              <span>ANALYZE</span>
              <h3>수집 · 요약 · 평가</h3>
              <p>공개 콘텐츠와 시장·뉴스·수급 분석</p>
            </div>
            <span className={styles.flowArrow} aria-hidden="true">
              →
            </span>
            <div>
              <span>VALIDATE</span>
              <h3>주문 · 청산 · 기록</h3>
              <p>실거래 결과를 추적하고 전략 검증</p>
            </div>
          </div>
        </section>
        <section id="scope" className={styles.section}>
          <p className={styles.eyebrow}>03 / BUILD & OPERATE</p>
          <h2>직접 만들고, 배포하고, 운영합니다.</h2>
          <p>{project.implementation}</p>
        </section>
        <section id="result" className={styles.section}>
          <p className={styles.eyebrow}>04 / RESULT</p>
          <h2>운영 기록을 다음 개선의 근거로.</h2>
          <p>{project.result}</p>
          <a
            className={styles.textLink}
            href={project.links[0].href}
            target="_blank"
            rel="noopener noreferrer"
          >
            Jongalab 서비스 방문 · 새 탭 ↗
          </a>
        </section>
        <footer className={styles.contact}>
          <p className={styles.eyebrow}>LET’S BUILD SOMETHING USEFUL</p>
          <h2>함께 풀어볼 문제가 있나요?</h2>
          <a className={styles.contactLink} href={`mailto:${profile.email}`}>
            {profile.email} ↗
          </a>
          <Link className={styles.textLink} href="/projects/smartoffer">
            다음 프로젝트 · SmartOffer →
          </Link>
        </footer>
      </article>
    </main>
  );
}
