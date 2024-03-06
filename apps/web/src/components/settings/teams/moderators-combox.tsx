import { Member } from "@repo/data";
import {
  Avatar,
  AvatarFallback,
  AvatarImage,
  Checkbox,
  ComboboxCell,
  CommandItem,
} from "@repo/ui";
import * as React from "react";
import { DeepReadonlyObject } from "replicache";

interface ModeratorsComboboxProps {
  members: readonly DeepReadonlyObject<Member>[];
  teamMembers: readonly DeepReadonlyObject<Member>[];
  moderators: readonly string[];
  handleToggleModerator: (e: string | boolean, id: string) => void;
}

export function ModeratorsCombobox({
  members,
  teamMembers,
  moderators,
  handleToggleModerator,
}: ModeratorsComboboxProps) {
  const [open, setOpen] = React.useState(false);

  return (
    <ComboboxCell
      open={open}
      onOpenChange={setOpen}
      nData={members.length}
      renderer={
        teamMembers.length > 0 && <span>@{teamMembers[0]?.data.username}</span>
      }
      label="moderators"
      placeholder="Search for moderators"
    >
      {members.map((member, i) => (
        <CommandItem
          key={i}
          value={`${member.data.username} ${member.data.displayName}`}
          className="flex items-center gap-2"
        >
          <Avatar className="h-6 w-6">
            <AvatarImage
              src={member.data?.avatar || ""}
              alt={member.data.username}
            />
            <AvatarFallback>{member.data.username[0]}</AvatarFallback>
          </Avatar>
          <div>
            <p className="truncate text-xs">{member.data.displayName}</p>
            <p className="truncate text-xs text-muted-foreground">
              @{member.data.username}
            </p>
          </div>

          <Checkbox
            className="ml-auto"
            defaultChecked={moderators.some((mod) => mod === member.id)}
            onCheckedChange={(e) => handleToggleModerator(e, member.id)}
          />
        </CommandItem>
      ))}
    </ComboboxCell>
  );
}
