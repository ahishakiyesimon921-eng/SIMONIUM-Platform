export interface ValidationResult {
  valid: boolean;
  errors: string[];
}

export interface RecordInput {
  title: string;
  description: string;
  moduleId: string;
  recordType: string;
}

const ALLOWED_MODULES = [
  "health",
  "education",
  "research-discovery",
  "community",
];

const MAX_TITLE_LENGTH = 150;
const MAX_DESCRIPTION_LENGTH = 10000;

/**
 * Validate a platform record before submission.
 *
 * This is client-side validation only.
 * The server must validate the data again.
 */
export function validateRecordInput(
  input: RecordInput,
): ValidationResult {
  const errors: string[] = [];

  if (!input.title || !input.title.trim()) {
    errors.push("A title is required.");
  } else if (input.title.trim().length > MAX_TITLE_LENGTH) {
    errors.push(
      `The title must not exceed ${MAX_TITLE_LENGTH} characters.`,
    );
  }

  if (!input.description || !input.description.trim()) {
    errors.push("A description is required.");
  } else if (
    input.description.trim().length > MAX_DESCRIPTION_LENGTH
  ) {
    errors.push(
      `The description must not exceed ${MAX_DESCRIPTION_LENGTH} characters.`,
    );
  }

  if (!input.moduleId || !input.moduleId.trim()) {
    errors.push("A platform module is required.");
  } else if (!ALLOWED_MODULES.includes(input.moduleId)) {
    errors.push("The selected platform module is not supported.");
  }

  if (!input.recordType || !input.recordType.trim()) {
    errors.push("A record type is required.");
  } else if (input.recordType.trim().length > 80) {
    errors.push("The record type must not exceed 80 characters.");
  }

  return {
    valid: errors.length === 0,
    errors,
  };
}

/**
 * Validate a search query.
 */
export function validateSearchQuery(
  query: string,
): ValidationResult {
  const errors: string[] = [];

  if (typeof query !== "string") {
    errors.push("The search query must be text.");
  } else if (query.length > 200) {
    errors.push("The search query must not exceed 200 characters.");
  }

  return {
    valid: errors.length === 0,
    errors,
  };
}

/**
 * Validate an email address for basic input checks.
 *
 * This does not verify that the address actually exists.
 */
export function validateEmail(
  email: string,
): ValidationResult {
  const errors: string[] = [];

  if (typeof email !== "string" || !email.trim()) {
    errors.push("An email address is required.");
  } else {
    const normalizedEmail = email.trim();

    if (normalizedEmail.length > 254) {
      errors.push("The email address is too long.");
    } else if (
      !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(normalizedEmail)
    ) {
      errors.push("Enter a valid email address.");
    }
  }

  return {
    valid: errors.length === 0,
    errors,
  };
}

/**
 * Validate a password before authentication.
 *
 * Authentication and password security must still be
 * enforced by the authentication provider.
 */
export function validatePassword(
  password: string,
): ValidationResult {
  const errors: string[] = [];

  if (typeof password !== "string") {
    errors.push("The password must be text.");
  } else if (password.length < 8) {
    errors.push("The password must contain at least 8 characters.");
  } else if (password.length > 128) {
    errors.push("The password must not exceed 128 characters.");
  }

  return {
    valid: errors.length === 0,
    errors,
  };
}
