here/**
 * SIMONIUM PLATFORM
 * Scientific Information Management, Organization, Network,
 * Intelligence and Unified Multidisciplinary Platform.
 *
 * Core platform type definitions.
 */

export type SectorId = string;

export type CoreSectorId =
  | "health"
  | "education"
  | "research-discovery"
  | "community";

export type ModuleStatus =
  | "active"
  | "planned"
  | "maintenance"
  | "disabled";

export interface PlatformModule {
  id: SectorId;
  name: string;
  description: string;
  status: ModuleStatus;
  icon: string;
  route: string;
  enabled: boolean;
}

export type UserRole =
  | "community"
  | "student"
  | "teacher"
  | "researcher"
  | "discoverer"
  | "health-professional"
  | "institution"
  | "administrator";

export type VerificationStatus =
  | "unverified"
  | "pending"
  | "verified"
  | "rejected"
  | "suspended";

export type AuthenticationStatus =
  | "loading"
  | "authenticated"
  | "unauthenticated";

export type PermissionAction =
  | "view"
  | "create"
  | "edit"
  | "delete"
  | "submit"
  | "review"
  | "verify"
  | "approve"
  | "export"
  | "manage-users"
  | "manage-settings";

export interface PlatformPermission {
  resource: string;
  action: PermissionAction;
}

export interface PlatformUser {
  id: string;
  displayName: string;
  email: string;
  role: UserRole;
  verificationStatus: VerificationStatus;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

export type RecordStatus =
  | "draft"
  | "submitted"
  | "under-review"
  | "verified"
  | "rejected"
  | "archived";

export interface PlatformRecordMetadata {
  id: string;
  createdAt: string;
  updatedAt: string;
  createdBy: string;
  status: RecordStatus;
  verifiedBy?: string;
  verifiedAt?: string;
}

export interface NavigationItem {
  id: string;
  label: string;
  route: string;
  description?: string;
  icon?: string;
  requiredRoles?: UserRole[];
  requiredPermissions?: PlatformPermission[];
}

export interface PlatformModuleConfiguration {
  module: PlatformModule;
  navigation: NavigationItem[];
}

export interface VerificationRecord {
  id: string;
  subjectId: string;
  subjectType: "user" | "research" | "health-report" | "education";
  status: VerificationStatus;
  reviewedBy?: string;
  reviewedAt?: string;
  reviewNotes?: string;
  createdAt: string;
  updatedAt: string;
}

export interface AuditLogEntry {
  id: string;
  actorId: string;
  action: string;
  resourceType: string;
  resourceId: string;
  timestamp: string;
  outcome: "success" | "failure";
}

export interface PlatformConfiguration {
  name: string;
  fullName: string;
  version: string;
  supportedSectors: CoreSectorId[];
  allowFutureSectors: boolean;
}

/**
 * Core SIMONIUM platform configuration.
 *
 * This configuration describes the initial sectors.
 * It does not activate backend services or grant permissions.
 */
export const SIMONIUM_CONFIG: PlatformConfiguration = {
  name: "SIMONIUM",
  fullName:
    "Scientific Information Management, Organization, Network, Intelligence and Unified Multidisciplinary Platform",
  version: "1.0.0",
  supportedSectors: [
    "health",
    "education",
    "research-discovery",
    "community",
  ],
  allowFutureSectors: true,
};
