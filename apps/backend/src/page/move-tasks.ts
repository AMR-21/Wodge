import { RunnerParams } from "../lib/replicache";
import { produce } from "immer";
import PageParty from "./page-party";
import { MoveColumnsArgs, MoveTasksArgs } from "@repo/data";
import { moveTasksMutation } from "@repo/data/models/page/mutators/move-tasks";

export async function moveTasks(party: PageParty, params: RunnerParams) {
  const args = params.mutation.args as MoveTasksArgs;
  const d = moveTasksMutation({
    boardId: args.boardId,
    t1: args.t1,
    tOrC2: args.tOrC2,
    isOverColumn: args.isOverColumn,
    boards: party.boards.data,
  });

  party.boards = produce(party.boards, (draft) => {
    draft.data = d;
    draft.lastModifiedVersion = params.nextVersion;
  });

  await party.room.storage.put("boards", party.boards);
}
