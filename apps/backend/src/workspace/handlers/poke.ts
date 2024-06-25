import { Context } from "hono";
import WorkspaceParty from "../workspace-party";
import { ok, unauthorized } from "../../lib/http-utils";

export async function poke(party: WorkspaceParty, c: Context) {
  await party.poke({
    type: "workspaceInfo",
  });
  return ok();
}
