import type { SupabaseClient } from "@supabase/supabase-js";
import { getSupabaseClient } from "../lib/supabase";

export type RecordModule =
  | "health"
  | "education"
  | "research-discovery"
  | "community";

export type RecordStatus =
  | "draft"
  | "submitted"
  | "under_review"
  | "needs_correction"
  | "approved"
  | "rejected"
  | "archived";

export type RecordVisibility =
  | "private"
  | "institution"
  | "public";

export interface PlatformRecord {
  id: string;
  module_id: RecordModule;
  record_type: string;
  title: string;
  description: string;
  data: Record<string, unknown>;
  location: string | null;
  visibility: RecordVisibility;
  status: RecordStatus;
  created_by: string;
  reviewed_by: string | null;
  review_feedback: string | null;
  reviewed_at: string | null;
  created_at: string;
  updated_at: string;
}

export interface CreateRecordInput {
  moduleId: RecordModule;
  recordType: string;
  title: string;
  description: string;
  data?: Record<string, unknown>;
  location?: string;
  visibility?: RecordVisibility;
  status?: "draft" | "submitted";
}

export interface RecordSearchOptions {
  moduleId?: RecordModule;
  status?: RecordStatus;
  recordType?: string;
  searchText?: string;
  limit?: number;
}

export interface RecordServiceResult<T> {
  success: boolean;
  message: string;
  data?: T;
}

function getClient(): SupabaseClient {
  return getSupabaseClient();
}

function cleanText(value: string): string {
  return value.trim();
}

function validateCreateInput(
  input: CreateRecordInput,
): string | null {
  if (!cleanText(input.title)) {
    return "A record title is required.";
  }

  if (!cleanText(input.recordType)) {
    return "A record type is required.";
  }

  if (!cleanText(input.description)) {
    return "A record description is required.";
  }

  if (input.title.length > 200) {
    return "The title cannot exceed 200 characters.";
  }

  if (input.description.length > 10000) {
    return "The description is too long.";
  }

  if (input.location && input.location.length > 500) {
    return "The location information is too long.";
  }

  return null;
}

/**
 * Create a new record.
 */
export async function createRecord(
  input: CreateRecordInput,
): Promise<RecordServiceResult<PlatformRecord>> {
  const validationError = validateCreateInput(input);

  if (validationError) {
    return {
      success: false,
      message: validationError,
    };
  }

  const client = getClient();

  try {
    const {
      data: { user },
      error: userError,
    } = await client.auth.getUser();

    if (userError || !user) {
      return {
        success: false,
        message: "Please sign in before creating a record.",
      };
    }

    const record = {
      module_id: input.moduleId,
      record_type: cleanText(input.recordType),
      title: cleanText(input.title),
      description: cleanText(input.description),
      data: input.data ?? {},
      location: input.location
        ? cleanText(input.location)
        : null,
      visibility: input.visibility ?? "private",
      status: input.status ?? "submitted",
      created_by: user.id,
    };

    const { data, error } = await client
      .from("platform_records")
      .insert(record)
      .select("*")
      .single();

    if (error) {
      return {
        success: false,
        message: error.message,
      };
    }

    return {
      success: true,
      message: "Record created successfully.",
      data: data as PlatformRecord,
    };
  } catch {
    return {
      success: false,
      message: "Unable to create the record.",
    };
  }
}

/**
 * Retrieve records using filters.
 */
export async function getRecords(
  options: RecordSearchOptions = {},
): Promise<RecordServiceResult<PlatformRecord[]>> {
  const client = getClient();

  try {
    let query = client
      .from("platform_records")
      .select("*")
      .order("created_at", { ascending: false });

    if (options.moduleId) {
      query = query.eq("module_id", options.moduleId);
    }

    if (options.status) {
      query = query.eq("status", options.status);
    }

    if (options.recordType) {
      query = query.eq("record_type", options.recordType);
    }

    const limit = Math.min(
      Math.max(options.limit ?? 50, 1),
      100,
    );

    if (options.searchText?.trim()) {
      const search = options.searchText
        .trim()
        .replace(/[,%()]/g, " ")
        .slice(0, 100);

      if (search) {
        query = query.or(
          `title.ilike.%${search}%,description.ilike.%${search}%`,
        );
      }
    }

    query = query.limit(limit);

    const { data, error } = await query;

    if (error) {
      return {
        success: false,
        message: error.message,
      };
    }

    return {
      success: true,
      message: "Records retrieved successfully.",
      data: (data ?? []) as PlatformRecord[],
    };
  } catch {
    return {
      success: false,
      message: "Unable to retrieve records.",
    };
  }
}

/**
 * Retrieve one record.
 */
export async function getRecordById(
  recordId: string,
): Promise<RecordServiceResult<PlatformRecord>> {
  if (!recordId.trim()) {
    return {
      success: false,
      message: "A record ID is required.",
    };
  }

  const client = getClient();

  try {
    const { data, error } = await client
      .from("platform_records")
      .select("*")
      .eq("id", recordId)
      .maybeSingle();

    if (error) {
      return {
        success: false,
        message: error.message,
      };
    }

    if (!data) {
      return {
        success: false,
        message: "Record not found or access is not permitted.",
      };
    }

    return {
      success: true,
      message: "Record retrieved successfully.",
      data: data as PlatformRecord,
    };
  } catch {
    return {
      success: false,
      message: "Unable to retrieve the record.",
    };
  }
}

/**
 * Update record content.
 */
export async function updateRecord(
  recordId: string,
  changes: {
    title?: string;
    description?: string;
    data?: Record<string, unknown>;
    location?: string | null;
    visibility?: RecordVisibility;
  },
): Promise<RecordServiceResult<PlatformRecord>> {
  if (!recordId.trim()) {
    return {
      success: false,
      message: "A record ID is required.",
    };
  }

  const updates: Record<string, unknown> = {};

  if (changes.title !== undefined) {
    const title = cleanText(changes.title);

    if (!title || title.length > 200) {
      return {
        success: false,
        message: "Enter a valid title of up to 200 characters.",
      };
    }

    updates.title = title;
  }

  if (changes.description !== undefined) {
    const description = cleanText(changes.description);

    if (!description || description.length > 10000) {
      return {
        success: false,
        message: "Enter a valid record description.",
      };
    }

    updates.description = description;
  }

  if (changes.data !== undefined) {
    updates.data = changes.data;
  }

  if (changes.location !== undefined) {
    if (
      changes.location !== null &&
      changes.location.length > 500
    ) {
      return {
        success: false,
        message: "The location information is too long.",
      };
    }

    updates.location = changes.location;
  }

  if (changes.visibility !== undefined) {
    updates.visibility = changes.visibility;
  }

  if (Object.keys(updates).length === 0) {
    return {
      success: false,
      message: "No changes were provided.",
    };
  }

  const client = getClient();

  try {
    const { data, error } = await client
      .from("platform_records")
      .update(updates)
      .eq("id", recordId)
      .select("*")
      .maybeSingle();

    if (error) {
      return {
        success: false,
        message: error.message,
      };
    }

    if (!data) {
      return {
        success: false,
        message: "Record not found or update is not permitted.",
      };
    }

    return {
      success: true,
      message: "Record updated successfully.",
      data: data as PlatformRecord,
    };
  } catch {
    return {
      success: false,
      message: "Unable to update the record.",
    };
  }
}

/**
 * Submit a draft or corrected record for review.
 */
export async function submitRecordForReview(
  recordId: string,
): Promise<RecordServiceResult<PlatformRecord>> {
  if (!recordId.trim()) {
    return {
      success: false,
      message: "A record ID is required.",
    };
  }

  const client = getClient();

  try {
    const { data, error } = await client
      .from("platform_records")
      .update({
        status: "submitted",
        reviewed_by: null,
        reviewed_at: null,
        review_feedback: null,
      })
      .eq("id", recordId)
      .in("status", ["draft", "needs_correction"])
      .select("*")
      .maybeSingle();

    if (error) {
      return {
        success: false,
        message: error.message,
      };
    }

    if (!data) {
      return {
        success: false,
        message: "Record cannot be submitted in its current state.",
      };
    }

    return {
      success: true,
      message: "Record submitted for review.",
      data: data as PlatformRecord,
    };
  } catch {
    return {
      success: false,
      message: "Unable to submit the record for review.",
    };
  }
}

/**
 * Delete a record when database policies permit it.
 */
export async function deleteRecord(
  recordId: string,
): Promise<RecordServiceResult<null>> {
  if (!recordId.trim()) {
    return {
      success: false,
      message: "A record ID is required.",
    };
  }

  const client = getClient();

  try {
    const { data, error } = await client
      .from("platform_records")
      .delete()
      .eq("id", recordId)
      .select("id")
      .maybeSingle();

    if (error) {
      return {
        success: false,
        message: error.message,
      };
    }

    if (!data) {
      return {
        success: false,
        message: "Record not found or deletion is not permitted.",
      };
    }

    return {
      success: true,
      message: "Record deleted successfully.",
      data: null,
    };
  } catch {
    return {
      success: false,
      message: "Unable to delete the record.",
    };
  }
}
