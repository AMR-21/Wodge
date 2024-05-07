"use client";
import Link from "next/link";
import { ChevronRight, Hash, LucideIcon } from "lucide-react";
import { buttonVariants } from "@repo/ui/components/ui/button";
import { forwardRef } from "react";
import { IconType } from "react-icons/lib";
import { cn } from "@repo/ui/lib/utils";

export interface SidebarItemProps extends React.HTMLAttributes<HTMLDivElement> {
  Icon?: LucideIcon | IconType | null;
  children?: React.ReactNode;
  className?: string;
  isActive?: boolean;
  href?: string;
  handler?: () => void;
  noIcon?: boolean;
  collapsible?: boolean;
}

const SidebarItem = forwardRef<HTMLDivElement, SidebarItemProps>(
  function SidebarItem(
    {
      Icon,
      children,
      className,
      isActive = false,
      href,
      handler,
      noIcon = false,
      collapsible = false,
      ...props
    },
    ref,
  ) {
    if (!Icon) Icon = Hash;

    let jsx = (
      <div
        ref={ref}
        tabIndex={0}
        role="button"
        className={cn(
          buttonVariants({
            variant: "ghost",
            size: "fit",
          }),

          "w-full grow items-center justify-start px-2 text-muted-foreground hover:text-accent-foreground",
          isActive && "bg-accent text-accent-foreground dark:bg-accent",
          className,
        )}
        onClick={handler}
        {...props}
      >
        {collapsible && (
          <ChevronRight className="mr-1 h-3.5 w-3.5 min-w-3.5 max-w-3.5 transition-transform group-data-[state=open]/collapsible:rotate-90" />
        )}

        {!noIcon && <Icon className="mr-2.5 h-4 w-4 shrink-0 transition-all" />}

        {children}
      </div>
    );

    if (href)
      jsx = (
        <div className="w-full">
          <Link href={href}>{jsx}</Link>
        </div>
      );

    return jsx;
  },
);

export { SidebarItem };
