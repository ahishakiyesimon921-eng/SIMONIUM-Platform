/**
 * SIMONIUM Notification Service
 *
 * Provides shared notification operations for all platform
 * sectors, including Health, Education, Research & Discovery,
 * Community, and future sectors.
 *
 * IMPORTANT:
 * Notifications must be retrieved from the backend.
 * The backend must verify recipients and protect private data.
 */

import { apiClient } from "./api-client";

export type NotificationType =
  | "information"
  | "success"
  | "warning"
  | "action-required"
  | "review-update"
  | "system";

export type NotificationStatus = "unread" | "read";

export interface PlatformNotification {
  id: string;
  recipientUserId: string;
  title: string;
  message: string;
  type: NotificationType;
  status: NotificationStatus;
  sectorId?: string;
  relatedRecordId?: string;
  actionUrl?: string;
  createdAt: string;
  readAt?: string;
}

export interface NotificationListResponse {
  items: PlatformNotification[];
  total: number;
  unreadCount: number;
  limit: number;
  offset: number;
}

export interface NotificationQuery {
  status?: NotificationStatus;
  sectorId?: string;
  type?: NotificationType;
  limit?: number;
  offset?: number;
}

function buildQueryString(query: NotificationQuery): string {
  const params = new URLSearchParams();

  for (const [key, value] of Object.entries(query)) {
    if (value !== undefined && value !== "") {
      params.set(key, String(value));
    }
  }

  const queryString = params.toString();

  return queryString ? `?${queryString}` : "";
}

export const notificationService = {
  /**
   * Retrieve notifications belonging to the authenticated user.
   */
  async list(
    query: NotificationQuery = {},
  ): Promise<NotificationListResponse> {
    return apiClient.get<NotificationListResponse>(
      `/notifications${buildQueryString(query)}`,
    );
  },

  /**
   * Retrieve one notification.
   */
  async getById(
    notificationId: string,
  ): Promise<PlatformNotification> {
    return apiClient.get<PlatformNotification>(
      `/notifications/${encodeURIComponent(notificationId)}`,
    );
  },

  /**
   * Mark a notification as read.
   */
  async markAsRead(
    notificationId: string,
  ): Promise<PlatformNotification> {
    return apiClient.patch<PlatformNotification>(
      `/notifications/${encodeURIComponent(notificationId)}/read`,
      {},
    );
  },

  /**
   * Mark all notifications for the authenticated user as read.
   */
  async markAllAsRead(): Promise<{ updatedCount: number }> {
    return apiClient.post<{ updatedCount: number }>(
      "/notifications/mark-all-read",
    );
  },

  /**
   * Delete a notification belonging to the authenticated user.
   */
  async delete(notificationId: string): Promise<void> {
    await apiClient.delete<void>(
      `/notifications/${encodeURIComponent(notificationId)}`,
    );
  },
};
