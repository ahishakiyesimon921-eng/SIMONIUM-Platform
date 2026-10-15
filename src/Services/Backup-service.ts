/**
 * SIMONIUM Backup and Restore Service
 *
 * Provides a shared interface for requesting backups,
 * checking backup history, and restoring data.
 *
 * IMPORTANT:
 * This service communicates with the backend.
 * It does not create backups or restore data by itself.
 *
 * The backend must enforce administrator permissions,
 * encryption, backup integrity checks, and audit logging.
 */

import { apiClient } from "./api-client";

export type BackupStatus =
  | "pending"
  | "in-progress"
  | "completed"
  | "failed";

export type RestoreStatus =
  | "pending"
  | "in-progress"
  | "completed"
  | "failed";

export interface BackupRecord {
  id: string;
  name: string;
  status: BackupStatus;
  createdAt: string;
  completedAt?: string;
  sizeBytes?: number;
  createdBy: string;
  checksum?: string;
}

export interface BackupListResponse {
  items: BackupRecord[];
  total: number;
}

export interface CreateBackupRequest {
  name: string;
  includeFiles: boolean;
  description?: string;
}

export interface RestoreRequest {
  backupId: string;
  confirmation: string;
}

export interface RestoreJob {
  id: string;
  backupId: string;
  status: RestoreStatus;
  requestedAt: string;
  completedAt?: string;
  requestedBy: string;
  message?: string;
}

export const backupService = {
  /**
   * Request creation of a new backup.
   *
   * The backend must verify that the authenticated user
   * is authorized to perform this operation.
   */
  async createBackup(
    request: CreateBackupRequest,
  ): Promise<BackupRecord> {
    return apiClient.post<BackupRecord>(
      "/admin/backups",
      request,
    );
  },

  /**
   * Retrieve backup history accessible to the user.
   */
  async listBackups(): Promise<BackupListResponse> {
    return apiClient.get<BackupListResponse>(
      "/admin/backups",
    );
  },

  /**
   * Retrieve information about a specific backup.
   */
  async getBackup(
    backupId: string,
  ): Promise<BackupRecord> {
    return apiClient.get<BackupRecord>(
      `/admin/backups/${encodeURIComponent(backupId)}`,
    );
  },

  /**
   * Request restoration from a selected backup.
   *
   * The backend must validate the backup, verify permissions,
   * protect current data, and record the operation in the
   * audit trail before carrying out a restoration.
   *
   * The confirmation value must follow the confirmation
   * procedure defined by the backend.
   */
  async restoreBackup(
    request: RestoreRequest,
  ): Promise<RestoreJob> {
    return apiClient.post<RestoreJob>(
      `/admin/backups/${encodeURIComponent(request.backupId)}/restore`,
      {
        confirmation: request.confirmation,
      },
    );
  },

  /**
   * Retrieve the current status of a restoration job.
   */
  async getRestoreStatus(
    jobId: string,
  ): Promise<RestoreJob> {
    return apiClient.get<RestoreJob>(
      `/admin/restore-jobs/${encodeURIComponent(jobId)}`,
    );
  },
};
