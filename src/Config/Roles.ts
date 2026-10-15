import type {
  Permission,
  RoleDefinition,
  RoleId,
} from "../types/access";

/**
 * SIMONIUM Platform
 * Built-in role definitions.
 *
 * These definitions describe intended permissions.
 * Production authorization must also be enforced by the server.
 */

const ADMIN_PERMISSIONS: Permission[] = [
  "profile:read",
  "profile:update",
  "users:read",
  "users:manage",
  "records:create",
  "records:read",
  "records:update",
  "records:delete",
  "records:submit",
  "records:review",
  "records:approve",
  "records:reject",
  "research:create",
  "research:participate",
  "health:submit",
  "education:manage",
  "community:report",
  "files:upload",
  "files:download",
  "notifications:read",
  "settings:manage",
  "backup:create",
  "backup:restore",
  "audit:read",
];

export const PLATFORM_ROLES: RoleDefinition[] = [
  {
    id: "community",
    name: "Community Member",
    description:
      "Reports community observations and shares local ideas.",
    permissions: [
      "profile:read",
      "profile:update",
      "records:create",
      "records:read",
      "records:submit",
      "community:report",
      "files:upload",
      "files:download",
      "notifications:read",
    ],
    active: true,
  },
  {
    id: "student",
    name: "Student",
    description:
      "Participates in assigned learning activities and research tasks.",
    permissions: [
      "profile:read",
      "profile:update",
      "records:read",
      "records:create",
      "records:update",
      "records:submit",
      "research:participate",
      "files:upload",
      "files:download",
      "notifications:read",
    ],
    active: true,
  },
  {
    id: "teacher",
    name: "Teacher",
    description:
      "Organizes learning activities and reviews student submissions.",
    permissions: [
      "profile:read",
      "profile:update",
      "records:read",
      "records:create",
      "records:update",
      "records:submit",
      "records:review",
      "records:reject",
      "education:manage",
      "research:participate",
      "files:upload",
      "files:download",
      "notifications:read",
    ],
    active: true,
  },
  {
    id: "researcher",
    name: "Researcher",
    description:
      "Creates research questions and contributes to scientific investigations.",
    permissions: [
      "profile:read",
      "profile:update",
      "records:read",
      "records:create",
      "records:update",
      "records:submit",
      "records:review",
      "records:reject",
      "research:create",
      "research:participate",
      "files:upload",
      "files:download",
      "notifications:read",
    ],
    active: true,
  },
  {
    id: "discoverer",
    name: "Discoverer",
    description:
      "Explores connections, observations, and potential discoveries.",
    permissions: [
      "profile:read",
      "profile:update",
      "records:read",
      "records:create",
      "records:submit",
      "research:create",
      "research:participate",
      "files:upload",
      "files:download",
      "notifications:read",
    ],
    active: true,
  },
  {
    id: "health-professional",
    name: "Health Professional",
    description:
      "Contributes health observations and participates in authorized health research.",
    permissions: [
      "profile:read",
      "profile:update",
      "records:read",
      "records:create",
      "records:update",
      "records:submit",
      "records:review",
      "records:reject",
      "health:submit",
      "research:participate",
      "files:upload",
      "files:download",
      "notifications:read",
    ],
    active: true,
  },
  {
    id: "institution",
    name: "Institution Representative",
    description:
      "Coordinates authorized activities and information belonging to an institution.",
    permissions: [
      "profile:read",
      "profile:update",
      "users:read",
      "records:read",
      "records:create",
      "records:update",
      "records:submit",
      "records:review",
      "research:create",
      "research:participate",
      "education:manage",
      "files:upload",
      "files:download",
      "notifications:read",
    ],
    active: true,
  },
  {
    id: "administrator",
    name: "Platform Administrator",
    description:
      "Manages platform operations according to verified administrative authorization.",
    permissions: [...ADMIN_PERMISSIONS],
    active: true,
  },
];

/**
 * Return all built-in role definitions.
 */
export function getPlatformRoles(): RoleDefinition[] {
  return PLATFORM_ROLES.map((role) => ({
    ...role,
    permissions: [...role.permissions],
  }));
}

/**
 * Find a role by its identifier.
 */
export function getPlatformRole(
  roleId: RoleId,
): RoleDefinition | undefined {
  const role = PLATFORM_ROLES.find(
    (item) => item.id === roleId,
  );

  if (!role) {
    return undefined;
  }

  return {
    ...role,
    permissions: [...role.permissions],
  };
}

/**
 * Return the configured permissions for a role.
 */
export function getRolePermissions(
  roleId: RoleId,
): Permission[] {
  const role = PLATFORM_ROLES.find(
    (item) => item.id === roleId && item.active,
  );

  return role ? [...role.permissions] : [];
}

/**
 * Check whether a configured role includes a permission.
 *
 * This helper is for application logic and interface decisions.
 * It does not replace server-side authorization.
 */
export function roleHasPermission(
  roleId: RoleId,
  permission: Permission,
): boolean {
  return getRolePermissions(roleId).includes(permission);
}
