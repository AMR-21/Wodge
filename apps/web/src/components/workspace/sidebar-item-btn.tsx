import * as React from "react";
import { LucideIcon } from "lucide-react";
import { IconType } from "react-icons/lib";
import { Button, ButtonProps } from "@repo/ui/components/ui/button";
import { cn } from "@repo/ui/lib/utils";

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
      onClick,
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
          "group/sidebtn z-20",
          !isVisible() && "invisible",
          className,
        )}
        onClick={(e) => {
          e.stopPropagation();
          onClick?.(e);
        }}
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
