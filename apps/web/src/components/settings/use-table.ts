import * as React from "react";
import {
  ColumnDef,
  RowPinningState,
  getCoreRowModel,
  useReactTable,
} from "@tanstack/react-table";
import { Updater, useImmer } from "use-immer";
import { RowData } from "@tanstack/react-table";
import { produce } from "immer";

declare module "@tanstack/react-table" {
  interface TableMeta<TData extends RowData> {
    edited: Set<number>;
    setEdited: Updater<Set<number>>;

    buffer: Map<number, Partial<TData>>;
    setBuffer: Updater<Map<number, Partial<TData>>>;
    submitRow: (idx: number) => void;
    discard: (idx: number) => void;
  }
}

export interface UpdateHandlerProps<TData> {
  data: Partial<TData>;
  idx: number;
}

export interface DataTableProps<TData, TValue> {
  columns: ColumnDef<TData, TValue>[];
  data: TData[];
  updateHandler?: ({ data, idx }: UpdateHandlerProps<TData>) => void;
  withForm?: boolean;
}

export function useTable<TData extends { id: string }, TValue>({
  data,
  columns,
  updateHandler,
  withForm,
}: DataTableProps<TData, TValue>) {
  const [rowSelection, setRowSelection] = React.useState({});
  const [rowPinning, setRowPinning] = React.useState<RowPinningState>({
    top: [],
    bottom: [],
  });

  const [edited, setEdited] = useImmer<Set<number>>(new Set());

  const [buffer, setBuffer] = useImmer<Map<number, Partial<TData>>>(new Map());

  const table = useReactTable({
    data,
    columns,

    getCoreRowModel: getCoreRowModel(),
    onRowSelectionChange: setRowSelection,
    onRowPinningChange: setRowPinning,
    state: {
      rowSelection,
      rowPinning,
    },
    meta: {
      edited,
      setEdited,
      buffer,
      setBuffer,
      submitRow: (idx: number) => {
        const updateData = buffer.get(idx);

        if (updateData) updateHandler?.({ data: updateData, idx });
      },

      discard: (idx: number) => {
        setBuffer(
          produce((draft) => {
            draft.delete(idx);
          }),
        );

        setEdited(
          produce((draft) => {
            draft.delete(idx);
          }),
        );
      },
    },
  });

  React.useEffect(() => {
    if (withForm) {
      const rows = table.getRowModel().rows;
      const lastRow = rows[rows.length - 1];

      if (lastRow?.original?.id.startsWith("add")) lastRow?.pin("bottom");
    }
  }, [table.options.data]);

  return { table, edited, buffer, setBuffer, setEdited };
}
