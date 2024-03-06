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
}

function DataTable<
  TData extends { id: string },
  TValue,
  T extends FieldValues,
>({ columns, data }: DataTableProps<TData, TValue, T>) {
  const [rowSelection, setRowSelection] = React.useState({});
  const [rowPinning, setRowPinning] = React.useState<RowPinningState>({
    top: [],
    bottom: [],
  });
  const [isEditing, setIsEditing] = React.useState(false);

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
  });

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
        </TableBody>
      </Table>

      <DataTablePagination table={table} />

      {/* <ComboboxCell /> */}
    </div>
  );
}

export { DataTable };
