import type { Metadata } from "next";
import Link from "next/link";
import ContactForm from "@/components/ContactForm";
import { email, githubUrl } from "@/data";

export const metadata: Metadata = {
  title: "Contact",
  description: "Start a project, a collaboration, or just say hello — Bingwen He."
};

export default function ContactPage() {
  return (
    <main className="page contact-page" id="main">
      <header className="page-head reveal">
        <p className="page-eyebrow">Contact</p>
        <h1 className="page-title contact-headline">Let&apos;s create something extraordinary</h1>
        <p className="page-lead">Tell me about a project, a collaboration, or just say hello.</p>
      </header>

      <ContactForm />

      <div className="contact-links reveal">
        <a className="contact-links__mail" href={`mailto:${email}`}>
          {email}
        </a>
        <div className="contact-links__social">
          <a href={githubUrl} target="_blank" rel="noreferrer">
            GitHub ↗
          </a>
          <Link href="/blog">Writing</Link>
        </div>
      </div>
    </main>
  );
}
