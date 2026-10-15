/**
 * SIMONIUM Authentication Service
 *
 * Handles frontend requests related to user authentication.
 *
 * IMPORTANT:
 * Real authentication and role authorization must be
 * implemented and enforced by the backend server.
 */

import { apiClient } from "./api-client";
import type { PlatformUser } from "../types/shared-records";

export interface LoginCredentials {
  email: string;
  password: string;
}

export interface RegistrationData {
  displayName: string;
  email: string;
  password: string;
}

export interface AuthResponse {
  user: PlatformUser;
}

export interface AuthServiceResult {
  success: boolean;
  message: string;
}

export const authService = {
  /**
   * Sign in an existing user.
   */
  async login(
    credentials: LoginCredentials,
  ): Promise<AuthResponse> {
    return apiClient.post<AuthResponse>(
      "/auth/login",
      credentials,
    );
  },

  /**
   * Register a new account.
   *
   * Roles are intentionally excluded from registration data.
   * The server must assign and verify user permissions.
   */
  async register(
    data: RegistrationData,
  ): Promise<AuthResponse> {
    return apiClient.post<AuthResponse>(
      "/auth/register",
      data,
    );
  },

  /**
   * Get the currently authenticated user.
   */
  async getCurrentUser(): Promise<AuthResponse> {
    return apiClient.get<AuthResponse>("/auth/me");
  },

  /**
   * Sign out the current user.
   */
  async logout(): Promise<AuthServiceResult> {
    return apiClient.post<AuthServiceResult>(
      "/auth/logout",
    );
  },
};
