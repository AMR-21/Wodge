import { useAppState } from "./store";

export const useUserStore = () => useAppState((s) => s.userStore);

export const useWorkspaceStore = (wid: string) =>
  useAppState((s) => s.workspaces[wid]);

export const useActions = () => useAppState((s) => s.actions);
