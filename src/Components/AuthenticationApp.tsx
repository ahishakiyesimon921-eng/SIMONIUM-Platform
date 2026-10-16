import type { ReactNode } from "react";

import { AuthProvider } from "../contexts/AuthContext";
import AuthGate from "./AuthGate";
import "../components/AuthPanel.css";

interface AuthenticatedAppProps {
  children: ReactNode;
}

/**
 * Provides authentication services and protects the application UI.
 *
 * Wrap the main SIMONIUM application with this component so that
 * authentication state is available throughout the application.
 */
export default function AuthenticatedApp({
  children,
}: AuthenticatedAppProps) {
  return (
    <AuthProvider>
      <AuthGate>{children}</AuthGate>
    </AuthProvider>
  );
}
