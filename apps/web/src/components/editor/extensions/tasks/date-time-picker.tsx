"use client";

import * as React from "react";
import { format } from "date-fns";
import { CalendarDays } from "lucide-react";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { Calendar } from "@/components/ui/calendar";
import { TimePickerDemo } from "@/components/time-picker-demo";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { DateRange } from "react-day-picker";
import { DrObj, Task } from "@repo/data";
import { Editor } from "@tiptap/react";

export function DateTimePicker({
  bigger,
  date,
  onSetDate,
  includeTime,
  setIncludeTime,
  isEditing,

  editor,
}: {
  bigger?: boolean;
  date?: DateRange;
  onSetDate?: (d: DateRange | undefined) => void | Promise<void>;
  includeTime?: boolean;
  setIncludeTime?: (c: boolean) => void;
  isEditing?: boolean;
  editor?: Editor | null;
}) {
  const [open, setOpen] = React.useState(false);

  React.useEffect(() => {
    editor?.setEditable(!open);
  }, [open]);

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant={"ghost"}
          size={bigger ? "sm" : "fit"}
          className={cn(
            "justify-start gap-2 overflow-hidden truncate text-left text-sm font-normal disabled:opacity-85",
            !date && "text-sm text-muted-foreground",
            bigger && "text-sm",
          )}
          disabled={!isEditing}
        >
          {bigger && (
            <div className="flex w-36 items-center gap-2">
              <CalendarDays className={cn("h-4 w-4 text-foreground")} />
              <span className="mr-2">Due date</span>
            </div>
          )}
          {date?.from ? (
            date.to ? (
              <p className="overflow-hidden truncate">
                {format(
                  date.from,
                  includeTime ? "LLL dd, y HH:mm" : "LLL dd, y",
                )}{" "}
                -{" "}
                {format(date.to, includeTime ? "LLL dd, y HH:mm" : "LLL dd, y")}
              </p>
            ) : (
              format(date.from, includeTime ? "LLL dd, y HH:mm" : "LLL dd, y")
            )
          ) : (
            <>
              {!bigger && (
                <CalendarDays
                  className={cn("h-4 w-4 text-foreground", bigger && "h-4 w-4")}
                />
              )}
              <span>{bigger ? "Empty" : "Add Due"}</span>
            </>
          )}
        </Button>
      </PopoverTrigger>
      <PopoverContent
        align={bigger ? "center" : "start"}
        className="z-40 w-auto p-0"
        onClick={(e) => {
          e.stopPropagation();
        }}
      >
        <Calendar
          mode="range"
          numberOfMonths={1}
          selected={date}
          onSelect={onSetDate}
          initialFocus
        />

        <div className="space-y-4 border-t border-border p-3">
          <div className="flex items-center justify-between gap-1 ">
            <Label htmlFor="time-toggle" className="text-sm">
              Include time
            </Label>
            <Switch
              id="time-toggle"
              onCheckedChange={(c) => {
                setIncludeTime?.(c);

                if (!c) {
                  onSetDate?.({
                    from: date?.from
                      ? new Date(date.from.setHours(0, 0, 0, 0))
                      : undefined,
                    to: date?.to
                      ? new Date(date.to.setHours(0, 0, 0, 0))
                      : undefined,
                  });
                }
              }}
            />
          </div>

          {includeTime && (
            <div className="flex w-full flex-col justify-between gap-1">
              <div className="flex items-center justify-between">
                <Label className="text-sm">From</Label>
                <TimePickerDemo
                  disabled={!includeTime}
                  setDate={(d) => {
                    onSetDate?.({
                      from: d,
                      to: date?.to,
                    });
                  }}
                  date={date?.from}
                />
              </div>

              <div className="flex items-center justify-between">
                <Label>To</Label>
                <TimePickerDemo
                  disabled={!includeTime}
                  setDate={(d) => {
                    onSetDate?.({
                      to: d,
                      from: date?.from,
                    });
                  }}
                  date={date?.to}
                />
              </div>
            </div>
          )}
        </div>

        <div className="space-y-4 border-t border-border p-1">
          <Button
            className="w-full"
            variant="ghost"
            size="fit"
            onClick={() => {
              onSetDate?.(undefined);
            }}
          >
            Clear
          </Button>
        </div>
      </PopoverContent>
    </Popover>
  );
}
