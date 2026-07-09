import { create } from "zustand";
import { persist } from "zustand/middleware";

interface ThemeState {
    theme: "light" | "dark";
    toggleTheme: () => void;
}

export const useThemeStore = create<ThemeState>()(
    persist(
        (set, get) => ({
            theme: "light",
            toggleTheme: () => {
                const next = get().theme === "light" ? "dark" : "light";
                set({ theme: next });
                if (next === "dark") {
                    document.documentElement.classList.add("dark");
                } else {
                    document.documentElement.classList.remove("dark");
                }
            },
        }),
        {
            name: "ais-theme-storage",
            onRehydrateStorage: () => (state) => {
                // Re-apply class saat halaman load dari localStorage
                if (state?.theme === "dark") {
                    document.documentElement.classList.add("dark");
                }
            },
        },
    ),
);
