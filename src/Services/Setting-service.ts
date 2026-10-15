/**
 * SIMONIUM Settings Service
 *
 * Provides shared interfaces for user preferences
 * and platform configuration.
 *
 * IMPORTANT:
 * The backend must validate all settings and enforce
 * permissions for protected platform configuration.
 */

import { apiClient } from "./api-client";

export type SupportedLanguage = "en" | "rw" | "fr";

export type ThemePreference = "light" | "dark" | "system";

export interface UserSettings {
  userId: string;
  language: SupportedLanguage;
  theme: ThemePreference;
  emailNotifications: boolean;
  inAppNotifications: boolean;
  timezone: string;
  updatedAt: string;
}

export interface UpdateUserSettings {
  language?: SupportedLanguage;
  theme?: ThemePreference;
  emailNotifications?: boolean;
  inAppNotifications?: boolean;
  timezone?: string;
}

export interface PlatformSettings {
  platformName: string;
  maintenanceMode: boolean;
  registrationEnabled: boolean;
  defaultLanguage: SupportedLanguage;
  supportedLanguages: SupportedLanguage[];
  updatedAt: string;
}

export interface UpdatePlatformSettings {
  platformName?: string;
  maintenanceMode?: boolean;
  registrationEnabled?: boolean;
  defaultLanguage?: SupportedLanguage;
  supportedLanguages?: SupportedLanguage[];
}

export const settingsService = {
  /**
   * Retrieve settings for the authenticated user.
   */
  async getMySettings(): Promise<UserSettings> {
    return apiClient.get<UserSettings>("/settings/me");
  },

  /**
   * Update settings for the authenticated user.
   */
  async updateMySettings(
    changes: UpdateUserSettings,
  ): Promise<UserSettings> {
    return apiClient.patch<UserSettings>(
      "/settings/me",
      changes,
    );
  },

  /**
   * Retrieve platform-wide configuration.
   *
   * The backend must return only the information
   * the authenticated user is allowed to view.
   */
  async getPlatformSettings(): Promise<PlatformSettings> {
    return apiClient.get<PlatformSettings>(
      "/admin/settings",
    );
  },

  /**
   * Update platform-wide configuration.
   *
   * The backend must independently verify administrator
   * permissions before accepting this request.
   */
  async updatePlatformSettings(
    changes: UpdatePlatformSettings,
  ): Promise<PlatformSettings> {
    return apiClient.patch<PlatformSettings>(
      "/admin/settings",
      changes,
    );
  },
};
