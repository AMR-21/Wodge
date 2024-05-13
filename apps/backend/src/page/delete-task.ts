import { RunnerParams } from "../lib/replicache";
import { produce } from "immer";
import { createColumnMutation } from "@repo/data/models/page/mutators/create-column";
import PageParty from "./page-party";
import { CreateTaskArgs } from "@repo/data";
import { editTaskMutation } from "@repo/data/models/page/mutators/edit-task";
import { deleteTaskMutation } from "@repo/data/models/page/mutators/delete-task";

export async function deleteTask(party: PageParty, params: RunnerParams) {
  const args = params.mutation.args as CreateTaskArgs;
  const d = deleteTaskMutation({
    boardId: args.boardId,
    task: args.task,
    boards: party.boards.data,
  });

  party.boards = produce(party.boards, (draft) => {
    draft.data = d;
    draft.lastModifiedVersion = params.nextVersion;
  });

  await party.room.storage.put("boards", party.boards);
}
