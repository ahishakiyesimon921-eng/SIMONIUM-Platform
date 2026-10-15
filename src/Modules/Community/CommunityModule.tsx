import { useState, type FormEvent } from "react";

type CommunityReportStatus =
  | "Submitted"
  | "Under Review"
  | "Correction Required"
  | "Approved"
  | "Rejected";

type CommunityReportCategory =
  | "Public Health"
  | "Education"
  | "Environment"
  | "Infrastructure"
  | "Social Issues"
  | "Other";

type CommunityReport = {
  id: string;
  title: string;
  category: CommunityReportCategory;
  location: string;
  description: string;
  suggestedAction: string;
  createdAt: string;
  status: CommunityReportStatus;
  feedback: string;
};

type CommunityIdea = {
  id: string;
  title: string;
  description: string;
  category: string;
  createdAt: string;
};

type CommunityTab =
  | "overview"
  | "reports"
  | "ideas";

const REPORT_CATEGORIES: CommunityReportCategory[] = [
  "Public Health",
  "Education",
  "Environment",
  "Infrastructure",
  "Social Issues",
  "Other",
];

export default function CommunityModule() {
  const [activeTab, setActiveTab] =
    useState<CommunityTab>("overview");

  const [reports, setReports] =
    useState<CommunityReport[]>([]);

  const [ideas, setIdeas] =
    useState<CommunityIdea[]>([]);

  const [reportTitle, setReportTitle] = useState("");
  const [reportCategory, setReportCategory] =
    useState<CommunityReportCategory>("Other");
  const [reportLocation, setReportLocation] = useState("");
  const [reportDescription, setReportDescription] =
    useState("");
  const [suggestedAction, setSuggestedAction] = useState("");

  const [ideaTitle, setIdeaTitle] = useState("");
  const [ideaCategory, setIdeaCategory] = useState("Other");
  const [ideaDescription, setIdeaDescription] = useState("");

  const [editingReportId, setEditingReportId] =
    useState<string | null>(null);

  const [message, setMessage] = useState("");

  function getCurrentDate() {
    return new Date().toISOString().split("T")[0];
  }

  function resetReportForm() {
    setReportTitle("");
    setReportCategory("Other");
    setReportLocation("");
    setReportDescription("");
    setSuggestedAction("");
    setEditingReportId(null);
  }

  function handleSaveReport(
    event: FormEvent<HTMLFormElement>,
  ) {
    event.preventDefault();

    if (
      !reportTitle.trim() ||
      !reportLocation.trim() ||
      !reportDescription.trim()
    ) {
      setMessage(
        "Please complete the required report fields.",
      );
      return;
    }

    if (editingReportId) {
      setReports((current) =>
        current.map((report) =>
          report.id === editingReportId
            ? {
                ...report,
                title: reportTitle.trim(),
                category: reportCategory,
                location: reportLocation.trim(),
                description: reportDescription.trim(),
                suggestedAction: suggestedAction.trim(),
                status: "Submitted",
                feedback: "",
              }
            : report,
        ),
      );

      setMessage(
        "Report updated and returned for review.",
      );
    } else {
      const newReport: CommunityReport = {
        id: crypto.randomUUID(),
        title: reportTitle.trim(),
        category: reportCategory,
        location: reportLocation.trim(),
        description: reportDescription.trim(),
        suggestedAction: suggestedAction.trim(),
        createdAt: getCurrentDate(),
        status: "Submitted",
        feedback: "",
      };

      setReports((current) => [newReport, ...current]);

      setMessage(
        "Community report submitted for review.",
      );
    }

    resetReportForm();
  }

  function handleEditReport(report: CommunityReport) {
    setEditingReportId(report.id);
    setReportTitle(report.title);
    setReportCategory(report.category);
    setReportLocation(report.location);
    setReportDescription(report.description);
    setSuggestedAction(report.suggestedAction);
    setActiveTab("reports");
    setMessage("You are editing a community report.");
  }

  function handleDeleteReport(reportId: string) {
    const confirmed = window.confirm(
      "Are you sure you want to delete this community report?",
    );

    if (!confirmed) {
      return;
    }

    setReports((current) =>
      current.filter((report) => report.id !== reportId),
    );

    if (editingReportId === reportId) {
      resetReportForm();
    }

    setMessage("Community report deleted.");
  }

  function handleUpdateReportFeedback(
    reportId: string,
    feedback: string,
  ) {
    setReports((current) =>
      current.map((report) =>
        report.id === reportId
          ? { ...report, feedback }
          : report,
      ),
    );
  }

  function handleUpdateReportStatus(
    reportId: string,
    status: CommunityReportStatus,
  ) {
    setReports((current) =>
      current.map((report) =>
        report.id === reportId
          ? { ...report, status }
          : report,
      ),
    );

    setMessage("Report status updated.");
  }

  function handleSaveIdea(
    event: FormEvent<HTMLFormElement>,
  ) {
    event.preventDefault();

    if (!ideaTitle.trim() || !ideaDescription.trim()) {
      setMessage(
        "Please enter an idea title and description.",
      );
      return;
    }

    const newIdea: CommunityIdea = {
      id: crypto.randomUUID(),
      title: ideaTitle.trim(),
      category: ideaCategory,
      description: ideaDescription.trim(),
      createdAt: getCurrentDate(),
    };

    setIdeas((current) => [newIdea, ...current]);

    setIdeaTitle("");
    setIdeaCategory("Other");
    setIdeaDescription("");

    setMessage("Your idea has been added.");
  }

  function handleDeleteIdea(ideaId: string) {
    const confirmed = window.confirm(
      "Are you sure you want to delete this idea?",
    );

    if (!confirmed) {
      return;
    }

    setIdeas((current) =>
      current.filter((idea) => idea.id !== ideaId),
    );

    setMessage("Community idea deleted.");
  }

  const pendingReports = reports.filter(
    (report) =>
      report.status === "Submitted" ||
      report.status === "Under Review",
  ).length;

  const approvedReports = reports.filter(
    (report) => report.status === "Approved",
  ).length;

  const correctionsRequired = reports.filter(
    (report) => report.status === "Correction Required",
  ).length;

  return (
    <main className="app">
      <section className="hero">
        <p className="eyebrow">
          SIMONIUM · COMMUNITY
        </p>

        <h1>Community Engagement</h1>

        <p className="hero-description">
          Connect community observations, local challenges,
          practical ideas, and research opportunities.
          Help turn community knowledge into useful action.
        </p>

        <div className="hero-note">
          Community reports must be reviewed before they
          are treated as verified information.
        </div>
      </section>

      <section className="modules-section">
        <div className="section-heading">
          <p className="eyebrow">
            COMMUNITY WORKSPACE
          </p>

          <h2>Community information and ideas</h2>

          <p>
            Submit reports, suggest improvements, and follow
            the review status of community observations.
          </p>
        </div>

        <nav
          className="module-grid"
          aria-label="Community sections"
        >
          <button
            type="button"
            className="module-card"
            onClick={() => {
              setActiveTab("overview");
              setMessage("");
            }}
          >
            Overview
          </button>

          <button
            type="button"
            className="module-card"
            onClick={() => {
              setActiveTab("reports");
              setMessage("");
            }}
          >
            Community Reports
          </button>

          <button
            type="button"
            className="module-card"
            onClick={() => {
              setActiveTab("ideas");
              setMessage("");
            }}
          >
            Ideas & Suggestions
          </button>
        </nav>

        {message && (
          <p className="hero-note" role="status">
            {message}
          </p>
        )}

        {activeTab === "overview" && (
          <section>
            <h2>Community overview</h2>

            <div className="module-grid">
              <article className="module-card">
                <h3>Total Reports</h3>
                <p>{reports.length}</p>
              </article>

              <article className="module-card">
                <h3>Pending Reviews</h3>
                <p>{pendingReports}</p>
              </article>

              <article className="module-card">
                <h3>Approved Reports</h3>
                <p>{approvedReports}</p>
              </article>

              <article className="module-card">
                <h3>Corrections Required</h3>
                <p>{correctionsRequired}</p>
              </article>

              <article className="module-card">
                <h3>Community Ideas</h3>
                <p>{ideas.length}</p>
              </article>
            </div>

            <div className="hero-note">
              <strong>Privacy reminder:</strong> Do not include
              passwords, private medical records, or unnecessary
              personal information in community reports.
            </div>
          </section>
        )}

        {activeTab === "reports" && (
          <section>
            <h2>
              {editingReportId
                ? "Edit Community Report"
                : "Submit a Community Report"}
            </h2>

            <form
              className="module-card"
              onSubmit={handleSaveReport}
            >
              <label htmlFor="report-title">
                Report title
              </label>

              <input
                id="report-title"
                type="text"
                value={reportTitle}
                onChange={(event) =>
                  setReportTitle(event.target.value)
                }
                placeholder="Describe the issue briefly"
                required
              />

              <label htmlFor="report-category">
                Category
              </label>

              <select
                id="report-category"
                value={reportCategory}
                onChange={(event) =>
                  setReportCategory(
                    event.target.value as CommunityReportCategory,
                  )
                }
              >
                {REPORT_CATEGORIES.map((category) => (
                  <option key={category} value={category}>
                    {category}
                  </option>
                ))}
              </select>

              <label htmlFor="report-location">
                General location
              </label>

              <input
                id="report-location"
                type="text"
                value={reportLocation}
                onChange={(event) =>
                  setReportLocation(event.target.value)
                }
                placeholder="For example: Sector or district"
                required
              />

              <label htmlFor="report-description">
                Description of the issue
              </label>

              <textarea
                id="report-description"
                value={reportDescription}
                onChange={(event) =>
                  setReportDescription(event.target.value)
                }
                placeholder="Explain what was observed"
                required
              />

              <label htmlFor="suggested-action">
                Suggested action (optional)
              </label>

              <textarea
                id="suggested-action"
                value={suggestedAction}
                onChange={(event) =>
                  setSuggestedAction(event.target.value)
                }
                placeholder="What could help address this issue?"
              />

              <button type="submit">
                {editingReportId
                  ? "Save Report Changes"
                  : "Submit Report"}
              </button>

              {editingReportId && (
                <button
                  type="button"
                  onClick={() => {
                    resetReportForm();
                    setMessage("Editing cancelled.");
                  }}
                >
                  Cancel Editing
                </button>
              )}
            </form>

            <h2>Submitted reports</h2>

            {reports.length === 0 ? (
              <p>
                No community reports have been submitted yet.
              </p>
            ) : (
              reports.map((report) => (
                <article
                  className="module-card"
                  key={report.id}
                >
                  <h3>{report.title}</h3>

                  <p>
                    <strong>Category:</strong>{" "}
                    {report.category}
                  </p>

                  <p>
                    <strong>Location:</strong>{" "}
                    {report.location}
                  </p>

                  <p>
                    <strong>Description:</strong>{" "}
                    {report.description}
                  </p>

                  {report.suggestedAction && (
                    <p>
                      <strong>Suggested action:</strong>{" "}
                      {report.suggestedAction}
                    </p>
                  )}

                  <p>
                    <strong>Date submitted:</strong>{" "}
                    {report.createdAt}
                  </p>

                  <p>
                    <strong>Status:</strong>{" "}
                    {report.status}
                  </p>

                  {report.feedback && (
                    <p>
                      <strong>Review feedback:</strong>{" "}
                      {report.feedback}
                    </p>
                  )}

                  <label>
                    Review feedback
                    <textarea
                      value={report.feedback}
                      onChange={(event) =>
                        handleUpdateReportFeedback(
                          report.id,
                          event.target.value,
                        )
                      }
                      placeholder="Enter review feedback"
                    />
                  </label>

                  <label>
                    Review status
                    <select
                      value={report.status}
                      onChange={(event) =>
                        handleUpdateReportStatus(
                          report.id,
                          event.target.value as CommunityReportStatus,
                        )
                      }
                    >
                      <option value="Submitted">
                        Submitted
                      </option>

                      <option value="Under Review">
                        Under Review
                      </option>

                      <option value="Correction Required">
                        Correction Required
                      </option>

                      <option value="Approved">
                        Approved
                      </option>

                      <option value="Rejected">
                        Rejected
                      </option>
                    </select>
                  </label>

                  <button
                    type="button"
                    onClick={() => handleEditReport(report)}
                  >
                    Edit Report
                  </button>

                  <button
                    type="button"
                    onClick={() => handleDeleteReport(report.id)}
                  >
                    Delete Report
                  </button>
                </article>
              ))
            )}
          </section>
        )}

        {activeTab === "ideas" && (
          <section>
            <h2>Share a community idea</h2>

            <form
              className="module-card"
              onSubmit={handleSaveIdea}
            >
              <label htmlFor="idea-title">
                Idea title
              </label>

              <input
                id="idea-title"
                type="text"
                value={ideaTitle}
                onChange={(event) =>
                  setIdeaTitle(event.target.value)
                }
                placeholder="Give your idea a title"
                required
              />

              <label htmlFor="idea-category">
                Category
              </label>

              <select
                id="idea-category"
                value={ideaCategory}
                onChange={(event) =>
                  setIdeaCategory(event.target.value)
                }
              >
                {REPORT_CATEGORIES.map((category) => (
                  <option key={category} value={category}>
                    {category}
                  </option>
                ))}
              </select>

              <label htmlFor="idea-description">
                Describe your idea
              </label>

              <textarea
                id="idea-description"
                value={ideaDescription}
                onChange={(event) =>
                  setIdeaDescription(event.target.value)
                }
                placeholder="Explain how this idea could help"
                required
              />

              <button type="submit">
                Save Community Idea
              </button>
            </form>

            <h2>Community ideas</h2>

            {ideas.length === 0 ? (
              <p>
                No community ideas have been submitted yet.
              </p>
            ) : (
              ideas.map((idea) => (
                <article
                  className="module-card"
                  key={idea.id}
                >
                  <h3>{idea.title}</h3>

                  <p>
                    <strong>Category:</strong>{" "}
                    {idea.category}
                  </p>

                  <p>
                    {idea.description}
                  </p>

                  <p>
                    <strong>Date:</strong> {idea.createdAt}
                  </p>

                  <button
                    type="button"
                    onClick={() => handleDeleteIdea(idea.id)}
                  >
                    Delete Idea
                  </button>
                </article>
              ))
            )}
          </section>
        )}
      </section>
    </main>
  );
}
