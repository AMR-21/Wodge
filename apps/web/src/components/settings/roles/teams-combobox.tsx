import { Member, Team } from "@repo/data";
import { DeepReadonlyObject } from "replicache";
import * as React from "react";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@repo/ui/components/ui/popover";
import { Button } from "@repo/ui/components/ui/button";
import { Command } from "lucide-react";
import {
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
} from "@repo/ui/components/ui/command";
import { Avatar, AvatarFallback } from "@repo/ui/components/ui/avatar";

interface TeamsComboboxProps {
  teams: readonly DeepReadonlyObject<Team>[];
  onClick?: (teamId: string) => void;
}
export function TeamsCombobox({ teams, onClick }: TeamsComboboxProps) {
  const [open, setOpen] = React.useState(false);

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button size="sm">Add a team</Button>
      </PopoverTrigger>
      <PopoverContent className=" p-0">
        <Command>
          <CommandInput placeholder="Search a team" />
          <CommandEmpty>No team found.</CommandEmpty>
          <CommandGroup>
            {teams.map((team) => (
              <CommandItem
                key={team.id}
                value={team.name}
                onSelect={() => {
                  onClick?.(team.id);
                  setOpen(false);
                }}
                className="flex items-center gap-3"
              >
                <Avatar className="h-8 w-8 rounded-md">
                  {/* <AvatarImage src={team.avatar} /> */}
                  <AvatarFallback>{team.name[0]}</AvatarFallback>
                </Avatar>

                <span>{team.name}</span>
              </CommandItem>
            ))}
          </CommandGroup>
        </Command>
      </PopoverContent>
    </Popover>
  );
}
