import {
  createClient,
  type SupabaseClient,
  type User,
  type Session,
} from "@supabase/supabase-js";

import type { PlatformUser } from "../types/access";
import { getSupabaseClient } from "../lib/supabase";

export interface AuthResult {
  success: boolean;
  message: string;
  user?: User;
  session?: Session | null;
}

export interface UserProfile {
  id: string;
  full_name: string;
  email: string;
  role_id: string;
  account_status: "pending" | "active" | "suspended";
  institution_id?: string | null;
  created_at?: string;
  updated_at?: string;
}

type ProfileResult = {
  profile: UserProfile | null;
  error: string | null;
};

function getClient(): SupabaseClient {
  return getSupabaseClient();
}

/**
 * Register a new SIMONIUM account.
 * New accounts must be verified and assigned an authorized role
 * before receiving protected permissions.
 */
export async function registerUser(input: {
  fullName: string;
  email: string;
  password: string;
}): Promise<AuthResult> {
  const client = getClient();

  const fullName = input.fullName.trim();
  const email = input.email.trim().toLowerCase();

  if (!fullName || !email || !input.password) {
    return {
      success: false,
      message: "Please complete all required fields.",
    };
  }

  if (input.password.length < 8) {
    return {
      success: false,
      message: "Password must contain at least 8 characters.",
    };
  }

  try {
    const { data, error } = await client.auth.signUp({
      email,
      password: input.password,
      options: {
        data: {
          full_name: fullName,
        },
      },
    });

    if (error) {
      return {
        success: false,
        message: error.message,
      };
    }

    return {
      success: true,
      message: data.session
        ? "Account created successfully."
        : "Account created. Check your email to verify it.",
      user: data.user ?? undefined,
      session: data.session,
    };
  } catch {
    return {
      success: false,
      message: "Unable to register. Check your connection and try again.",
    };
  }
}

/**
 * Sign in with email and password.
 */
export async function signInUser(
  emailInput: string,
  password: string,
): Promise<AuthResult> {
  const client = getClient();

  const email = emailInput.trim().toLowerCase();

  if (!email || !password) {
    return {
      success: false,
      message: "Email and password are required.",
    };
  }

  try {
    const { data, error } = await client.auth.signInWithPassword({
      email,
      password,
    });

    if (error) {
      return {
        success: false,
        message: error.message,
      };
    }

    return {
      success: true,
      message: "Signed in successfully.",
      user: data.user,
      session: data.session,
    };
  } catch {
    return {
      success: false,
      message: "Unable to sign in. Check your connection and try again.",
    };
  }
}

/**
 * Sign out the current user.
 */
export async function signOutUser(): Promise<AuthResult> {
  const client = getClient();

  try {
    const { error } = await client.auth.signOut();

    if (error) {
      return {
        success: false,
        message: error.message,
      };
    }

    return {
      success: true,
      message: "Signed out successfully.",
    };
  } catch {
    return {
      success: false,
      message: "Unable to sign out. Please try again.",
    };
  }
}

/**
 * Return the currently authenticated session.
 */
export async function getCurrentSession(): Promise<Session | null> {
  const client = getClient();

  try {
    const { data, error } = await client.auth.getSession();

    if (error) {
      return null;
    }

    return data.session;
  } catch {
    return null;
  }
}

/**
 * Return the currently authenticated user.
 */
export async function getCurrentUser(): Promise<User | null> {
  const client = getClient();

  try {
    const { data, error } = await client.auth.getUser();

    if (error) {
      return null;
    }

    return data.user;
  } catch {
    return null;
  }
}

/**
 * Listen for sign-in, sign-out, and session changes.
 * Call subscription.data.subscription.unsubscribe() when finished.
 */
export function listenToAuthChanges(
  callback: (user: User | null, session: Session | null) => void,
) {
  const client = getClient();

  return client.auth.onAuthStateChange((_event, session) => {
    callback(session?.user ?? null, session);
  });
}

/**
 * Send a password-reset email.
 */
export async function requestPasswordReset(
  emailInput: string,
): Promise<AuthResult> {
  const client = getClient();
  const email = emailInput.trim().toLowerCase();

  if (!email) {
    return {
      success: false,
      message: "Email is required.",
    };
  }

  try {
    const { error } = await client.auth.resetPasswordForEmail(email);

    if (error) {
      return {
        success: false,
        message: error.message,
      };
    }

    return {
      success: true,
      message: "If the account exists, password-reset instructions will be sent.",
    };
  } catch {
    return {
      success: false,
      message: "Unable to request a password reset. Try again later.",
    };
  }
}

/**
 * Retrieve a user's profile from the profiles table.
 * The table and its access policies must be configured in Supabase.
 */
export async function getUserProfile(
  userId: string,
): Promise<ProfileResult> {
  const client = getClient();

  if (!userId.trim()) {
    return {
      profile: null,
      error: "A valid user ID is required.",
    };
  }

  try {
    const { data, error } = await client
      .from("profiles")
      .select(
        "id, full_name, email, role_id, account_status, institution_id, created_at, updated_at",
      )
      .eq("id", userId)
      .maybeSingle();

    if (error) {
      return {
        profile: null,
        error: error.message,
      };
    }

    return {
      profile: data as UserProfile | null,
      error: null,
    };
  } catch {
    return {
      profile: null,
      error: "Unable to load the user profile.",
    };
  }
}

/**
 * Convert an approved profile into the platform user structure.
 * The database profile must be protected by server-side access policies.
 */
export function toPlatformUser(
  profile: UserProfile,
): PlatformUser {
  return {
    id: profile.id,
    email: profile.email,
    roleId: profile.role_id,
    accountStatus: profile.account_status,
  } as PlatformUser;
}

/**
 * Update the authenticated user's password.
 */
export async function updateCurrentPassword(
  newPassword: string,
): Promise<AuthResult> {
  const client = getClient();

  if (newPassword.length < 8) {
    return {
      success: false,
      message: "Password must contain at least 8 characters.",
    };
  }

  try {
    const { error } = await client.auth.updateUser({
      password: newPassword,
    });

    if (error) {
      return {
        success: false,
        message: error.message,
      };
    }

    return {
      success: true,
      message: "Password updated successfully.",
    };
  } catch {
    return {
      success: false,
      message: "Unable to update the password. Please try again.",
    };
  }
}
