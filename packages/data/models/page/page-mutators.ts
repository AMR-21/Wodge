import { WriteTransaction } from "replicache";
import { createColumnMutation } from "./mutators/create-column";
import { Board, Column, Task } from "../../schemas/page.schema";
import { deleteColumnMutation } from "./mutators/delete-column";
import { updateColumnMutation } from "./mutators/update-column";
import { createTaskMutation } from "./mutators/create-task";
import { editTaskMutation } from "./mutators/edit-task";
import { deleteTaskMutation } from "./mutators/delete-task";
import { moveColumnsMutation } from "./mutators/move-columns";
import { moveTasksMutation } from "./mutators/move-tasks";

export interface CreateColumnArgs {
  boardId: string;
  title?: string;
  id: string;
}
export interface CreateTaskArgs {
  boardId: string;
  task: Task;
  col: string;
}

export interface EditTaskArgs {
  boardId: string;
  task: Task;
}

export interface MoveColumnsArgs {
  c1: string;
  c2: string;
  boardId: string;
}

export interface MoveTasksArgs {
  t1: string;
  tOrC2: string;
  boardId: string;
  isOverColumn: boolean;
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
  async editTask(tx: WriteTransaction, data: EditTaskArgs) {
    const boards = await tx.get<Board[]>("boards");
    if (!boards) return;

    if (!data.boardId) return;

    const newBoards = editTaskMutation({
      boardId: data.boardId,
      task: data.task,
      boards,
    });

    await tx.set("boards", newBoards);
  },
  async deleteTask(tx: WriteTransaction, data: EditTaskArgs) {
    const boards = await tx.get<Board[]>("boards");
    if (!boards) return;

    if (!data.boardId) return;

    const newBoards = deleteTaskMutation({
      boardId: data.boardId,
      task: data.task,
      boards,
    });

    await tx.set("boards", newBoards);
  },
  async moveColumns(tx: WriteTransaction, data: MoveColumnsArgs) {
    const boards = await tx.get<Board[]>("boards");
    if (!boards) return;

    if (!data.boardId) return;

    const newBoards = moveColumnsMutation({
      boardId: data.boardId,
      c1: data.c1,
      c2: data.c2,
      boards,
    });

    await tx.set("boards", newBoards);
  },
  async moveTasks(tx: WriteTransaction, data: MoveTasksArgs) {
    const boards = await tx.get<Board[]>("boards");
    if (!boards) return;

    if (!data.boardId) return;

    const newBoards = moveTasksMutation({
      boardId: data.boardId,
      t1: data.t1,
      tOrC2: data.tOrC2,
      isOverColumn: data.isOverColumn,
      boards,
    });

    await tx.set("boards", newBoards);
  },
};
