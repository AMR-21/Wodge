import { RunnerParams } from "../lib/replicache";
import { produce } from "immer";
import { createColumnMutation } from "@repo/data/models/page/mutators/create-column";
import PageParty from "./page-party";
import { CreateColumnArgs } from "@repo/data";
import { deleteColumnMutation } from "@repo/data/models/page/mutators/delete-column";

export async function deleteColumn(party: PageParty, params: RunnerParams) {
  const args = params.mutation.args as CreateColumnArgs;
  const d = deleteColumnMutation({
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
