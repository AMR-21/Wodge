import { RunnerParams } from "../lib/replicache";
import { produce } from "immer";
import PageParty from "./page-party";
import { editTaskMutation } from "@repo/data/models/page/mutators/edit-task";
import { EditTaskArgs } from "@repo/data/models/page/page-mutators";

export async function editTask(party: PageParty, params: RunnerParams) {
  const args = params.mutation.args as EditTaskArgs;
  const newTasks = editTaskMutation({
    task: args.task,
    tasks: party.db.data.tasks,
  });

  party.db = produce(party.db, (draft) => {
    draft.data.tasks = newTasks;
    draft.lastModifiedVersion = params.nextVersion;
  });

  await party.room.storage.put("db", party.db);
}
