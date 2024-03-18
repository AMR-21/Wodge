import { DrObj, Member } from "@repo/data";
import { DataTableActions } from "@repo/ui/components/data-table/data-table-action";
import {
  DataTableHeaderSelect,
  DataTableRowSelect,
} from "@repo/ui/components/data-table/data-table-select";
import { Header } from "@repo/ui/components/data-table/header";
import {
  Avatar,
  AvatarFallback,
  AvatarImage,
} from "@repo/ui/components/ui/avatar";
import { buttonVariants } from "@repo/ui/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@repo/ui/components/ui/select";
import { useMember } from "@repo/ui/hooks/use-member";
import { cn } from "@repo/ui/lib/utils";

import { ColumnDef } from "@tanstack/react-table";
import { useState } from "react";

interface MembersColumnsProps {
  removeMember: (memberId: string) => void;
  changeTeamMemberRole: (
    memberId: string,
    role: "teamMember" | "moderator",
  ) => void;
  creatorId?: string;
  moderatorsIds: readonly string[];
}

export const teamMembersColumns = ({
  creatorId,
  removeMember,
  changeTeamMemberRole,
  moderatorsIds,
}: MembersColumnsProps): ColumnDef<DrObj<Member>>[] => [
  {
    id: "select",
    header: ({ table }) => <DataTableHeaderSelect table={table} />,
    cell: ({ row }) => <DataTableRowSelect row={row} />,
    enableSorting: false,
    enableHiding: false,
  },

  {
    // accessorFn: (member) => member.data.email,
    id: "member",
    header: () => <Header>Member</Header>,
    cell: ({ row }) => {
      const memberId = row.original.id;
      const { member, isMembersPending } = useMember(memberId);

      if (isMembersPending) return null;

      return (
        <div className="flex items-center gap-4">
          <Avatar className="h-8 w-8 rounded-md ">
            <AvatarImage
              src={member?.avatar}
              alt={member?.displayName}
              className="rounded-md"
            />
            <AvatarFallback className="rounded-md capitalize">
              {member?.displayName?.[0] || ""}
            </AvatarFallback>
          </Avatar>
          <div className="flex flex-col">
            <p>{member?.displayName}</p>
            <p className="text-xs text-muted-foreground">{member?.email}</p>
          </div>
        </div>
      );
    },
  },

  {
    id: "creator",
    header: () => <Header>Creator</Header>,
    cell: ({ row }) => {
      if (row.original.id === creatorId) {
        return <p>Creator</p>;
      }
      return null;
    },
  },
  {
    id: "role",
    header: () => <Header className="pl-3">Role</Header>,
    cell: ({ row }) => {
      const isModerator = moderatorsIds?.includes(row.original.id);
      const [value, setValue] = useState<string>(
        isModerator ? "moderator" : "teamMember",
      );

      return (
        <div className="flex w-28">
          <Select
            defaultValue={value}
            onValueChange={(v) =>
              changeTeamMemberRole(
                row.original.id,
                v as "teamMember" | "moderator",
              )
            }
          >
            <SelectTrigger
              className={cn(
                buttonVariants({
                  variant: "ghost",
                  size: "sm",
                }),
                "w-fit justify-end gap-1 border-none text-right capitalize",
              )}
            >
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="teamMember">Team member</SelectItem>
              <SelectItem value="moderator">Moderator</SelectItem>
            </SelectContent>
          </Select>
        </div>
      );
    },
  },
  {
    id: "actions",
    cell: ({ row, table }) => {
      const memberId = row.original.id;

      return (
        <DataTableActions
          row={row}
          table={table}
          menuItems={[
            {
              label: "Remove from team",
              action: () => {
                removeMember(memberId);
              },
              destructive: true,
            },
          ]}
        />
      );
    },
  },
];
