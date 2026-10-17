export type ErrorSeverity = "info" | "warning" | "error" | "critical";

export interface AppError {
  code: string;
  message: string;
  severity: ErrorSeverity;
  timestamp: string;
}

type ErrorListener = (error: AppError) => void;

const listeners = new Set<ErrorListener>();

const USER_MESSAGES: Record<string, string> = {
  NETWORK_ERROR: "Connection problem. Please check your internet.",
  AUTH_REQUIRED: "Please sign in to continue.",
  PERMISSION_DENIED: "You are not allowed to perform this action.",
  VALIDATION_ERROR: "Please check the information you entered.",
  NOT_FOUND: "The requested information could not be found.",
  STORAGE_ERROR: "The file operation could not be completed.",
  DATABASE_ERROR: "The information could not be saved or loaded.",
  UNKNOWN_ERROR: "Something went wrong. Please try again.",
};

/**
 * Subscribe to application errors.
 * Returns a function that removes the listener.
 */
export function subscribeToErrors(
  listener: ErrorListener,
): () => void {
  listeners.add(listener);

  return () => {
    listeners.delete(listener);
  };
}

/**
 * Convert an error code into a user-friendly message.
 */
export function getUserErrorMessage(code: string): string {
  return USER_MESSAGES[code] ?? USER_MESSAGES.UNKNOWN_ERROR;
}

/**
 * Report an application error without exposing sensitive details.
 *
 * This service does not send errors to an external server.
 */
export function reportError(
  code: string,
  severity: ErrorSeverity = "error",
): AppError {
  const safeCode = USER_MESSAGES[code]
    ? code
    : "UNKNOWN_ERROR";

  const error: AppError = {
    code: safeCode,
    message: getUserErrorMessage(safeCode),
    severity,
    timestamp: new Date().toISOString(),
  };

  for (const listener of listeners) {
    try {
      listener(error);
    } catch {
      // A failing listener must not break error reporting.
    }
  }

  return error;
}

/**
 * Clear all registered listeners.
 */
export function clearErrorListeners(): void {
  listeners.clear();
}
