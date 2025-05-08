import { create } from "zustand";
import { persist } from "zustand/middleware";

interface AuthState {
  isAuthenticated: boolean;
  login: (username?: string, password?: string) => Promise<void>;
  logout: () => void;
}

const HARDCODED_USERNAME = "admin";
const HARDCODED_PASSWORD = "password";

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      isAuthenticated: false,
      login: async (username, password) => {
        return new Promise<void>((resolve, reject) => {
          if (
            username === HARDCODED_USERNAME &&
            password === HARDCODED_PASSWORD
          ) {
            set({ isAuthenticated: true });
            resolve();
          } else {
            set({ isAuthenticated: false });
            reject(new Error("Invalid username or password"));
          }
        });
      },
      logout: () => {
        set({ isAuthenticated: false });
      },
    }),
    {
      name: "auth-storage", // name of the item in the storage (must be unique)
    }
  )
);

// Optional: export a selector for convenience
export const selectIsAuthenticated = (state: AuthState) =>
  state.isAuthenticated;
