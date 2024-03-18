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
import { useMember } from "@repo/ui/hooks/use-member";

import { ColumnDef } from "@tanstack/react-table";

interface MembersColumnsProps {
  removeMember: (memberId: string) => void;
  creatorId?: string;
  allowRemoveCreator?: boolean;
  allowAllRemove?: boolean;
}

export const generalMembersColumns = ({
  creatorId,
  removeMember,
  allowRemoveCreator = false,
  allowAllRemove = false,
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
    id: "actions",
    cell: ({ row, table }) => {
      const memberId = row.original.id;
      const disabled =
        (!allowAllRemove && table.getRowCount() === 1) ||
        (!allowRemoveCreator && creatorId === memberId);

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
              disabled,
            },
          ]}
        />
      );
    },
  },
];
