import { RunnerParams } from "../lib/replicache";
import { produce } from "immer";
import PageParty from "./page-party";
import { MoveColumnsArgs } from "@repo/data";
import { moveColumnsMutation } from "@repo/data/models/page/mutators/move-columns";

export async function moveColumns(party: PageParty, params: RunnerParams) {
  const args = params.mutation.args as MoveColumnsArgs;
  const d = moveColumnsMutation({
    boardId: args.boardId,
    c1: args.c1,
    c2: args.c2,
    boards: party.boards.data,
  });

  party.boards = produce(party.boards, (draft) => {
    draft.data = d;
    draft.lastModifiedVersion = params.nextVersion;
  });

  await party.room.storage.put("boards", party.boards);
}
