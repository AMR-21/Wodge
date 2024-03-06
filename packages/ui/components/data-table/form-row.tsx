import * as React from "react";
import { Table, flexRender } from "@tanstack/react-table";
import { FieldValues, UseFormReturn } from "react-hook-form";
import { Form } from "../ui/form";
import { TableCell, TableRow } from "../ui/table";
import { cn } from "../../lib/utils";
import { FormRowControl } from "./form-row-control";
import { FormCell } from "./form-cell";

interface FormRowProps<TData, T extends FieldValues> {
  table: Table<TData>;
  form: UseFormReturn<T>;
  label?: string;
}

export function FormRow<TData, T extends FieldValues>({
  table,
  form,
  label,
}: FormRowProps<TData, T>) {
  const [isEditing, setIsEditing] = React.useState(false);
  const formId = (label || "") + "-form";

  return (
    <div>
      {table.getBottomRows()?.length > 0 &&
        table.getBottomRows().map((row) => (
          <Form {...form} key={row.id}>
            <form id={formId}>
              <TableRow
                data-state={row.getIsSelected() && "selected"}
                className="relative"
              >
                {row.getVisibleCells().map((cell) => (
                  <TableCell
                    key={cell.id}
                    className={cn("invisible", isEditing && "visible")}
                  >
                    {cell.id.endsWith("actions") ? (
                      <FormRowControl
                        formId={formId}
                        formIsSubmitted={true}
                        setIsEditing={setIsEditing}
                      />
                    ) : (
                      flexRender(cell.column.columnDef.cell, cell.getContext())
                    )}
                  </TableCell>
                ))}

                <FormCell
                  isEditing={isEditing}
                  setIsEditing={setIsEditing}
                  label={label}
                />
              </TableRow>
            </form>
          </Form>
        ))}
    </div>
  );
}
