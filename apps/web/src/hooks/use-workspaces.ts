import { useLocalUser } from "./use-local-user";
import { useSubscribe } from "replicache-react";
import { SpaceStore } from "../../../../packages/data/client-models";

export function useWorkspaces() {
  const store = useLocalUser()?.store;
  const spaces = useSubscribe(
    store,
    async (tx) => tx.get("spaces"),
    {},
  ) as SpaceStore;

  return spaces;
}
