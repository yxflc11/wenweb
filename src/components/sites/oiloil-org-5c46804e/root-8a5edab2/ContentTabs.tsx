"use client";

import Link from "next/link";
import { useRef, useState, type KeyboardEvent } from "react";
import ProductsPanel from "./ProductsPanel";
import styles from "./ContentTabs.module.css";
import { about, articles, capabilities, collaborations, tabs, type TabKey } from "./content";

function CapabilitiesPanel() {
  return (
    <div className={styles.secondaryPanel}>
      <div className={styles.panelKicker}>SKILL</div>
      <div className={styles.skillGrid}>
        {capabilities.map((capability, index) => (
          <article className={styles.skillCard} key={capability.title}>
            <span className={styles.cardNumber} aria-hidden="true">
              {String(index + 1).padStart(2, "0")}
            </span>
            <div className={styles.skillCopy}>
              <span className={styles.abilityMeta}>{capability.meta}</span>
              <div className={styles.skillHeading}>
                <h3>{capability.title}</h3>
              </div>
              <p>{capability.description}</p>
            </div>
          </article>
        ))}
      </div>
    </div>
  );
}

function WritingPanel() {
  return (
    <div className={styles.secondaryPanel}>
      <div className={styles.articleGrid}>
        {articles.map((article, index) => (
          <Link
            className={`${styles.articleCard} ${styles.articleCardText}`}
            href={article.href}
            key={article.title}
          >
            <span className={styles.articleIndex} aria-hidden="true">
              {String(index + 1).padStart(2, "0")}
            </span>
            <div className={styles.articleInfo}>
              <time dateTime={article.date.replaceAll(".", "-")}>{article.date}</time>
              <h3>{article.title}</h3>
              <p className={styles.articleSummary}>{article.summary}</p>
              <span className={styles.readMore}>阅读文章 ↗</span>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}

function AboutPanel() {
  return (
    <div className={styles.secondaryPanel}>
      <div className={styles.bio}>
        <p className={styles.bioEyebrow}>{about.eyebrow}</p>
        <p className={styles.bioText}>{about.statement}</p>
        <div className={styles.chips} aria-label="个人实践方向">
          {about.chips.map((chip) => (
            <span key={chip}>{chip}</span>
          ))}
        </div>
      </div>

      <div className={styles.experience}>
        <div className={styles.sectionHeading}>
          <strong>实践 / PRACTICE</strong>
          <span>Build once. Reuse the judgement.</span>
        </div>
        <div className={styles.experienceList}>
          {about.practices.map((item, index) => (
            <article className={styles.experienceCard} key={item.name}>
              <span className={styles.experienceNo} aria-hidden="true">
                {String(index + 1).padStart(2, "0")}
              </span>
              <div className={styles.experienceCopy}>
                <span className={styles.experienceStatus}>
                  {"current" in item && item.current ? <i aria-hidden="true" /> : null}
                  {item.status}
                </span>
                <h3>{item.name}</h3>
                <p>{item.description}</p>
              </div>
            </article>
          ))}
        </div>
      </div>
    </div>
  );
}

function ContactPanel() {
  return (
    <div className={styles.secondaryPanel}>
      <div className={styles.sectionHeading}>
        <strong>咨询与学习 / CONSULTING</strong>
        <span>专业 · 成长 · 分享</span>
      </div>
      <div className={styles.serviceList}>
        {collaborations.map((service, index) => (
          <Link
            className={styles.serviceCard}
            href={service.href}
            key={service.title}
          >
            <span className={styles.serviceNo} aria-hidden="true">
              {String(index + 1).padStart(2, "0")}
            </span>
            <span className={styles.serviceCopy}>
              <span className={styles.serviceEyebrow}>{service.eyebrow}</span>
              <strong
                className={`${styles.serviceTitle} ${
                  "compact" in service && service.compact ? styles.serviceTitleCompact : ""
                }`}
              >
                {service.title}
              </strong>
              <span className={styles.serviceSummary}>{service.summary}</span>
              <span className={styles.serviceMeta}>{service.meta}</span>
            </span>
            <span className={styles.serviceArt} aria-hidden="true">
              <img src={service.image} alt="" loading="lazy" />
            </span>
            <span className={styles.externalArrow} aria-hidden="true">↗</span>
          </Link>
        ))}
      </div>
    </div>
  );
}

const panelContent: Record<TabKey, () => React.JSX.Element> = {
  projects: ProductsPanel,
  capabilities: CapabilitiesPanel,
  writing: WritingPanel,
  about: AboutPanel,
  contact: ContactPanel,
};

export default function ContentTabs() {
  const [activeTab, setActiveTab] = useState<TabKey>("projects");
  const tabRefs = useRef<Array<HTMLButtonElement | null>>([]);

  const handleKeyDown = (event: KeyboardEvent<HTMLButtonElement>, index: number) => {
    let target = index;

    if (event.key === "ArrowRight") target = (index + 1) % tabs.length;
    else if (event.key === "ArrowLeft") target = (index - 1 + tabs.length) % tabs.length;
    else if (event.key === "Home") target = 0;
    else if (event.key === "End") target = tabs.length - 1;
    else return;

    event.preventDefault();
    const nextTab = tabs[target];
    setActiveTab(nextTab.id);
    tabRefs.current[target]?.focus();
  };

  return (
    <section className={styles.contentTabs}>
      <div className={styles.tabList} role="tablist" aria-label="内容分类">
        {tabs.map((tab, index) => {
          const active = activeTab === tab.id;
          return (
            <button
              className={`${styles.tab} ${active ? styles.active : ""}`}
              id={`wen-content-tab-${tab.id}`}
              type="button"
              role="tab"
              aria-controls={`wen-content-panel-${tab.id}`}
              aria-selected={active}
              tabIndex={active ? 0 : -1}
              onClick={() => setActiveTab(tab.id)}
              onKeyDown={(event) => handleKeyDown(event, index)}
              ref={(node) => {
                tabRefs.current[index] = node;
              }}
              key={tab.id}
            >
              {tab.label}
            </button>
          );
        })}
      </div>

      {tabs.map((tab) => {
        const Panel = panelContent[tab.id];
        return (
          <div
            className={styles.panel}
            id={`wen-content-panel-${tab.id}`}
            role="tabpanel"
            aria-labelledby={`wen-content-tab-${tab.id}`}
            tabIndex={0}
            hidden={activeTab !== tab.id}
            key={tab.id}
          >
            <Panel />
          </div>
        );
      })}
    </section>
  );
}
