"use client";

import * as React from "react";
import { format } from "date-fns";
import { CalendarDays } from "lucide-react";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@repo/ui/components/ui/popover";
import { Button } from "@repo/ui/components/ui/button";
import { cn } from "@repo/ui/lib/utils";
import { Calendar } from "@repo/ui/components/ui/calendar";
import { TimePickerDemo } from "@repo/ui/components/time-picker-demo";
import { Label } from "@repo/ui/components/ui/label";
import { Switch } from "@repo/ui/components/ui/switch";
import { DateRange } from "react-day-picker";

export function DateTimePicker({
  preset,
  bigger,
}: {
  preset?: DateRange;
  bigger?: boolean;
}) {
  const [date, setDate] = React.useState<DateRange | undefined>(
    preset || undefined,
  );
  const [includeTime, setIncludeTime] = React.useState<boolean>(false);

  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button
          variant={"ghost"}
          size={bigger ? "sm" : "fit"}
          className={cn(
            "justify-start gap-2 text-left text-xs font-normal",
            !date && "text-sm text-muted-foreground",
            bigger && "text-sm",
          )}
        >
          {bigger && (
            <div className="flex w-36 items-center gap-2">
              <CalendarDays className={cn("h-4 w-4 text-foreground")} />
              <span className="mr-2">Due date</span>
            </div>
          )}
          {date?.from ? (
            date.to ? (
              <>
                {format(
                  date.from,
                  includeTime ? "LLL dd, y HH:mm" : "LLL dd, y",
                )}{" "}
                -{" "}
                {format(date.to, includeTime ? "LLL dd, y HH:mm" : "LLL dd, y")}
              </>
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
        className="w-auto p-0"
      >
        <Calendar
          mode="range"
          numberOfMonths={1}
          selected={date}
          onSelect={setDate}
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
                setIncludeTime(c);

                if (!c) {
                  setDate({
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
                    setDate({
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
                    setDate({
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
              setDate(undefined);
            }}
          >
            Clear
          </Button>
        </div>
      </PopoverContent>
    </Popover>
  );
}
