import { useState } from "react";
import type { FormEvent } from "react";

type HealthReport = {
  id: string;
  title: string;
  category: string;
  description: string;
  location: string;
  createdAt: string;
  status: "Submitted";
};

type ResearchRequest = {
  id: string;
  topic: string;
  requestType: string;
  details: string;
  createdAt: string;
  status: "Submitted";
};

export default function HealthModule() {
  const [activeTab, setActiveTab] = useState<
    "overview" | "reports" | "research"
  >("overview");

  const [reports, setReports] = useState<HealthReport[]>([]);
  const [requests, setRequests] = useState<ResearchRequest[]>([]);

  const [reportTitle, setReportTitle] = useState("");
  const [reportCategory, setReportCategory] = useState("Disease observation");
  const [reportDescription, setReportDescription] = useState("");
  const [reportLocation, setReportLocation] = useState("");

  const [researchTopic, setResearchTopic] = useState("");
  const [requestType, setRequestType] = useState("Treatment research");
  const [researchDetails, setResearchDetails] = useState("");

  const [message, setMessage] = useState("");

  function handleReportSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    const newReport: HealthReport = {
      id: crypto.randomUUID(),
      title: reportTitle.trim(),
      category: reportCategory,
      description: reportDescription.trim(),
      location: reportLocation.trim(),
      createdAt: new Date().toISOString(),
      status: "Submitted",
    };

    setReports((previous) => [newReport, ...previous]);

    setReportTitle("");
    setReportCategory("Disease observation");
    setReportDescription("");
    setReportLocation("");

    setMessage(
      "Health observation added to this temporary prototype session."
    );

    setActiveTab("reports");
  }

  function handleResearchSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    const newRequest: ResearchRequest = {
      id: crypto.randomUUID(),
      topic: researchTopic.trim(),
      requestType,
      details: researchDetails.trim(),
      createdAt: new Date().toISOString(),
      status: "Submitted",
    };

    setRequests((previous) => [newRequest, ...previous]);

    setResearchTopic("");
    setRequestType("Treatment research");
    setResearchDetails("");

    setMessage(
      "Research request added to this temporary prototype session."
    );

    setActiveTab("research");
  }

  return (
    <main className="app health-module">
      <header className="header">
        <a className="brand" href="#health-home">
          <span className="brand-mark">S</span>
          <span>SIMONIUM</span>
        </a>

        <span className="platform-label">Health Module</span>
      </header>

      <section className="hero" id="health-home">
        <p className="eyebrow">HEALTH · COLLABORATION · DISCOVERY</p>

        <h1>
          Health information.
          <br />
          Connected discovery.
        </h1>

        <p className="hero-description">
          A dedicated space designed to help authorized health
          professionals organize health observations and connect
          research questions with responsible scientific collaboration.
        </p>

        <div className="hero-note">
          Health Module — Early Development Prototype
        </div>
      </section>

      <section className="modules-section">
        <div className="section-heading">
          <p className="eyebrow">HEALTH WORKSPACE</p>
          <h2>Health Professional Centre</h2>

          <p>
            Record health observations, organize research requests,
            and prepare information for future review and verification.
          </p>
        </div>

        <div className="module-grid">
          <article className="module-card">
            <span className="module-icon" aria-hidden="true">
              +
            </span>

            <h3>Health Observations</h3>

            <p>
              Record observations about diseases, unusual health
              problems, and issues that may require investigation.
            </p>

            <strong>{reports.length} temporary records</strong>
          </article>

          <article className="module-card">
            <span className="module-icon" aria-hidden="true">
              ⌕
            </span>

            <h3>Research Collaboration</h3>

            <p>
              Prepare questions about treatments, medicines,
              vaccines, and other health research topics.
            </p>

            <strong>{requests.length} temporary requests</strong>
          </article>

          <article className="module-card">
            <span className="module-icon" aria-hidden="true">
              ✓
            </span>

            <h3>Review and Verification</h3>

            <p>
              Prepare submitted information for future assessment
              by authorized reviewers and research institutions.
            </p>

            <strong>Verification workflow planned</strong>
          </article>
        </div>
      </section>

      <section className="modules-section">
        <div className="section-heading">
          <p className="eyebrow">HEALTH OPERATIONS</p>
          <h2>Manage health information</h2>
        </div>

        <div
          className="module-grid"
          role="navigation"
          aria-label="Health module navigation"
        >
          <button
            type="button"
            className="module-card"
            onClick={() => {
              setActiveTab("overview");
              setMessage("");
            }}
          >
            <h3>Overview</h3>
            <p>Return to the Health Module workspace.</p>
          </button>

          <button
            type="button"
            className="module-card"
            onClick={() => {
              setActiveTab("reports");
              setMessage("");
            }}
          >
            <h3>Health Observations</h3>
            <p>Create and review temporary health observation records.</p>
          </button>

          <button
            type="button"
            className="module-card"
            onClick={() => {
              setActiveTab("research");
              setMessage("");
            }}
          >
            <h3>Research Requests</h3>
            <p>Prepare research questions and collaboration requests.</p>
          </button>
        </div>
      </section>

      {message && (
        <section className="modules-section" aria-live="polite">
          <div className="hero-note">{message}</div>
        </section>
      )}

      {activeTab === "overview" && (
        <section className="modules-section">
          <div className="section-heading">
            <h2>Health Module Workflow</h2>

            <p>
              Health observations and research requests will need
              review and verification before being accepted into
              a trusted shared research database.
            </p>
          </div>

          <div className="module-card">
            <h3>Current development status</h3>

            <p>
              The forms and temporary session records are part
              of the frontend prototype. User authentication,
              secure storage, permissions, and shared database
              services have not yet been connected.
            </p>
          </div>
        </section>
      )}

      {activeTab === "reports" && (
        <section className="modules-section">
          <div className="section-heading">
            <p className="eyebrow">HEALTH OBSERVATIONS</p>
            <h2>Submit a Health Observation</h2>

            <p>
              Provide a clear description of a health problem
              that may require professional investigation.
            </p>
          </div>

          <form className="module-card" onSubmit={handleReportSubmit}>
            <label htmlFor="report-title">
              Observation title
            </label>

            <input
              id="report-title"
              name="reportTitle"
              type="text"
              value={reportTitle}
              onChange={(event) => setReportTitle(event.target.value)}
              placeholder="Enter a general observation title"
              required
              maxLength={150}
            />

            <label htmlFor="report-category">
              Observation category
            </label>

            <select
              id="report-category"
              name="reportCategory"
              value={reportCategory}
              onChange={(event) => setReportCategory(event.target.value)}
              required
            >
              <option>Disease observation</option>
              <option>Unusual health problem</option>
              <option>Public health concern</option>
              <option>Laboratory research observation</option>
              <option>Other health research topic</option>
            </select>

            <label htmlFor="report-location">
              General location (optional)
            </label>

            <input
              id="report-location"
              name="reportLocation"
              type="text"
              value={reportLocation}
              onChange={(event) => setReportLocation(event.target.value)}
              placeholder="For example, district or health facility"
              maxLength={150}
            />

            <label htmlFor="report-description">
              Observation details
            </label>

            <textarea
              id="report-description"
              name="reportDescription"
              value={reportDescription}
              onChange={(event) =>
                setReportDescription(event.target.value)
              }
              placeholder="Describe what was observed, when it occurred, and why it may need investigation."
              rows={6}
              required
              maxLength={5000}
            />

            <p>
              Do not include patient names, identification numbers,
              contact details, or other information that identifies
              an individual.
import { useState } from "react";
import type { FormEvent } from "react";

type HealthReport = {
  id: string;
  title: string;
  category: string;
  description: string;
  location: string;
  createdAt: string;
  status: "Submitted";
};

type ResearchRequest = {
  id: string;
  topic: string;
  requestType: string;
  details: string;
  createdAt: string;
  status: "Submitted";
};

export default function HealthModule() {
  const [activeTab, setActiveTab] = useState<
    "overview" | "reports" | "research"
  >("overview");

  const [reports, setReports] = useState<HealthReport[]>([]);
  const [requests, setRequests] = useState<ResearchRequest[]>([]);

  const [reportTitle, setReportTitle] = useState("");
  const [reportCategory, setReportCategory] = useState("Disease observation");
  const [reportDescription, setReportDescription] = useState("");
  const [reportLocation, setReportLocation] = useState("");

  const [researchTopic, setResearchTopic] = useState("");
  const [requestType, setRequestType] = useState("Treatment research");
  const [researchDetails, setResearchDetails] = useState("");

  const [message, setMessage] = useState("");

  function handleReportSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    const newReport: HealthReport = {
      id: crypto.randomUUID(),
      title: reportTitle.trim(),
      category: reportCategory,
      description: reportDescription.trim(),
      location: reportLocation.trim(),
      createdAt: new Date().toISOString(),
      status: "Submitted",
    };

    setReports((previous) => [newReport, ...previous]);

    setReportTitle("");
    setReportCategory("Disease observation");
    setReportDescription("");
    setReportLocation("");

    setMessage(
      "Health observation added to this temporary prototype session."
    );

    setActiveTab("reports");
  }

  function handleResearchSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    const newRequest: ResearchRequest = {
      id: crypto.randomUUID(),
      topic: researchTopic.trim(),
      requestType,
      details: researchDetails.trim(),
      createdAt: new Date().toISOString(),
      status: "Submitted",
    };

    setRequests((previous) => [newRequest, ...previous]);

    setResearchTopic("");
    setRequestType("Treatment research");
    setResearchDetails("");

    setMessage(
      "Research request added to this temporary prototype session."
    );

    setActiveTab("research");
  }

  return (
    <main className="app health-module">
      <header className="header">
        <a className="brand" href="#health-home">
          <span className="brand-mark">S</span>
          <span>SIMONIUM</span>
        </a>

        <span className="platform-label">Health Module</span>
      </header>

      <section className="hero" id="health-home">
        <p className="eyebrow">HEALTH · COLLABORATION · DISCOVERY</p>

        <h1>
          Health information.
          <br />
          Connected discovery.
        </h1>

        <p className="hero-description">
          A dedicated space designed to help authorized health
          professionals organize health observations and connect
          research questions with responsible scientific collaboration.
        </p>

        <div className="hero-note">
          Health Module — Early Development Prototype
        </div>
      </section>

      <section className="modules-section">
        <div className="section-heading">
          <p className="eyebrow">HEALTH WORKSPACE</p>
          <h2>Health Professional Centre</h2>

          <p>
            Record health observations, organize research requests,
            and prepare information for future review and verification.
          </p>
        </div>

        <div className="module-grid">
          <article className="module-card">
            <span className="module-icon" aria-hidden="true">
              +
            </span>

            <h3>Health Observations</h3>

            <p>
              Record observations about diseases, unusual health
              problems, and issues that may require investigation.
            </p>

            <strong>{reports.length} temporary records</strong>
          </article>

          <article className="module-card">
            <span className="module-icon" aria-hidden="true">
              ⌕
            </span>

            <h3>Research Collaboration</h3>

            <p>
              Prepare questions about treatments, medicines,
              vaccines, and other health research topics.
            </p>

            <strong>{requests.length} temporary requests</strong>
          </article>

          <article className="module-card">
            <span className="module-icon" aria-hidden="true">
              ✓
            </span>

            <h3>Review and Verification</h3>

            <p>
              Prepare submitted information for future assessment
              by authorized reviewers and research institutions.
            </p>

            <strong>Verification workflow planned</strong>
          </article>
        </div>
      </section>

      <section className="modules-section">
        <div className="section-heading">
          <p className="eyebrow">HEALTH OPERATIONS</p>
          <h2>Manage health information</h2>
        </div>

        <div
          className="module-grid"
          role="navigation"
          aria-label="Health module navigation"
        >
          <button
            type="button"
            className="module-card"
            onClick={() => {
              setActiveTab("overview");
              setMessage("");
            }}
          >
            <h3>Overview</h3>
            <p>Return to the Health Module workspace.</p>
          </button>

          <button
            type="button"
            className="module-card"
            onClick={() => {
              setActiveTab("reports");
              setMessage("");
            }}
          >
            <h3>Health Observations</h3>
            <p>Create and review temporary health observation records.</p>
          </button>

          <button
            type="button"
            className="module-card"
            onClick={() => {
              setActiveTab("research");
              setMessage("");
            }}
          >
            <h3>Research Requests</h3>
            <p>Prepare research questions and collaboration requests.</p>
          </button>
        </div>
      </section>

      {message && (
        <section className="modules-section" aria-live="polite">
          <div className="hero-note">{message}</div>
        </section>
      )}

      {activeTab === "overview" && (
        <section className="modules-section">
          <div className="section-heading">
            <h2>Health Module Workflow</h2>

            <p>
              Health observations and research requests will need
              review and verification before being accepted into
              a trusted shared research database.
            </p>
          </div>

          <div className="module-card">
            <h3>Current development status</h3>

            <p>
              The forms and temporary session records are part
              of the frontend prototype. User authentication,
              secure storage, permissions, and shared database
              services have not yet been connected.
            </p>
          </div>
        </section>
      )}

      {activeTab === "reports" && (
        <section className="modules-section">
          <div className="section-heading">
            <p className="eyebrow">HEALTH OBSERVATIONS</p>
            <h2>Submit a Health Observation</h2>

            <p>
              Provide a clear description of a health problem
              that may require professional investigation.
            </p>
          </div>

          <form className="module-card" onSubmit={handleReportSubmit}>
            <label htmlFor="report-title">
              Observation title
            </label>

            <input
              id="report-title"
              name="reportTitle"
              type="text"
              value={reportTitle}
              onChange={(event) => setReportTitle(event.target.value)}
              placeholder="Enter a general observation title"
              required
              maxLength={150}
            />

            <label htmlFor="report-category">
              Observation category
            </label>

            <select
              id="report-category"
              name="reportCategory"
              value={reportCategory}
              onChange={(event) => setReportCategory(event.target.value)}
              required
            >
              <option>Disease observation</option>
              <option>Unusual health problem</option>
              <option>Public health concern</option>
              <option>Laboratory research observation</option>
              <option>Other health research topic</option>
            </select>

            <label htmlFor="report-location">
              General location (optional)
            </label>

            <input
              id="report-location"
              name="reportLocation"
              type="text"
              value={reportLocation}
              onChange={(event) => setReportLocation(event.target.value)}
              placeholder="For example, district or health facility"
              maxLength={150}
            />

            <label htmlFor="report-description">
              Observation details
            </label>

            <textarea
              id="report-description"
              name="reportDescription"
              value={reportDescription}
              onChange={(event) =>
                setReportDescription(event.target.value)
              }
              placeholder="Describe what was observed, when it occurred, and why it may need investigation."
              rows={6}
              required
              maxLength={5000}
            />

            <p>
              Do not include patient names, identification numbers,
              contact details, or other information that identifies
              an individual.
            </p>

            <button type="submit">
              Submit Observation
            </button>
          </form>

          <div className="section-heading">
            <h2>Observation Records</h2>
            <p>
              {reports.length} record(s) created in this session.
            </p>
          </div>

          {reports.length === 0 ? (
            <p>No observations have been added in this session.</p>
          ) : (
            reports.map((report) => (
              <article className="module-card" key={report.id}>
                <h3>{report.title}</h3>

                <p>
                  <strong>Category:</strong> {report.category}
                </p>

                <p>
                  <strong>Location:</strong>{" "}
                  {report.location || "Not provided"}
                </p>

                <p>{report.description}</p>

                <p>
                  <strong>Status:</strong> {report.status}
                </p>

                <small>
                  Created: {new Date(report.createdAt).toLocaleString()}
                </small>

                <button
                  type="button"
                  onClick={() => {
                    setReports((previous) =>
                      previous.filter((item) => item.id !== report.id)
                    );
                    setMessage("Temporary observation record deleted.");
                  }}
                >
                  Delete Record
                </button>
              </article>
            ))
          )}
        </section>
      )}

      {activeTab === "research" && (
        <section className="modules-section">
          <div className="section-heading">
            <p className="eyebrow">RESEARCH COLLABORATION</p>
            <h2>Prepare a Research Request</h2>

            <p>
              Describe a health research question that may benefit
              from collaboration with qualified professionals
              or research institutions.
            </p>
          </div>

          <form className="module-card" onSubmit={handleResearchSubmit}>
            <label htmlFor="research-topic">
              Research topic
            </label>

            <input
              id="research-topic"
              name="researchTopic"
              type="text"
              value={researchTopic}
              onChange={(event) => setResearchTopic(event.target.value)}
              placeholder="Enter the research topic"
              required
              maxLength={150}
            />

            <label htmlFor="request-type">
              Type of research support
            </label>

            <select
              id="request-type"
              name="requestType"
              value={requestType}
              onChange={(event) => setRequestType(event.target.value)}
              required
            >
              <option>Treatment research</option>
              <option>Medicine research</option>
              <option>Vaccine research</option>
              <option>Disease investigation</option>
              <option>Diagnostic research</option>
              <option>Public health research</option>
              <option>Other scientific collaboration</option>
            </select>

            <label htmlFor="research-details">
              Explain the research question
            </label>

            <textarea
              id="research-details"
              name="researchDetails"
              value={researchDetails}
              onChange={(event) => setResearchDetails(event.target.value)}
              placeholder="Describe the question, existing evidence, and the type of collaboration needed."
              rows={6}
              required
              maxLength={5000}
            />

            <p>
              Research requests do not establish that a treatment,
              medicine, or vaccine is effective. Scientific review
              and appropriate approvals are necessary.
            </p>

            <button type="submit">
              Submit Research Request
            </button>
          </form>

          <div className="section-heading">
            <h2>Research Request Records</h2>
            <p>
              {requests.length} request(s) created in this session.
            </p>
          </div>

          {requests.length === 0 ? (
            <p>No research requests have been added in this session.</p>
          ) : (
            requests.map((request) => (
              <article className="module-card" key={request.id}>
                <h3>{request.topic}</h3>

                <p>
                  <strong>Research support:</strong> {request.requestType}
                </p>

                <p>{request.details}</p>

                <p>
                  <strong>Status:</strong> {request.status}
                </p>

                <small>
                  Created: {new Date(request.createdAt).toLocaleString()}
                </small>

                <button
                  type="button"
                  onClick={() => {
                    setRequests((previous) =>
                      previous.filter((item) => item.id !== request.id)
                    );
                    setMessage("Temporary research request deleted.");
                  }}
                >
                  Delete Request
                </button>
              </article>
            ))
          )}
        </section>
      )}

      <footer className="footer">
        <strong>SIMONIUM Health</strong>

        <p>
          Health information management, responsible collaboration,
          and scientific research support.
        </p>

        <small>
          Development prototype. Not a clinical decision-making
          system or a substitute for professional medical judgment.
        </small>
      </footer>
    </main>
  );
}￼Enter            </p>

            <button type="submit">
              Submit Observation
            </button>
          </form>

          <div className="section-heading">
            <h2>Observation Records</h2>
            <p>
              {reports.length} record(s) created in this session.
            </p>
          </div>

          {reports.length === 0 ? (
            <p>No observations have been added in this session.</p>
          ) : (
            reports.map((report) => (
              <article className="module-card" key={report.id}>
                <h3>{report.title}</h3>

                <p>
                  <strong>Category:</strong> {report.category}
                </p>

                <p>
                  <strong>Location:</strong>{" "}
                  {report.location || "Not provided"}
                </p>

                <p>{report.description}</p>

                <p>
                  <strong>Status:</strong> {report.status}
                </p>

                <small>
                  Created: {new Date(report.createdAt).toLocaleString()}
                </small>

                <button
                  type="button"
                  onClick={() => {
                    setReports((previous) =>
                      previous.filter((item) => item.id !== report.id)
                    );
                    setMessage("Temporary observation record deleted.");
                  }}
                >
                  Delete Record
                </button>
              </article>
            ))
          )}
        </section>
      )}

      {activeTab === "research" && (
        <section className="modules-section">
          <div className="section-heading">
            <p className="eyebrow">RESEARCH COLLABORATION</p>
            <h2>Prepare a Research Request</h2>

            <p>
        Describe a health research question that may benefit
              from collaboration with qualified professionals
              or research institutions.
            </p>
          </div>

          <form className="module-card" onSubmit={handleResearchSubmit}>
            <label htmlFor="research-topic">
              Research topic
            </label>

            <input
              id="research-topic"
              name="researchTopic"
              type="text"
              value={researchTopic}
              onChange={(event) => setResearchTopic(event.target.value)}
              placeholder="Enter the research topic"
              required
              maxLength={150}
            />

            <label htmlFor="request-type">
              Type of research support
            </label>

            <select
              id="request-type"
              name="requestType"
              value={requestType}
              onChange={(event) => setRequestType(event.target.value)}
              required
            >
              <option>Treatment research</option>
              <option>Medicine research</option>
              <option>Vaccine research</option>
              <option>Disease investigation</option>
              <option>Diagnostic research</option>
              <option>Public health research</option>
              <option>Other scientific collaboration</option>
            </select>

            <label htmlFor="research-details">
              Explain the research question
            </label>

            <textarea
              id="research-details"
              name="researchDetails"
              value={researchDetails}
              onChange={(event) => setResearchDetails(event.target.value)}
              placeholder="Describe the question, existing evidence, and the type of collaboration needed."
              rows={6}
              required
              maxLength={5000}
            />

            <p>
              Research requests do not establish that a treatment,
              medicine, or vaccine is effective. Scientific review
              and appropriate approvals are necessary.
            </p>

            <button type="submit">
