"use client";

import {
  ColumnDef,
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
import { Button } from "../ui/button";
import { Check, Plus, X } from "lucide-react";
import { cn } from "../../lib/utils";
import { SidebarItemBtn } from "../sidebar-item-btn";
import { set } from "react-hook-form";

interface DataTableProps<TData, TValue> {
  columns: ColumnDef<TData, TValue>[];
  data: TData[];
  children?: React.ReactNode;
  formId?: string;
  label?: string;
  formIsSubmitted?: boolean;
}

function EditableDataTable<TData, TValue>({
  columns,
  data,
  label,
  formId,
  formIsSubmitted,
  children,
}: DataTableProps<TData, TValue>) {
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
                key={row.id}
                data-state={row.getIsSelected() && "selected"}
              >
                {row.getVisibleCells().map((cell) => (
                  <TableCell
                    key={cell.id}
                    className={
                      (cell.id.endsWith("actions") && "text-center") || ""
                    }
                  >
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
                    {cell.id.endsWith("actions") ? (
                      <div className="flex">
                        <SidebarItemBtn
                          Icon={Check}
                          className="hover:text-success-base"
                          form={formId}
                          type="submit"
                          onClick={() => {
                            if (formIsSubmitted) setIsEditing(false);
                          }}
                        />
                        <SidebarItemBtn
                          Icon={X}
                          onClick={(e) => {
                            e.preventDefault();
                            setIsEditing(false);
                          }}
                          className="hover:text-destructive-base"
                        />
                      </div>
                    ) : (
                      flexRender(cell.column.columnDef.cell, cell.getContext())
                    )}
                  </TableCell>
                ))}
                <TableCell
                  className={cn(
                    "absolute left-0 top-1/2 z-50 flex  w-full -translate-y-1/2 text-muted-foreground",
                    isEditing && "invisible right-0",
                  )}
                >
                  {!isEditing && (
                    <Button
                      size="fit"
                      variant="ghost"
                      className="w-full justify-center gap-1 p-1.5 text-sm"
                      onClick={() => setIsEditing(true)}
                    >
                      <Plus className="h-4 w-4" />
                      <span className="text-sm">New {label}</span>
                    </Button>
                  )}
                </TableCell>
              </TableRow>
            ))}
        </TableBody>
      </Table>

      <DataTablePagination table={table} />
    </div>
  );
}

export { EditableDataTable };
