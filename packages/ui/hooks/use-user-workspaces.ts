import { useLocalUser } from "./use-local-user";
import { ReadTransaction } from "replicache";
import { makeWorkspacesStoreKey } from "@repo/data/keys";
import { useSubscribe } from "./use-subscribe";
import { UserWorkspacesStore } from "@repo/data/schemas";

export function useUserWorkspaces() {
  const user = useLocalUser();

  const { data: workspaces, isPending } = useSubscribe<UserWorkspacesStore>(
    user?.store,
    (tx: ReadTransaction) =>
      tx.get<UserWorkspacesStore>(makeWorkspacesStoreKey()),
  );

  return { workspaces, isPending };
}
