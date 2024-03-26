import { Button } from "@repo/ui/components/ui/button";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
} from "@repo/ui/components/ui/command";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@repo/ui/components/ui/popover";
import { cn } from "@repo/ui/lib/utils";
import { Check, ChevronDown } from "lucide-react";
import { useState } from "react";

interface MultiSelectProps {
  data: string[];
}

export function MultiSelect({ data }: MultiSelectProps) {
  const [value, setValue] = useState<string[]>([]);

  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button className="flex items-center gap-1">
          <span>Multi-select</span>
          <ChevronDown className="h-4 w-4" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="bg-transparent p-0">
        <Command>
          <CommandInput placeholder="Search framework..." />
          <CommandEmpty>No framework found.</CommandEmpty>
          <CommandGroup>
            {data.map((d) => (
              <CommandItem
                key={d}
                value={d}
                onSelect={(currentValue) => {
                  setValue((v) => [...new Set([...v, currentValue])]);
                }}
              >
                {d}
                <Check
                  className={cn(
                    "mr-2 h-4 w-4",
                    value.includes(d) ? "opacity-100" : "opacity-0",
                  )}
                />
              </CommandItem>
            ))}
          </CommandGroup>
        </Command>
      </PopoverContent>
    </Popover>
  );
}
