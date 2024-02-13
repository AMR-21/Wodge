"use client";
import Link from "next/link";
import { Hash, LucideIcon } from "lucide-react";
import { cn, buttonVariants, ButtonProps, Button } from "@repo/ui";
import { forwardRef } from "react";
import { IconType } from "react-icons/lib";

interface SidebarItemProps {
  label: string;
  Icon?: LucideIcon | IconType | null;
  children?: React.ReactNode;
  className?: string;
  isActive?: boolean;
}

const SidebarItem = forwardRef<HTMLLIElement, SidebarItemProps>(
  function SidebarItem(
    { label, Icon, children, className, isActive = false, ...props },
    ref,
  ) {
    if (!Icon) Icon = Hash;

    return (
      <li ref={ref} className="grow">
        <div
          tabIndex={0}
          role="button"
          className={cn(
            buttonVariants({
              variant: "ghost",
              size: "fit",
            }),

            // Center the icon with the space avatar by adding padding left of 12px + 4px - 8px = 8px
            // 12px half of the avatar width - 4px padding of the space switcher - 8px half of the icon width
            "w-full items-center justify-start pl-2 text-muted-foreground hover:text-accent-foreground",
            isActive && "bg-accent text-accent-foreground dark:bg-accent",
            className,
          )}
          {...props}
        >
          {/* 8px margin of the switcher + 12px half space avatar width - 8px half icon width */}
          <Icon className="mr-3 h-4 w-4 shrink-0 transition-all" />
          <span>{label}</span>

          {children}
        </div>
      </li>
    );
  },
);

export { SidebarItem };
