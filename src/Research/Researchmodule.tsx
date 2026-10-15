import { useState, type FormEvent } from "react";

type ResearchStatus =
  | "Submitted"
  | "Under Review"
  | "Correction Required"
  | "Approved"
  | "Rejected";

type ResearchQuestion = {
  id: string;
  title: string;
  field: string;
  description: string;
  objective: string;
  createdAt: string;
  status: ResearchStatus;
  feedback: string;
};

type ResearchFinding = {
  id: string;
  questionId: string;
  title: string;
  description: string;
  method: string;
  createdAt: string;
  status: ResearchStatus;
  feedback: string;
};

type ResearchTab = "overview" | "questions" | "findings";

const INITIAL_QUESTIONS: ResearchQuestion[] = [];

const INITIAL_FINDINGS: ResearchFinding[] = [];

export default function ResearchModule() {
  const [activeTab, setActiveTab] =
    useState<ResearchTab>("overview");

  const [questions, setQuestions] =
    useState<ResearchQuestion[]>(INITIAL_QUESTIONS);

  const [findings, setFindings] =
    useState<ResearchFinding[]>(INITIAL_FINDINGS);

  const [questionTitle, setQuestionTitle] = useState("");
  const [questionField, setQuestionField] = useState("");
  const [questionDescription, setQuestionDescription] =
    useState("");
  const [questionObjective, setQuestionObjective] =
    useState("");

  const [findingQuestionId, setFindingQuestionId] =
    useState("");
  const [findingTitle, setFindingTitle] = useState("");
  const [findingDescription, setFindingDescription] =
    useState("");
  const [findingMethod, setFindingMethod] = useState("");

  const [message, setMessage] = useState("");

  function getCurrentDate() {
    return new Date().toISOString().split("T")[0];
  }

  function handleAddQuestion(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    if (
      !questionTitle.trim() ||
      !questionField.trim() ||
      !questionDescription.trim() ||
      !questionObjective.trim()
    ) {
      setMessage("Please complete all research question fields.");
      return;
    }

    const newQuestion: ResearchQuestion = {
      id: crypto.randomUUID(),
      title: questionTitle.trim(),
      field: questionField.trim(),
      description: questionDescription.trim(),
      objective: questionObjective.trim(),
      createdAt: getCurrentDate(),
      status: "Submitted",
      feedback: "",
    };

    setQuestions((current) => [newQuestion, ...current]);

    setQuestionTitle("");
    setQuestionField("");
    setQuestionDescription("");
    setQuestionObjective("");

    setMessage(
      "Research question added. It is awaiting review.",
    );
  }

  function handleAddFinding(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    if (
      !findingQuestionId ||
      !findingTitle.trim() ||
      !findingDescription.trim() ||
      !findingMethod.trim()
    ) {
      setMessage("Please complete all research finding fields.");
      return;
    }

    const relatedQuestion = questions.find(
      (question) => question.id === findingQuestionId,
    );

    if (!relatedQuestion) {
      setMessage("Please select a valid research question.");
      return;
    }

    const newFinding: ResearchFinding = {
      id: crypto.randomUUID(),
      questionId: findingQuestionId,
      title: findingTitle.trim(),
      description: findingDescription.trim(),
      method: findingMethod.trim(),
      createdAt: getCurrentDate(),
      status: "Submitted",
      feedback: "",
    };

    setFindings((current) => [newFinding, ...current]);

    setFindingQuestionId("");
    setFindingTitle("");
    setFindingDescription("");
    setFindingMethod("");

    setMessage(
      "Research finding submitted and awaiting review.",
    );
  }

  function handleUpdateQuestionStatus(
    questionId: string,
    status: ResearchStatus,
  ) {
    setQuestions((current) =>
      current.map((question) =>
        question.id === questionId
          ? { ...question, status }
          : question,
      ),
    );

    setMessage("Research question status updated.");
  }

  function handleUpdateFindingStatus(
    findingId: string,
    status: ResearchStatus,
  ) {
    setFindings((current) =>
      current.map((finding) =>
        finding.id === findingId
          ? { ...finding, status }
          : finding,
      ),
    );

    setMessage("Research finding status updated.");
  }

  function handleUpdateQuestionFeedback(
    questionId: string,
    feedback: string,
  ) {
    setQuestions((current) =>
      current.map((question) =>
        question.id === questionId
          ? { ...question, feedback }
          : question,
      ),
    );
  }

  function handleUpdateFindingFeedback(
    findingId: string,
    feedback: string,
  ) {
    setFindings((current) =>
      current.map((finding) =>
        finding.id === findingId
          ? { ...finding, feedback }
          : finding,
      ),
    );
  }

  function handleDeleteQuestion(questionId: string) {
    const hasFindings = findings.some(
      (finding) => finding.questionId === questionId,
    );

    if (hasFindings) {
      setMessage(
        "This question has linked findings. Remove those findings first.",
      );
      return;
    }

    const confirmed = window.confirm(
      "Are you sure you want to delete this research question?",
    );

    if (!confirmed) {
      return;
    }

    setQuestions((current) =>
      current.filter((question) => question.id !== questionId),
    );

    setMessage("Research question deleted.");
  }

  function handleDeleteFinding(findingId: string) {
    const confirmed = window.confirm(
      "Are you sure you want to delete this research finding?",
    );

    if (!confirmed) {
      return;
    }

    setFindings((current) =>
      current.filter((finding) => finding.id !== findingId),
    );

    setMessage("Research finding deleted.");
  }

  const approvedQuestions = questions.filter(
    (question) => question.status === "Approved",
  ).length;

  const approvedFindings = findings.filter(
    (finding) => finding.status === "Approved",
  ).length;

  const pendingReviews = [
    ...questions,
    ...findings,
  ].filter(
    (item) =>
      item.status === "Submitted" ||
      item.status === "Under Review",
  ).length;

  return (
    <main className="app">
      <section className="hero">
        <p className="eyebrow">
          SIMONIUM · RESEARCH & DISCOVERY
        </p>

        <h1>Research & Discovery</h1>

        <p className="hero-description">
          Organize research questions, document findings,
          and support responsible scientific discovery
          through review and verification.
        </p>

        <div className="hero-note">
          Research records require appropriate review before
          their findings can be treated as verified.
        </div>
      </section>

      <section className="modules-section">
        <div className="section-heading">
          <p className="eyebrow">RESEARCH WORKSPACE</p>

          <h2>Research management</h2>

          <p>
            Create research questions, submit findings,
            and track their review status.
          </p>
        </div>

        <nav
          className="module-grid"
          aria-label="Research sections"
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
              setActiveTab("questions");
              setMessage("");
            }}
          >
            Research Questions
          </button>

          <button
            type="button"
            className="module-card"
            onClick={() => {
              setActiveTab("findings");
              setMessage("");
            }}
          >
            Findings
          </button>
        </nav>

        {message && (
          <p className="hero-note" role="status">
            {message}
          </p>
        )}

        {activeTab === "overview" && (
          <section>
            <h2>Research overview</h2>

            <div className="module-grid">
              <article className="module-card">
                <h3>Research Questions</h3>
                <p>{questions.length}</p>
              </article>

              <article className="module-card">
                <h3>Research Findings</h3>
                <p>{findings.length}</p>
              </article>

              <article className="module-card">
                <h3>Pending Reviews</h3>
                <p>{pendingReviews}</p>
              </article>

              <article className="module-card">
                <h3>Approved Questions</h3>
                <p>{approvedQuestions}</p>
              </article>

              <article className="module-card">
                <h3>Approved Findings</h3>
                <p>{approvedFindings}</p>
              </article>
            </div>

            <div className="hero-note">
              <strong>Important:</strong> Approval in this
              prototype is not proof of scientific validity.
              A secure review process and authorized reviewers
              must be implemented before real-world use.
            </div>
          </section>
        )}

        {activeTab === "questions" && (
          <section>
            <h2>Create a research question</h2>

            <form
              className="module-card"
              onSubmit={handleAddQuestion}
            >
              <label htmlFor="question-title">
                Research question title
              </label>

              <input
                id="question-title"
                type="text"
                value={questionTitle}
                onChange={(event) =>
                  setQuestionTitle(event.target.value)
                }
                placeholder="Enter a research title"
                required
              />

              <label htmlFor="question-field">
                Research field
              </label>

              <input
                id="question-field"
                type="text"
                value={questionField}
                onChange={(event) =>
                  setQuestionField(event.target.value)
                }
                placeholder="For example: Microbiology"
                required
              />

              <label htmlFor="question-description">
                Research question or problem
              </label>

              <textarea
                id="question-description"
                value={questionDescription}
                onChange={(event) =>
                  setQuestionDescription(event.target.value)
                }
                placeholder="Describe the question or problem"
                required
              />

              <label htmlFor="question-objective">
                Research objective
              </label>

              <textarea
                id="question-objective"
                value={questionObjective}
                onChange={(event) =>
                  setQuestionObjective(event.target.value)
                }
                placeholder="Explain what the research aims to discover"
                required
              />

              <button type="submit">
                Save Research Question
              </button>
            </form>

            <h2>Submitted research questions</h2>

            {questions.length === 0 ? (
              <p>No research questions have been added yet.</p>
            ) : (
              questions.map((question) => (
                <article
                  className="module-card"
                  key={question.id}
                >
                  <h3>{question.title}</h3>

                  <p>
                    <strong>Field:</strong> {question.field}
                  </p>

                  <p>
                    <strong>Question:</strong>{" "}
                    {question.description}
                  </p>

                  <p>
                    <strong>Objective:</strong>{" "}
                    {question.objective}
                  </p>

                  <p>
                    <strong>Date:</strong> {question.createdAt}
                  </p>

                  <p>
                    <strong>Status:</strong> {question.status}
                  </p>

                  <label>
                    Review feedback
                    <textarea
                      value={question.feedback}
                      onChange={(event) =>
                        handleUpdateQuestionFeedback(
                          question.id,
                          event.target.value,
                        )
                      }
                      placeholder="Enter review feedback"
                    />
                  </label>

                  <label>
                    Update review status
                    <select
                      value={question.status}
                      onChange={(event) =>
                        handleUpdateQuestionStatus(
                          question.id,
                          event.target.value as ResearchStatus,
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
                    onClick={() =>
                      handleDeleteQuestion(question.id)
                    }
                  >
                    Delete Question
                  </button>
                </article>
              ))
            )}
          </section>
        )}

        {activeTab === "findings" && (
          <section>
            <h2>Submit a research finding</h2>

            <form
              className="module-card"
              onSubmit={handleAddFinding}
            >
              <label htmlFor="finding-question">
                Related research question
              </label>

              <select
                id="finding-question"
                value={findingQuestionId}
                onChange={(event) =>
                  setFindingQuestionId(event.target.value)
                }
                required
              >
                <option value="">
                  Select a research question
                </option>

                {questions.map((question) => (
                  <option
                    key={question.id}
                    value={question.id}
                  >
                    {question.title}
                  </option>
                ))}
              </select>

              <label htmlFor="finding-title">
                Finding title
              </label>

              <input
                id="finding-title"
                type="text"
                value={findingTitle}
                onChange={(event) =>
                  setFindingTitle(event.target.value)
                }
                placeholder="Enter the finding title"
                required
              />

              <label htmlFor="finding-description">
                Finding or observation
              </label>

              <textarea
                id="finding-description"
                value={findingDescription}
                onChange={(event) =>
                  setFindingDescription(event.target.value)
                }
                placeholder="Describe the observed results"
                required
              />

              <label htmlFor="finding-method">
                Method or source of evidence
              </label>

              <textarea
                id="finding-method"
                value={findingMethod}
                onChange={(event) =>
                  setFindingMethod(event.target.value)
                }
                placeholder="Explain how the evidence was collected"
                required
              />

              <button type="submit">
                Submit Research Finding
              </button>
            </form>

            <h2>Research findings</h2>

            {findings.length === 0 ? (
              <p>No research findings have been submitted yet.</p>
            ) : (
              findings.map((finding) => {
                const relatedQuestion = questions.find(
                  (question) =>
                    question.id === finding.questionId,
                );

                return (
                  <article
                    className="module-card"
                    key={finding.id}
                  >
                    <h3>{finding.title}</h3>

                    <p>
                      <strong>Related question:</strong>{" "}
                      {relatedQuestion?.title ??
                        "Research question unavailable"}
                    </p>

                    <p>
                      <strong>Finding:</strong>{" "}
                      {finding.description}
                    </p>

                    <p>
                      <strong>Method or evidence:</strong>{" "}
                      {finding.method}
                    </p>

                    <p>
                      <strong>Date:</strong> {finding.createdAt}
                    </p>

                    <p>
                      <strong>Status:</strong> {finding.status}
                    </p>

                    <label>
                      Review feedback
                      <textarea
                        value={finding.feedback}
                        onChange={(event) =>
                          handleUpdateFindingFeedback(
                            finding.id,
                            event.target.value,
                          )
                        }
                        placeholder="Enter review feedback"
                      />
                    </label>

                    <label>
                      Update review status
                      <select
                        value={finding.status}
                        onChange={(event) =>
                          handleUpdateFindingStatus(
                            finding.id,
                            event.target.value as ResearchStatus,
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
                      onClick={() =>
                        handleDeleteFinding(finding.id)
                      }
                    >
                      Delete Finding
                    </button>
                  </article>
                );
              })
            )}
          </section>
        )}
      </section>
    </main>
  );
}
