import { Button, ButtonProps, cn } from "../../../../../packages/ui";
import { LucideIcon } from "lucide-react";
import { IconType } from "react-icons/lib";

interface SidebarItemBtnProps extends ButtonProps {
  Icon: LucideIcon | IconType;
  iconClassName?: string;
  isVisible?: () => boolean;
}

export function SidebarItemBtn({
  className,
  Icon,
  iconClassName,
  isVisible = () => true,
  ...props
}: SidebarItemBtnProps) {
  return (
    <Button
      variant="ghost"
      size="fit"
      className={cn(
        "group/sidebtn z-10",
        !isVisible() && "invisible",
        className,
      )}
      {...props}
    >
      <Icon
        className={cn(
          "h-4 w-4 opacity-60 transition-opacity group-hover/sidebtn:opacity-100",
          iconClassName,
        )}
      />
    </Button>
  );
}
