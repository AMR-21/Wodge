import { WriteTransaction } from "replicache";
import { createColumnMutation } from "./mutators/create-column";
import { Board, Column, Task } from "../../schemas/page.schema";
import { deleteColumnMutation } from "./mutators/delete-column";
import { updateColumnMutation } from "./mutators/update-column";
import { createTaskMutation } from "./mutators/create-task";
// deleteColumn = { deleteColumn };
// updateColumn = { updateColumn };
// createTask = { createTask };
// deleteTask = { deleteTask };
// updateTask = { updateTask };

export interface CreateColumnArgs {
  boardId: string;
  title?: string;
  id: string;
}
export interface CreateTaskArgs {
  boardId: string;
  task: Task;
  col: Column;
}

export const pageMutators = {
  async createColumn(tx: WriteTransaction, data: CreateColumnArgs) {
    const boards = await tx.get<Board[]>("boards");
    if (!boards) return;

    if (data.boardId) return;

    const newBoards = createColumnMutation({
      boardId: data.boardId,
      col: {
        id: data.id,
        title: data.title,
      },
      boards,
    });

    await tx.set("boards", newBoards);
  },
  async deleteColumn(tx: WriteTransaction, data: CreateColumnArgs) {
    const boards = await tx.get<Board[]>("boards");
    if (!boards) return;

    if (data.boardId) return;

    const newBoards = deleteColumnMutation({
      boardId: data.boardId,
      col: {
        id: data.id,
        title: data.title,
      },
      boards,
    });

    await tx.set("boards", newBoards);
  },
  async updateColumn(tx: WriteTransaction, data: CreateColumnArgs) {
    const boards = await tx.get<Board[]>("boards");
    if (!boards) return;

    if (data.boardId) return;

    const newBoards = updateColumnMutation({
      boardId: data.boardId,
      col: {
        id: data.id,
        title: data.title,
      },
      boards,
    });

    await tx.set("boards", newBoards);
  },
  async createTask(tx: WriteTransaction, data: CreateTaskArgs) {
    const boards = await tx.get<Board[]>("boards");
    if (!boards) return;

    if (data.boardId) return;

    const newBoards = createTaskMutation({
      boardId: data.boardId,
      col: data.col,
      task: data.task,
      boards,
    });

    await tx.set("boards", newBoards);
  },
};
