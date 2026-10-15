/**
 * SIMONIUM Permission Service
 *
 * Requests user permissions from the SIMONIUM backend.
 *
 * IMPORTANT:
 * Frontend permission checks only control the user interface.
 * The backend must independently verify permissions for
 * every protected operation and record.
 */

import { apiClient } from "./api-client";
import type {
  PlatformRole,
  SectorId,
} from "../types/shared-records";

export type PermissionAction =
  | "view"
  | "create"
  | "edit"
  | "delete"
  | "submit"
  | "review"
  | "approve"
  | "export"
  | "manage";

export interface Permission {
  sectorId: SectorId;
  resource: string;
  actions: PermissionAction[];
}

export interface UserPermissionsResponse {
  userId: string;
  roles: PlatformRole[];
  permissions: Permission[];
}

export const permissionService = {
  /**
   * Request the current user's verified permissions.
   */
  async getMyPermissions(): Promise<UserPermissionsResponse> {
    return apiClient.get<UserPermissionsResponse>(
      "/auth/permissions",
    );
  },

  /**
   * Check whether the returned permission list includes
   * a particular action.
   *
   * This is a frontend convenience check, not a security
   * boundary. The backend must check permissions again.
   */
  can(
    permissions: Permission[],
    sectorId: SectorId,
    resource: string,
    action: PermissionAction,
  ): boolean {
    return permissions.some(
      (permission) =>
        permission.sectorId === sectorId &&
        permission.resource === resource &&
        permission.actions.includes(action),
    );
  },
};
