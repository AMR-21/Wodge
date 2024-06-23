import { produce } from "immer";
import { DrObj } from "../../..";
import { Column } from "../../../schemas/page.schema";

export function createColumnMutation({
  col,
  columns,
}: {
  col: Column;
  columns: Column[] | DrObj<Column[]>;
}) {
  const newColumns = produce(columns, (draft) => {
    draft.push(col);

    return draft;
  });

  return newColumns as Column[];
}
