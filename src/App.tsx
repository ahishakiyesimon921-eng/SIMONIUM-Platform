
import "./App.css";

const modules = [
  {
    name: "Health",
    description:
      "Support authorized health professionals and responsible health research.",
    icon: "✚",
  },
  {
    name: "Education",
    description:
      "Connect students, teachers, learning activities, and academic reviews.",
    icon: "▤",
  },
  {
    name: "Research & Discovery",
    description:
      "Organize research questions, scientific information, and verified findings.",
    icon: "⌕",
  },
  {
    name: "Community",
    description:
      "Connect community observations, local challenges, and ideas for investigation.",
    icon: "◎",
  },
];

export default function App() {
  return (
    <main className="app">
      <header className="header">
        <a className="brand" href="#home">
          <span className="brand-mark">S</span>
          <span>SIMONIUM</span>
        </a>

        <span className="platform-label">Platform Preview</span>
      </header>

      <section className="hero" id="home">
        <p className="eyebrow">KNOWLEDGE · COLLABORATION · DISCOVERY</p>

        <h1>
          Connecting knowledge.
          <br />
          Enabling discovery.
        </h1>

        <p className="hero-description">
          A multidisciplinary platform designed to connect health,
          education, research, and communities through organized
          information and responsible collaboration.
        </p>

        <div className="hero-note">
          Website and mobile app development in progress.
        </div>
      </section>

      <section className="modules-section" id="modules">
        <div className="section-heading">
          <p className="eyebrow">ONE CONNECTED PLATFORM</p>
          <h2>Explore our sectors</h2>
          <p>
            Start with four core modules, with room to expand into
            additional sectors in the future.
          </p>
        </div>

        <div className="module-grid">
          {modules.map((module) => (
            <article className="module-card" key={module.name}>
              <span className="module-icon" aria-hidden="true">
                {module.icon}
              </span>
              <h3>{module.name}</h3>
              <p>{module.description}</p>
              <span className="module-status">Planned module</span>
            </article>
          ))}
        </div>
      </section>

      <footer className="footer">
        <strong>SIMONIUM</strong>
        <p>
          Scientific Information Management, Organization, Network,
          Intelligence and Unified Multidisciplinary Platform.
        </p>
        <small>
          Early development preview. Secure services and user
          authentication are not yet configured.
        </small>
      </footer>
    </main>
  );
}
￼Enter
