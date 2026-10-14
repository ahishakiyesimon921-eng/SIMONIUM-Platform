import "./App.css";

import PlatformHeader from "./components/PlatformHeader";
import PlatformFooter from "./components/PlatformFooter";
import ModuleGrid from "./components/ModuleGrid";

import { getPlatformModules } from "./config/platform-modules";

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
            to support additional sectors in the future without
            rebuilding the entire platform.
          </p>
        </div>

        <ModuleGrid modules={modules} />
      </section>

      <section className="hero" id="vision">
        <p className="eyebrow">OUR VISION</p>

        <h2>Knowledge that connects people and ideas.</h2>

        <p className="hero-description">
          SIMONIUM aims to bring together observations,
          educational activities, research questions, and
          verified findings to support learning, collaboration,
          and responsible innovation.
        </p>

        <div className="hero-note">
          Artificial intelligence is intended to assist human
          intelligence, not replace human judgment.
        </div>
      </section>

      <PlatformFooter />
    </main>
  );
}
