import { DrObj, Member, PublicUserType } from "@repo/data";
import { queryClient } from "@repo/data/lib/query-client";
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
import { useMember } from "@repo/ui/hooks/use-member";

import { ColumnDef } from "@tanstack/react-table";

interface MembersColumnsProps {
  removeMember: (memberId: string) => void;
  creatorId?: string;
  workspaceId: string;
}

export const groupMembersColumns = ({
  creatorId,
  removeMember,
  workspaceId,
}: MembersColumnsProps): ColumnDef<DrObj<Member>>[] => [
  {
    id: "select",
    header: ({ table }) => <DataTableHeaderSelect table={table} />,
    cell: ({ row }) => <DataTableRowSelect row={row} />,
    enableSorting: false,
    enableHiding: false,
  },

  {
    accessorFn: (row) => {
      const members = queryClient.getQueryData<PublicUserType[]>([
        workspaceId,
        "members",
      ]);

      const member = members?.find((m) => m.id === row.id);

      return `${member?.displayName} ${member?.email} ${member?.username}`;
    },
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
    id: "actions",
    cell: ({ row, table }) => {
      const memberId = row.original.id;

      return (
        <DataTableActions
          row={row}
          table={table}
          menuItems={[
            {
              label: "Remove from group",
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
