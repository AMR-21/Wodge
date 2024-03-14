import { DrObj, Member, Team } from "@repo/data";
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
import { Button } from "@repo/ui/components/ui/button";

import { ColumnDef } from "@tanstack/react-table";

export const linkedTeamColumns = (
  unLinkTeam: (teamId: string) => void,
): ColumnDef<DrObj<Team>>[] => [
  {
    id: "select",
    header: ({ table }) => <DataTableHeaderSelect table={table} />,
    cell: ({ row }) => <DataTableRowSelect row={row} />,
    enableSorting: false,
    enableHiding: false,
  },

  {
    accessorFn: (team) => team.name,
    id: "team",
    header: () => <Header>Team</Header>,
    cell: ({ row }) => {
      const { name, avatar } = row.original;

      return (
        <div className="flex items-center gap-4">
          <Avatar className="h-8 w-8 rounded-md ">
            {/* <AvatarImage src={avatar} alt={name} className="rounded-md" /> */}
            <AvatarFallback className="rounded-md capitalize">
              {name?.[0] || ""}
            </AvatarFallback>
          </Avatar>
          <p>{name}</p>
        </div>
      );
    },
  },
  {
    id: "unlink",
    cell: ({ row }) => {
      return (
        <Button
          variant="outline"
          size="sm"
          onClick={() => unLinkTeam(row.original.id)}
        >
          Unlink
        </Button>
      );
    },
  },
];
