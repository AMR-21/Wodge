import { Team } from "@repo/data";
import {
  Avatar,
  AvatarFallback,
  AvatarImage,
  Badge,
  Checkbox,
  DataTableColumnHeader,
} from "@repo/ui";
import { ColumnDef } from "@tanstack/react-table";
import { DeepReadonly } from "replicache";

export const columns: ColumnDef<DeepReadonly<Team>>[] = [
  {
    id: "select",
    header: ({ table }) => (
      <div className="flex items-center">
        <Checkbox
          checked={
            table.getIsAllPageRowsSelected() ||
            (table.getIsSomePageRowsSelected() && "indeterminate")
          }
          onCheckedChange={(value) => table.toggleAllPageRowsSelected(!!value)}
          aria-label="Select all"
        />
      </div>
    ),
    cell: ({ row }) => (
      <div className="flex items-center">
        <Checkbox
          checked={row.getIsSelected()}
          onCheckedChange={(value) => row.toggleSelected(!!value)}
          aria-label="Select row"
        />
      </div>
    ),
    enableSorting: false,
    enableHiding: false,
  },
  {
    accessorKey: "avatar",
    header: () => <div className="w-fit">Avatar</div>,
    cell: ({ row }) => {
      const team = row.original;

      return (
        <div className="w-fit">
          <Avatar className="h-8 w-8 rounded-md ">
            <AvatarImage
              src={team.avatar}
              alt={team.name}
              className="rounded-md"
            />
            <AvatarFallback className="rounded-md">
              {team.name[0]}
            </AvatarFallback>
          </Avatar>
        </div>
      );
    },
  },
  {
    accessorKey: "name",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Name" />
    ),
  },
  {
    accessorKey: "tags",
    header: "Tags",
    cell: ({ row }) => (
      <Badge className="cursor-pointer" onClick={() => console.log("hi")}>
        Show
      </Badge>
    ),
  },

  {
    accessorKey: "moderators",
    header: "Moderators",
    cell: ({ row }) => (
      <Badge className="cursor-pointer" onClick={() => console.log("hi2")}>
        Show
      </Badge>
    ),
  },
  {
    accessorKey: "actions",
    header: "Actions",
  },
];
