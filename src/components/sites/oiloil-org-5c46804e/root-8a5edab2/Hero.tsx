import styles from "./Hero.module.css";
import { identity } from "./content";

export default function Hero() {
  return (
    <>
      <header className={styles.header}>
        <div className={styles.headerInner}>
          <div className={styles.brand} aria-label="WEN">
            <span className={styles.statusDot} aria-hidden="true" />
            <span>{identity.brand}</span>
          </div>

          <a
            className={styles.github}
            href={identity.githubUrl}
            target="_blank"
            rel="noreferrer"
          >
            <svg viewBox="0 0 24 24" aria-hidden="true">
              <path
                fill="currentColor"
                d="M12 .8a11.5 11.5 0 0 0-3.64 22.42c.58.1.79-.25.79-.56v-2.23c-3.23.7-3.91-1.37-3.91-1.37-.53-1.34-1.29-1.7-1.29-1.7-1.05-.72.08-.71.08-.71 1.17.08 1.78 1.2 1.78 1.2 1.04 1.77 2.72 1.26 3.38.96.1-.75.4-1.26.74-1.55-2.58-.3-5.29-1.29-5.29-5.68 0-1.26.45-2.29 1.19-3.1-.12-.3-.52-1.47.11-3.06 0 0 .97-.31 3.16 1.18A10.96 10.96 0 0 1 12 6.21c.98 0 1.95.13 2.86.39 2.2-1.49 3.17-1.18 3.17-1.18.63 1.59.23 2.77.11 3.06.74.81 1.19 1.84 1.19 3.1 0 4.41-2.72 5.38-5.3 5.67.42.36.79 1.07.79 2.16v3.25c0 .31.21.67.8.56A11.5 11.5 0 0 0 12 .8Z"
              />
            </svg>
            <span>{identity.githubLabel}</span>
          </a>
        </div>
      </header>

      <section className={styles.hero} aria-labelledby="wen-hero-title">
        <div className={styles.heroFrame}>
          <div className={styles.composition}>
            <h1 id="wen-hero-title" className={styles.title}>
              <span className={`${styles.titleLine} ${styles.brandLine}`}>
                {identity.heroBrand}<sup>®</sup>
              </span>
              {identity.heroStatementLines.map((line) => (
                <span className={styles.titleLine} key={line}>
                  {line}
                </span>
              ))}
            </h1>

            <div className={styles.meta}>
              <span className={styles.name}>{identity.name}</span>
              <span className={styles.roles}>{identity.roles}</span>
            </div>
          </div>

          <div className={styles.scrollCue} aria-hidden="true">
            ↓　往下滑
          </div>
        </div>
      </section>
    </>
  );
}
