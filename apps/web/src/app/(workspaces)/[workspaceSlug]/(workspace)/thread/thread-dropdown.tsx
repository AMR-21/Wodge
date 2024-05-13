import { SidebarItemBtn } from "@/app/(workspaces)/[workspaceSlug]/(workspace)/_components/sidebar-item-btn";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { MoreHorizontal, Pencil, Trash2 } from "lucide-react";

interface ThreadDropDownProps {
  onEdit?: () => void;
  onDelete?: () => void;
  canEdit?: boolean;
  canDelete?: boolean;
  label?: string;
}

export function ThreadDropDown({
  onDelete,
  onEdit,
  label = "post",
  canDelete,
  canEdit,
}: ThreadDropDownProps) {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <SidebarItemBtn
          Icon={MoreHorizontal}
          className="invisible ml-auto transition-all group-hover:visible aria-expanded:visible"
        />
      </DropdownMenuTrigger>

      <DropdownMenuContent align="end">
        {label !== "poll" && (
          <>
            <DropdownMenuItem
              disabled={!canEdit}
              onClick={() => {
                onEdit?.();
              }}
            >
              <Pencil className="h-4 w-4 " />
              Edit {label}
            </DropdownMenuItem>

            <DropdownMenuSeparator />
          </>
        )}

        <DropdownMenuItem
          disabled={!canDelete}
          onDisclosureConfirm={() => {
            onDelete?.();
          }}
          destructive
          disclosure
        >
          <Trash2 className="h-4 w-4" />
          Delete {label}
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
