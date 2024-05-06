import { PokeMessage } from "@repo/data";
import { env } from "@repo/env";
import PartySocket from "partysocket";
import { useAppState } from "./store";
import { toast } from "sonner";
import { queryClient } from "@repo/data/lib/query-client";

export function createSocket(userId: string) {
  const socket = new PartySocket({
    host: env.NEXT_PUBLIC_BACKEND_DOMAIN,
    party: "user",
    room: userId,
  });

  const userStore = useAppState.getState().userStore;
  const { addWorkspace, removeWorkspace } = useAppState.getState().actions;

  socket.addEventListener("message", (e) => {
    const data = JSON.parse(e.data) as { sub: string } & PokeMessage;

    // console.log("socket message", data);

    if (data.sub === "poke") {
      switch (data.type) {
        case "workspace":
          if (!data.id) return;
          const workspaces = useAppState.getState().workspaces;
          const workspace = workspaces?.[data.id];
          let rep;

          if (!workspace) {
            rep = addWorkspace(data.id, userId);
          }

          queryClient.invalidateQueries({
            queryKey: ["invites", data.id],
          });

          queryClient.invalidateQueries({
            queryKey: ["user-workspaces"],
          });

          return rep ? rep.pull() : workspace?.pull();

        case "channel":
          const repCh = useAppState.getState().activeChanRep;
          if (repCh && data.id && repCh.name.includes(data.id)) repCh.pull();
          return;

        case "workspaceInfo":
          queryClient.invalidateQueries({
            queryKey: ["invites", data.id],
          });

          // queryClient.invalidateQueries({
          //   queryKey: ["resources", data.id],
          // });

          return queryClient.invalidateQueries({
            queryKey: ["user-workspaces"],
          });

        case "workspaceMembers":
          const workspaces2 = useAppState.getState().workspaces;
          if (data.id && workspaces2[data.id]) workspaces2[data.id]?.pull();
          return queryClient.invalidateQueries({
            queryKey: [data.id, "members"],
          });

        case "deleteWorkspace":
          if (!data.id) return;
          removeWorkspace(data.id);

          return queryClient.invalidateQueries({
            queryKey: ["user-workspaces"],
          });

        case "invite":
          return queryClient.invalidateQueries({
            queryKey: ["invites", data.id],
          });

        case "team-files":
          return queryClient.invalidateQueries({
            queryKey: ["resources", data.id],
          });
        default:
          userStore?.pull();
      }
    }
  });

  return socket;
}
