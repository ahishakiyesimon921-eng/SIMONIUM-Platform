import { getSupabaseClient } from "../lib/supabase";

export type RecordReviewAction =
  | "approve"
  | "reject"
  | "request_correction";

export interface RecordReviewInput {
  recordId: string;
  action: RecordReviewAction;
  reviewNotes: string;
}

export interface RecordReviewResult {
  success: boolean;
  message: string;
  recordId?: string;
  status?: string;
}

const REVIEWER_ROLES = [
  "teacher",
  "researcher",
  "discoverer",
  "health-professional",
  "institution",
  "administrator",
] as const;

const ACTION_STATUS: Record<RecordReviewAction, string> = {
  approve: "approved",
  reject: "rejected",
  request_correction: "needs_correction",
};

/**
 * SIMONIUM record review workflow.
 *
 * This service supports the review of submitted records.
 * Actual authorization must also be enforced by database
 * permissions and secure server-side policies.
 */
export async function reviewPlatformRecord(
  input: RecordReviewInput,
): Promise<RecordReviewResult> {
  const recordId = input.recordId.trim();
  const reviewNotes = input.reviewNotes.trim();

  if (!recordId) {
    return {
      success: false,
      message: "A valid record ID is required.",
    };
  }

  if (!input.action || !(input.action in ACTION_STATUS)) {
    return {
      success: false,
      message: "Select a valid review action.",
    };
  }

  if (input.action !== "approve" && !reviewNotes) {
    return {
      success: false,
      message: "Explain the rejection or requested correction.",
    };
  }

  const supabase = getSupabaseClient();

  if (!supabase) {
    return {
      success: false,
      message:
        "Database connection is not configured. Check the Supabase settings.",
    };
  }

  try {
    // Confirm the authenticated user.
    const {
      data: authData,
      error: authError,
    } = await supabase.auth.getUser();

    if (authError || !authData.user) {
      return {
        success: false,
        message: "You must sign in before reviewing records.",
      };
    }

    const reviewerId = authData.user.id;

    // Read the reviewer's registered role and account status.
    const {
      data: profile,
      error: profileError,
    } = await supabase
      .from("profiles")
      .select("role_id, account_status")
      .eq("id", reviewerId)
      .maybeSingle();

    if (profileError || !profile) {
      return {
        success: false,
        message: "Your registered profile could not be verified.",
      };
    }

    if (profile.account_status !== "active") {
      return {
        success: false,
        message: "Your account is not active for this operation.",
      };
    }

    const roleId = String(profile.role_id);

    if (
      !REVIEWER_ROLES.includes(
        roleId as (typeof REVIEWER_ROLES)[number],
      )
    ) {
      return {
        success: false,
        message: "Your registered role cannot review records.",
      };
    }

    // Load the record to verify its current state.
    const {
      data: record,
      error: recordError,
    } = await supabase
      .from("platform_records")
      .select("id, created_by, status")
      .eq("id", recordId)
      .maybeSingle();

    if (recordError || !record) {
      return {
        success: false,
        message: "The requested record was not found or is inaccessible.",
      };
    }

    // A contributor must not approve their own submission.
    if (record.created_by === reviewerId) {
      return {
        success: false,
        message: "You cannot review your own record.",
      };
    }

    if (record.status !== "submitted") {
      return {
        success: false,
        message:
          "Only submitted records can enter this review process.",
      };
    }

    const nextStatus = ACTION_STATUS[input.action];

    // Database policies must independently validate this update.
    const {
      data: updatedRecord,
      error: updateError,
    } = await supabase
      .from("platform_records")
      .update({
        status: nextStatus,
        reviewed_by: reviewerId,
        reviewed_at: new Date().toISOString(),
        review_notes: reviewNotes || null,
        updated_at: new Date().toISOString(),
      })
      .eq("id", recordId)
      .eq("status", "submitted")
      .neq("created_by", reviewerId)
      .select("id, status")
      .maybeSingle();

    if (updateError) {
      return {
        success: false,
        message:
          "The review could not be saved. Check database permissions and configuration.",
      };
    }

    if (!updatedRecord) {
      return {
        success: false,
        message:
          "The record was not updated. It may have changed or your permissions may not allow this action.",
      };
    }

    const messages: Record<RecordReviewAction, string> = {
      approve: "The record has been approved.",
      reject: "The record has been rejected.",
      request_correction:
        "Corrections have been requested from the contributor.",
    };

    return {
      success: true,
      message: messages[input.action],
      recordId: updatedRecord.id,
      status: updatedRecord.status,
    };
  } catch {
    return {
      success: false,
      message:
        "An unexpected error occurred while processing the review.",
    };
  }
}
