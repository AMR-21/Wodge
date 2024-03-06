"use client";

import * as React from "react";
import { CaretSortIcon, CheckIcon } from "@radix-ui/react-icons";

import { cn } from "../../lib/utils";
import { Button, buttonVariants } from "../ui/button";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
} from "../ui/command";
import { Popover, PopoverContent, PopoverTrigger } from "../ui/popover";
import { ChevronDown, ChevronRight, Plus } from "lucide-react";
import { SidebarItemBtn } from "../sidebar-item-btn";
import { TooltipWrapper } from "../tooltip-wrapper";

interface ComboBoxCellProps {
  label: string | React.ReactNode;
  placeholder?: string;
  emptyMsg?: string;
  nData?: number;
  description?: string;
  children: React.ReactNode;
  open: boolean;
  onOpenChange?: (open: boolean) => void;
  className?: string;
}

export function ComboboxCell({
  label,
  placeholder,
  emptyMsg,
  nData = 2,
  description,
  children,
  open = false,
  onOpenChange,
  className,
}: ComboBoxCellProps) {
  return (
    <Popover open={open} onOpenChange={onOpenChange}>
      <div
        className={cn(
          buttonVariants({
            size: "sm",
            variant: "ghost",
          }),
          "group w-[10rem] max-w-[10rem] justify-start gap-1 hover:bg-transparent",
        )}
      >
        <span className="truncate">{label}</span>
        {nData > 1 ? (
          <span className="rounded-md border border-border/50 bg-surface p-1 text-xs">
            +{nData - 1}
          </span>
        ) : null}

        <PopoverTrigger asChild>
          <SidebarItemBtn
            description={description}
            Icon={ChevronRight}
            className={cn(
              "invisible transition-all group-hover/row:visible",

              open && "visible rotate-90 ",
            )}
          />
        </PopoverTrigger>
      </div>

      <PopoverContent className={cn("w-[200px] p-0", className)}>
        <Command>
          <CommandInput placeholder={placeholder} className="h-9" />
          <CommandEmpty>{emptyMsg}</CommandEmpty>
          <CommandGroup>{children}</CommandGroup>
        </Command>
      </PopoverContent>
    </Popover>
  );
}
