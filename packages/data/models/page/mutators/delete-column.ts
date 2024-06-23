import { produce } from "immer";
import { DrObj } from "../../..";
import { Column, Task } from "../../../schemas/page.schema";

export function deleteColumnMutation({
  col,
  columns,
  tasks,
}: {
  col: Column;
  columns: Column[] | DrObj<Column[]>;
  tasks: Task[] | DrObj<Task[]>;
}) {
  const newColumns = produce(columns, (draft) => {
    draft = draft.filter((c) => c.id !== col.id);

    return draft;
  }) as Column[];

  const newTasks = produce(tasks, (draft) => {
    draft = draft.filter((t) => t.columnId !== col.id);

    return draft;
  }) as Task[];

  return { newColumns, newTasks };
}
