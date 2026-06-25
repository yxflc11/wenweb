import type { Metadata } from "next";
import Link from "next/link";
import { getPosts, formatDate } from "@/lib/posts";

export const metadata: Metadata = {
  title: "Writing",
  description: "Notes on systems, AI automation, and building a one-person company."
};

export default async function BlogIndex() {
  const posts = await getPosts();
  return (
    <main className="page blog-index" id="main">
      <header className="page-head reveal">
        <p className="page-eyebrow">Writing</p>
        <h1 className="page-title">Notes on systems, AI, and building a one-person company.</h1>
        <p className="page-lead">
          Working notes — what I&apos;m learning while turning judgement into repeatable
          systems. Newest first.
        </p>
      </header>

      <ol className="post-list">
        {posts.map((post) => (
          <li className="post-row reveal" key={post.slug}>
            <Link href={`/blog/${post.slug}`} className="post-link">
              <div className="post-main">
                <h2 className="post-title">{post.title}</h2>
                <p className="post-summary">{post.summary}</p>
                <div className="post-tags">
                  {post.tags.map((t) => (
                    <span className="tag" key={t}>
                      {t}
                    </span>
                  ))}
                </div>
              </div>
              <div className="post-meta">
                <time dateTime={post.date}>{formatDate(post.date)}</time>
                <span className="post-arrow" aria-hidden="true">
                  ↗
                </span>
              </div>
            </Link>
          </li>
        ))}
      </ol>
    </main>
  );
}
