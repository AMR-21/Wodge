import { SidebarItemBtn } from "@/components/workspace/sidebar-item-btn";
import { Team } from "@repo/data";
import {
  Avatar,
  AvatarFallback,
  AvatarImage,
  Badge,
  Button,
  Checkbox,
  DataTableColumnHeader,
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
  FormField,
  FormItem,
  FormMessage,
  Header,
  Input,
} from "@repo/ui";
import { ColumnDef } from "@tanstack/react-table";
import { Check, MoreHorizontal } from "lucide-react";
import { UseFormReturn } from "react-hook-form";
import { DeepReadonly } from "replicache";

export const teamColumns = (
  form: UseFormReturn<
    {
      name: string;
      id: string;
    },
    any,
    {
      name: string;
      id: string;
    }
  >,
): ColumnDef<DeepReadonly<Team>>[] => {
  return [
    {
      id: "select",
      header: ({ table }) => (
        <div className="flex items-center">
          <Checkbox
            checked={
              table.getIsAllPageRowsSelected() ||
              (table.getIsSomePageRowsSelected() && "indeterminate")
            }
            onCheckedChange={(value) =>
              table.toggleAllPageRowsSelected(!!value)
            }
            aria-label="Select all"
          />
        </div>
      ),
      cell: ({ row }) => {
        if (row.original.id === "add-team") return null;
        return (
          <div className="flex items-center">
            <Checkbox
              checked={row.getIsSelected()}
              onCheckedChange={(value) => {
                row.toggleSelected(!!value);
                row.pin("bottom");
              }}
              aria-label="Select row"
            />
          </div>
        );
      },
      enableSorting: false,
      enableHiding: false,
    },

    {
      accessorKey: "avatar",
      header: () => <Header>Avatar</Header>,
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
              <AvatarFallback className="rounded-md capitalize">
                {team.name[0]}
              </AvatarFallback>
            </Avatar>
          </div>
        );
      },
    },
    {
      accessorKey: "name",
      header: () => <Header>Team name</Header>,
      cell: ({ row }) => {
        const team = row.original;

        if (team.id === "add-team")
          return (
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <Input
                    {...field}
                    placeholder="Team name"
                    className="h-3/4  w-3/4"
                  />
                </FormItem>
              )}
            />
          );

        return <p>{team.name}</p>;
      },
    },
    {
      accessorKey: "tags",
      header: () => <Header>Tags</Header>,
      cell: ({ row }) => (
        <Badge className="cursor-pointer" onClick={() => console.log("hi")}>
          Show
        </Badge>
      ),
    },

    {
      accessorKey: "moderators",
      header: () => <Header>Moderators</Header>,
      cell: ({ row }) => (
        <Badge className="cursor-pointer" onClick={() => console.log("hi2")}>
          Show
        </Badge>
      ),
    },
    {
      id: "actions",
      cell: ({ row }) => {
        const team = row.original;

        if (team.id === "add-team") return null;

        return (
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <SidebarItemBtn Icon={MoreHorizontal} />
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuLabel>Actions</DropdownMenuLabel>
              <DropdownMenuItem
              // onClick={() =>
              //   navigator.clipboard.writeText(member.data.username)
              // }
              >
                Copy username
              </DropdownMenuItem>
              <DropdownMenuItem
              // onClick={() => navigator.clipboard.writeText(member.data.email)}
              >
                Copy email
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem destructive>
                Remove from workspace
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        );
      },
    },
  ];
};
