import { Member, Team } from "@repo/data";
import { DeepReadonlyObject } from "replicache";
import * as React from "react";
import {
  Avatar,
  AvatarFallback,
  AvatarImage,
  Button,
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@repo/ui";

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
                  <AvatarImage src={team.avatar} />
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
