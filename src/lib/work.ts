import { createReader } from "@keystatic/core/reader";
import keystaticConfig from "../../keystatic.config";

// Work case-studies managed by Keystatic (src/content/work/*.mdoc).
const reader = createReader(process.cwd(), keystaticConfig);

export type WorkMeta = {
  slug: string;
  title: string;
  year: string;
  category: string;
  role: string;
  date: string;
  summary: string;
  link: string;
};

export async function getWorkPosts(): Promise<WorkMeta[]> {
  const all = await reader.collections.work.all();
  return all.map(({ slug, entry }) => ({
    slug,
    title: entry.title,
    year: entry.year ?? "",
    category: entry.category ?? "",
    role: entry.role ?? "",
    date: entry.date ?? "",
    summary: entry.summary ?? "",
    link: entry.link ?? ""
  }));
}

export async function getWorkPost(slug: string) {
  const entry = await reader.collections.work.read(slug);
  if (!entry) return null;
  const { node } = await entry.content();
  return {
    slug,
    title: entry.title,
    year: entry.year ?? "",
    category: entry.category ?? "",
    role: entry.role ?? "",
    date: entry.date ?? "",
    summary: entry.summary ?? "",
    link: entry.link ?? "",
    node
  };
}
