import { create } from "zustand";
import { persist } from "zustand/middleware";

type ThemeState = {
  dark: boolean;
  setDark: (value: boolean) => void;
};

export const useThemeStore = create<ThemeState>()(
  persist((set) => ({ dark: false, setDark: (dark) => set({ dark }) }), {
    name: "corvex-theme",
  }),
);
