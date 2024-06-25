import { ok, unauthorized } from "@/lib/http-utils";
import { serviceMiddleware } from "../../lib/service-middleware";
import { authChannel } from "../handlers/auth-channel";
import { channelPoke } from "../handlers/channel-poke";
import { poke } from "../handlers/poke";
import { isAdmin } from "../handlers/is-admin";
import { getMembership } from "../handlers/get-membership";
import { memberUpdateHandler } from "../handlers/member-update";
import { handlePresence } from "../handlers/presence";
import WorkspaceParty from "../workspace-party";

export function setupServiceRoutes(party: WorkspaceParty) {
  party.app.use("/service/*", serviceMiddleware.bind(null, party.room));
  party.app.get("/service/membership", getMembership.bind(null, party));
  party.app.get("/service/auth-channel", authChannel.bind(null, party));
  party.app.post("/service/presence", handlePresence.bind(null, party));
  party.app.get("/service/isAdmin", isAdmin.bind(null, party));

  party.app.post(
    "/service/member-update",
    memberUpdateHandler.bind(null, party)
  );
  party.app.post("/service/poke-channel", channelPoke.bind(null, party));

  party.app.post("/service/poke", poke.bind(null, party));
}
