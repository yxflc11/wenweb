"use client";

import Link from "next/link";
import { workByGroup } from "@/data";
import { usePreview } from "./PreviewContext";
import { useUI } from "./ui-context";

export default function Work() {
  const { setActive } = usePreview();
  const { onNavSection, hoverTick } = useUI();

  return (
    <section className="work" id="work" aria-label="Selected work">
      <div className="section-head reveal">
        <span className="section-index">01</span>
        <h2>Selected Work</h2>
        <p>
          Systems, automation experiments, content engines, and study artefacts — grouped by
          craft, newest first.
        </p>
      </div>

      <div className="work-list">
        {workByGroup.map(({ group, items }) => (
          <div className="work-group reveal" key={group}>
            <div className="work-group-head">
              <span className="work-group-title">{group}</span>
              <span className="work-group-count">{String(items.length).padStart(2, "0")}</span>
            </div>
            <div className="work-rows">
              {items.map((w) => {
                const className = `work-row ${w.image ? "has-preview" : ""}`;
                const onMouseEnter = () => {
                  hoverTick();
                  if (w.image) setActive(w.image);
                };
                const onMouseLeave = () => setActive(null);
                const inner = (
                  <>
                    <span className="work-title">{w.title}</span>
                    <span className="work-cat">{w.category}</span>
                    <span className="work-year">{w.year}</span>
                    <span className="work-type">{w.type}</span>
                    <span className="work-arrow" aria-hidden="true">
                      {w.href || w.slug ? "↗" : "→"}
                    </span>
                  </>
                );

                // Case-study page → internal route; else external link; else
                // scroll to contact.
                if (w.slug) {
                  return (
                    <Link
                      className={className}
                      key={w.title}
                      href={`/work/${w.slug}`}
                      onClick={() => setActive(null)}
                      onMouseEnter={onMouseEnter}
                      onMouseLeave={onMouseLeave}
                    >
                      {inner}
                    </Link>
                  );
                }
                if (w.href) {
                  return (
                    <a
                      className={className}
                      key={w.title}
                      href={w.href}
                      target="_blank"
                      rel="noreferrer"
                      onMouseEnter={onMouseEnter}
                      onMouseLeave={onMouseLeave}
                    >
                      {inner}
                    </a>
                  );
                }
                return (
                  <a
                    className={className}
                    key={w.title}
                    href="/contact"
                    onClick={(e) => {
                      e.preventDefault();
                      setActive(null);
                      onNavSection("#contact");
                    }}
                    onMouseEnter={onMouseEnter}
                    onMouseLeave={onMouseLeave}
                  >
                    {inner}
                  </a>
                );
              })}
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
