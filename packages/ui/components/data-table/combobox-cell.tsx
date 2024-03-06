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
import { Tooltip, TooltipProvider, TooltipTrigger } from "../ui/tooltip";

interface ComboBoxCellProps {
  renderer: React.ReactNode;
  placeholder?: string;
  emptyMsg?: string;
  nData?: number;
  label?: string;
  children: React.ReactNode;
  open: boolean;
  onOpenChange?: (open: boolean) => void;
  className?: string;
  placeholderClassName?: string;
}

export function ComboboxCell({
  renderer,
  placeholder,
  emptyMsg,
  nData = 2,
  children,
  label,
  open = false,
  onOpenChange,
  className,
  placeholderClassName,
}: ComboBoxCellProps) {
  const labelText = nData > 0 ? `Manage ${label}` : "";

  return (
    <Popover open={open} onOpenChange={onOpenChange}>
      <TooltipWrapper content={labelText} side="top">
        <PopoverTrigger asChild>
          <div
            className={cn(
              buttonVariants({
                size: "sm",
                variant: "ghost",
              }),
              "group w-[10rem] max-w-[10rem] cursor-pointer justify-start gap-1 ",
            )}
          >
            {nData > 0 && <span className="truncate">{renderer}</span>}
            {nData > 1 ? (
              <span className="rounded-md border border-border/50 bg-surface p-1 text-xs">
                +{nData - 1}
              </span>
            ) : null}

            {nData === 0 && (
              <div
                className={cn(
                  "flex w-full items-center justify-start gap-1",
                  placeholderClassName,
                )}
              >
                <Plus className="h-4 w-4" />
                <span>Add {label}</span>
              </div>
            )}
            {nData > 1 && (
              <ChevronRight
                className={cn(
                  "h-4 w-4 opacity-50 transition-all group-hover:opacity-100",
                  open && "visible rotate-90",
                )}
              />
            )}
            {/* <SidebarItemBtn
              description={labelText}
              Icon={nData === 0 ? Plus : ChevronRight}
              className="invisible group-hover/row:visible"
              iconClassName={cn(
                "transition-all",
                nData > 0 && open && "visible rotate-90 transition-all ",
                )}
              /> */}
          </div>
        </PopoverTrigger>
      </TooltipWrapper>

      <PopoverContent
        className={cn("w-[200px] p-0", className)}
        sticky="always"
      >
        <Command>
          <CommandInput placeholder={placeholder} className="h-9" />
          <CommandEmpty>{emptyMsg}</CommandEmpty>
          <CommandGroup>{children}</CommandGroup>
        </Command>
      </PopoverContent>
    </Popover>
  );
}
