"use client";

import { useState } from "react";
import { email, formEndpoint } from "@/data";
import { useUI } from "./ui-context";

type Status = { text: string; state: "" | "ok" | "error" };

// The contact form. Backend is Formspree today and intentionally swappable —
// point `action` at a custom API route later to store messages yourself.
export default function ContactForm() {
  const { tick } = useUI();
  const [status, setStatus] = useState<Status>({ text: "", state: "" });

  const onSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const form = e.currentTarget;
    if (!form.checkValidity()) {
      setStatus({ text: "Please fill in your name, a valid email, and a message.", state: "error" });
      form.reportValidity();
      return;
    }
    setStatus({ text: "Sending…", state: "" });
    try {
      const res = await fetch(form.action, {
        method: "POST",
        body: new FormData(form),
        headers: { Accept: "application/json" }
      });
      if (res.ok) {
        form.reset();
        setStatus({ text: "Thanks — your message is on its way.", state: "ok" });
        tick(560);
      } else {
        setStatus({ text: `Couldn't send right now. Email me at ${email} instead.`, state: "error" });
      }
    } catch {
      setStatus({ text: `Network error. Email me at ${email} instead.`, state: "error" });
    }
  };

  return (
    <form className="contact-form reveal" action={formEndpoint} method="POST" noValidate onSubmit={onSubmit}>
      <div className="field">
        <label htmlFor="cf-name">Your name</label>
        <input id="cf-name" name="name" type="text" autoComplete="name" required />
      </div>
      <div className="field">
        <label htmlFor="cf-email">Email</label>
        <input id="cf-email" name="email" type="email" autoComplete="email" required />
      </div>
      <div className="field field--wide">
        <label htmlFor="cf-topic">What&apos;s this about?</label>
        <select id="cf-topic" name="topic" defaultValue="AI automation project">
          <option>AI automation project</option>
          <option>Prompt engineering</option>
          <option>Collaboration</option>
          <option>Just saying hello</option>
        </select>
      </div>
      <div className="field field--wide">
        <label htmlFor="cf-message">Message</label>
        <textarea id="cf-message" name="message" rows={5} required />
      </div>
      <button className="btn contact-submit" type="submit">
        Send message →
      </button>
      <p className="contact-status" aria-live="polite" data-state={status.state}>
        {status.text}
      </p>
    </form>
  );
}
