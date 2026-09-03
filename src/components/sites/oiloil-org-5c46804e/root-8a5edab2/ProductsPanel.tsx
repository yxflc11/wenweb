import Link from "next/link";
import styles from "./ProductsPanel.module.css";
import { projects, type PreviewProject, type ProjectVisual } from "./content";

const ASSET_ROOT = "/sites/oiloil-org-5c46804e/root-8a5edab2/assets/";

function VisualPlaceholder() {
  return <span className={styles.visualPlaceholder}>视觉占位 / 待替换</span>;
}

function ProductVisual({ name }: { name: ProjectVisual }) {
  if (name === "wolfcha") {
    return (
      <div className={`${styles.visual} ${styles.wolfVisual}`} aria-hidden="true">
        <div className={styles.wolfBubble}>我是预言家，4 号查杀</div>
        <div className={styles.wolfCast}>
          {["werewolf.png", "hunter.png", "seer.png", "guard.png", "witch.png"].map((role) => (
            <img className={styles.wolfCharacter} src={`${ASSET_ROOT}${role}`} alt="" key={role} />
          ))}
        </div>
        <span className={styles.sparkOne}>◆</span>
        <span className={styles.sparkTwo}>●</span>
        <VisualPlaceholder />
      </div>
    );
  }

  if (name === "textWell") {
    return (
      <div className={`${styles.visual} ${styles.textWellVisual}`} aria-hidden="true">
        <div className={styles.paperBack} />
        <div className={styles.paper}>
          <p>AI tools <span className={styles.correctWord}>have</span> changed how we write,</p>
          <p>and it&apos;s now easier <span className={styles.errorWord}>then</span> <span className={styles.replacement}>than</span> ever to</p>
          <p>polish a draft in minutes.</p>
        </div>
        <VisualPlaceholder />
      </div>
    );
  }

  if (name === "vibeHub") {
    return (
      <div className={`${styles.visual} ${styles.vibeVisual}`} aria-hidden="true">
        <div className={styles.vibeWindow}>
          <div className={styles.vibeHeader}>
            <span className={styles.vibeIndex}>N°03</span>
            <strong>毛玻璃</strong>
            <span>Backdrop Blur</span>
            <b>外观</b>
          </div>
          <p>导航栏被放半透明的，后面的内容滚过去时模糊。</p>
          <div className={styles.vibeDemo}>
            <span>普通按钮</span>
            <span className={styles.vibeActive}>毛玻璃按钮</span>
            <span>明亮按钮</span>
          </div>
          <div className={styles.vibePager}>
            <i /> <i className={styles.vibePagerActive} /> <i />
            <span>03 / 28</span>
          </div>
        </div>
        <VisualPlaceholder />
      </div>
    );
  }

  if (name === "selector") {
    return (
      <div className={`${styles.visual} ${styles.selectorVisual}`} aria-hidden="true">
        <div className={styles.selectorWindows}>
          <div className={styles.selectorWindow}>
            <span className={styles.selectorBar} />
            <div className={styles.selectorTarget}>
              <i /><i /><i /><i />
            </div>
          </div>
          <div className={styles.selectorWindow}>
            <span className={styles.selectorBar} />
            <div className={styles.selectorTargetSmall}>
              <i /><i /><i /><i />
            </div>
          </div>
        </div>
        <ol className={styles.selectorPrompt}>
          <li><b>button</b> “Get started” → 改成黑色</li>
          <li>card “Launch” → 增加圆角</li>
        </ol>
        <div className={styles.selectorChip}>
          <strong>Selector</strong>
          <span>PRO</span>
          <small>Chrome 扩展</small>
          <b>↗</b>
        </div>
        <VisualPlaceholder />
      </div>
    );
  }

  return (
    <div className={`${styles.visual} ${styles.notchVisual}`} aria-hidden="true">
      <div className={styles.macScreen}>
        <div className={styles.macBar}>
          <span>● ● ●</span>
          <small>Wed · 10:24</small>
        </div>
        <div className={styles.notch}>
          <i />
        </div>
        <div className={styles.note}>
          <div><span>Note 01</span><b>⌘ K</b></div>
          <p># 今天</p>
          <small>把突然想到的事，留在视线里。</small>
        </div>
      </div>
      <VisualPlaceholder />
    </div>
  );
}

function ProjectCard({ project, index }: { project: PreviewProject; index: number }) {
  const contents = (
    <>
      <ProductVisual name={project.visual} />
      <div className={styles.content}>
        <span className={styles.projectMeta}>PROJECT / {project.year}</span>
        <div className={styles.brand}>
          <h3><span>{project.name}</span></h3>
        </div>
        <p className={styles.description}>{project.description}</p>
        <span className={`${styles.cta} ${project.status === "draft" ? styles.draftCta : ""}`}>
          {project.action}
          {project.status === "published" ? <i aria-hidden="true">→</i> : null}
        </span>
      </div>
      <span className={styles.number} aria-hidden="true">
        {String(index + 1).padStart(2, "0")}
      </span>
    </>
  );

  if (project.status === "draft") {
    return (
      <article className={`${styles.card} ${styles.draftCard}`} aria-label={`${project.name}：详情整理中`}>
        {contents}
      </article>
    );
  }

  return (
    <Link className={styles.card} href={project.href} aria-label={`${project.name}：${project.action}`}>
      {contents}
    </Link>
  );
}

export default function ProductsPanel() {
  return (
    <section className={styles.panel} aria-label="项目">
      {projects.map((project, index) => (
        <ProjectCard project={project} index={index} key={project.name} />
      ))}
    </section>
  );
}
