import { RunnerParams } from "../lib/replicache";
import { produce } from "immer";
import { createColumnMutation } from "@repo/data/models/page/mutators/create-column";
import PageParty from "./page-party";
import { CreateColumnArgs, CreateTaskArgs } from "@repo/data";
import { createTaskMutation } from "@repo/data/models/page/mutators/create-task";
import { editTaskMutation } from "@repo/data/models/page/mutators/edit-task";
import { EditTaskArgs } from "@repo/data/models/page/page-mutators";

export async function editTask(party: PageParty, params: RunnerParams) {
  const args = params.mutation.args as EditTaskArgs;
  const d = editTaskMutation({
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
