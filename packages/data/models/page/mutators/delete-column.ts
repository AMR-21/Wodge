import { produce } from "immer";
import { DrObj } from "../../..";
import { Board, Column } from "../../../schemas/page.schema";

export function deleteColumnMutation({
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
      return draft;
    }

    draft[bIdx]!.columns = draft[bIdx]!.columns.filter((c) => c.id !== col.id);

    return draft;
  });

  return newBoards as Board[];
}
