import { produce } from "immer";
import { DrObj } from "../../..";
import { Board, Column } from "../../../schemas/page.schema";

export function createColumnMutation({
  col,
  boards,
  boardId,
}: {
  col: Column;
  boards: Board[] | DrObj<Board[]>;
  boardId: string;
}) {
  const newBoards = produce(boards, (draft) => {
    const bIdx = draft.findIndex((b) => b.id === boardId);

    if (bIdx === -1) {
      draft.push({ id: boardId, columns: [col], tasks: [] });
      return draft;
    }

    draft[bIdx]!.columns.push(col);

    return draft;
  });

  return newBoards as Board[];
}
