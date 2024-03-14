import { useAppState } from "./store";

export const useUserStore = () => useAppState((s) => s.userStore);
