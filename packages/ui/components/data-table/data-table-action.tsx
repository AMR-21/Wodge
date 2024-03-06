import { cn } from "../../lib/utils";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "../ui/dropdown-menu";
import { SidebarItemBtn } from "../sidebar-item-btn";
import { Check, MoreHorizontal, X } from "lucide-react";
import { Row, RowData, Table } from "@tanstack/react-table";

interface DataTableActionsProps<TData> {
  table: Table<TData>;
  row: Row<TData>;
  menuItems?: {
    label?: string;
    action?: () => void;
    destructive?: boolean;
    type?: "separator" | "item";
  }[];
}

export function DataTableActions<TData>({
  table,
  row,
  menuItems,
}: DataTableActionsProps<TData>) {
  const isEdited = table.options.meta?.edited.has(row.index);

  return (
    <div className={cn(" flex w-[3.25rem] overflow-hidden ")}>
      <div
        className={cn(
          "ml-0.5 translate-x-1/2 transition-all",
          isEdited && "ml-0 -translate-x-full",
        )}
      >
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <SidebarItemBtn
              Icon={MoreHorizontal}
              className={cn(menuItems?.length === 0 && "invisible")}
            />
          </DropdownMenuTrigger>
          <DropdownMenuContent align="center">
            <DropdownMenuLabel>Actions</DropdownMenuLabel>
            {menuItems?.map((item, idx) => {
              if (item.type === "separator") {
                return <DropdownMenuSeparator key={idx} />;
              }
              return (
                <DropdownMenuItem
                  key={idx}
                  destructive={!!item?.destructive}
                  onClick={item?.action}
                >
                  {item?.label}
                </DropdownMenuItem>
              );
            })}
          </DropdownMenuContent>
        </DropdownMenu>
      </div>

      <div className={cn("flex w-[3.25rem] min-w-[3.25rem] gap-1")}>
        <SidebarItemBtn
          Icon={Check}
          onClick={() => table.options.meta?.submitRow(row.index)}
          className={cn(
            "translate-x-[200%] transition-all",
            isEdited && " -translate-x-full",
          )}
          success
        />
        <SidebarItemBtn
          key={"btn"}
          Icon={X}
          className={cn(
            "translate-x-full transition-all",
            isEdited && "-translate-x-full",
          )}
          onClick={() => {
            table.options.meta?.discard(row.index);
          }}
          destructive
        />
      </div>
    </div>
  );
}
