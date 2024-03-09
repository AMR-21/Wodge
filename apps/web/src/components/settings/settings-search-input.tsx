import { Input } from "@repo/ui";
import { Table } from "@tanstack/react-table";

interface SettingsSearchInputProps<TData> {
  table: Table<TData>;
  searchColumn: string;
  placeHolder?: string;
}

export function SettingsSearchInput<TData>({
  searchColumn,
  table,
  placeHolder,
}: SettingsSearchInputProps<TData>) {
  return (
    <Input
      placeholder={placeHolder || "Search"}
      className="max-w-56"
      value={(table.getColumn(searchColumn)?.getFilterValue() as string) ?? ""}
      onChange={(e) => {
        table.getColumn(searchColumn)?.setFilterValue(e.target.value);
      }}
    />
  );
}
