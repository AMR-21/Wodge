import { WriteTransaction } from "replicache";
import { createColumnMutation } from "./mutators/create-column";
import { Board } from "../../schemas/page.schema";
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
};
