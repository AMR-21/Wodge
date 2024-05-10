import { RunnerParams } from "../lib/replicache";
import { produce } from "immer";
import { createColumnMutation } from "@repo/data/models/page/mutators/create-column";
import PageParty from "./page-party";
import { CreateColumnArgs, CreateTaskArgs } from "@repo/data";
import { createTaskMutation } from "@repo/data/models/page/mutators/create-task";

export async function createTask(party: PageParty, params: RunnerParams) {
  const args = params.mutation.args as CreateTaskArgs;
  const d = createTaskMutation({
    boardId: args.boardId,
    task: args.task,
    boards: party.boards.data,
    col: args.col,
  });

  party.boards = produce(party.boards, (draft) => {
    draft.data = d;
    draft.lastModifiedVersion = params.nextVersion;
  });

  await party.room.storage.put("boards", party.boards);
}
