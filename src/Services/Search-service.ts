import { getSupabaseClient } from "../lib/supabase";

export interface SearchOptions {
  query: string;
  moduleId?: string;
  recordType?: string;
  status?: string;
  limit?: number;
}

export interface SearchResult {
  id: string;
  title: string;
  description: string | null;
  moduleId: string;
  recordType: string;
  status: string;
  createdAt: string;
  updatedAt: string | null;
}

interface PlatformRecordRow {
  id: string;
  title: string;
  description: string | null;
  module_id: string;
  record_type: string;
  status: string;
  created_at: string;
  updated_at: string | null;
}

/**
 * Search platform records using Supabase.
 *
 * Actual access is controlled by database Row Level Security (RLS).
 */
export async function searchRecords(
  options: SearchOptions,
): Promise<SearchResult[]> {
  const client = getSupabaseClient();

  if (!client) {
    throw new Error(
      "SIMONIUM search is unavailable. Check your Supabase configuration.",
    );
  }

  const query = options.query.trim();
  const limit = options.limit ?? 20;

  if (!Number.isInteger(limit) || limit < 1 || limit > 100) {
    throw new Error("Search limit must be between 1 and 100.");
  }

  if (
    options.status &&
    ![
      "draft",
      "submitted",
      "approved",
      "rejected",
      "needs_correction",
    ].includes(options.status)
  ) {
    throw new Error("The selected record status is invalid.");
  }

  let request = client
    .from("platform_records")
    .select(
      "id, title, description, module_id, record_type, status, created_at, updated_at",
    )
    .order("created_at", { ascending: false })
    .limit(limit);

  if (query) {
    // Escape characters that have special meaning in PostgREST filters.
    const escapedQuery = query.replace(/[,%()"]/g, " ");

    request = request.or(
      `title.ilike.%${escapedQuery}%,description.ilike.%${escapedQuery}%`,
    );
  }

  if (options.moduleId) {
    request = request.eq("module_id", options.moduleId);
  }

  if (options.recordType) {
    request = request.eq("record_type", options.recordType);
  }

  if (options.status) {
    request = request.eq("status", options.status);
  }

  const { data, error } = await request;

  if (error) {
    throw new Error(`Search failed: ${error.message}`);
  }

  return ((data ?? []) as PlatformRecordRow[]).map((record) => ({
    id: record.id,
    title: record.title,
    description: record.description,
    moduleId: record.module_id,
    recordType: record.record_type,
    status: record.status,
    createdAt: record.created_at,
    updatedAt: record.updated_at,
  }));
}
