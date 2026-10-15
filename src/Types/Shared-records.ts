/**
 * SIMONIUM Shared Data Architecture
 *
 * Defines common data structures that can be shared
 * across different platform sectors.
 *
 * This file defines TypeScript types only.
 * It does not implement authentication, database storage,
 * server permissions, or security controls.
 */

/**
 * Platform sectors.
 *
 * Additional sector identifiers can be introduced
 * as the platform expands.
 */
export type SectorId = string;

/**
 * Platform roles.
 *
 * Actual role assignments must be verified by the server.
 * Users must not gain permissions simply by selecting a role.
 */
export type PlatformRole =
  | "community"
  | "student"
  | "teacher"
  | "researcher"
  | "discoverer"
  | "health-professional"
  | "institution"
  | "administrator";

/**
 * Review workflow shared across platform sectors.
 */
export type ReviewStatus =
  | "draft"
  | "submitted"
  | "under-review"
  | "correction-required"
  | "approved"
  | "rejected"
  | "archived";

/**
 * Visibility classification for platform records.
 *
 * Actual visibility must be enforced by the server.
 */
export type RecordVisibility =
  | "private"
  | "restricted"
  | "institution"
  | "authorized-collaborators"
  | "public";

/**
 * Common metadata for records created in SIMONIUM.
 */
export interface BaseRecord {
  id: string;

  sectorId: SectorId;

  recordType: string;

  title: string;

  description: string;

  createdAt: string;

  updatedAt: string;

  createdBy: string;

  status: ReviewStatus;

  visibility: RecordVisibility;

  version: number;
}

/**
 * Links one record to another.
 *
 * Examples:
 * - A community report linked to a research question.
 * - A student submission linked to a learning activity.
 * - A research finding linked to a research project.
 */
export interface RecordLink {
  id: string;

  sourceRecordId: string;

  targetRecordId: string;

  relationshipType: string;

  createdAt: string;

  createdBy: string;
}

/**
 * Describes a verified user's identity and assigned roles.
 *
 * This is a data structure, not an authentication mechanism.
 */
export interface PlatformUser {
  id: string;

  displayName: string;

  email?: string;

  assignedRoles: PlatformRole[];

  accountStatus:
    | "pending-verification"
    | "active"
    | "suspended"
    | "disabled";

  createdAt: string;
}

/**
 * Records an action performed on a platform record.
 *
 * A real audit trail must be stored securely on the server
 * and must not rely on data supplied by the client alone.
 */
export interface AuditEvent {
  id: string;

  recordId: string;

  actorUserId: string;

  action:
    | "created"
    | "viewed"
    | "updated"
    | "submitted"
    | "reviewed"
    | "approved"
    | "rejected"
    | "deleted"
    | "restored";

  timestamp: string;

  details?: string;
}

/**
 * Represents a review decision.
 */
export interface ReviewDecision {
  id: string;

  recordId: string;

  reviewerUserId: string;

  previousStatus: ReviewStatus;

  newStatus: ReviewStatus;

  feedback: string;

  reviewedAt: string;
}

/**
 * Defines the relationship between a record and its
 * authorized collaborators.
 *
 * Actual access must be checked by the server.
 */
export interface RecordCollaboration {
  id: string;

  recordId: string;

  userId: string;

  permission:
    | "view"
    | "comment"
    | "edit"
    | "review";

  grantedBy: string;

  grantedAt: string;
}
