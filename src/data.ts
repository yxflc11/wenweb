export const email = "yxflc11@gmail.com";
export const githubUrl = "https://github.com/yxflc11";
// Formspree endpoint for the contact form.
export const formEndpoint = "https://formspree.io/f/xgobeplp";

// Featured work carries a poster image (served from /public) used for the 3D
// hover preview.
export const images: Record<string, string> = {
  "AICA 2026": "/assets/aica-2026.png",
  "One-Person Company Toolkit": "/assets/company-toolkit.png",
  "Workflow SOP Lab": "/assets/workflow-sop.png",
  "Obsidian Knowledge System": "/assets/obsidian-system.png",
  "Codex · Claude · GPT Stack": "/assets/codex-stack.png",
  "Content Dashboard": "/assets/content-dashboard.png"
};

// Ordered top-level groupings (haoqi-style: work organised by category, each
// item carrying its year and an optional external link).
export const groups = [
  "Systems & Automation",
  "Tools & Engineering",
  "Content & Research",
  "Learning"
] as const;

export type Group = (typeof groups)[number];

export type WorkItem = {
  group: Group;
  year: string;
  title: string;
  category: string;
  type: string;
  image?: string;
  href?: string;
  slug?: string;
};

// Projects with a case-study page (src/content/work/<slug>.md → /work/<slug>).
const detailSlugs: Record<string, string> = {
  "AICA 2026": "aica-2026",
  "Codex · Claude · GPT Stack": "codex-stack",
  "Obsidian Knowledge System": "obsidian-system"
};

// [group, year, title, category, type, href?]
const raw: [Group, string, string, string, string, string?][] = [
  ["Systems & Automation", "2026", "AICA 2026", "AI Content System", "System"],
  ["Systems & Automation", "2026", "Workflow SOP Lab", "Automation", "System"],
  ["Systems & Automation", "2026", "Obsidian Knowledge System", "Personal OS", "System"],
  ["Systems & Automation", "2025", "Agent SOP Board", "Automation", "Workflow"],
  ["Systems & Automation", "2025", "Prompt Library 2.0", "Knowledge", "System"],
  ["Systems & Automation", "2024", "Class Operations OS", "Coordination", "System"],
  ["Systems & Automation", "2023", "Knowledge Base Starter", "Obsidian", "System"],
  ["Tools & Engineering", "2026", "Codex · Claude · GPT Stack", "Developer Tooling", "Tool", githubUrl],
  ["Tools & Engineering", "2026", "Content Dashboard", "Analytics", "Dashboard"],
  ["Tools & Engineering", "2024", "Frontend Component Notes", "Web", "Study"],
  ["Content & Research", "2026", "One-Person Company Toolkit", "Content Archive", "Archive"],
  ["Content & Research", "2025", "Account Positioning Map", "Content Research", "Research"],
  ["Content & Research", "2025", "Xiaohongshu Card System", "Visual Template", "Template"],
  ["Content & Research", "2023", "Student Affairs Templates", "Management", "SOP"],
  ["Learning", "2024", "MySQL Study Notes", "Database", "Learning"],
  ["Learning", "2024", "C Language Foundation", "Programming", "Learning"]
];

export const work: WorkItem[] = raw.map(([group, year, title, category, type, href]) => ({
  group,
  year,
  title,
  category,
  type,
  image: images[title],
  href,
  slug: detailSlugs[title]
}));

export const workByGroup = groups.map((group) => ({
  group,
  items: work.filter((w) => w.group === group)
}));

export const services = [
  "AI automation workflow design",
  "Prompt engineering & prompt systems",
  "AI agent and tool integration",
  "Content system architecture",
  "Knowledge-base and SOP design",
  "One-person company operating systems"
];

export const focus = ["AI automation", "Prompt engineering", "One-person company"];
