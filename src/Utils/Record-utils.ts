import type {
  BaseRecord,
  ReviewStatus,
} from "../types/shared-records";

/**
 * SIMONIUM Shared Record Utilities
 *
 * Common helper functions for managing platform records.
 *
 * These utilities run on the client side.
 * They do not replace server-side security,
 * authorization, or database validation.
 */

/**
 * Generate a unique identifier for a new record.
 */
export function createRecordId(): string {
  if (
    typeof crypto !== "undefined" &&
    typeof crypto.randomUUID === "function"
  ) {
    return crypto.randomUUID();
  }

  throw new Error(
    "Secure record ID generation is unavailable in this environment.",
  );
}

/**
 * Return the current date and time in ISO 8601 format.
 */
export function getCurrentTimestamp(): string {
  return new Date().toISOString();
}

/**
 * Return the current date in YYYY-MM-DD format.
 */
export function getCurrentDate(): string {
  return getCurrentTimestamp().split("T")[0];
}

/**
 * Prepare standard metadata for a newly created record.
 */
export function createRecordMetadata(
  sectorId: string,
  recordType: string,
  title: string,
  description: string,
  createdBy: string,
): BaseRecord {
  const now = getCurrentTimestamp();

  return {
    id: createRecordId(),
    sectorId,
    recordType,
    title: title.trim(),
    description: description.trim(),
    createdAt: now,
    updatedAt: now,
    createdBy,
    status: "draft",
    visibility: "private",
    version: 1,
  };
}

/**
 * Update a record while maintaining common metadata.
 *
 * The record ID and original creation information
 * remain unchanged.
 */
export function updateRecordMetadata<T extends BaseRecord>(
  record: T,
  changes: Partial<
    Pick<
      BaseRecord,
      | "title"
      | "description"
      | "status"
      | "visibility"
    >
  >,
): T {
  return {
    ...record,
    ...changes,
    id: record.id,
    createdAt: record.createdAt,
    createdBy: record.createdBy,
    updatedAt: getCurrentTimestamp(),
    version: record.version + 1,
  };
}

/**
 * Return a readable label for a review status.
 *
 * Example:
 * "under-review" becomes "Under Review".
 */
export function getReviewStatusLabel(
  status: ReviewStatus,
): string {
  const labels: Record<ReviewStatus, string> = {
    draft: "Draft",
    submitted: "Submitted",
    "under-review": "Under Review",
    "correction-required": "Correction Required",
    approved: "Approved",
    rejected: "Rejected",
    archived: "Archived",
  };

  return labels[status];
}

/**
 * Identify statuses that represent a completed review decision.
 *
 * This is a workflow helper, not an authorization check.
 */
export function isFinalReviewStatus(
  status: ReviewStatus,
): boolean {
  return (
    status === "approved" ||
    status === "rejected" ||
    status === "archived"
  );
}

/**
 * Check whether a record has the minimum required
 * common metadata.
 *
 * Server-side validation will still be required
 * before accepting records into a shared database.
 */
export function hasValidRecordMetadata(
  record: BaseRecord,
): boolean {
  return (
    record.id.trim().length > 0 &&
    record.sectorId.trim().length > 0 &&
    record.recordType.trim().length > 0 &&
    record.title.trim().length > 0 &&
    record.description.trim().length > 0 &&
    record.createdBy.trim().length > 0 &&
    Number.isInteger(record.version) &&
    record.version > 0 &&
    !Number.isNaN(Date.parse(record.createdAt)) &&
    !Number.isNaN(Date.parse(record.updatedAt))
  );
}
