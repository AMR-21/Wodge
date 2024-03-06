"use client";

import {
  ColumnDef,
  RowData,
  RowPinningState,
  flexRender,
  getCoreRowModel,
  useReactTable,
} from "@tanstack/react-table";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "../ui/table";

import * as React from "react";
import { DataTablePagination } from "./data-table-pagination";
import { SidebarItemBtn } from "../sidebar-item-btn";
import { Check, Plus, X } from "lucide-react";
import { cn } from "../../lib/utils";
import { Button } from "../ui/button";
import { FormCell } from "./form-cell";
import { FormRowControl } from "./form-row-control";
import { ComboboxCell } from "./combobox-cell";
import { FieldValues, UseFormReturn, useForm } from "react-hook-form";
import { Form } from "../ui/form";
import { Team } from "@repo/data";

interface DataTableProps<
  TData extends { id: string },
  TValue,
  T extends FieldValues,
> {
  columns: ColumnDef<TData, TValue>[];
  data: TData[];
  withForm?: boolean;
  formId?: string;
  label?: string;
  formIsSubmitted?: boolean;
  form: UseFormReturn<T>;
  updateHandler?: (data: TData) => void;
}

function DataTable<
  TData extends { id: string },
  TValue,
  T extends FieldValues,
>({
  columns,
  data,
  label,
  formId,
  formIsSubmitted,
  form,
  updateHandler,
  withForm,
}: DataTableProps<TData, TValue, T>) {
  const [rowSelection, setRowSelection] = React.useState({});
  const [rowPinning, setRowPinning] = React.useState<RowPinningState>({
    top: [],
    bottom: [],
  });
  const [isEditing, setIsEditing] = React.useState(false);

  const [edited, setEdited] = React.useState<Set<number>>(new Set());
  const [updateQueue, setUpdateQueue] = React.useState<Map<number, TData>>(
    new Map(),
  );

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
    // meta: {
    //   edited,
    //   setEdited,
    //   updateQueue,
    //   setUpdateQueue,
    //   updateRow: (idx: number) => {
    //     const updateData = updateQueue.get(idx);
    //     console.log("updating", updateQueue.get(idx));
    //     if (updateData) updateHandler?.(updateData);
    //   },
    // },
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
          {table.getBottomRows()?.length > 0 &&
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
                      <FormRowControl
                        formId={formId}
                        formIsSubmitted={formIsSubmitted}
                        setIsEditing={setIsEditing}
                      />
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
            ))}
        </TableBody>
      </Table>

      <DataTablePagination table={table} />

      {/* <ComboboxCell /> */}
    </div>
  );
}

export { DataTable };
