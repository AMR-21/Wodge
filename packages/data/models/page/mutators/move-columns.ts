import { produce } from "immer";
import { DrObj } from "../../..";
import {  Column } from "../../../schemas/page.schema";
export function moveColumnsMutation({
  c1,
  c2,
  columns,
}: {
  c1: string;
  c2: string;
  columns: Column[] | DrObj<Column[]>;
}) {
  if (c1 === c2) return columns as Column[];

  const newColumns = produce(columns, (draft) => {
    const activeIndex = draft.findIndex((c) => c.id === c1);
    const overIndex = draft.findIndex((c) => c.id === c2);

    if (activeIndex > -1 && overIndex > -1) {
      const temp = draft[activeIndex];

      if (!temp) return;
      draft[activeIndex] = draft[overIndex]!;
      draft[overIndex] = temp;
    }

    return draft;
  });

  return newColumns as Column[];
}
