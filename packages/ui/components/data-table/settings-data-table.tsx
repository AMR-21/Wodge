"use client";

import * as React from "react";
import {
  ColumnDef,
  RowData,
  RowPinningState,
  getCoreRowModel,
} from "@tanstack/react-table";
import { useReactTable } from "@tanstack/react-table";

import { flexRender } from "@tanstack/react-table";
import { enableMapSet, produce } from "immer";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "../ui/table";
import { DataTablePagination } from "./data-table-pagination";

import { Updater, useImmer } from "use-immer";

enableMapSet();

interface DataTableProps<TData extends { id: string }, TValue> {
  columns: ColumnDef<TData, TValue>[];
  data: TData[];
  withForm?: boolean;
  label?: string;
  updateHandler?: ({ data, id }: { data: Partial<TData>; id: string }) => void;
}

export function SettingsDataTable<TData extends { id: string }, TValue>({
  columns,
  data,
  updateHandler,
  label,
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
        const { id } = data[idx]!;

        if (updateData) updateHandler?.({ data: updateData, id });
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

  return (
    <div className="rounded-md border">
      <Table>
        <TableHeader>
          {table.getHeaderGroups().map((headerGroup) => (
            <TableRow key={headerGroup.id}>
              {headerGroup.headers.map((header) => (
                <TableHead key={header.id}>
                  {header.isPlaceholder
                    ? null
                    : flexRender(
                        header.column.columnDef.header,
                        header.getContext(),
                      )}
                </TableHead>
              ))}
            </TableRow>
          ))}
        </TableHeader>
        <TableBody>
          {table.getCenterRows()?.length > 0 &&
            table.getCenterRows().map((row) => (
              <TableRow
                className="group/row"
                key={row.id}
                data-state={row.getIsSelected() && "selected"}
              >
                {row.getVisibleCells().map((cell) => (
                  <TableCell key={cell.id} className="">
                    {flexRender(cell.column.columnDef.cell, cell.getContext())}
                  </TableCell>
                ))}
              </TableRow>
            ))}
          {/* {table.getBottomRows()?.length > 0 &&
            table.getBottomRows().map((row) => (
              <TableRow
                key={row.id}
                data-state={row.getIsSelected() && "selected"}
                className="relative"
              >
                {row.getVisibleCells().map((cell) => (
                  <TableCell
                    key={cell.id}
                    className={cn("invisible", isEditing && "visible")}
                  >
                    {withForm && cell.id.endsWith("actions") ? (
                      <FormRowControl setIsEditing={setIsEditing} />
                    ) : (
                      flexRender(cell.column.columnDef.cell, cell.getContext())
                    )}
                  </TableCell>
                ))}

                {withForm && (
                  <FormCell
                    isEditing={isEditing}
                    setIsEditing={setIsEditing}
                    label={label}
                  />
                )}
              </TableRow>
            ))} */}
        </TableBody>
      </Table>

      <DataTablePagination table={table} />
      {/* modal content here */}
    </div>
  );
}

// function FormRow({}) {
//   return (
//     <TableRow
//       key={row.id}
//       data-state={row.getIsSelected() && "selected"}
//       className="relative group/row"
//     >
//       {row.getVisibleCells().map((cell) => (
//         <TableCell
//           key={cell.id}
//           className={cn("invisible", isEditing && "visible")}
//         >
//           {withForm && cell.id.endsWith("actions") ? (
//             <FormRowControl setIsEditing={setIsEditing} />
//           ) : (
//             flexRender(cell.column.columnDef.cell, cell.getContext())
//           )}
//         </TableCell>
//       ))}

//       {withForm && (
//         <FormCell
//           isEditing={isEditing}
//           setIsEditing={setIsEditing}
//           label={label}
//         />
//       )}
//     </TableRow>
//   );
// }
