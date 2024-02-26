import type * as Party from "partykit/server";
import WorkspaceParty from "../workspace-party";
import { RunnerParams, repPush } from "../../lib/replicache";

export async function workspacePush(req: Party.Request, party: WorkspaceParty) {
  // return await repPush
}

function runner(party: WorkspaceParty) {
  return async ({ mutation, nextVersion, storage }: RunnerParams) => {
    switch (mutation.name) {
    }
  };
}
