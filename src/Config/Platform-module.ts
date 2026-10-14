import type {
  CoreSectorId,
  PlatformModule,
} from "../types/platform";

/**
 * SIMONIUM PLATFORM MODULE REGISTRY
 *
 * Central registry for the platform's core sectors.
 * Future sectors can be registered without rebuilding
 * the entire application architecture.
 */

export const PLATFORM_MODULES: Record<
  CoreSectorId,
  PlatformModule
> = {
  health: {
    id: "health",
    name: "Health",
    description:
      "Connect health professionals, health information, observations, and research opportunities.",
    status: "active",
    icon: "health",
    route: "/health",
    enabled: true,
  },

  education: {
    id: "education",
    name: "Education",
    description:
      "Connect students, teachers, learning activities, educational resources, and verified academic results.",
    status: "active",
    icon: "education",
    route: "/education",
    enabled: true,
  },

  "research-discovery": {
    id: "research-discovery",
    name: "Research & Discovery",
    description:
      "Organize research questions, observations, evidence, discoveries, and collaborative research activities.",
    status: "active",
    icon: "research",
    route: "/research",
    enabled: true,
  },

  community: {
    id: "community",
    name: "Community",
    description:
      "Connect communities with researchers and relevant institutions through structured observations, questions, and ideas.",
    status: "planned",
    icon: "community",
    route: "/community",
    enabled: false,
  },
};

/**
 * Returns all registered platform modules.
 */
export function getPlatformModules(): PlatformModule[] {
  return Object.values(PLATFORM_MODULES);
}

/**
 * Returns only modules enabled in the frontend configuration.
 *
 * This does not determine backend authorization.
 */
export function getEnabledPlatformModules(): PlatformModule[] {
  return getPlatformModules().filter(
    (module) => module.enabled,
  );
}

/**
 * Finds a module by its identifier.
 */
export function getPlatformModule(
  id: CoreSectorId,
): PlatformModule | undefined {
  return PLATFORM_MODULES[id];
}

/**
 * Checks whether a registered module is enabled.
 */
export function isPlatformModuleEnabled(
  id: CoreSectorId,
): boolean {
  return PLATFORM_MODULES[id]?.enabled ?? false;
}￼Enter
