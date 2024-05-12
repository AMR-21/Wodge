import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { MoreHorizontal, Pencil, Trash2 } from "lucide-react";
import { SidebarItemBtn } from "../_components/sidebar-item-btn";

interface MessageDropDownProps {
  onEdit?: () => void;
  onDelete?: () => void;
  canEdit?: boolean;
  canDelete?: boolean;
}

export function MessageDropDown({
  onDelete,
  onEdit,
  canDelete,
  canEdit,
}: MessageDropDownProps) {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <SidebarItemBtn
          Icon={MoreHorizontal}
          className="invisible ml-auto h-fit shrink-0 transition-all hover:bg-transparent group-hover:visible aria-expanded:visible"
        />
      </DropdownMenuTrigger>

      <DropdownMenuContent align="end">
        <DropdownMenuItem
          disabled={!canEdit}
          className="gap-2 text-sm"
          onClick={() => {
            onEdit?.();
          }}
        >
          <Pencil className="h-4 w-4 " />
          Edit message
        </DropdownMenuItem>

        <DropdownMenuSeparator />

        <DropdownMenuItem
          disabled={!canDelete}
          className="gap-2 text-sm text-red-500  focus:text-red-600 dark:focus:text-red-400"
          onClick={() => {
            onDelete?.();
          }}
        >
          <Trash2 className="h-4 w-4" />
          Delete message
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
