const projects = [
  {
    title: "AICA 2026",
    meta: "AI Content System",
    year: "2026",
    type: "System",
    image: "./public/assets/aica-2026.png",
    size: "project--wide",
    theme: "lime",
    depth: 0.24,
    x: -4,
    y: 0
  },
  {
    title: "One-Person Company Toolkit",
    meta: "Content Archive",
    year: "2026",
    type: "Archive",
    image: "./public/assets/company-toolkit.png",
    size: "project--tall",
    theme: "bone",
    depth: 0.16,
    x: 5,
    y: 14
  },
  {
    title: "Workflow SOP Lab",
    meta: "Automation",
    year: "2026",
    type: "System",
    image: "./public/assets/workflow-sop.png",
    size: "project--medium",
    theme: "charcoal",
    depth: 0.3,
    x: -1,
    y: -8
  },
  {
    title: "Obsidian Knowledge System",
    meta: "Personal OS",
    year: "2026",
    type: "System",
    image: "./public/assets/obsidian-system.png",
    size: "project--tall",
    theme: "paper",
    depth: 0.2,
    x: 7,
    y: 8
  },
  {
    title: "Codex-Claude-GPT Stack",
    meta: "Tooling",
    year: "2026",
    type: "Tool",
    image: "./public/assets/codex-stack.png",
    size: "project--banner",
    theme: "graphite",
    depth: 0.34,
    x: -7,
    y: -6
  },
  {
    title: "Content Dashboard",
    meta: "Analytics",
    year: "2026",
    type: "Dashboard",
    image: "./public/assets/content-dashboard.png",
    size: "project--wide project--push",
    theme: "solar",
    depth: 0.22,
    x: 6,
    y: 2
  }
];

const archiveRows = [
  ["2026", "AICA 2026", "AI Content System", "System"],
  ["2026", "One-Person Company Toolkit", "Content Archive", "Archive"],
  ["2026", "Workflow SOP Lab", "Automation", "System"],
  ["2026", "Obsidian Knowledge System", "Personal OS", "System"],
  ["2026", "Codex-Claude-GPT Stack", "Dev Tools", "Tool"],
  ["2026", "Content Dashboard", "Analytics", "Dashboard"],
  ["2025", "Prompt Library 2.0", "Knowledge", "System"],
  ["2025", "Account Positioning Map", "Content", "Research"],
  ["2025", "Xiaohongshu Card System", "Visual", "Template"],
  ["2025", "Agent SOP Board", "Automation", "Workflow"],
  ["2024", "MySQL Study Notes", "Database", "Learning"],
  ["2024", "C Language Foundation", "Programming", "Learning"],
  ["2024", "Class Operations OS", "Coordination", "System"],
  ["2024", "Frontend Component Notes", "Web", "Study"],
  ["2023", "Knowledge Base Starter", "Obsidian", "System"],
  ["2023", "Student Affairs Templates", "Management", "SOP"]
];

const services = [
  "AI automation workflow design",
  "Prompt engineering and prompt systems",
  "AI agent and tool integration",
  "Content system architecture",
  "Knowledge-base and SOP design",
  "One-person company operating systems"
];

const root = document.getElementById("root");
let overlay = null;
let loopTimer = 0;
const email = "yxflc11@gmail.com";
const githubUrl = "https://github.com/yxflc11";
// Formspree endpoint for the contact form.
const formEndpoint = "https://formspree.io/f/xgobeplp";

function scrollTo(target) {
  if (window.__lenis) {
    window.__lenis.scrollTo(target, { duration: 1.2 });
    return;
  }
  if (typeof target === "number") {
    window.scrollTo({ top: target, behavior: "smooth" });
  } else {
    document.querySelector(target)?.scrollIntoView({ behavior: "smooth" });
  }
}

function scatterText(text) {
  return text
    .split("")
    .map((letter, index) => `<span style="--i:${index}">${letter === " " ? "&nbsp;" : letter}</span>`)
    .join("");
}

function render() {
  const newOpen = overlay === "new";
  const archiveOpen = overlay === "archive";
  const infoOpen = overlay === "info";
  const contactOpen = overlay === "contact";
  const menuOpen = overlay === "menu";

  document.body.style.overflow =
    archiveOpen || infoOpen || contactOpen || menuOpen ? "hidden" : "";
  root.innerHTML = `
    <nav class="nav-pill" aria-label="Primary">
      <button class="pill" data-action="projects" type="button">Projects</button>
      <button class="pill" data-action="archive" type="button" aria-controls="archive-panel">Archive</button>
      <button class="pill" data-action="info" type="button" aria-controls="information-panel">Information</button>
    </nav>
    <button class="menu-toggle ${menuOpen ? "is-open" : ""}" data-action="menu" type="button" aria-label="Menu" aria-expanded="${menuOpen}">
      <span></span><span></span>
    </button>
    <button class="pill new-pill ${newOpen ? "is-active" : ""}" data-action="new" type="button">New 4 <span class="dot"></span></button>
    <div class="fixed-contact fixed-left">
      <a class="scatter-link small-scatter" href="mailto:${email}">${scatterText(`-> ${email}`)}</a>
      <a href="#contact" data-action="contact">-&gt; Enquiries</a>
    </div>
    <div class="fixed-contact fixed-center">
      <a class="scatter-link small-scatter" href="${githubUrl}" target="_blank" rel="noreferrer">${scatterText("-> GitHub")}</a>
      <a href="mailto:${email}">-&gt; Chat</a>
    </div>
    <div class="copyright">© Bingwen He 2026</div>
    <main class="app ${newOpen ? "is-dimmed" : ""}">
      ${heroMarkup()}
      ${projectsMarkup()}
    </main>
    <button class="scrim ${newOpen ? "is-open" : ""}" data-action="close" type="button" aria-label="Close new work"></button>
    ${newStackMarkup(newOpen)}
    ${archivePanelMarkup(archiveOpen)}
    ${informationPanelMarkup(infoOpen)}
    ${contactPanelMarkup(contactOpen)}
    ${mobileMenuMarkup(menuOpen)}
  `;

  bindEvents();
  bindReveal();
  bindContactForm();
  bindListMore();
  updateParallax();
}

function heroMarkup() {
  return `
    <section class="hero" aria-label="Identity">
      <div class="hero-grid" aria-label="Bingwen He software and AI automation">
        <div class="hero-row hero-row--name" style="--delay:0ms">
          <span>BINGWEN</span>
          <span>HE</span>
        </div>
        <div class="hero-row hero-row--software" style="--delay:90ms">SOFTWARE</div>
        <div class="hero-row hero-row--amp" style="--delay:180ms">&</div>
        <div class="hero-row hero-row--direction" style="--delay:270ms">
          <span>AI</span>
          <span>AUTOMATION</span>
        </div>
        <div class="hero-row hero-row--phone" style="--delay:360ms">FULL STACK SYSTEMS</div>
        <div class="hero-row hero-row--links" style="--delay:450ms">
          <a class="scatter-link hero-scatter" href="mailto:${email}">${scatterText("->EMAIL")}</a>
          <a class="scatter-link hero-scatter" href="${githubUrl}" target="_blank" rel="noreferrer">${scatterText("->GITHUB")}</a>
        </div>
      </div>
    </section>
  `;
}

function projectsMarkup() {
  return `
    <section class="projects" id="projects" aria-label="Project archive">
      <div class="sticky-word" aria-hidden="true">ARCHIVE</div>
      <div class="project-wall">
        ${projects
          .map(
            (project, index) => `
              <article class="project ${project.size}" data-theme="${project.theme}" data-depth="${project.depth}" data-base-y="${project.y}" style="--x:${project.x}vw;--y:${project.y}px;--stagger:${index * 80}ms">
                <div class="project-media">
                  <img src="${project.image}" alt="${project.title} poster" loading="lazy">
                  <span class="open-button">Open</span>
                </div>
                <a class="project-caption" href="#archive">
                  <span>-&gt; ${project.title}</span>
                  <span>${project.meta}</span>
                  <span>${project.type}</span>
                </a>
              </article>
            `
          )
          .join("")}
      </div>
      <div class="project-list" aria-label="Selected project list">
        ${projects
          .map(
            (project, index) =>
              `<a class="project-list__item ${index >= 3 ? "is-extra" : ""}" href="#archive">-&gt; ${project.title} ${project.year} / ${project.meta}</a>`
          )
          .join("")}
        <button class="list-more" type="button" data-hidden="${projects.length - 3}" aria-expanded="false">+ ${projects.length - 3} more</button>
      </div>
      <section class="loop-back" aria-label="Return to top">
        <p>END / BEGIN</p>
        <button type="button" data-action="top">Back to top</button>
      </section>
    </section>
  `;
}

function newStackMarkup(open) {
  return `
    <aside class="new-stack ${open ? "is-open" : ""}" aria-label="New work notifications" aria-hidden="${!open}">
      ${projects
        .slice(0, 4)
        .map(
          (project, index) => `
            <a class="new-card" href="#projects" style="--card-delay:${index * 80}ms">
              <img src="${project.image}" alt="">
              <span>
                <small>${project.meta}</small>
                <strong>${project.title}</strong>
                <em>+4 more</em>
              </span>
            </a>
          `
        )
        .join("")}
    </aside>
  `;
}

function archivePanelMarkup(open) {
  return `
    <section class="light-panel ${open ? "is-open" : ""}" id="archive-panel" aria-hidden="${!open}" data-lenis-prevent>
      <button class="panel-close" data-action="close" type="button" aria-label="Close archive">x</button>
      <header class="panel-head">
        <span>ARCHIVE</span>
        <p>Project systems, study artefacts, content engines, and automation experiments.</p>
      </header>
      <div class="archive-table">
        <div class="archive-heading">
          <span>Year</span><span>Project</span><span>Category</span><span>Type</span><span></span>
        </div>
        ${archiveRows
          .map(
            ([year, project, category, type]) => `
              <a class="archive-row" href="#projects">
                <span>${year}</span><span>${project}</span><span>${category}</span><span>${type}</span><span>[Open]</span>
              </a>
            `
          )
          .join("")}
      </div>
    </section>
  `;
}

function informationPanelMarkup(open) {
  return `
    <section class="light-panel info-panel ${open ? "is-open" : ""}" id="information-panel" aria-hidden="${!open}" data-lenis-prevent>
      <button class="panel-close" data-action="close" type="button" aria-label="Close information">x</button>
      <header class="panel-head">
        <span>INFORMATION</span>
        <p>AI automation and prompt engineering, building toward a one-person company.</p>
      </header>
      <div class="info-layout">
        <div class="bio-copy">
          <h2>Bingwen He builds AI automation and prompt-engineering systems, working toward life as a super-individual running a one-person company.</h2>
          <p>His current practice centers on AI automation and prompt engineering — designing the workflows, prompt systems, and repeatable processes that let a single person operate like a whole team.</p>
          <p>He is building toward an AI-native one-person company (OPC), continuously exploring the frontier of every new era of AI so that his work compounds with the technology instead of being left behind by it.</p>
        </div>
        <div class="info-stack">
          <div>
            <h3>Services</h3>
            ${services.map((item) => `<span>${item}</span>`).join("")}
          </div>
          <div>
            <h3>Contact</h3>
            <a href="mailto:${email}">${email}</a>
            <a href="${githubUrl}" target="_blank" rel="noreferrer">github.com/yxflc11</a>
          </div>
          <div>
            <h3>Focus</h3>
            <span>AI automation</span>
            <span>Prompt engineering</span>
            <span>One-person company</span>
          </div>
        </div>
      </div>
    </section>
  `;
}

function contactPanelMarkup(open) {
  return `
    <section class="light-panel contact-panel ${open ? "is-open" : ""}" id="contact-panel" aria-hidden="${!open}" data-lenis-prevent>
      <button class="panel-close" data-action="close" type="button" aria-label="Close contact">x</button>
      <header class="panel-head">
        <span>CONTACT</span>
        <p>Tell me about a project, a collaboration, or just say hello.</p>
      </header>
      <form class="contact-form" id="contact-form" action="${formEndpoint}" method="POST" novalidate>
        <div class="field">
          <label for="cf-name">Your name</label>
          <input id="cf-name" name="name" type="text" autocomplete="name" required>
        </div>
        <div class="field">
          <label for="cf-email">Email</label>
          <input id="cf-email" name="email" type="email" autocomplete="email" required>
        </div>
        <div class="field">
          <label for="cf-topic">What's this about?</label>
          <select id="cf-topic" name="topic">
            <option>AI automation project</option>
            <option>Prompt engineering</option>
            <option>Collaboration</option>
            <option>Just saying hello</option>
          </select>
        </div>
        <div class="field">
          <label for="cf-message">Message</label>
          <textarea id="cf-message" name="message" rows="5" required></textarea>
        </div>
        <button class="contact-submit" type="submit">Send message -&gt;</button>
        <p class="contact-status" aria-live="polite"></p>
      </form>
    </section>
  `;
}

function mobileMenuMarkup(open) {
  const items = [
    ["projects", "#projects", "Projects"],
    ["archive", "#archive", "Archive"],
    ["info", "#information", "Information"],
    ["contact", "#contact", "Contact"]
  ];
  return `
    <nav class="mobile-menu ${open ? "is-open" : ""}" aria-label="Mobile" aria-hidden="${!open}" data-lenis-prevent>
      ${items
        .map(
          ([action, href, label], index) =>
            `<a class="mobile-menu__link" data-action="${action}" href="${href}" style="--menu-delay:${index * 60}ms">${label}</a>`
        )
        .join("")}
      <div class="mobile-menu__foot">
        <a href="mailto:${email}">${email}</a>
        <a href="${githubUrl}" target="_blank" rel="noreferrer">github.com/yxflc11</a>
      </div>
    </nav>
  `;
}

function bindListMore() {
  const list = root.querySelector(".project-list");
  const btn = list?.querySelector(".list-more");
  if (!btn) return;
  const hidden = Number(btn.dataset.hidden || 0);
  btn.addEventListener("click", () => {
    const expanded = list.classList.toggle("is-expanded");
    btn.textContent = expanded ? "Show less" : `+ ${hidden} more`;
    btn.setAttribute("aria-expanded", String(expanded));
  });
}

function bindContactForm() {
  const form = document.getElementById("contact-form");
  if (!form) return;
  const status = form.querySelector(".contact-status");
  form.addEventListener("submit", async (event) => {
    event.preventDefault();

    if (!form.checkValidity()) {
      status.textContent = "Please fill in your name, a valid email, and a message.";
      status.dataset.state = "error";
      form.reportValidity();
      return;
    }

    if (form.action.includes("YOUR_FORM_ID")) {
      status.textContent = "Form is not connected yet — add your Formspree ID to enable sending.";
      status.dataset.state = "error";
      return;
    }

    status.textContent = "Sending…";
    status.dataset.state = "";
    try {
      const response = await fetch(form.action, {
        method: "POST",
        body: new FormData(form),
        headers: { Accept: "application/json" }
      });
      if (response.ok) {
        form.reset();
        status.textContent = "Thanks — your message is on its way.";
        status.dataset.state = "ok";
      } else {
        status.textContent = `Couldn't send right now. Email me at ${email} instead.`;
        status.dataset.state = "error";
      }
    } catch {
      status.textContent = `Network error. Email me at ${email} instead.`;
      status.dataset.state = "error";
    }
  });
}

function bindEvents() {
  root.querySelectorAll("[data-action]").forEach((node) => {
    node.addEventListener("click", (event) => {
      const action = node.dataset.action;
      if (action === "projects") {
        event.preventDefault();
        if (overlay) {
          overlay = null;
          render();
        }
        scrollTo("#projects");
        return;
      }
      if (action === "top") {
        event.preventDefault();
        scrollTo(0);
        return;
      }

      event.preventDefault();
      if (action === "archive") overlay = overlay === "archive" ? null : "archive";
      if (action === "info") overlay = overlay === "info" ? null : "info";
      if (action === "contact") overlay = overlay === "contact" ? null : "contact";
      if (action === "menu") overlay = overlay === "menu" ? null : "menu";
      if (action === "new") overlay = overlay === "new" ? null : "new";
      if (action === "close") overlay = null;
      render();
    });
  });
}

function bindReveal() {
  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add("is-visible");
          observer.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.18 }
  );

  root.querySelectorAll(".project").forEach((node) => observer.observe(node));
  root.querySelectorAll(".project").forEach((node) => {
    node.addEventListener("mouseenter", () => {
      document.body.dataset.theme = node.dataset.theme || "default";
    });
    node.addEventListener("mouseleave", () => {
      document.body.dataset.theme = "default";
    });
  });

  const loop = root.querySelector(".loop-back");
  if (loop) {
    const loopObserver = new IntersectionObserver(
      ([entry]) => {
        clearTimeout(loopTimer);
        if (entry.isIntersecting && window.scrollY > window.innerHeight) {
          loop.classList.add("is-active");
          loopTimer = window.setTimeout(() => scrollTo(0), 1600);
        } else {
          loop.classList.remove("is-active");
        }
      },
      { threshold: 0.86 }
    );
    loopObserver.observe(loop);
  }
}

function updateParallax() {
  // On mobile the cards are stacked in one column; parallax offsets would
  // pull cards over the caption of the card above, so skip it there.
  if (window.matchMedia("(max-width: 900px)").matches) return;
  const scroll = window.scrollY;
  root.querySelectorAll(".project").forEach((node) => {
    const depth = Number(node.dataset.depth || 0);
    const baseY = Number(node.dataset.baseY || 0);
    node.style.setProperty("--y", `${baseY + Math.round(scroll * depth * -0.14)}px`);
  });
}

let frame = 0;
window.addEventListener(
  "scroll",
  () => {
    cancelAnimationFrame(frame);
    frame = requestAnimationFrame(updateParallax);
  },
  { passive: true }
);

window.addEventListener("keydown", (event) => {
  if (event.key === "Escape") {
    overlay = null;
    render();
  }
});

// --- Intro reveal ---
function runIntro() {
  const intro = document.getElementById("intro");
  if (!intro) return;
  const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  const dismiss = () => {
    intro.classList.add("is-done");
    window.setTimeout(() => {
      intro.style.display = "none";
    }, 1100);
  };

  if (reduced) {
    dismiss();
    return;
  }

  const countEl = intro.querySelector(".intro-count");
  const start = performance.now();
  const duration = 1100;
  const tick = (now) => {
    const t = Math.min(1, (now - start) / duration);
    if (countEl) countEl.textContent = String(Math.round(t * 99)).padStart(2, "0");
    if (t < 1) {
      requestAnimationFrame(tick);
    } else {
      dismiss();
    }
  };
  requestAnimationFrame(tick);
}

if (document.fonts && document.fonts.ready) {
  Promise.race([document.fonts.ready, new Promise((r) => setTimeout(r, 1200))]).then(runIntro);
} else {
  window.addEventListener("load", runIntro);
}

// --- Smooth inertia scrolling (Lenis) ---
// Loaded lazily; if the CDN is unreachable the site simply falls back to
// native scrolling instead of breaking.
document.documentElement.classList.add("has-smooth-scroll");
import("https://cdn.jsdelivr.net/npm/lenis@1.1.20/dist/lenis.mjs")
  .then(({ default: Lenis }) => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const lenis = new Lenis({ lerp: 0.1, wheelMultiplier: 1, smoothWheel: true });
    window.__lenis = lenis;
    const raf = (time) => {
      lenis.raf(time);
      requestAnimationFrame(raf);
    };
    requestAnimationFrame(raf);
  })
  .catch(() => {
    document.documentElement.classList.remove("has-smooth-scroll");
  });

render();
