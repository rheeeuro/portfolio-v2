'use client';
import Image from 'next/image';
import Link from 'next/link';
import { projects, otherProjects } from '@/content/projects';
import {
  profile,
  skills,
  experiences,
  education,
  awards,
} from '@/content/profile';
import { phaseAtHour, phases } from '@/lib/time';
import { useEnvironment } from '@/stores/environment';
import styles from '../Workspace.module.css';

function ProjectLinks({ links }: { links: { label: string; href: string }[] }) {
  return (
    <div className={styles.contentLinks}>
      {links.map((link) => (
        <a
          key={link.href}
          href={link.href}
          target="_blank"
          rel="noopener noreferrer"
        >
          {link.label} <span aria-hidden="true">↗</span>
        </a>
      ))}
    </div>
  );
}

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
        B2B 솔루션부터 직접 운영하는 서비스까지.
        <br />
        문제를 정의하고, 기술을 선택하고, 결과로 검증한 기록입니다.
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
                <span className={styles.resultBadge}>{project.highlight}</span>
              </div>
              <span className={styles.projectArrow} aria-hidden="true">
                ↗
              </span>
            </summary>
            <div className={styles.projectBody}>
              <p className={styles.projectMeta}>
                {project.period}
                <br />
                {project.role}
              </p>
              <p>{project.description}</p>
              {project.title === 'SmartOffer' && (
                <div className={styles.contentLinks}>
                  <Link href="/projects/smartoffer">
                    SmartOffer 상세 사례 읽기 →
                  </Link>
                </div>
              )}
              <figure className={styles.projectFigure}>
                <Image
                  src={project.image.src}
                  width={project.image.width}
                  height={project.image.height}
                  alt={project.image.alt}
                  sizes="(max-width: 760px) 90vw, 480px"
                />
                <figcaption>{project.image.caption}</figcaption>
              </figure>
              <h4>Problem</h4>
              <p>{project.problem}</p>
              <h4>Technical decisions</h4>
              <p>{project.decision}</p>
              <h4>Implementation</h4>
              <p>{project.implementation}</p>
              <h4>Result / Retrospective</h4>
              <p>{project.result}</p>
              <ProjectLinks links={project.links} />
            </div>
          </details>
        ))}
      </div>
      <h3 className={styles.contentHeading}>More things I’ve built</h3>
      <div className={styles.otherProjects}>
        {otherProjects.map((project) => (
          <article key={project.title}>
            <p className={styles.eyebrow}>{project.category}</p>
            <h3>{project.title}</h3>
            <p className={styles.projectMeta}>
              {project.period}
              <br />
              {project.stack}
            </p>
            <p>{project.description}</p>
            <ProjectLinks links={project.links} />
          </article>
        ))}
      </div>
    </>
  );
}

export function About() {
  return (
    <>
      <p className={styles.eyebrow}>02 / {profile.englishName}</p>
      <h2>
        문제를 구조화하고,
        <br />
        <em>더 나은 해법을 찾습니다.</em>
      </h2>
      <p className={styles.profileName}>
        {profile.name} <span>{profile.role}</span>
      </p>
      <p className={styles.intro}>{profile.introduction}</p>
      <p className={styles.intro}>{profile.focus}</p>
      <div className={styles.notebook}>
        <span className={styles.noteDate}>HOW I THINK / HOW I BUILD</span>
        <div className={styles.focusGrid}>
          <div>
            <span>01 / Problem Analysis</span>
            <p>원인과 병목을 구조적으로 찾습니다.</p>
          </div>
          <div>
            <span>02 / Product Thinking</span>
            <p>기존 제품과 운영 맥락까지 고려합니다.</p>
          </div>
          <div>
            <span>03 / Performance</span>
            <p>측정 가능한 지표로 개선을 검증합니다.</p>
          </div>
          <div>
            <span>04 / AI Workflow</span>
            <p>반복 가능한 개발·업무 흐름을 만듭니다.</p>
          </div>
        </div>
      </div>
      <div className={styles.aboutNotes}>
        <div>
          <h3>How I work</h3>
          <p>
            성능 병목은 데이터 흐름과 조회 구조에서 찾고, 새로운 기능은
            결합도·확장성·유지보수 비용까지 고려해 설계합니다.
          </p>
        </div>
        <div>
          <h3>Currently building</h3>
          <p>
            AI를 개발 규칙·검증·업무 흐름에 연결하고 있습니다. 개인 프로젝트
            Jongalab에서는 데이터 수집부터 자동매매까지 직접 구축하고
            운영합니다.
          </p>
        </div>
      </div>
      <h3 className={styles.contentHeading}>Tools for the work</h3>
      <dl className={styles.skillList}>
        {skills.map((skill) => (
          <div key={skill.category}>
            <dt>{skill.category}</dt>
            <dd>{skill.items}</dd>
          </div>
        ))}
      </dl>
      <div className={styles.contactCard}>
        <p className={styles.eyebrow}>LET’S TALK</p>
        <a href={`mailto:${profile.email}`}>{profile.email}</a>
        <a href={`tel:${profile.phone.replaceAll('-', '')}`}>{profile.phone}</a>
        <ProjectLinks links={profile.links} />
      </div>
    </>
  );
}

export function Experience() {
  return (
    <>
      <p className={styles.eyebrow}>03 / EXPERIENCE</p>
      <h2>
        Always learning.
        <br />
        <em>Always building.</em>
      </h2>
      <p className={styles.intro}>
        제품 개발, 성능 개선, 연구와 운영을 거쳐 쌓아온 경험.
      </p>
      <div className={styles.metrics}>
        <div>
          <strong>190 → 14ms</strong>
          <span>API 응답 시간 · 넷스루</span>
        </div>
        <div>
          <strong>2시간 → 10분</strong>
          <span>회의록 작성·정리 · 넷스루</span>
        </div>
        <div>
          <strong>70% 향상</strong>
          <span>시나리오 작성 생산성 · 카카오엔터프라이즈</span>
        </div>
      </div>
      <div className={styles.timeline}>
        {experiences.map((experience, index) => (
          <div key={experience.company}>
            <span>{String(index + 1).padStart(2, '0')}</span>
            <p className={styles.experiencePeriod}>{experience.period}</p>
            <h3>{experience.company}</h3>
            <p className={styles.experienceRole}>{experience.role}</p>
            <p>{experience.description}</p>
            <ul className={styles.achievementList}>
              {experience.achievements.map((item) => (
                <li key={item}>{item}</li>
              ))}
            </ul>
          </div>
        ))}
      </div>
      <div className={styles.credentials}>
        <section>
          <h3 className={styles.contentHeading}>Education</h3>
          {education.map((item) => (
            <article key={item.title}>
              <p className={styles.projectMeta}>{item.period}</p>
              <h4>{item.title}</h4>
              <p>{item.description}</p>
            </article>
          ))}
        </section>
        <section>
          <h3 className={styles.contentHeading}>Awards</h3>
          {awards.map((item) => (
            <article key={item.title}>
              <p className={styles.projectMeta}>{item.period}</p>
              <h4>{item.title}</h4>
              <p>{item.description}</p>
            </article>
          ))}
        </section>
      </div>
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
