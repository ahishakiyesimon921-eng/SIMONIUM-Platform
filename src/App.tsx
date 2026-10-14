import "./App.css";

import { getPlatformModules } from "./config/platform-modules";

import PlatformHeader from "./components/PlatformHeader";
import ModuleGrid from "./components/ModuleGrid";
import PlatformFooter from "./components/PlatformFooter";

export default function App() {
  const modules = getPlatformModules();

  return (
    <main className="app">
      <PlatformHeader />

      <section className="hero" id="home">
        <p className="eyebrow">
          KNOWLEDGE · COLLABORATION · DISCOVERY
        </p>

        <h1>
          Connecting knowledge.
          <br />
          Enabling discovery.
        </h1>

        <p className="hero-description">
          SIMONIUM is a multidisciplinary platform designed to
          connect health professionals, students, teachers,
          researchers, institutions, and communities through
          organized information, responsible collaboration,
          and scientific discovery.
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
            SIMONIUM begins with four core sectors and is designed
            to support additional sectors in the future.
          </p>
        </div>

        <ModuleGrid modules={modules} />
      </section>

      <section className="platform-principles">
        <div className="section-heading">
          <p className="eyebrow">BUILT FOR COLLABORATION</p>

          <h2>One platform, connected knowledge</h2>

          <p>
            SIMONIUM aims to connect information, people, and
            ideas across different sectors while respecting
            access permissions, data protection, and the need
            to verify information before it is trusted.
          </p>
        </div>

        <div className="module-grid">
          <article className="module-card">
            <span className="module-icon" aria-hidden="true">
              ◈
            </span>

            <h3>Organized Information</h3>

            <p>
              Structure information so that authorized users
              can find and use relevant knowledge.
            </p>
          </article>

          <article className="module-card">
            <span className="module-icon" aria-hidden="true">
              ◎
            </span>

            <h3>Human Collaboration</h3>

            <p>
              Connect people with different knowledge,
              responsibilities, and perspectives.
            </p>
          </article>

          <article className="module-card">
            <span className="module-icon" aria-hidden="true">
              ⌕
            </span>

            <h3>Research and Discovery</h3>

            <p>
              Support the responsible organization, review,
              and exploration of research questions and findings.
            </p>
          </article>
        </div>
      </section>

      <PlatformFooter />
    </main>
  );
            }
