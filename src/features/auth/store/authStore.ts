import { create } from "zustand";
import { supabase } from "../../services/supabase";
import type { User, Session } from "@supabase/supabase-js";

interface AuthState {
  isAuthenticated: boolean;
  user: User | null;
  session: Session | null;
  role: string;
  setAuth: (session: Session | null, user: User | null, role?: string) => void;
  logout: () => Promise<void>;
}

export const useAuthStore = create<AuthState>()((set) => ({
  isAuthenticated: false,
  user: null,
  session: null,
  role: "client", // default role

  setAuth: (session, user, role) =>
    set({
      isAuthenticated: !!session,
      user,
      session,
      role: role || user?.user_metadata?.role || "client",
    }),

  logout: async () => {
    await supabase.auth.signOut();
    set({
      isAuthenticated: false,
      user: null,
      session: null,
      role: "client",
    });
  },
}));

// Set up listener for auth state changes
supabase.auth.onAuthStateChange((_event, session) => {
  const user = session?.user || null;
  useAuthStore.getState().setAuth(session, user);
});

// Fetch initial session
supabase.auth.getSession().then(({ data: { session } }) => {
  const user = session?.user || null;
  useAuthStore.getState().setAuth(session, user);
});
