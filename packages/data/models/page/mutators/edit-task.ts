import { produce } from "immer";
import { DrObj } from "../../..";
import { Task } from "../../../schemas/page.schema";

export function editTaskMutation({
  task,
  tasks,
}: {
  task: Task;
  tasks: Task[] | DrObj<Task[]>;
}) {
  const newTasks = produce(tasks, (draft) => {
    const taskIndex = draft?.findIndex((t) => t.id === task.id);

    if (taskIndex === -1) return draft;

    draft[taskIndex] = {
      ...task,
    };

    return draft;
  });

  return newTasks as Task[];
}
