import { produce } from "immer";
import { DrObj } from "../../..";
import { Board } from "../../../schemas/page.schema";
import { arrayMove } from "@dnd-kit/sortable";
export function moveTasksMutation({
  t1,
  tOrC2,
  boards,
  boardId,
  isOverColumn,
}: {
  t1: string;
  tOrC2: string;
  boards: Board[] | DrObj<Board[]>;
  boardId: string;
  isOverColumn: boolean;
}) {
  if (t1 === tOrC2) return boards as Board[];

  const newBoards = produce(boards, (draft) => {
    const board = draft.find((b) => b.id === boardId);

    if (!board) return;

    const activeIndex = board.tasks.findIndex((c) => c.id === t1);
    const overIndex = isOverColumn
      ? board.columns.findIndex((c) => c.id === tOrC2)
      : board.tasks.findIndex((c) => c.id === tOrC2);

    if (
      !isOverColumn &&
      board.tasks[activeIndex]?.columnId != board.tasks[overIndex]?.columnId
    ) {
      board.tasks[activeIndex]!.columnId = board.tasks[overIndex]!.columnId;

      board.tasks = arrayMove(board.tasks, activeIndex, overIndex);
      return draft;
    }
    if (isOverColumn) {
      board.tasks[activeIndex]!.columnId = tOrC2;
    }

    board.tasks = arrayMove(
      board.tasks,
      activeIndex,
      isOverColumn ? activeIndex : overIndex
    );

    return draft;
  });

  return newBoards as Board[];
}
