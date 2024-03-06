import * as React from "react";
import { Button, ButtonProps, cn } from "@repo/ui";
import { LucideIcon } from "lucide-react";
import { IconType } from "react-icons/lib";

interface SidebarItemBtnProps extends ButtonProps {
  Icon?: LucideIcon | IconType;
  iconClassName?: string;
  isVisible?: () => boolean;
  sr?: string;
}

export const SidebarItemBtn = React.forwardRef<
  HTMLButtonElement,
  SidebarItemBtnProps
>(
  (
    {
      className,
      Icon,
      iconClassName,
      isVisible = () => true,
      children,
      sr,
      ...props
    },
    ref,
  ) => {
    return (
      <Button
        ref={ref}
        variant="ghost"
        size="fit"
        className={cn(
          "group/sidebtn z-10",
          !isVisible() && "invisible",
          className,
        )}
        {...props}
      >
        <span className="sr-only">{sr || "sidebar item action"}</span>
        {Icon && (
          <Icon
            className={cn(
              "h-4 w-4 opacity-60 transition-opacity group-hover/sidebtn:opacity-100",
              iconClassName,
            )}
          />
        )}
        {children}
      </Button>
    );
  },
);

SidebarItemBtn.displayName = "SidebarItemBtn";
