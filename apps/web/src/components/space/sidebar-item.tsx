"use client";
import Link from "next/link";
import { Hash, LucideIcon } from "lucide-react";
import { cn, buttonVariants } from "@repo/ui";
import { forwardRef } from "react";
import { IconType } from "react-icons/lib";

interface SidebarItemProps {
  label: string;
  Icon?: LucideIcon | IconType | null;
  action?: () => void;
  href?: string;
  children?: React.ReactNode;
  className?: string;
  ItemFor: string;
  isActive?: boolean;
}

const SidebarItem = forwardRef<HTMLDivElement, SidebarItemProps>(
  function SidebarItem(
    {
      label,
      Icon,
      action,
      href,
      children,
      className,
      ItemFor,
      isActive = false,
      ...props
    },
    ref,
  ) {
    if (!Icon) Icon = Hash;

    const jsx = (
      <div
        ref={ref}
        role="button"
        className={cn(
          buttonVariants({
            variant: "ghost",
            size: "fit",
          }),
          "group/sidebar w-full justify-start gap-2 pl-3.5 pr-0.5 capitalize text-muted-foreground hover:text-foreground",
          isActive &&
            "bg-neutral-muted/75 text-foreground dark:bg-neutral-muted/60",
          className,
        )}
        {...(action && { onClick: action })}
        {...props}
        aria-current={isActive ? "page" : undefined}
      >
        <Icon className="mr-0.5 h-4 w-4 shrink-0 transition-transform duration-200" />
        <span>{label}</span>

        {/* Extra options */}
        {children}
      </div>
    );

    return href ? (
      <li className="w-full">
        <Link href={href}>{jsx}</Link>
      </li>
    ) : (
      <li className="w-full">{jsx}</li>
    );
  },
);

export { SidebarItem };
