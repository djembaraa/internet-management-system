import { create } from "zustand";
import { persist } from "zustand/middleware";

interface AuthState {
  isAuthenticated: boolean;
  user: { username: string; role: string } | null;
  token: string | null;
  login: (userData: { username: string; role: string }, token: string) => void;
  logout: () => void;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      isAuthenticated: false,
      user: null,
      token: null,

      login: (userData, token) =>
        set({
          isAuthenticated: true,
          user: userData,
          token: token,
        }),

      logout: () =>
        set({
          isAuthenticated: false,
          user: null,
          token: null,
        }),
    }),
    {
      name: "ais-auth-storage",
    },
  ),
);
