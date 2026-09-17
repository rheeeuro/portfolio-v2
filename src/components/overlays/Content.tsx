'use client';
import { projects } from '@/content/projects';
import { phaseAtHour, phases } from '@/lib/time';
import { useEnvironment } from '@/stores/environment';
import styles from '../Workspace.module.css';
export function Projects() {
  return (
    <>
      <p className={styles.eyebrow}>01 / SELECTED WORK</p>
      <h2>
        Thoughtfully built.
        <br />
        <em>Made to be used.</em>
      </h2>
      <p className={styles.intro}>
        작은 디테일부터 전체 구조까지.
        <br />
        문제를 이해하고, 더 나은 사용 경험을 만듭니다.
      </p>
      <p className={styles.sample}>
        CONTENT PREVIEW · 실제 프로젝트 자료로 교체할 샘플 콘텐츠입니다.
      </p>
      <div className={styles.projectList}>
        {projects.map((project) => (
          <details key={project.id} className={styles.project}>
            <summary>
              <span className={styles.projectNumber}>{project.id}</span>
              <div>
                <span className={styles.eyebrow}>{project.category}</span>
                <h3>{project.title}</h3>
                <p>{project.stack}</p>
              </div>
              <span className={styles.projectArrow}>↗</span>
            </summary>
            <div className={styles.projectBody}>
              <p>{project.description}</p>
              <h4>Problem</h4>
              <p>{project.problem}</p>
              <h4>Technical decisions</h4>
              <p>{project.decision}</p>
              <h4>Role / Architecture / Challenges</h4>
              <p>
                담당 범위, 구조와 해결 과정은 실제 프로젝트 자료 입력 후
                공개합니다.
              </p>
              <h4>Result / Retrospective</h4>
              <p>검증된 결과와 회고를 준비 중입니다.</p>
            </div>
          </details>
        ))}
      </div>
    </>
  );
}
export function About() {
  return (
    <>
      <p className={styles.eyebrow}>02 / NOTES TO SELF</p>
      <h2>
        Good interfaces.
        <br />
        <em>Considered details.</em>
      </h2>
      <p className={styles.intro}>
        좋은 인터페이스는 사용자를 이해하는 것에서 시작합니다.
      </p>
      <div className={styles.notebook}>
        <span className={styles.noteDate}>FIELD NOTES / 001</span>
        <svg
          viewBox="0 0 560 245"
          role="img"
          aria-label="Frontend Developer의 네 가지 관심사: UI, Performance, Architecture, Interaction"
        >
          <g fill="none" stroke="currentColor" strokeWidth="1.5">
            <path
              className={styles.draw}
              pathLength="1"
              d="M48 70 L48 209 M48 95 Q48 110 65 110 H190 M48 139 Q48 153 65 153 H190 M48 180 Q48 195 65 195 H190 M280 70 V95 Q280 110 296 110 H349"
            />
          </g>
          <g fill="currentColor">
            <text x="28" y="45" fontSize="25" fontFamily="Georgia, serif">
              Frontend Developer
            </text>
            <text x="205" y="116" fontSize="17">
              UI
            </text>
            <text x="205" y="159" fontSize="17">
              Performance
            </text>
            <text x="205" y="201" fontSize="17">
              Architecture
            </text>
            <text x="362" y="116" fontSize="17">
              Interaction
            </text>
          </g>
        </svg>
        <p>
          “보기 좋은 것에서 한 걸음 더.
          <br />
          이해하기 쉽고, 사용하기 편한 것을 만듭니다.”
        </p>
      </div>
      <div className={styles.aboutNotes}>
        <div>
          <h3>How I work</h3>
          <p>
            문제를 먼저 정의하고, 작은 단위로 검증하며, 선택한 이유를
            기록합니다.
          </p>
        </div>
        <div>
          <h3>Currently exploring</h3>
          <p>
            성능과 접근성, 유지보수 가능한 구조, 그리고 웹에서의 자연스러운
            인터랙션.
          </p>
        </div>
      </div>
      <p className={styles.sample}>
        소개 문구는 프로토타입이며 실제 경력과 함께 다듬을 예정입니다.
      </p>
    </>
  );
}
export function Experience() {
  return (
    <>
      <p className={styles.eyebrow}>03 / COMMIT HISTORY</p>
      <h2>
        Always learning.
        <br />
        <em>Always building.</em>
      </h2>
      <p className={styles.intro}>경험을 쌓고, 관점을 넓혀가는 과정.</p>
      <div className={styles.timeline}>
        {[
          [
            '03',
            'Structure & systems',
            '유지보수 가능한 구조와 팀의 개발 경험',
          ],
          ['02', 'Performance & ownership', '제품의 흐름과 사용자의 실제 경험'],
          ['01', 'A solid foundation', '인터페이스 구현과 웹의 기본기'],
        ].map(([year, title, description]) => (
          <div key={year}>
            <span>{year}</span>
            <h3>{title}</h3>
            <p>{description}</p>
          </div>
        ))}
      </div>
      <p className={styles.sample}>
        EXPERIENCE PLACEHOLDER · 실제 회사·기간·성과는 아직 입력하지 않았습니다.
      </p>
    </>
  );
}
export function Environment() {
  const { phase, weather, automatic, cyclePhase, toggleWeather } =
    useEnvironment();
  return (
    <>
      <p className={styles.eyebrow}>04 / A WINDOW TO THE WORLD</p>
      <h2>
        A different light.
        <br />
        <em>The same room.</em>
      </h2>
      <p className={styles.intro}>창밖의 시간과 분위기를 바꿔보세요.</p>
      <div className={styles.environmentPreview} data-phase={phase}>
        <span>{phase}</span>
        <small>{weather === 'rain' ? '비 오는 창가' : '맑은 하늘'}</small>
      </div>
      <div className={styles.environmentOptions}>
        {phases.map((value) => (
          <button
            key={value}
            aria-pressed={phase === value}
            onClick={() =>
              useEnvironment.setState({ phase: value, automatic: false })
            }
          >
            {value}
          </button>
        ))}
      </div>
      <div className={styles.environmentActions}>
        <button onClick={cyclePhase}>다음 시간대 ↗</button>
        <button onClick={toggleWeather} aria-pressed={weather === 'rain'}>
          Weather / {weather === 'rain' ? 'Rain' : 'Clear'}
        </button>
        <button
          onClick={() =>
            useEnvironment.setState({
              automatic: true,
              phase: phaseAtHour(new Date().getHours()),
            })
          }
          aria-pressed={automatic}
        >
          현재 시간 사용
        </button>
      </div>
      <p className={styles.sample}>
        시간은 기기 기준입니다. 날씨는 API를 사용하지 않는 미리보기이며, 빗방울
        셰이더는 후속 구현 범위입니다.
      </p>
    </>
  );
}
