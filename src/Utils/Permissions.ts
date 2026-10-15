import type {
  Permission,
  PlatformUser,
  RoleId,
} from "../types/access";

import { getPlatformRole } from "../config/roles";

/**
 * SIMONIUM permission utilities.
 *
 * These helpers support interface and application logic.
 * They do not replace authentication, database policies,
 * or server-side authorization.
 */

/**
 * Check whether an account is active.
 */
export function isAccountActive(
  user: PlatformUser | null | undefined,
): boolean {
  return Boolean(user && user.accountStatus === "active");
}

/**
 * Check whether a user has a particular configured role.
 */
export function userHasRole(
  user: PlatformUser | null | undefined,
  roleId: RoleId,
): boolean {
  if (!user || !isAccountActive(user)) {
    return false;
  }

  return user.roleIds.some((assignedRoleId) => {
    const role = getPlatformRole(assignedRoleId);

    return (
      assignedRoleId === roleId &&
      role !== undefined &&
      role.active
    );
  });
}

/**
 * Check whether a user has a permission through any
 * of their configured roles.
 */
export function userHasPermission(
  user: PlatformUser | null | undefined,
  permission: Permission,
): boolean {
  if (!user || !isAccountActive(user)) {
    return false;
  }

  return user.roleIds.some((roleId) => {
    const role = getPlatformRole(roleId);

    return (
      role !== undefined &&
      role.active &&
      role.permissions.includes(permission)
    );
  });
}

/**
 * Check whether the user may manage platform settings.
 */
export function canManageSettings(
  user: PlatformUser | null | undefined,
): boolean {
  return userHasPermission(user, "settings:manage");
}

/**
 * Check whether the user may review submitted records.
 */
export function canReviewRecords(
  user: PlatformUser | null | undefined,
): boolean {
  return userHasPermission(user, "records:review");
}

/**
 * Check whether the user may approve submitted records.
 */
export function canApproveRecords(
  user: PlatformUser | null | undefined,
): boolean {
  return userHasPermission(user, "records:approve");
}

/**
 * Check whether the user may manage other user accounts.
 */
export function canManageUsers(
  user: PlatformUser | null | undefined,
): boolean {
  return userHasPermission(user, "users:manage");
}

/**
 * Check whether the user may create backups.
 */
export function canCreateBackup(
  user: PlatformUser | null | undefined,
): boolean {
  return userHasPermission(user, "backup:create");
}

/**
 * Check whether the user may restore backups.
 */
export function canRestoreBackup(
  user: PlatformUser | null | undefined,
): boolean {
  return userHasPermission(user, "backup:restore");
}
