import { RunnerParams } from "../lib/replicache";
import { produce } from "immer";
import PageParty from "./page-party";
import { CreateColumnArgs } from "@repo/data";
import { updateColumnMutation } from "@repo/data/models/page/mutators/update-column";

export async function updateColumn(party: PageParty, params: RunnerParams) {
  const args = params.mutation.args as CreateColumnArgs;
  const d = updateColumnMutation({
    boardId: args.boardId,
    boards: party.boards.data,
    col: {
      id: args.id,
      title: args.title,
    },
  });

  party.boards = produce(party.boards, (draft) => {
    draft.data = d;
    draft.lastModifiedVersion = params.nextVersion;
  });

  await party.room.storage.put("boards", party.boards);
}
