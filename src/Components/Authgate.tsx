import type { ReactNode } from "react";
import { useAuth } from "../contexts/AuthContext";
import AuthPanel from "./AuthPanel";

interface AuthGateProps {
  children: ReactNode;
}

/**
 * Controls access to authenticated areas of SIMONIUM.
 *
 * This component checks whether a user has signed in.
 * It does not replace server-side authorization or database security.
 */
export default function AuthGate({
  children,
}: AuthGateProps) {
  const { user, loading } = useAuth();

  if (loading) {
    return (
      <main className="auth-gate-loading">
        <div
          className="auth-gate-spinner"
          role="status"
          aria-label="Loading"
        />

        <h2>Loading SIMONIUM</h2>

        <p>Checking your authentication session...</p>
      </main>
    );
  }

  if (!user) {
    return <AuthPanel />;
  }

  return <>{children}</>;
}
