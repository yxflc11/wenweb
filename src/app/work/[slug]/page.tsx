import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { getWorkPost, getWorkPosts } from "@/lib/work";
import { formatDate } from "@/lib/posts";
import MarkdocContent from "@/components/MarkdocContent";

export async function generateStaticParams() {
  return (await getWorkPosts()).map((p) => ({ slug: p.slug }));
}

export async function generateMetadata({
  params
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const post = await getWorkPost(slug);
  if (!post) return { title: "Not found" };
  return { title: post.title, description: post.summary };
}

export default async function WorkDetail({
  params
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const post = await getWorkPost(slug);
  if (!post) notFound();

  return (
    <main className="page article" id="main">
      <Link href="/#work" className="article-back reveal">
        ← Work
      </Link>

      <header className="article-head reveal">
        <div className="article-tags">
          <span className="tag">{post.category}</span>
          {post.role ? <span className="tag">{post.role}</span> : null}
        </div>
        <h1 className="article-title">{post.title}</h1>
        <div className="article-meta">
          <span>{post.year}</span>
          {post.date ? (
            <>
              <span aria-hidden="true">·</span>
              <time dateTime={post.date}>{formatDate(post.date)}</time>
            </>
          ) : null}
          {post.link ? (
            <>
              <span aria-hidden="true">·</span>
              <a href={post.link} target="_blank" rel="noreferrer" className="article-extlink">
                Visit ↗
              </a>
            </>
          ) : null}
        </div>
      </header>

      <div className="prose reveal">
        <MarkdocContent node={post.node} />
      </div>

      <nav className="article-nav reveal" aria-label="More">
        <Link href="/#work" className="article-nav__item">
          <span className="article-nav__dir">← Back</span>
          <span className="article-nav__title">All work</span>
        </Link>
        <Link href="/#contact" className="article-nav__item article-nav__item--end">
          <span className="article-nav__dir">Enquire →</span>
          <span className="article-nav__title">Start a project</span>
        </Link>
      </nav>
    </main>
  );
}
