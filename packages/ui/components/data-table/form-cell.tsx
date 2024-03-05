import { Plus } from "lucide-react";
import { cn } from "../../lib/utils";
import { Button } from "../ui/button";
import { TableCell } from "../ui/table";

interface FormCellProps {
  isEditing: boolean;
  setIsEditing: (value: boolean) => void;
  label?: string;
}

export function FormCell({ isEditing, setIsEditing, label }: FormCellProps) {
  return (
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
  );
}
