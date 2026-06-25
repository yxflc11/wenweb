import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { getPost, getPosts, formatDate } from "@/lib/posts";
import MarkdocContent from "@/components/MarkdocContent";

export async function generateStaticParams() {
  return (await getPosts()).map((p) => ({ slug: p.slug }));
}

export async function generateMetadata({
  params
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const post = await getPost(slug);
  if (!post) return { title: "Not found" };
  return { title: post.title, description: post.summary };
}

export default async function BlogPostPage({
  params
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const post = await getPost(slug);
  if (!post) notFound();

  const posts = await getPosts();
  const index = posts.findIndex((p) => p.slug === post.slug);
  const next = posts[index - 1]; // newer
  const prev = posts[index + 1]; // older

  return (
    <main className="page article" id="main">
      <Link href="/blog" className="article-back reveal">
        ← Writing
      </Link>

      <header className="article-head reveal">
        <div className="article-tags">
          {post.tags.map((t) => (
            <span className="tag" key={t}>
              {t}
            </span>
          ))}
        </div>
        <h1 className="article-title">{post.title}</h1>
        <div className="article-meta">
          <time dateTime={post.date}>{formatDate(post.date)}</time>
        </div>
      </header>

      <div className="prose reveal">
        <MarkdocContent node={post.node} />
      </div>

      <nav className="article-nav reveal" aria-label="More posts">
        {prev ? (
          <Link href={`/blog/${prev.slug}`} className="article-nav__item">
            <span className="article-nav__dir">← Older</span>
            <span className="article-nav__title">{prev.title}</span>
          </Link>
        ) : (
          <span />
        )}
        {next ? (
          <Link href={`/blog/${next.slug}`} className="article-nav__item article-nav__item--end">
            <span className="article-nav__dir">Newer →</span>
            <span className="article-nav__title">{next.title}</span>
          </Link>
        ) : (
          <span />
        )}
      </nav>
    </main>
  );
}
