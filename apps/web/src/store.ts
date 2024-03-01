import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";

import { mountStoreDevtool } from "simple-zustand-devtools";

interface AppState {
  isSidebarOpen: boolean;
  isSettingsSidebarOpen: boolean;
  toggleSidebar: () => void;
  toggleSettingsSidebar: () => void;
}

export const useAppState = create(
  persist<AppState>(
    (set, get) => ({
      isSidebarOpen: true,
      toggleSidebar: () => set({ isSidebarOpen: !get().isSidebarOpen }),
      isSettingsSidebarOpen: true,
      toggleSettingsSidebar: () =>
        set({ isSettingsSidebarOpen: !get().isSettingsSidebarOpen }),
    }),
    {
      name: "app-state",
      storage: createJSONStorage(() => localStorage),
    },
  ),
);

if (process.env.NODE_ENV === "development") {
  mountStoreDevtool("Store", useAppState);
}
