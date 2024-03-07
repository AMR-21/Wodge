import * as React from "react";
import { Button, ButtonProps } from "./ui/button";
import { LucideIcon } from "lucide-react";
import { IconType } from "react-icons/lib";
import { cn } from "../lib/utils";
import { TooltipWrapper } from "./tooltip-wrapper";
interface SidebarItemBtnProps extends ButtonProps {
  Icon?: LucideIcon | IconType;
  iconClassName?: string;
  isVisible?: () => boolean;
  description?: string;
  side?: "top" | "bottom" | "left" | "right";
  destructive?: boolean;
  success?: boolean;
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
      description,
      side = "top",
      destructive,
      success,
      ...props
    },
    ref,
  ) => {
    const jsx = (
      <Button
        ref={ref}
        variant="ghost"
        size="fit"
        className={cn(
          "group/sidebtn transition-all",
          !isVisible() && "invisible",
          destructive && "hover:text-destructive-base",
          success && "hover:text-success-base",
          className,
        )}
        {...props}
      >
        <span className="sr-only">{description || "sidebar item action"}</span>
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

    if (description)
      return (
        <TooltipWrapper content={description} side={side}>
          {jsx}
        </TooltipWrapper>
      );

    return jsx;
  },
);

SidebarItemBtn.displayName = "SidebarItemBtn";
