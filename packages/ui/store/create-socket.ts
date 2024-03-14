import { PokeMessage } from "@repo/data";
import { env } from "@repo/env";
import PartySocket from "partysocket";
import { useAppState } from "./store";

export function createSocket(userId: string) {
  const socket = new PartySocket({
    host: env.NEXT_PUBLIC_BACKEND_DOMAIN,
    party: "user",
    room: userId,
  });

  const userStore = useAppState.getState().userStore;
  const { addWorkspace } = useAppState.getState().actions;

  socket.addEventListener("message", (e) => {
    const data = JSON.parse(e.data) as { sub: string } & PokeMessage;

    if (data.sub === "poke") {
      switch (data.type) {
        case "workspace":
          if (!data.id) return;
          const workspaces = useAppState.getState().workspaces;
          const workspace = workspaces?.[data.id];
          let rep;

          if (!workspace) {
            rep = addWorkspace(data.id, "cloud", userId);
          }

          return rep ? rep.pull() : workspace?.pull();

        case "channel":
          return;
        default:
          userStore?.pull();
      }
    }
  });

  return socket;
}
