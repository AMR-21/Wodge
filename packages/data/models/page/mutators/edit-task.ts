import { produce } from "immer";
import { DrObj } from "../../..";
import { Board, Column, Task } from "../../../schemas/page.schema";

export function editTaskMutation({
  task,
  boards,
  boardId,
}: {
  task: Task;
  boards: Board[] | DrObj<Board[]>;
  boardId: string;
}) {
  const newBoards = produce(boards, (draft) => {
    const board = draft.find((b) => b.id === boardId);

    if (!board) return;

    const taskIndex = board.tasks?.findIndex((t) => t.id === task.id);

    if (taskIndex === -1) return draft;

    board.tasks[taskIndex] = task;

    return draft;
  });

  return newBoards as Board[];
}
