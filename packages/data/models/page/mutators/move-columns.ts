import { produce } from "immer";
import { DrObj } from "../../..";
import { Board, Column, Task } from "../../../schemas/page.schema";
export function moveColumnsMutation({
  c1,
  c2,
  boards,
  boardId,
}: {
  c1: string;
  c2: string;
  boards: Board[] | DrObj<Board[]>;
  boardId: string;
}) {
  if (c1 === c2) return boards as Board[];

  const newBoards = produce(boards, (draft) => {
    const board = draft.find((b) => b.id === boardId);

    if (!board) return;

    const activeIndex = board.columns.findIndex((c) => c.id === c1);
    const overIndex = board.columns.findIndex((c) => c.id === c2);

    if (activeIndex > -1 && overIndex > -1) {
      const temp = board.columns[activeIndex];

      if (!temp) return;
      board.columns[activeIndex] = board.columns[overIndex]!;
      board.columns[overIndex] = temp;
    }

    return draft;
  });

  return newBoards as Board[];
}
