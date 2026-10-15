/**
 * SIMONIUM Audit Service
 *
 * Provides a shared interface for retrieving audit history
 * and recording important platform activities.
 *
 * IMPORTANT:
 * The backend must generate trustworthy audit events.
 * Frontend users must not be allowed to forge audit history.
 */

import { apiClient } from "./api-client";

export type AuditAction =
  | "record.created"
  | "record.viewed"
  | "record.updated"
  | "record.deleted"
  | "record.submitted"
  | "record.reviewed"
  | "record.approved"
  | "record.rejected"
  | "user.logged_in"
  | "user.logged_out"
  | "permission.changed"
  | "file.uploaded"
  | "file.deleted"
  | "backup.created"
  | "backup.restored";

export interface AuditEventInput {
  action: AuditAction;
  sectorId?: string;
  recordId?: string;
  description: string;
}

export interface AuditEvent {
  id: string;
  action: AuditAction;
  actorUserId: string;
  sectorId?: string;
  recordId?: string;
  description: string;
  createdAt: string;
}

export interface AuditQuery {
  action?: AuditAction;
  actorUserId?: string;
  sectorId?: string;
  recordId?: string;
  createdAfter?: string;
  createdBefore?: string;
  limit?: number;
  offset?: number;
}

export interface AuditListResponse {
  items: AuditEvent[];
  total: number;
  limit: number;
  offset: number;
}

function buildAuditQuery(query: AuditQuery): string {
  const params = new URLSearchParams();

  for (const [key, value] of Object.entries(query)) {
    if (value !== undefined && value !== "") {
      params.set(key, String(value));
    }
  }

  const queryString = params.toString();

  return queryString ? `?${queryString}` : "";
}

export const auditService = {
  /**
   * Request that the server record an important activity.
   *
   * The server must verify the authenticated user and
   * determine the trustworthy event details itself.
   */
  async recordActivity(
    event: AuditEventInput,
  ): Promise<AuditEvent> {
    return apiClient.post<AuditEvent>("/audit-events", event);
  },

  /**
   * Retrieve audit history using filters.
   *
   * The server must restrict access to authorized users.
   */
  async list(
    query: AuditQuery = {},
  ): Promise<AuditListResponse> {
    const queryString = buildAuditQuery(query);

    return apiClient.get<AuditListResponse>(
      `/audit-events${queryString}`,
    );
  },

  /**
   * Retrieve the audit history for a specific record.
   */
  async getRecordHistory(
    recordId: string,
  ): Promise<AuditListResponse> {
    return apiClient.get<AuditListResponse>(
      `/records/${encodeURIComponent(recordId)}/audit-history`,
    );
  },
};
