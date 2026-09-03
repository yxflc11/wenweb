export const identity = {
  brand: "WEN®",
  name: "WEN",
  githubLabel: "github.com/yxflc11",
  githubUrl: "https://github.com/yxflc11",
  email: "yxflc11@gmail.com",
  roles: "ENGINEER / DESIGNER / OPEN-SOURCE",
  heroBrand: "Wen",
  heroStatementLines: ["Still becoming,", "never settling."],
} as const;

export const tabs = [
  { id: "projects", label: "项目" },
  { id: "capabilities", label: "Skill" },
  { id: "writing", label: "文章" },
  { id: "about", label: "关于我" },
  { id: "contact", label: "交流" },
] as const;

export type TabKey = (typeof tabs)[number]["id"];
export type ProjectVisual = "wolfcha" | "textWell" | "vibeHub" | "selector" | "notchNotes";

type PublishedProject = {
  status: "published";
  href: string;
};

type DraftProject = {
  status: "draft";
  href?: never;
};

export type PreviewProject = {
  name: string;
  description: string;
  action: string;
  visual: ProjectVisual;
  year: string;
} & (PublishedProject | DraftProject);

export const projects: readonly PreviewProject[] = [
  {
    name: "AICA 2026",
    description: "把研究采集、内容生成与分发串成一个可重复运行的个人内容系统。",
    action: "查看案例",
    href: "/work/aica-2026",
    status: "published",
    visual: "wolfcha",
    year: "2026",
  },
  {
    name: "Obsidian Knowledge System",
    description: "把捕捉、项目与可复用方法放进同一张知识网络里的个人操作系统。",
    action: "查看案例",
    href: "/work/obsidian-system",
    status: "published",
    visual: "textWell",
    year: "2026",
  },
  {
    name: "Codex · Claude · GPT Stack",
    description: "让不同模型承担合适角色，并共享一套稳定的规划、编辑与验证工作流。",
    action: "查看案例",
    href: "/work/codex-stack",
    status: "published",
    visual: "vibeHub",
    year: "2026",
  },
  {
    name: "Workflow SOP Lab",
    description: "将高频工作整理成可复用的 SOP 与自动化流程。案例说明正在整理中。",
    action: "详情整理中",
    status: "draft",
    visual: "selector",
    year: "2026",
  },
  {
    name: "One-Person Company Toolkit",
    description: "围绕一人公司运营沉淀的模板、清单与内容档案。案例说明正在整理中。",
    action: "详情整理中",
    status: "draft",
    visual: "notchNotes",
    year: "2026",
  },
];

export const capabilities = [
  {
    title: "AI 自动化工作流",
    description: "把重复任务整理成可运行、可检查、可迭代的自动化流程。",
    meta: "WORKFLOW DESIGN",
  },
  {
    title: "Prompt 系统",
    description: "用清晰的输入、行为、输出与失败处理，让 Prompt 成为稳定接口。",
    meta: "PROMPT ENGINEERING",
  },
  {
    title: "Agent 与工具集成",
    description: "组合模型、工具与验证环节，让 Agent 真正完成端到端任务。",
    meta: "TOOL INTEGRATION",
  },
  {
    title: "内容系统架构",
    description: "连接研究、写作、格式化与分发，让内容工作持续复用与积累。",
    meta: "CONTENT SYSTEMS",
  },
  {
    title: "知识库与 SOP",
    description: "把捕捉、项目和方法沉淀成一套长期可维护的工作记忆。",
    meta: "KNOWLEDGE OPS",
  },
  {
    title: "一人公司运营系统",
    description: "减少重复执行的表面积，把有限注意力留给判断与创造。",
    meta: "ONE-PERSON COMPANY",
  },
] as const;

export const articles = [
  {
    date: "2026.05.18",
    title: "Operating like a team of one",
    summary: "一人公司不是做更多，而是让系统吸收重复劳动。",
    href: "/blog/operating-like-a-team-of-one",
  },
  {
    date: "2026.03.09",
    title: "Prompts are interfaces, not spells",
    summary: "把 Prompt 当作定义输入、行为、输出与失败处理的接口。",
    href: "/blog/prompts-are-interfaces",
  },
  {
    date: "2025.12.02",
    title: "Notes on building this site",
    summary: "关于克制、排版，以及为什么每一个动效都需要有理由。",
    href: "/blog/notes-on-building-this-site",
  },
] as const;

export const about = {
  eyebrow: "WEN®",
  statement:
    "我专注于 AI 自动化与 Prompt Engineering，持续构建让一个人能够像团队一样工作的系统。目标不是做更多，而是不再重复解决同一个问题。",
  chips: ["AI Automation", "Prompt Engineering", "Design Systems", "One-Person Company"],
  practices: [
    {
      status: "当前实践",
      name: "Systems & Automation",
      description: "把内容、知识与开发工作拆成能够复用和验证的系统。",
      current: true,
    },
    {
      status: "工作方式",
      name: "Design Engineering",
      description: "在设计判断与工程实现之间保持同一套清晰标准。",
    },
    {
      status: "长期方向",
      name: "One-Person Company",
      description: "用 AI 原生工作流扩大个人能力，同时保留品味与判断力。",
    },
  ],
} as const;

export const collaborations = [
  {
    eyebrow: "PROFESSIONAL / 专业讨论",
    title: "咨询",
    summary: "把 AI 用进开发、设计、运营和产品工作。",
    meta: "一对一语音会议 · 有需要可开视频",
    href: "/contact",
    image: "/sites/oiloil-org-5c46804e/root-8a5edab2/assets/consulting/one-on-one-professional-v2.webp",
  },
  {
    eyebrow: "Q&A COMMUNITY / 交流答疑",
    title: "交流答疑群",
    summary: "带着问题来，一起聊 AI、产品、自媒体和求职。",
    meta: "付费微信群 · ¥99 · 持续答疑",
    href: "/contact",
    image: "/sites/oiloil-org-5c46804e/root-8a5edab2/assets/consulting/free-chat-freedom-v1.webp",
    compact: true,
  },
  {
    eyebrow: "SUPER OIL FRIENDS / 深度交流",
    title: "超级欧友社群",
    summary: "和独立开发者、大厂开发、设计师和产品经理深度交流。",
    meta: "高质量付费社群 · 长期交流 · 可私聊",
    href: "/contact",
    image: "/sites/oiloil-org-5c46804e/root-8a5edab2/assets/consulting/community-growth-v2.webp",
    compact: true,
  },
  {
    eyebrow: "SHARING / 直播与线下",
    title: "直播 / 线下分享",
    summary: "一起把产品、AI 和内容创作聊清楚。",
    meta: "直播连麦 · 线下活动 · 邮件联系",
    href: "/contact",
    image: "/sites/oiloil-org-5c46804e/root-8a5edab2/assets/consulting/live-offline-sharing-v1.webp",
    compact: true,
  },
  {
    eyebrow: "VIBE CODING / 作品投稿",
    title: "作品投稿",
    summary: "分享你认真完成的作品。遇到好的、有趣的作品，我会制作视频分享并推荐给更多人。",
    meta: "免费投稿 · 审核后展示",
    href: "/contact",
    image: "/sites/oiloil-org-5c46804e/root-8a5edab2/assets/consulting/vibe-coding-submission-v1.png",
  },
] as const;

export const elsewhere = [
  { no: "01", icon: "github", label: "GitHub", note: "@yxflc11", href: identity.githubUrl, external: true },
  { no: "02", icon: "x", label: "X", note: "@Yxflc11", href: "https://x.com/Yxflc11", external: true },
  { no: "03", icon: "email", label: "Email", note: identity.email, href: `mailto:${identity.email}` },
  {
    no: "04",
    icon: "bilibili",
    label: "哔哩哔哩",
    note: "WEN 的视频与 AI 实践",
    href: "https://space.bilibili.com/286356781?spm_id_from=333.33.0.0",
    external: true,
  },
  {
    no: "05",
    icon: "xiaohongshu",
    label: "小红书",
    note: "WEN 的小红书主页",
    href: "https://www.xiaohongshu.com/user/profile/6a3d614b000000000f039401?xsec_token=YB7ul2ua3Sc9m2heKh9dhO2F1YFhlOXtGg_yhzThiODzY=&xsec_source=app_share&xhsshare=CopyLink&shareRedId=OEc1RDk2OEs2NzUyOTgwNjZJOTo9OTY6&apptime=1788397609&share_id=bbec0870a9714e858820506d2028ef1c",
    external: true,
  },
  {
    no: "06",
    icon: "douyin",
    label: "抖音",
    note: "WEN 的抖音主页",
    href: "https://www.douyin.com/user/MS4wLjABAAAAoEk5WZai87CVUN-v78RoTDa1U-eOIRBUw_kGlBDNYCVJxvVU2vecgURtavsZpAWl?from_tab_name=main",
    external: true,
  },
] as const;
