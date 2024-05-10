import { produce } from "immer";
import { DrObj } from "../../..";
import { Board, Column } from "../../../schemas/page.schema";

export function updateColumnMutation({
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
      // draft.push({ id: boardId, columns: [col], tasks: [] });
      return draft;
    }

    const colIdx = draft[bIdx]!.columns.findIndex((c) => c.id === col.id);

    if (colIdx === -1) return draft;
    draft[bIdx]!.columns[colIdx] = col;

    // draft[bIdx]!.columns.push(col);

    return draft;
  });

  return newBoards as Board[];
}
