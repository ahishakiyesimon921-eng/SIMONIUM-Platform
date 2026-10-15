/**
 * SIMONIUM Platform
 * User Roles, Permissions, and Access Control Types
 *
 * These definitions establish the foundation for access
 * control. Real authorization must be enforced by the server.
 */

export type BuiltInRoleId =
  | "community"
  | "student"
  | "teacher"
  | "researcher"
  | "discoverer"
  | "health-professional"
  | "institution"
  | "administrator";

/**
 * Allows new roles to be added as SIMONIUM expands.
 */
export type RoleId = BuiltInRoleId | (string & {});

/**
 * Account lifecycle.
 */
export type AccountStatus =
  | "pending"
  | "active"
  | "suspended"
  | "rejected";

/**
 * Permissions describe actions that a user may be allowed
 * to perform after their identity and role are verified.
 */
export type Permission =
  | "profile:read"
  | "profile:update"
  | "users:read"
  | "users:manage"
  | "records:create"
  | "records:read"
  | "records:update"
  | "records:delete"
  | "records:submit"
  | "records:review"
  | "records:approve"
  | "records:reject"
  | "research:create"
  | "research:participate"
  | "health:submit"
  | "education:manage"
  | "community:report"
  | "files:upload"
  | "files:download"
  | "notifications:read"
  | "settings:manage"
  | "backup:create"
  | "backup:restore"
  | "audit:read";

/**
 * A role definition describes a role available on the platform.
 *
 * The permissions listed here are intended as configuration
 * data. They are not, by themselves, a security mechanism.
 */
export interface RoleDefinition {
  id: RoleId;
  name: string;
  description: string;
  permissions: Permission[];
  active: boolean;
}

/**
 * A platform user profile.
 *
 * Authentication credentials and private secrets must not
 * be stored in this profile object.
 */
export interface PlatformUser {
  id: string;
  displayName: string;
  email: string;
  roleIds: RoleId[];
  accountStatus: AccountStatus;
  institutionId?: string;
  createdAt: string;
  updatedAt: string;
}

/**
 * Resource ownership and access scope.
 */
export type AccessScope =
  | "own"
  | "assigned"
  | "institution"
  | "sector"
  | "platform";

/**
 * Describes an access request for a resource.
 */
export interface AccessRequest {
  userId: string;
  resourceType: string;
  resourceId: string;
  action: Permission;
  scope: AccessScope;
}

/**
 * Review lifecycle for information submitted to SIMONIUM.
 */
export type ReviewStatus =
  | "draft"
  | "submitted"
  | "under-review"
  | "changes-requested"
  | "approved"
  | "rejected";

/**
 * Records important actions for accountability.
 */
export interface AuditEvent {
  id: string;
  actorUserId: string;
  action: string;
  resourceType: string;
  resourceId: string;
  timestamp: string;
  details?: string;
}
