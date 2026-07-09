import { create } from "zustand";
import { supabase } from "../../../services/supabase";
import type { User, Session, AuthChangeEvent } from "@supabase/supabase-js";

export interface Profile {
  id: string;
  username: string;
  full_name?: string;
  email?: string;
  phone?: string;
  address?: string;
  role: string;
}

interface AuthState {
  isAuthenticated: boolean;
  user: User | null;
  session: Session | null;
  profile: Profile | null;
  role: string;
  setAuth: (session: Session | null, user: User | null, role?: string) => Promise<void>;
  logout: () => Promise<void>;
}

export const useAuthStore = create<AuthState>()((set) => ({
  isAuthenticated: false,
  user: null,
  session: null,
  profile: null,
  role: "client", // default role

  setAuth: async (session, user, role) => {
    let currentProfile = null;
    
    if (user) {
      // Fetch real profile from DB
      const { data } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', user.id)
        .single();
        
      if (data) {
        currentProfile = data;
      }
    }
    
    set({
      isAuthenticated: !!session,
      user,
      session,
      profile: currentProfile,
      role: role || currentProfile?.role || user?.user_metadata?.role || "client",
    });
  },

  logout: async () => {
    await supabase.auth.signOut();
    set({
      isAuthenticated: false,
      user: null,
      session: null,
      profile: null,
      role: "client",
    });
  },
}));

// Set up listener for auth state changes
supabase.auth.onAuthStateChange(async (_event: AuthChangeEvent, session: Session | null) => {
  const user = session?.user || null;
  await useAuthStore.getState().setAuth(session, user);
});

// Fetch initial session
supabase.auth.getSession().then(async ({ data: { session } }) => {
  const user = session?.user || null;
  await useAuthStore.getState().setAuth(session, user);
});
