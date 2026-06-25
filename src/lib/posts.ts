import { createReader } from "@keystatic/core/reader";
import keystaticConfig from "../../keystatic.config";

// Blog content is now managed by Keystatic (src/content/posts/*.mdoc). We read
// it with Keystatic's reader so the CMS and the site always agree on format.
const reader = createReader(process.cwd(), keystaticConfig);

export type PostMeta = {
  slug: string;
  title: string;
  date: string;
  summary: string;
  tags: string[];
};

export async function getPosts(): Promise<PostMeta[]> {
  const all = await reader.collections.posts.all();
  return all
    .map(({ slug, entry }) => ({
      slug,
      title: entry.title,
      date: entry.date ?? "",
      summary: entry.summary ?? "",
      tags: [...(entry.tags ?? [])]
    }))
    .sort((a, b) => b.date.localeCompare(a.date));
}

export async function getPost(slug: string) {
  const entry = await reader.collections.posts.read(slug);
  if (!entry) return null;
  const { node } = await entry.content();
  return {
    slug,
    title: entry.title,
    date: entry.date ?? "",
    summary: entry.summary ?? "",
    tags: [...(entry.tags ?? [])],
    node
  };
}

export function formatDate(iso: string): string {
  if (!iso) return "";
  const d = new Date(iso + "T00:00:00");
  if (Number.isNaN(d.getTime())) return iso;
  return d.toLocaleDateString("en-US", { year: "numeric", month: "long", day: "numeric" });
}
