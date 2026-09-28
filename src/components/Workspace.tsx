'use client';
import dynamic from 'next/dynamic';
import Link from 'next/link';
import Image from 'next/image';
import { projects } from '@/content/projects';
import { useEffect, useRef, useState } from 'react';
import gsap from 'gsap';
import { useNavigation } from '@/stores/navigation';
import { useEnvironment } from '@/stores/environment';
import { useAudio, toggleAudio, suspendAudio } from '@/stores/audio';
import { parseView, type View } from '@/lib/scene';
import { profile } from '@/content/profile';
import { phaseAtHour } from '@/lib/time';
import { Projects, About, Experience, Environment } from './overlays/Content';
import styles from './Workspace.module.css';
const RoomScene = dynamic(() => import('./room/RoomScene'), { ssr: false });
const menu: { view: View; label: string; number: string }[] = [
  { view: 'home', label: 'The room', number: '00' },
  { view: 'projects', label: 'Projects', number: '01' },
  { view: 'about', label: 'About', number: '02' },
  { view: 'experience', label: 'Experience', number: '03' },
];
export default function Workspace() {
  const { view, entered, ready, failed, transitioning, navigate, enter } =
    useNavigation();
  const { theme, phase, weather, toggleTheme } = useEnvironment();
  const { enabled, error } = useAudio();
  const [reducedMotion, setReducedMotion] = useState(false);
  const [visible, setVisible] = useState(true);
  const [slow, setSlow] = useState(false);
  const [bootGone, setBootGone] = useState(false);
  const [clock, setClock] = useState('--:--');
  const boot = useRef<HTMLDivElement>(null);
  const panel = useRef<HTMLElement>(null);
  const homeButton = useRef<HTMLButtonElement>(null);
  useEffect(() => {
    const media = matchMedia('(prefers-reduced-motion: reduce)');
    const motion = () => setReducedMotion(media.matches);
    motion();
    media.addEventListener('change', motion);
    useEnvironment.setState({
      theme: matchMedia('(prefers-color-scheme: light)').matches
        ? 'light'
        : 'dark',
    });
    const tick = () => {
      const date = new Date();
      setClock(
        date.toLocaleTimeString('en-GB', {
          hour: '2-digit',
          minute: '2-digit',
        }),
      );
      if (useEnvironment.getState().automatic)
        useEnvironment.setState({ phase: phaseAtHour(date.getHours()) });
    };
    tick();
    const interval = setInterval(tick, 30_000);
    const history = () =>
      useNavigation.getState().syncView(parseView(location.hash));
    const initialView = parseView(location.hash);
    if (initialView !== 'home')
      useNavigation.setState({ view: initialView, entered: true });
    window.addEventListener('popstate', history);
    window.addEventListener('hashchange', history);
    const visibility = () => {
      setVisible(!document.hidden);
      suspendAudio(document.hidden);
    };
    document.addEventListener('visibilitychange', visibility);
    const key = (event: KeyboardEvent) => {
      if (event.key === 'Escape' && useNavigation.getState().entered) {
        navigate('home');
        homeButton.current?.focus();
      }
    };
    window.addEventListener('keydown', key);
    const timeout = setTimeout(() => setSlow(true), 12_000);
    return () => {
      media.removeEventListener('change', motion);
      clearInterval(interval);
      clearTimeout(timeout);
      window.removeEventListener('popstate', history);
      window.removeEventListener('hashchange', history);
      window.removeEventListener('keydown', key);
      document.removeEventListener('visibilitychange', visibility);
      suspendAudio(true);
    };
  }, [navigate]);
  useEffect(() => {
    if (!entered || !boot.current) return;
    const tween = gsap.to(boot.current, {
      opacity: 0,
      scale: 1,
      duration: reducedMotion ? 0 : 0.3,
      ease: 'power3.inOut',
      onComplete: () => {
        setBootGone(true);
        homeButton.current?.focus();
      },
    });
    return () => {
      tween.kill();
    };
  }, [entered, reducedMotion]);
  useEffect(() => {
    if (entered && view !== 'home' && (!transitioning || failed || !ready))
      panel.current?.focus();
  }, [entered, view, transitioning, failed, ready]);
  return (
    <main className={styles.workspace} data-theme={theme}>
      <a
        href="#projects"
        className={styles.skip}
        onClick={(event) => {
          event.preventDefault();
          navigate('projects');
        }}
      >
        프로젝트 바로 보기
      </a>
      <div className={styles.app} inert={!entered} hidden={!entered}>
        <header className={styles.header}>
          <button
            ref={homeButton}
            className={styles.brand}
            onClick={() => navigate('home')}
            aria-label="작업실 홈"
          >
            <span className={styles.brandMark}>
              dr<span>.</span>
            </span>
            <span>
              DEVELOPER’S ROOM<small>RHEE EURO · FRONTEND DEVELOPER</small>
            </span>
          </button>
          <div className={styles.headerRight}>
            <span className={styles.statusDot} />{' '}
            <span>OPEN FOR EXPLORATION</span>
            <span className={styles.edition}>PORTFOLIO / 2026</span>
          </div>
        </header>
        <section className={styles.stage} aria-label="개발자의 3D 작업실">
          <div className={styles.canvas}>
            {entered && !failed && (
              <RoomScene reducedMotion={reducedMotion} visible={visible} />
            )}
          </div>
          {failed && (
            <div className={styles.sceneFallback}>
              <span>THE ROOM IS TAKING A BREAK</span>
              <h2>
                Ideas live beyond
                <br />
                the room.
              </h2>
              <p>
                3D 화면을 불러올 수 없습니다.
                <br />
                메뉴에서 모든 콘텐츠를 확인할 수 있습니다.
              </p>
            </div>
          )}
          <div className={styles.roomIntro} data-hidden={view !== 'home'}>
            <p className={styles.eyebrow}>
              <span /> A LITTLE SPACE, A LOT OF IDEAS
            </p>
            <h1>
              Welcome to
              <br />
              <em>my everyday.</em>
            </h1>
            <p>
              문제를 구조화하고, 더 나은 해법을 찾는 곳.
              <br />
              프론트엔드 개발자 {profile.name}의 작업실입니다.
            </p>
          </div>
          <div className={styles.roomIndex}>
            <span>ROOM 001</span>
            <span>DESIGN · CODE · REPEAT</span>
          </div>
          <button
            className={styles.environmentPill}
            onClick={() => navigate('window')}
          >
            <span className={styles.sunIcon}>◷</span>
            <span>
              {clock}
              <small>LOCAL TIME · {phase.toUpperCase()}</small>
            </span>
            <span className={styles.weatherLabel}>
              {weather === 'rain' ? 'RAIN' : 'CLEAR'} ↗
            </span>
          </button>
          <div className={styles.roomHint} data-hidden={view !== 'home'}>
            <span>↖</span>
            <p>
              Every object has a story.
              <small>사물의 이름을 눌러 둘러보세요</small>
            </p>
          </div>
          {view !== 'home' && (
            <section
              ref={panel}
              tabIndex={-1}
              className={styles.panel}
              aria-label={view}
              aria-busy={ready && !failed && transitioning}
              data-arrived={failed || !ready || !transitioning}
            >
              <div className={styles.panelTop}>
                <span>WORKSPACE / {view.toUpperCase()}</span>
                <button
                  onClick={() => {
                    navigate('home');
                    homeButton.current?.focus();
                  }}
                >
                  닫기 <span>×</span>
                </button>
              </div>
              {view === 'projects' ? (
                <Projects />
              ) : view === 'about' ? (
                <About />
              ) : view === 'experience' ? (
                <Experience />
              ) : (
                <Environment />
              )}
            </section>
          )}
        </section>
        <footer className={styles.footer}>
          <nav aria-label="작업실 탐색">
            {menu.map((item) => (
              <button
                key={item.view}
                onClick={() => navigate(item.view)}
                aria-current={view === item.view ? 'page' : undefined}
              >
                <small>{item.number}</small>
                {item.label}
                <span className={styles.activeDot} />
              </button>
            ))}
          </nav>
          <div className={styles.controls}>
            <button
              onClick={toggleTheme}
              aria-pressed={theme === 'light'}
              aria-label="조명 전환"
            >
              {theme === 'light' ? '☀' : '☾'}
              <span>Lights {theme === 'light' ? 'on' : 'off'}</span>
            </button>
            <button
              onClick={() => void toggleAudio()}
              aria-pressed={enabled}
              aria-label="사운드 전환"
            >
              <span className={styles.soundIcon}>
                {enabled ? '▂▅▃' : '▂▂▂'}
              </span>
              <span>Sound {enabled ? 'on' : 'off'}</span>
            </button>
          </div>
        </footer>
        <div className={styles.mobileContent}>
          <section id="mobile-projects">
            <Projects />
          </section>
          <section>
            <About />
          </section>
          <section>
            <Experience />
          </section>
        </div>
        {error && (
          <p className={styles.audioError} role="status">
            {error}
          </p>
        )}
      </div>
      {!bootGone && (
        <div ref={boot} className={styles.boot} inert={entered}>
          <header className={styles.bootHeader}>
            <a href="#landing-top" className={styles.landingBrand}>
              er<span>.</span> <span>이유로 / 개발자의 작업실</span>
            </a>
            <nav aria-label="포트폴리오 탐색">
              <a href="#selected-work">프로젝트</a>
              <a href={`mailto:${profile.email}`}>연락하기 ↗</a>
            </nav>
          </header>
          <div className={styles.landingContent} id="landing-top">
            <section className={styles.landingHero} aria-label="소개와 작업실">
              <div className={styles.landingIntro}>
                <p className={styles.eyebrow}>
                  <span className={styles.statusDot} /> FRONTEND DEVELOPER ·
                  RHEE EURO
                </p>
                <h1>
                  문제를 구조화하고,
                  <br />
                  <em>결과로 검증합니다.</em>
                </h1>
                <p className={styles.landingDescription}>
                  복잡한 문제를 명확한 구조로, 아이디어를 실제로 쓰이는
                  제품으로.
                  <br />
                  프론트엔드 개발자 <strong>{profile.name}</strong>입니다.
                </p>
                <div className={styles.landingActions}>
                  <a className={styles.enter} href="#selected-work">
                    프로젝트 살펴보기 <span>↓</span>
                  </a>
                  <a
                    className={styles.landingContact}
                    href={`mailto:${profile.email}`}
                  >
                    함께 일하기 ↗
                  </a>
                </div>
                <p className={styles.landingExpertise}>
                  제품 개발 <span>/</span> 성능 개선 <span>/</span> AI · 자동화
                </p>
              </div>
              <div className={styles.roomPreview}>
                <div className={styles.previewLabel}>
                  <span>THE DEVELOPER’S ROOM</span>
                  <span>01 / EXPLORE</span>
                </div>
                <div className={styles.previewCanvas} inert aria-hidden="true">
                  {!entered && !failed && (
                    <RoomScene
                      reducedMotion={reducedMotion}
                      visible={visible}
                    />
                  )}
                  {failed && (
                    <p className={styles.previewFallback}>
                      잠시 쉬어가는 작업실.
                      <br />
                      <span>아래에서 프로젝트를 바로 만나보세요.</span>
                    </p>
                  )}
                </div>
                <div className={styles.previewCaption}>
                  <div>
                    <strong>생각이 제품이 되는 공간</strong>
                    <p>사물을 누르며 제 작업을 둘러보세요.</p>
                  </div>
                  <button
                    className={styles.explore}
                    disabled={!ready || failed}
                    onClick={enter}
                  >
                    작업실 둘러보기 <span>↗</span>
                  </button>
                </div>
                <p className={styles.sceneStatus} role="status">
                  {failed
                    ? '3D를 사용할 수 없어도 모든 프로젝트를 읽을 수 있어요.'
                    : ready
                      ? '탐색 준비 완료 · 사운드는 기본으로 꺼져 있어요.'
                      : slow
                        ? '작업실을 준비하는 데 시간이 걸리고 있어요. 프로젝트는 바로 읽을 수 있어요.'
                        : '작업실을 준비하고 있어요. 프로젝트는 바로 읽을 수 있어요.'}
                </p>
              </div>
            </section>
            <section
              className={styles.featuredWork}
              id="selected-work"
              aria-label="대표 프로젝트"
            >
              <div className={styles.workHeading}>
                <div>
                  <p className={styles.eyebrow}>SELECTED WORK / 2024—2026</p>
                  <h2>
                    직접 풀어온 문제들<span>02</span>
                  </h2>
                </div>
                <p>설계부터 개선, 그리고 운영까지.</p>
              </div>
              <div className={styles.workGrid}>
                {[projects[1], projects[0]].map((project, index) => (
                  <article className={styles.featuredCard} key={project.id}>
                    <Link
                      href={`/projects/${project.title.toLowerCase()}`}
                      className={styles.projectCover}
                      aria-label={`${project.title} 사례 읽기`}
                    >
                      <div className={styles.coverLabel}>
                        <span>
                          {index === 0
                            ? 'PRODUCT ENGINEERING'
                            : 'INDEPENDENT PRODUCT'}
                        </span>
                        <span>0{index + 1} ↗</span>
                      </div>
                      <Image
                        src={project.image.src}
                        width={project.image.width}
                        height={project.image.height}
                        alt={project.image.alt}
                        sizes="(max-width: 800px) 90vw, 45vw"
                      />
                    </Link>
                    <div className={styles.featuredBody}>
                      <p className={styles.eyebrow}>
                        {index === 0
                          ? 'B2B 솔루션 · 프론트엔드 / 성능 개선'
                          : '개인 프로젝트 · 설계 / 개발 / 운영'}
                      </p>
                      <h3>
                        <Link href={`/projects/${project.title.toLowerCase()}`}>
                          {project.title}
                          <span>↗</span>
                        </Link>
                      </h3>
                      <p>
                        {index === 0
                          ? '개인화 추천 솔루션의 조회 병목을 줄이고, 서버 데이터와 화면 상태의 경계를 정리했습니다.'
                          : 'AI 분석에서 주문·청산까지. 가설을 실제 거래로 검증하는 서비스를 만들고 운영합니다.'}
                      </p>
                      <div className={styles.cardResult}>
                        <strong>{project.highlight}</strong>
                        <small>
                          {index === 0
                            ? '목록 API 응답 시간 개선'
                            : '2026년 9월 기준 · 운영 규모'}
                        </small>
                      </div>
                      <div className={styles.cardLinks}>
                        <Link href={`/projects/${project.title.toLowerCase()}`}>
                          문제 해결 과정 읽기 →
                        </Link>
                        <a
                          href={project.links[0].href}
                          target="_blank"
                          rel="noopener noreferrer"
                        >
                          {index === 0 ? '제품 소개' : '서비스 방문'} ↗
                          <span className={styles.srOnly}> (새 탭)</span>
                        </a>
                      </div>
                    </div>
                  </article>
                ))}
              </div>
              <button
                className={styles.bypass}
                onClick={() => navigate('projects')}
              >
                다른 프로젝트도 살펴보기 <span>→</span>
              </button>
            </section>
            <footer className={styles.landingFooter}>
              <div>
                <p className={styles.eyebrow}>LET’S BUILD TOGETHER</p>
                <h2>함께 풀어볼 문제가 있나요?</h2>
              </div>
              <a href={`mailto:${profile.email}`}>{profile.email} ↗</a>
            </footer>
          </div>
          <div className={styles.bootFooter}>
            <span>© 2026 RHEE EURO</span>
            <span>THOUGHTFULLY BUILT, ONE DETAIL AT A TIME.</span>
          </div>
        </div>
      )}
      <noscript>
        <div className={styles.noScript}>
          <h1>Developer’s Room</h1>
          <p>인터랙티브 작업실은 JavaScript가 필요합니다.</p>
          <Projects />
          <About />
        </div>
      </noscript>
    </main>
  );
}
