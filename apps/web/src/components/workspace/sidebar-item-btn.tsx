"use client";

import * as React from "react";
import { LucideIcon } from "lucide-react";
import { IconType } from "react-icons/lib";
import {
  Button,
  ButtonProps,
  buttonVariants,
} from "@repo/ui/components/ui/button";
import { cn } from "@repo/ui/lib/utils";
import Link from "next/link";

interface SidebarItemBtnProps
  extends React.ButtonHTMLAttributes<HTMLDivElement> {
  Icon?: LucideIcon | IconType;
  iconClassName?: string;
  isVisible?: () => boolean;
  sr?: string;
  href?: string;
}

export const SidebarItemBtn = React.forwardRef<
  HTMLDivElement,
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
      href,
      ...props
    },
    ref,
  ) => {
    let jsx = (
      <>
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
      </>
    );

    if (href) jsx = <Link href={href}>{jsx}</Link>;

    return (
      <div
        tabIndex={0}
        ref={ref}
        role="button"
        className={cn(
          buttonVariants({ variant: "ghost", size: "fit" }),
          "group/sidebtn z-20 aria-expanded:text-accent-foreground",
          !isVisible() && "invisible",
          className,
        )}
        onClick={(e) => {
          onClick?.(e);
        }}
        {...props}
        {...(href && { asChild: true })}
      >
        {jsx}
      </div>
    );
  },
);

SidebarItemBtn.displayName = "SidebarItemBtn";
