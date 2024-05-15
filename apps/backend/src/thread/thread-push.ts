import type * as Party from "partykit/server";
import { repPush, RunnerParams } from "../lib/replicache";
import { pokeWorkspace } from "../lib/utils";
import { badRequest } from "../lib/http-utils";
import ThreadParty from "./thread-party";
import { createComment } from "./create-comment";
import { Context, HonoRequest } from "hono";
import { editComment } from "./edit-comment";
import { deleteComment } from "./delete-comment";
import { createPost } from "./create-post";
import { deletePost } from "./delete-post";
import { editPost } from "./edit-post";
import { togglePost } from "./toggle-post";

export async function threadPush(party: ThreadParty, c: Context) {
  const wid = c.req.header("x-workspace-id");

  if (!wid) return badRequest();

  const res = await repPush({
    req: c.req,
    storage: party.room.storage,
    versions: party.versions,
    runner: runner(party, c.req),
  });

  if (res.status === 200) {
    await pokeWorkspace(wid, party);
  }

  return res;
}

function runner(party: ThreadParty, req: HonoRequest) {
  const isAdmin = req.header("x-admin") === "true";
  const isOwner = req.header("x-owner") === "true";
  const isTeamModerator = req.header("x-team-moderator") === "true";

  return async (params: RunnerParams) => {
    switch (params.mutation.name) {
      case "createComment":
        return await createComment(party, params);
      case "editComment":
        return await editComment(party, params);
      case "deleteComment":
        return await deleteComment(
          party,
          params,
          isAdmin || isOwner || isTeamModerator
        );

      case "createPost":
        return await createPost(
          party,
          params,
          isAdmin || isOwner || isTeamModerator
        );
      case "deletePost":
        return await deletePost(
          party,
          params,
          isAdmin || isOwner || isTeamModerator
        );
      case "togglePost":
        return await togglePost(
          party,
          params,
          isAdmin || isOwner || isTeamModerator
        );

      case "editPost":
        return await editPost(party, params);

      default:
        throw new Error("Unknown mutation: " + params.mutation.name);
    }
  };
}
