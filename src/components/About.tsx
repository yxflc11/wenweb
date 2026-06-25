import { focus, services } from "../data";

export default function About() {
  return (
    <section className="about" id="about" aria-label="About">
      <div className="section-head reveal">
        <span className="section-index">02</span>
        <h2>About</h2>
      </div>
      <div className="about-grid">
        <p className="about-lead reveal">
          Bingwen He builds AI automation and prompt-engineering systems, working toward life
          as a super-individual running a one-person company.
        </p>
        <div className="about-body reveal" style={{ "--d": "80ms" } as React.CSSProperties}>
          <p>
            My current practice centres on AI automation and prompt engineering — designing
            the workflows, prompt systems, and repeatable processes that let a single person
            operate like a whole team.
          </p>
          <p>
            I'm building toward an AI-native one-person company (OPC), continuously exploring
            the frontier of every new era of AI so the work compounds with the technology
            instead of being left behind by it.
          </p>
        </div>
        <div className="about-meta reveal" style={{ "--d": "160ms" } as React.CSSProperties}>
          <div className="meta-block">
            <h3>Services</h3>
            <ul>
              {services.map((s) => (
                <li key={s}>{s}</li>
              ))}
            </ul>
          </div>
          <div className="meta-block">
            <h3>Focus</h3>
            <ul>
              {focus.map((f) => (
                <li key={f}>{f}</li>
              ))}
            </ul>
          </div>
          <div className="meta-block">
            <h3>Currently</h3>
            <ul>
              <li className="status">
                <span className="status-dot" aria-hidden="true" />
                Open to collaboration
              </li>
              <li>Building AICA 2026</li>
            </ul>
          </div>
        </div>
      </div>
    </section>
  );
}
