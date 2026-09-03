"use client";

import { useEffect, useState } from "react";
import ContentTabs from "./ContentTabs";
import Hero from "./Hero";
import styles from "./OilOilClone.module.css";
import { elsewhere, identity } from "./content";

const aboutAssetRoot = "/sites/oiloil-org-5c46804e/root-8a5edab2/assets/about";

function ContactRow({ item }: { item: (typeof elsewhere)[number] }) {
  return (
    <a
      className={styles.contactRow}
      href={item.href}
      target={"external" in item && item.external ? "_blank" : undefined}
      rel={"external" in item && item.external ? "noreferrer" : undefined}
    >
      <span className={styles.contactIcon} data-brand={item.icon} aria-hidden="true">
        <img src={`${aboutAssetRoot}/${item.icon}.svg`} alt="" />
      </span>
      <span className={styles.contactNo}>{item.no}</span>
      <strong>{item.label}</strong>
      <span className={styles.contactNote}>{item.note}</span>
      <span className={styles.contactArrow} aria-hidden="true">→</span>
    </a>
  );
}

export default function OilOilClone({ theme = "neutral" }: { theme?: "neutral" | "night" }) {
  const [progress, setProgress] = useState(0);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    const timer = window.setTimeout(() => setReady(true), 850);
    let raf = 0;
    const updateProgress = () => {
      cancelAnimationFrame(raf);
      raf = requestAnimationFrame(() => {
        const max = Math.max(1, document.documentElement.scrollHeight - window.innerHeight);
        setProgress(Math.max(0, Math.min(100, Math.round((window.scrollY / max) * 100))));
      });
    };
    updateProgress();
    window.addEventListener("scroll", updateProgress, { passive: true });
    window.addEventListener("resize", updateProgress);
    return () => {
      clearTimeout(timer);
      cancelAnimationFrame(raf);
      window.removeEventListener("scroll", updateProgress);
      window.removeEventListener("resize", updateProgress);
    };
  }, []);

  return (
    <div
      className={styles.page}
      data-ready={ready ? "true" : "false"}
      data-theme={theme}
    >
      <div className={styles.grid} aria-hidden="true" />
      <div className={styles.glow} aria-hidden="true" />

      <div className={styles.loader} role="status" aria-label="正在准备首屏">
        <span className={styles.loaderFace}>W</span>
        <span className={styles.loaderTrack}><i /></span>
      </div>

      <aside className={styles.progress} aria-label={`阅读进度 ${progress}%`}>
        <i style={{ transform: `scaleY(${progress / 100})` }} />
        <span>{String(progress).padStart(2, "0")}</span>
      </aside>

      <div className={styles.column}>
        <Hero />

        <main>
          <section className={styles.workSection} aria-label="项目与内容">
            <span className={styles.sectionNo} aria-hidden="true">01</span>
            <ContentTabs />
          </section>

          <section className={styles.elsewhere} aria-labelledby="elsewhere-title">
            <div className={styles.ghostTwo} aria-hidden="true">02</div>
            <header className={styles.sectionHeading}>
              <span className={styles.rule} />
              <h2 id="elsewhere-title">联系 / ELSEWHERE</h2>
            </header>
            <div className={styles.contactList}>
              {elsewhere.map((item) => (
                <ContactRow item={item} key={item.label} />
              ))}
            </div>
            <div className={styles.ghostOil} aria-hidden="true">wen</div>
          </section>
        </main>

        <footer className={styles.footer}>© 2026 {identity.brand}</footer>
      </div>
    </div>
  );
}
