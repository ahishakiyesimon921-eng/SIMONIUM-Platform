/**
 * SIMONIUM Shared Record Service
 *
 * Provides common operations for records across platform
 * sectors, including Health, Education, Research & Discovery,
 * Community, and future sectors.
 *
 * IMPORTANT:
 * Actual data storage, access control, validation,
 * and deletion rules must be enforced by the backend.
 */

import { apiClient } from "./api-client";
import type { BaseRecord } from "../types/shared-records";

export interface RecordListQuery {
  sectorId?: string;
  recordType?: string;
  createdBy?: string;
  status?: string;
  visibility?: string;
  searchText?: string;
  createdAfter?: string;
  createdBefore?: string;
  limit?: number;
  offset?: number;
}

export interface RecordListResponse<T extends BaseRecord> {
  items: T[];
  total: number;
  limit: number;
  offset: number;
}

function buildQueryString(query: RecordListQuery): string {
  const params = new URLSearchParams();

  for (const [key, value] of Object.entries(query)) {
    if (value !== undefined && value !== "") {
      params.set(key, String(value));
    }
  }

  const queryString = params.toString();

  return queryString ? `?${queryString}` : "";
}

export const recordService = {
  /**
   * Create a new record.
   */
  async create<T extends BaseRecord>(
    record: Omit<BaseRecord, "id">,
  ): Promise<T> {
    return apiClient.post<T>("/records", record);
  },

  /**
   * Retrieve a single record by its identifier.
   */
  async getById<T extends BaseRecord>(
    recordId: string,
  ): Promise<T> {
    return apiClient.get<T>(
      `/records/${encodeURIComponent(recordId)}`,
    );
  },

  /**
   * Search and retrieve records using filters.
   */
  async list<T extends BaseRecord>(
    query: RecordListQuery = {},
  ): Promise<RecordListResponse<T>> {
    const queryString = buildQueryString(query);

    return apiClient.get<RecordListResponse<T>>(
      `/records${queryString}`,
    );
  },

  /**
   * Update an existing record.
   */
  async update<T extends BaseRecord>(
    recordId: string,
    changes: Partial<
      Pick<BaseRecord, "title" | "description" | "status" | "visibility">
    >,
  ): Promise<T> {
    return apiClient.patch<T>(
      `/records/${encodeURIComponent(recordId)}`,
      changes,
    );
  },

  /**
   * Request deletion of a record.
   *
   * The backend must check authorization, retention rules,
   * record relationships, and audit requirements.
   */
  async delete(recordId: string): Promise<void> {
    await apiClient.delete<void>(
      `/records/${encodeURIComponent(recordId)}`,
    );
  },
};
