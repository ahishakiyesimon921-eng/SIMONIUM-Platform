/**
 * SIMONIUM File Management Service
 *
 * Provides shared file upload, retrieval, listing,
 * and deletion requests for platform sectors.
 *
 * IMPORTANT:
 * Files must be stored and protected by the backend.
 * The server must enforce access permissions, validate
 * file content, and apply upload size limits.
 */

import { apiClient } from "./api-client";

export interface PlatformFile {
  id: string;
  fileName: string;
  mimeType: string;
  size: number;
  sectorId: string;
  recordId?: string;
  uploadedBy: string;
  createdAt: string;
}

export interface FileListQuery {
  sectorId?: string;
  recordId?: string;
  uploadedBy?: string;
  limit?: number;
  offset?: number;
}

export interface FileListResponse {
  items: PlatformFile[];
  total: number;
  limit: number;
  offset: number;
}

function buildQueryString(query: FileListQuery): string {
  const params = new URLSearchParams();

  for (const [key, value] of Object.entries(query)) {
    if (value !== undefined && value !== "") {
      params.set(key, String(value));
    }
  }

  const queryString = params.toString();

  return queryString ? `?${queryString}` : "";
}

export const fileService = {
  /**
   * Upload a file to the backend.
   */
  async upload(
    file: File,
    sectorId: string,
    recordId?: string,
  ): Promise<PlatformFile> {
    const formData = new FormData();

    formData.append("file", file);
    formData.append("sectorId", sectorId);

    if (recordId) {
      formData.append("recordId", recordId);
    }

    return apiClient.post<PlatformFile>(
      "/files",
      formData,
    );
  },

  /**
   * List files accessible to the authenticated user.
   */
  async list(
    query: FileListQuery = {},
  ): Promise<FileListResponse> {
    return apiClient.get<FileListResponse>(
      `/files${buildQueryString(query)}`,
    );
  },

  /**
   * Retrieve file metadata.
   */
  async getById(fileId: string): Promise<PlatformFile> {
    return apiClient.get<PlatformFile>(
      `/files/${encodeURIComponent(fileId)}`,
    );
  },

  /**
   * Request a protected download URL from the backend.
   *
   * The server must verify access before returning a URL.
   */
  async getDownloadUrl(fileId: string): Promise<{ url: string }> {
    return apiClient.get<{ url: string }>(
      `/files/${encodeURIComponent(fileId)}/download`,
    );
  },

  /**
   * Request deletion of a file.
   *
   * The backend must check permissions and retention rules.
   */
  async delete(fileId: string): Promise<void> {
    await apiClient.delete<void>(
      `/files/${encodeURIComponent(fileId)}`,
    );
  },
};
