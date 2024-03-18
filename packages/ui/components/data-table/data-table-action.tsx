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
import { Check, MoreHorizontal, Users2, X } from "lucide-react";
import { Row, RowData, Table } from "@tanstack/react-table";
import { Children } from "react";

interface DataTableActionsProps<TData> {
  table: Table<TData>;
  row: Row<TData>;
  menuItems?: {
    label?: string;
    action?: () => void;
    destructive?: boolean;
    type?: "separator" | "item";
    disabled?: boolean;
  }[];

  children?: React.ReactNode;
}

export function DataTableActions<TData>({
  table,
  row,
  children,
  menuItems,
}: DataTableActionsProps<TData>) {
  const isEdited = table.options.meta?.edited.has(row.index);

  const nActions = Children.count(children) || 0;

  return (
    <div
      className="flex justify-end"
      style={{
        width: `calc(${nActions * 1.75}rem + 1.75rem + 1.5rem)`,
      }}
    >
      <div
        className={cn("flex gap-1 overflow-hidden transition-all")}
        style={{
          width: `calc( ${nActions * 1.75}rem + 1.5rem )`,
          ...(isEdited && {
            width: `calc(${nActions * 1.75}rem + 1.75rem + 1.5rem)`,
          }),
        }}
      >
        {children}
        <div
          className={cn(
            "transition-transform",
            isEdited && "invisible translate-x-full opacity-0",
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
              {menuItems?.map((item, idx) => {
                if (item.type === "separator") {
                  return <DropdownMenuSeparator key={idx} />;
                }
                return (
                  <DropdownMenuItem
                    key={idx}
                    destructive={!!item?.destructive}
                    onClick={item?.action}
                    disabled={item?.disabled}
                  >
                    {item?.label}
                  </DropdownMenuItem>
                );
              })}
            </DropdownMenuContent>
          </DropdownMenu>
        </div>

        <SidebarItemBtn
          Icon={Check}
          onClick={() => table.options.meta?.submitRow(row.index)}
          className={cn(
            "invisible  text-success-base transition-all",
            isEdited && "visible -translate-x-7  ",
          )}
          success
        />

        <SidebarItemBtn
          Icon={X}
          className={cn(
            "invisible transition-all",
            isEdited && "visible -translate-x-7",
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
