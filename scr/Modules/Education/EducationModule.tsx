import { useState, type FormEvent } from "react";

type ActivityStatus = "Open" | "Closed";

type ReviewStatus =
  | "Submitted"
  | "Under Review"
  | "Approved"
  | "Correction Required";

interface LearningActivity {
  id: string;
  title: string;
  description: string;
  subject: string;
  createdAt: string;
  status: ActivityStatus;
}

interface StudentSubmission {
  id: string;
  activityId: string;
  studentName: string;
  response: string;
  submittedAt: string;
  reviewStatus: ReviewStatus;
  feedback: string;
}

export default function EducationModule() {
  const [activeTab, setActiveTab] = useState<
    "overview" | "activities" | "submissions"
  >("overview");

  const [activities, setActivities] = useState<
    LearningActivity[]
  >([]);

  const [submissions, setSubmissions] = useState<
    StudentSubmission[]
  >([]);

  const [activityTitle, setActivityTitle] = useState("");
  const [activityDescription, setActivityDescription] =
    useState("");
  const [activitySubject, setActivitySubject] = useState("");

  const [studentName, setStudentName] = useState("");
  const [selectedActivity, setSelectedActivity] = useState("");
  const [studentResponse, setStudentResponse] = useState("");

  const [feedbackDrafts, setFeedbackDrafts] = useState<
    Record<string, string>
  >({});

  function handleCreateActivity(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    if (
      !activityTitle.trim() ||
      !activityDescription.trim() ||
      !activitySubject.trim()
    ) {
      return;
    }

    const newActivity: LearningActivity = {
      id: crypto.randomUUID(),
      title: activityTitle.trim(),
      description: activityDescription.trim(),
      subject: activitySubject.trim(),
      createdAt: new Date().toISOString(),
      status: "Open",
    };

    setActivities((previous) => [...previous, newActivity]);

    setActivityTitle("");
    setActivityDescription("");
    setActivitySubject("");
  }

  function handleSubmitResponse(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    if (
      !studentName.trim() ||
      !selectedActivity ||
      !studentResponse.trim()
    ) {
      return;
    }

    const activity = activities.find(
      (item) => item.id === selectedActivity,
    );

    if (!activity || activity.status !== "Open") {
      return;
    }

    const newSubmission: StudentSubmission = {
      id: crypto.randomUUID(),
      activityId: selectedActivity,
      studentName: studentName.trim(),
      response: studentResponse.trim(),
      submittedAt: new Date().toISOString(),
      reviewStatus: "Submitted",
      feedback: "",
    };

    setSubmissions((previous) => [
      ...previous,
      newSubmission,
    ]);

    setStudentResponse("");
    setStudentName("");
    setSelectedActivity("");
  }

  function handleReviewSubmission(
    submissionId: string,
    reviewStatus: ReviewStatus,
  ) {
    setSubmissions((previous) =>
      previous.map((submission) =>
        submission.id === submissionId
          ? {
              ...submission,
              reviewStatus,
              feedback:
                feedbackDrafts[submissionId]?.trim() ?? "",
            }
          : submission,
      ),
    );
  }

  function handleDeleteActivity(activityId: string) {
    const hasSubmissions = submissions.some(
      (submission) => submission.activityId === activityId,
    );

    if (hasSubmissions) {
      window.alert(
        "This activity has student submissions. It cannot be deleted yet.",
      );
      return;
    }

    const confirmed = window.confirm(
      "Are you sure you want to delete this activity?",
    );

    if (!confirmed) {
      return;
    }

    setActivities((previous) =>
      previous.filter((activity) => activity.id !== activityId),
    );
  }

  function getActivityTitle(activityId: string) {
    return (
      activities.find((activity) => activity.id === activityId)
        ?.title ?? "Unknown activity"
    );
  }

  const pendingReviews = submissions.filter(
    (submission) =>
      submission.reviewStatus === "Submitted" ||
      submission.reviewStatus === "Under Review",
  ).length;

  const approvedSubmissions = submissions.filter(
    (submission) => submission.reviewStatus === "Approved",
  ).length;

  return (
    <main className="app">
      <section className="hero">
        <p className="eyebrow">SIMONIUM EDUCATION</p>

        <h1>Learning, Collaboration and Discovery</h1>

        <p className="hero-description">
          Connect learning activities, students, teachers,
          research questions, and verified educational results.
        </p>

        <div className="hero-note">
          Education module development in progress.
          Information entered here is temporary and is not
          stored in a permanent database.
        </div>
      </section>

      <nav
        aria-label="Education module navigation"
        className="education-tabs"
      >
        <button
          type="button"
          onClick={() => setActiveTab("overview")}
          aria-pressed={activeTab === "overview"}
        >
          Overview
        </button>

        <button
          type="button"
          onClick={() => setActiveTab("activities")}
          aria-pressed={activeTab === "activities"}
        >
          Learning Activities
        </button>

        <button
          type="button"
          onClick={() => setActiveTab("submissions")}
          aria-pressed={activeTab === "submissions"}
        >
          Student Submissions
        </button>
      </nav>

      {activeTab === "overview" && (
        <section className="modules-section">
          <div className="section-heading">
            <p className="eyebrow">EDUCATION WORKSPACE</p>

            <h2>Education Dashboard</h2>

            <p>
              Organize learning activities, receive student
              responses, and support teacher review.
            </p>
          </div>

          <div className="module-grid">
            <article className="module-card">
              <h3>Learning Activities</h3>
              <p>{activities.length} activities created</p>
            </article>

            <article className="module-card">
              <h3>Student Submissions</h3>
              <p>{submissions.length} responses received</p>
            </article>

            <article className="module-card">
              <h3>Pending Reviews</h3>
              <p>{pendingReviews} responses awaiting review</p>
            </article>

            <article className="module-card">
              <h3>Approved Results</h3>
              <p>{approvedSubmissions} responses approved</p>
            </article>
          </div>

          <div className="section-heading">
            <h2>Create a Learning Activity</h2>

            <p>
              Teachers can prepare activities that students
              can respond to.
            </p>
          </div>

          <form
            className="education-form"
            onSubmit={handleCreateActivity}
          >
            <label htmlFor="activity-subject">Subject</label>

            <input
              id="activity-subject"
              value={activitySubject}
              onChange={(event) =>
                setActivitySubject(event.target.value)
              }
              placeholder="For example: Cell Biology"
              required
            />

            <label htmlFor="activity-title">Activity Title</label>

            <input
              id="activity-title"
              value={activityTitle}
              onChange={(event) =>
                setActivityTitle(event.target.value)
              }
              placeholder="Enter the activity title"
              required
            />

            <label htmlFor="activity-description">
              Instructions or Research Question
            </label>

            <textarea
              id="activity-description"
              value={activityDescription}
              onChange={(event) =>
                setActivityDescription(event.target.value)
              }
              placeholder="Describe the activity and what students should investigate."
              rows={4}
              required
            />

            <button type="submit">
              Create Learning Activity
            </button>
          </form>
        </section>
      )}

      {activeTab === "activities" && (
        <section className="modules-section">
          <div className="section-heading">
            <h2>Learning Activities</h2>

            <p>
              Review available activities and their instructions.
            </p>
          </div>

          {activities.length === 0 ? (
            <p className="hero-note">
              No activities have been created yet.
              Create one from the Overview tab.
            </p>
          ) : (
            <div className="module-grid">
              {activities.map((activity) => (
                <article
                  className="module-card"
                  key={activity.id}
                >
                  <div className="module-content">
                    <p className="eyebrow">
                      {activity.subject}
                    </p>

                    <h3>{activity.title}</h3>

                    <p>{activity.description}</p>

                    <p>
                      Status: <strong>{activity.status}</strong>
                    </p>

                    <p>
                      Created:{" "}
                      {new Date(
                        activity.createdAt,
                      ).toLocaleString()}
                    </p>

                    <button
                      type="button"
                      onClick={() =>
                        setSelectedActivity(activity.id)
                      }
                      disabled={activity.status !== "Open"}
import { useState, type FormEvent } from "react";

type ActivityStatus = "Open" | "Closed";

type ReviewStatus =
  | "Submitted"
  | "Under Review"
  | "Approved"
  | "Correction Required";

interface LearningActivity {
  id: string;
  title: string;
  description: string;
  subject: string;
  createdAt: string;
  status: ActivityStatus;
}

interface StudentSubmission {
  id: string;
  activityId: string;
  studentName: string;
  response: string;
  submittedAt: string;
  reviewStatus: ReviewStatus;
  feedback: string;
}

export default function EducationModule() {
  const [activeTab, setActiveTab] = useState<
    "overview" | "activities" | "submissions"
  >("overview");

  const [activities, setActivities] = useState<
    LearningActivity[]
  >([]);

  const [submissions, setSubmissions] = useState<
    StudentSubmission[]
  >([]);

  const [activityTitle, setActivityTitle] = useState("");
  const [activityDescription, setActivityDescription] =
    useState("");
  const [activitySubject, setActivitySubject] = useState("");

  const [studentName, setStudentName] = useState("");
  const [selectedActivity, setSelectedActivity] = useState("");
  const [studentResponse, setStudentResponse] = useState("");

  const [feedbackDrafts, setFeedbackDrafts] = useState<
    Record<string, string>
  >({});

  function handleCreateActivity(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    if (
      !activityTitle.trim() ||
      !activityDescription.trim() ||
      !activitySubject.trim()
    ) {
      return;
    }

    const newActivity: LearningActivity = {
      id: crypto.randomUUID(),
      title: activityTitle.trim(),
      description: activityDescription.trim(),
      subject: activitySubject.trim(),
      createdAt: new Date().toISOString(),
      status: "Open",
    };

    setActivities((previous) => [...previous, newActivity]);

    setActivityTitle("");
    setActivityDescription("");
    setActivitySubject("");
  }

  function handleSubmitResponse(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    if (
      !studentName.trim() ||
      !selectedActivity ||
      !studentResponse.trim()
    ) {
      return;
    }

    const activity = activities.find(
      (item) => item.id === selectedActivity,
    );

    if (!activity || activity.status !== "Open") {
      return;
    }

    const newSubmission: StudentSubmission = {
      id: crypto.randomUUID(),
      activityId: selectedActivity,
      studentName: studentName.trim(),
      response: studentResponse.trim(),
      submittedAt: new Date().toISOString(),
      reviewStatus: "Submitted",
      feedback: "",
    };

    setSubmissions((previous) => [
      ...previous,
      newSubmission,
    ]);

    setStudentResponse("");
    setStudentName("");
    setSelectedActivity("");
  }

  function handleReviewSubmission(
    submissionId: string,
    reviewStatus: ReviewStatus,
  ) {
    setSubmissions((previous) =>
      previous.map((submission) =>
        submission.id === submissionId
          ? {
              ...submission,
              reviewStatus,
              feedback:
                feedbackDrafts[submissionId]?.trim() ?? "",
            }
          : submission,
      ),
    );
  }

  function handleDeleteActivity(activityId: string) {
    const hasSubmissions = submissions.some(
      (submission) => submission.activityId === activityId,
    );

    if (hasSubmissions) {
      window.alert(
        "This activity has student submissions. It cannot be deleted yet.",
      );
      return;
    }

    const confirmed = window.confirm(
      "Are you sure you want to delete this activity?",
    );

    if (!confirmed) {
      return;
    }

    setActivities((previous) =>
      previous.filter((activity) => activity.id !== activityId),
    );
  }

  function getActivityTitle(activityId: string) {
    return (
      activities.find((activity) => activity.id === activityId)
        ?.title ?? "Unknown activity"
    );
  }

  const pendingReviews = submissions.filter(
    (submission) =>
      submission.reviewStatus === "Submitted" ||
      submission.reviewStatus === "Under Review",
  ).length;

  const approvedSubmissions = submissions.filter(
    (submission) => submission.reviewStatus === "Approved",
  ).length;

  return (
    <main className="app">
      <section className="hero">
        <p className="eyebrow">SIMONIUM EDUCATION</p>

        <h1>Learning, Collaboration and Discovery</h1>

        <p className="hero-description">
          Connect learning activities, students, teachers,
          research questions, and verified educational results.
        </p>

        <div className="hero-note">
          Education module development in progress.
          Information entered here is temporary and is not
          stored in a permanent database.
        </div>
      </section>

      <nav
        aria-label="Education module navigation"
        className="education-tabs"
      >
        <button
          type="button"
          onClick={() => setActiveTab("overview")}
          aria-pressed={activeTab === "overview"}
        >
          Overview
        </button>

        <button
          type="button"
          onClick={() => setActiveTab("activities")}
          aria-pressed={activeTab === "activities"}
        >
          Learning Activities
        </button>

        <button
          type="button"
          onClick={() => setActiveTab("submissions")}
          aria-pressed={activeTab === "submissions"}
        >
          Student Submissions
        </button>
      </nav>

      {activeTab === "overview" && (
        <section className="modules-section">
          <div className="section-heading">
            <p className="eyebrow">EDUCATION WORKSPACE</p>

            <h2>Education Dashboard</h2>

            <p>
              Organize learning activities, receive student
              responses, and support teacher review.
            </p>
          </div>

          <div className="module-grid">
            <article className="module-card">
              <h3>Learning Activities</h3>
              <p>{activities.length} activities created</p>
            </article>

            <article className="module-card">
              <h3>Student Submissions</h3>
              <p>{submissions.length} responses received</p>
            </article>

            <article className="module-card">
              <h3>Pending Reviews</h3>
              <p>{pendingReviews} responses awaiting review</p>
            </article>

            <article className="module-card">
              <h3>Approved Results</h3>
              <p>{approvedSubmissions} responses approved</p>
            </article>
          </div>

          <div className="section-heading">
            <h2>Create a Learning Activity</h2>

            <p>
              Teachers can prepare activities that students
              can respond to.
            </p>
          </div>

          <form
            className="education-form"
            onSubmit={handleCreateActivity}
          >
            <label htmlFor="activity-subject">Subject</label>

            <input
              id="activity-subject"
              value={activitySubject}
              onChange={(event) =>
                setActivitySubject(event.target.value)
              }
              placeholder="For example: Cell Biology"
              required
            />

            <label htmlFor="activity-title">Activity Title</label>

            <input
              id="activity-title"
              value={activityTitle}
              onChange={(event) =>
                setActivityTitle(event.target.value)
              }
              placeholder="Enter the activity title"
              required
            />

            <label htmlFor="activity-description">
              Instructions or Research Question
            </label>

            <textarea
              id="activity-description"
              value={activityDescription}
              onChange={(event) =>
                setActivityDescription(event.target.value)
              }
              placeholder="Describe the activity and what students should investigate."
              rows={4}
              required
            />

            <button type="submit">
              Create Learning Activity
            </button>
          </form>
        </section>
      )}

      {activeTab === "activities" && (
        <section className="modules-section">
          <div className="section-heading">
            <h2>Learning Activities</h2>

            <p>
              Review available activities and their instructions.
            </p>
          </div>

          {activities.length === 0 ? (
            <p className="hero-note">
              No activities have been created yet.
              Create one from the Overview tab.
            </p>
          ) : (
            <div className="module-grid">
              {activities.map((activity) => (
                <article
                  className="module-card"
                  key={activity.id}
                >
                  <div className="module-content">
                    <p className="eyebrow">
                      {activity.subject}
                    </p>

                    <h3>{activity.title}</h3>

                    <p>{activity.description}</p>

                    <p>
                      Status: <strong>{activity.status}</strong>
                    </p>

                    <p>
                      Created:{" "}
                      {new Date(
                        activity.createdAt,
                      ).toLocaleString()}
                    </p>

                    <button
                      type="button"
                      onClick={() =>
                        setSelectedActivity(activity.id)
                      }
                      disabled={activity.status !== "Open"}
                    >
                      Select Activity
                    </button>

                    <button
                      type="button"
                      onClick={() =>
                        handleDeleteActivity(activity.id)
                      }
                    >
                      Delete Activity
                    </button>
                  </div>
                </article>
              ))}
            </div>
          )}

          {selectedActivity && (
            <form
              className="education-form"
              onSubmit={handleSubmitResponse}
            >
              <h3>Submit Student Response</h3>

              <p>
                Selected activity:{" "}
                {getActivityTitle(selectedActivity)}
              </p>

              <label htmlFor="student-name">
                Student Name
              </label>

              <input
                id="student-name"
                value={studentName}
                onChange={(event) =>
                  setStudentName(event.target.value)
                }
                required
              />

              <label htmlFor="student-response">
                Student Response
              </label>

              <textarea
                id="student-response"
                value={studentResponse}
                onChange={(event) =>
                  setStudentResponse(event.target.value)
                }
                rows={5}
                required
              />

              <button type="submit">
                Submit Response
              </button>

              <button
                type="button"
                onClick={() => setSelectedActivity("")}
              >
                Cancel
              </button>
            </form>
          )}
        </section>
      )}

      {activeTab === "submissions" && (
        <section className="modules-section">
          <div className="section-heading">
            <h2>Student Submissions</h2>

            <p>
              Review responses and record feedback.
              Approval here is a prototype workflow, not
              formal institutional verification.
            </p>
          </div>

          {submissions.length === 0 ? (
            <p className="hero-note">
              No student responses have been submitted yet.
            </p>
          ) : (
            <div className="module-grid">
              {submissions.map((submission) => (
                <article
                  className="module-card"
                  key={submission.id}
                >
                  <div className="module-content">
                    <h3>{submission.studentName}</h3>

                    <p>
                      <strong>Activity:</strong>{" "}
                      {getActivityTitle(submission.activityId)}
                    </p>

                    <p>
                      <strong>Response:</strong>{" "}
                      {submission.response}
                    </p>

                    <p>
                      <strong>Status:</strong>{" "}
                      {submission.reviewStatus}
                    </p>

                    <label
                      htmlFor={`feedback-${submission.id}`}
                    >
                      Teacher Feedback
                    </label>

                    <textarea
                      id={`feedback-${submission.id}`}
                      value={
                        feedbackDrafts[submission.id] ??
                        submission.feedback
                      }
                      onChange={(event) =>
                        setFeedbackDrafts((previous) => ({
                          ...previous,
                          [submission.id]: event.target.value,
                        }))
                      }
                      rows={3}
                    />

                    <button
                      type="button"
                      onClick={() =>
                        handleReviewSubmission(
                          submission.id,
                          "Under Review",
                        )
                      }
                    >
                      Mark Under Review
                    </button>

                    <button
                      type="button"
                      onClick={() =>
                        handleReviewSubmission(
                          submission.id,
                          "Correction Required",
                        )
                      }
                    >
                      Request Correction
                    </button>

                    <button
                      type="button"
                      onClick={() =>
                        handleReviewSubmission(
                          submission.id,
                          "Approved",
                        )
                      }
                    >
                      Approve Response
                    </button>
                  </div>
                </article>
              ))}
            </div>
          )}
        </section>
      )}

      <section className="platform-principles">
        <div className="section-heading">
          <h2>Responsible Learning and Research</h2>

          <p>
            Educational results should be reviewed before
            they are treated as verified research evidence.
            Future versions will connect this workflow to
            authenticated users, permissions, and a shared
            database.
          </p>
        </div>
      </section>
    </main>
  );
}￼Enter                    >
                      Select Activity
                    </button>

                    <button
                      type="button"
                      onClick={() =>
                        handleDeleteActivity(activity.id)
                      }
                    >
                      Delete Activity
                    </button>
                  </div>
                </article>
              ))}
            </div>
          )}

          {selectedActivity && (
            <form
              className="education-form"
              onSubmit={handleSubmitResponse}
            >
              <h3>Submit Student Response</h3>

              <p>
                Selected activity:{" "}
                {getActivityTitle(selectedActivity)}
              </p>

              <label htmlFor="student-name">
                Student Name
              </label>

              <input
                id="student-name"
                value={studentName}
                onChange={(event) =>
                  setStudentName(event.target.value)
                }
                required
              />

              <label htmlFor="student-response">
                Student Response
              </label>

              <textarea
                id="student-response"
                value={studentResponse}
                onChange={(event) =>
                  setStudentResponse(event.target.value)
                }
                rows={5}
                required
              />

              <button type="submit">
                Submit Response
              </button>

              <button
                type="button"
                onClick={() => setSelectedActivity("")}
        >
                Cancel
              </button>
            </form>
          )}
        </section>
      )}

      {activeTab === "submissions" && (
        <section className="modules-section">
          <div className="section-heading">
            <h2>Student Submissions</h2>

            <p>
              Review responses and record feedback.
              Approval here is a prototype workflow, not
              formal institutional verification.
            </p>
          </div>

          {submissions.length === 0 ? (
            <p className="hero-note">
              No student responses have been submitted yet.
            </p>
          ) : (
            <div className="module-grid">
              {submissions.map((submission) => (
                <article
                  className="module-card"
                  key={submission.id}
                >
                  <div className="module-content">
                    <h3>{submission.studentName}</h3>

                    <p>
                      <strong>Activity:</strong>{" "}
                      {getActivityTitle(submission.activityId)}
                    </p>

                    <p>
                      <strong>Response:</strong>{" "}
                      {submission.response}
                    </p>

                    <p>
                      <strong>Status:</strong>{" "}
                      {submission.reviewStatus}
                    </p>

                    <label
                      htmlFor={`feedback-${submission.id}`}
                    >
                      Teacher Feedback
                    </label>

                    <textarea
                      id={`feedback-${submission.id}`}
                      value={
                        feedbackDrafts[submission.id] ??
                        submission.feedback
                      }
                      onChange={(event) =>
                        setFeedbackDrafts((previous) => ({
                          ...previous,
