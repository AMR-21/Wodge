import { useLocalUser } from "./use-local-user";
import { WorkspacesStore } from "@repo/data/client-models";
import { ReadTransaction } from "replicache";
import { USER_WORKSPACES_STORE_PREFIX } from "@repo/data/prefixes";
import { useSubscribe } from "./use-subscribe";

export function useUserWorkspaces() {
  const user = useLocalUser();

  const { data: workspaces, isPending } = useSubscribe<WorkspacesStore>(
    user?.store,
    (tx: ReadTransaction) =>
      tx.get<WorkspacesStore>(USER_WORKSPACES_STORE_PREFIX),
  );

  return { workspaces, isPending };
}
