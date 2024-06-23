import { produce } from "immer";
import { DrObj } from "../../..";
import { Task } from "../../../schemas/page.schema";

export function deleteTaskMutation({
  task,
  tasks,
}: {
  task: Task;
  tasks: Task[] | DrObj<Task[]>;
}) {
  const newTasks = produce(tasks, (draft) => {
    draft = draft.filter((t) => t.id !== task.id);

    return draft;
  });

  return newTasks as Task[];
}
