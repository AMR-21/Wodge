import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";

import { mountStoreDevtool } from "simple-zustand-devtools";

interface AppState {
  isSidebarOpen: boolean;

  toggleSidebar: () => void;
}

export const useAppState = create(
  persist<AppState>(
    (set, get) => ({
      isSidebarOpen: true,
      toggleSidebar: () => set({ isSidebarOpen: !get().isSidebarOpen }),
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
