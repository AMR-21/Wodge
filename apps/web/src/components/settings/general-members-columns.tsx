import { DrObj, Member } from "@repo/data";
import { DataTableActions } from "@repo/ui/components/data-table/data-table-action";
import { DataTableHeaderSelect, DataTableRowSelect } from "@repo/ui/components/data-table/data-table-select";
import { Header } from "@repo/ui/components/data-table/header";
import { Avatar, AvatarFallback, AvatarImage } from "@repo/ui/components/ui/avatar";

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
    accessorFn: (member) => member.data.email,
    id: "member",
    header: () => <Header>Member</Header>,
    cell: ({ row }) => {
      const { avatar, displayName, email } = row.original.data;

      return (
        <div className="flex items-center gap-4">
          <Avatar className="h-8 w-8 rounded-md ">
            <AvatarImage
              src={avatar}
              alt={displayName}
              className="rounded-md"
            />
            <AvatarFallback className="rounded-md capitalize">
              {displayName?.[0] || ""}
            </AvatarFallback>
          </Avatar>
          <div className="flex flex-col">
            <p>{displayName}</p>
            <p className="text-xs text-muted-foreground">{email}</p>
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
