import { create } from "zustand";
import { persist } from "zustand/middleware";
import type { User } from "@/types";

type AuthState = {
  token: string | null;
  user: User | null;
  login: (email: string, password: string) => boolean;
  demoLogin: () => void;
  logout: () => void;
};

const makeUser = (email: string): User => ({
  id: "usr_demo",
  name: email.startsWith("demo") ? "Maya Chen" : email.split("@")[0] || "Analyst",
  email,
  company: "Northstar Capital",
  plan: "Team",
});

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      token: null,
      user: null,
      login: (email, password) => {
        if (!email.trim() || !password.trim()) return false;
        set({ token: "corvex_demo_token", user: makeUser(email) });
        return true;
      },
      demoLogin: () =>
        set({ token: "corvex_demo_token", user: makeUser("demo@corvex.example") }),
      logout: () => set({ token: null, user: null }),
    }),
    { name: "corvex-auth" },
  ),
);
