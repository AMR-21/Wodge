import { produce } from "immer";
import { DrObj } from "../../..";
import { Board, Task } from "../../../schemas/page.schema";

export function deleteTaskMutation({
  task,
  boards,
  boardId,
}: {
  task: Task;
  boards: Board[] | DrObj<Board[]>;
  boardId: string;
}) {
  const newBoards = produce(boards, (draft) => {
    const bIdx = draft.findIndex((b) => b.id === boardId);

    if (bIdx === -1) {
      return draft;
    }

    draft[bIdx]!.tasks = draft[bIdx]!.tasks.filter((t) => t.id !== task.id);

    return draft;
  });

  return newBoards as Board[];
}
