import Link from "next/link";

export default function NotFound() {
  return (
    <main className="page notfound" id="main">
      <div className="notfound-inner reveal">
        <p className="notfound-code">404</p>
        <h1 className="notfound-title">This page wandered off.</h1>
        <p className="notfound-lead">
          The link is broken or the page has moved. Here&apos;s the way back.
        </p>
        <div className="notfound-actions">
          <Link className="btn" href="/">
            Home
          </Link>
          <Link className="btn btn--ghost" href="/blog">
            Read the writing
          </Link>
        </div>
      </div>
    </main>
  );
}
