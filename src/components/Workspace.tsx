'use client';
import dynamic from 'next/dynamic';
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
      scale: reducedMotion ? 1 : 0.18,
      duration: reducedMotion ? 0 : 0.7,
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
      <div className={styles.app} inert={!entered}>
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
            {!failed && (
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
          <div className={styles.bootHeader}>
            <span>DEVELOPER’S ROOM</span>
            <span>EST. 2026 / WORKSPACE 001</span>
          </div>
          <div className={styles.bootContent}>
            <p className={styles.eyebrow}>
              <span className={styles.statusDot} /> HELLO, WORLD.
            </p>
            <h1>
              Good things
              <br />
              start <em>here.</em>
            </h1>
            <p className={styles.bootDescription}>
              프론트엔드 개발자 {profile.name}의 생각과 작업이 모이는 공간.
            </p>
            <div className={styles.terminal} aria-live="polite">
              <p>
                <span>01</span> &gt; booting workspace... <b>done</b>
              </p>
              <p>
                <span>02</span> &gt; loading room...{' '}
                <b>{failed ? 'unavailable' : ready ? 'done' : 'loading'}</b>
              </p>
              <p>
                <span>03</span> &gt; loading projects... <b>done</b>
              </p>
              <p>
                <span>04</span> &gt; almost there...{' '}
                <b>{ready ? 'done' : '...'}</b>
              </p>
              <p className={styles.ready}>
                {failed
                  ? 'HTML workspace available.'
                  : ready
                    ? 'workspace ready.'
                    : 'Preparing your workspace…'}
              </p>
            </div>
            <button
              className={styles.enter}
              disabled={!ready || failed}
              onClick={enter}
            >
              ENTER WORKSPACE <span>↗</span>
            </button>
            <button
              className={styles.bypass}
              onClick={() => navigate('projects')}
            >
              프로젝트 바로 보기 <span>→</span>
            </button>
            {(failed || slow) && (
              <p className={styles.loadingNote}>
                {failed
                  ? '3D 로딩에 실패했습니다. 프로젝트 바로 보기를 이용해 주세요.'
                  : '로딩이 오래 걸리면 프로젝트를 먼저 확인할 수 있습니다.'}
              </p>
            )}
          </div>
          <div className={styles.bootFooter}>
            <span>THOUGHTFULLY BUILT, ONE DETAIL AT A TIME.</span>
            <span>TAKE A LOOK AROUND.</span>
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
