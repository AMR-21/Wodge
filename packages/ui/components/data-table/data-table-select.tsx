import { Row, Table } from "@tanstack/react-table";
import { Checkbox } from "../ui/checkbox";

export function DataTableHeaderSelect<TData>({
  table,
  withForm,
}: {
  table: Table<TData>;
  withForm?: boolean;
}) {
  const checked = withForm
    ? table.getSelectedRowModel().rows.length === table.getRowCount() - 1
    : !!table.getIsAllRowsSelected();

  return (
    <div className="flex items-center px-2">
      <Checkbox
        checked={
          checked || (table.getIsSomePageRowsSelected() && "indeterminate")
        }
        onCheckedChange={(value) => table.toggleAllPageRowsSelected(!!value)}
        aria-label="Select all"
      />
    </div>
  );
}

export function DataTableRowSelect<TData extends { id: string }>({
  row,
}: {
  row: Row<TData>;
}) {
  if (row.original.id.startsWith("add")) return null;

  return (
    <div className="flex items-center px-2">
      <Checkbox
        checked={row.getIsSelected()}
        onCheckedChange={(value) => {
          row.toggleSelected(!!value);
        }}
        aria-label="Select row"
      />
    </div>
  );
}
