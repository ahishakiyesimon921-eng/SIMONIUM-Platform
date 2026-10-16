import {
  createContext,
  useContext,
  useEffect,
  useState,
  type ReactNode,
} from "react";

import type { User, Session } from "@supabase/supabase-js";

import {
  listenToAuthChanges,
  registerUser,
  signInUser,
  signOutUser,
  requestPasswordReset,
  updateCurrentPassword,
} from "../services/auth-service";

import type { AuthResult } from "../services/auth-service";

interface AuthContextValue {
  user: User | null;
  session: Session | null;
  loading: boolean;
  isAuthenticated: boolean;

  register: (
    fullName: string,
    email: string,
    password: string,
  ) => Promise<AuthResult>;

  signIn: (
    email: string,
    password: string,
  ) => Promise<AuthResult>;

  signOut: () => Promise<AuthResult>;

  resetPassword: (email: string) => Promise<AuthResult>;

  changePassword: (newPassword: string) => Promise<AuthResult>;
}

const AuthContext = createContext<AuthContextValue | undefined>(
  undefined,
);

interface AuthProviderProps {
  children: ReactNode;
}

export function AuthProvider({
  children,
}: AuthProviderProps) {
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const { data } = listenToAuthChanges(
      (currentUser, currentSession) => {
        setUser(currentUser);
        setSession(currentSession);
        setLoading(false);
      },
    );

    return () => {
      data.subscription.unsubscribe();
    };
  }, []);

  async function register(
    fullName: string,
    email: string,
    password: string,
  ): Promise<AuthResult> {
    return registerUser({
      fullName,
      email,
      password,
    });
  }

  async function signIn(
    email: string,
    password: string,
  ): Promise<AuthResult> {
    return signInUser(email, password);
  }

  async function signOut(): Promise<AuthResult> {
    return signOutUser();
  }

  async function resetPassword(
    email: string,
  ): Promise<AuthResult> {
    return requestPasswordReset(email);
  }

  async function changePassword(
    newPassword: string,
  ): Promise<AuthResult> {
    return updateCurrentPassword(newPassword);
  }

  const value: AuthContextValue = {
    user,
    session,
    loading,
    isAuthenticated: user !== null,
    register,
    signIn,
    signOut,
    resetPassword,
    changePassword,
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
}

/**
 * Access SIMONIUM authentication from React components.
 * This hook must be used inside AuthProvider.
 */
export function useAuth(): AuthContextValue {
  const context = useContext(AuthContext);

  if (!context) {
    throw new Error(
      "useAuth must be used inside an AuthProvider.",
    );
  }

  return context;
}
