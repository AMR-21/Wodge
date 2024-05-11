import { DrObj, Member, PublicUserType } from "@repo/data";
import { queryClient } from "@repo/data/lib/query-client";
import { DataTableActions } from "@/components/data-table/data-table-action";
import {
  DataTableHeaderSelect,
  DataTableRowSelect,
} from "@/components/data-table/data-table-select";
import { Header } from "@/components/data-table/header";
import {
  Avatar,
  AvatarFallback,
  AvatarImage,
} from "@/components/ui/avatar";
import { useMember } from "@/hooks/use-member";

import { ColumnDef } from "@tanstack/react-table";

interface MembersColumnsProps {
  removeMember: (memberId: string) => void;
  creatorId?: string;
  workspaceId?: string;
}

export const groupMembersColumns = ({
  creatorId,
  removeMember,
  workspaceId,
}: MembersColumnsProps): ColumnDef<string>[] => [
  // {
  //   id: "select",
  //   header: ({ table }) => <DataTableHeaderSelect table={table} />,
  //   cell: ({ row }) => <DataTableRowSelect row={row} />,
  //   enableSorting: false,
  //   enableHiding: false,
  // },

  {
    accessorFn: (row) => {
      const members = queryClient.getQueryData<PublicUserType[]>([
        workspaceId,
        "members",
      ]);

      const member = members?.find((m) => m.id === row);

      return `${member?.displayName} ${member?.email} ${member?.username}`;
    },
    id: "member",
    header: () => <Header>Member</Header>,
    cell: ({ row }) => {
      const memberId = row.original;
      const { member, isMembersPending } = useMember(memberId);

      if (isMembersPending) return null;

      return (
        <div className="flex items-center gap-4">
          <Avatar className="h-8 w-8">
            <AvatarImage src={member?.avatar} alt={member?.displayName} />
            <AvatarFallback>{member?.displayName.at(0)}</AvatarFallback>
          </Avatar>
          <div className="flex flex-col">
            <div className="flex gap-1 text-[0.8125rem]">
              <p>{member?.displayName}</p>
            </div>
            <span className="text-[0.8125rem] text-muted-foreground">
              {member?.email}
            </span>
          </div>
        </div>
      );
    },
  },

  {
    id: "username",

    header: () => <Header>Username</Header>,

    cell: ({ row }) => {
      const { member, isMembersPending } = useMember(row.original);

      if (isMembersPending) return null;

      return <p className="text-sm">@{member?.username}</p>;
    },
  },
  {
    id: "actions",
    cell: ({ row, table }) => {
      const memberId = row.original;

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
