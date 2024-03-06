import { Member, PublicUserType } from "@repo/data";
import {
  Avatar,
  AvatarFallback,
  AvatarImage,
  Badge,
  Button,
  Checkbox,
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
  TooltipWrapper,
} from "@repo/ui";
import { SidebarItemBtn } from "@repo/ui/components/sidebar-item-btn";
import { ColumnDef } from "@tanstack/react-table";
import { Crown, MoreHorizontal } from "lucide-react";
import { DeepReadonly } from "replicache";

export function membersColumns(
  inviters: (Pick<Member, "id" | "data"> | undefined)[],
): ColumnDef<DeepReadonly<Member>>[] {
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
      id: "avatar",
      header: () => <p>Avatar</p>,
      cell: ({ row }) => {
        const member = row.original;

        return (
          <div className="w-fit">
            <Avatar className="h-8 w-8">
              <AvatarImage
                src={member.data.avatar}
                alt={member.data.displayName}
                className="rounded-md"
              />
              <AvatarFallback className="rounded-md">
                {member.data.displayName[0]}
              </AvatarFallback>
            </Avatar>
          </div>
        );
      },
    },

    {
      id: "info",
      header: () => <p>Information</p>,

      cell: ({ row }) => {
        const member = row.original;

        return (
          <div className="flex flex-col">
            <div className="flex gap-1">
              <p>{member.data.displayName}</p>
              <span>-</span>
              <p>{member.data.username}</p>
            </div>
            <span className="text-xs text-muted-foreground">
              {member.data.email}
            </span>
          </div>
        );
      },
    },
    {
      id: "joinMethod",
      header: () => <p className="pl-1">Join Method</p>,
      cell: ({ row }) => {
        const member = row.original;

        // if(!inviters)
        const inviter = inviters.find(
          (i) => i?.id === member.joinInfo.created_by,
        );

        const token = member.joinInfo.token;

        return (
          <div className="flex flex-col">
            <div className="truncate">
              {token ? (
                <TooltipWrapper
                  content={`Created by ${inviter?.data.username}`}
                >
                  <pre className="truncate rounded-md bg-surface p-1 text-center text-xs">
                    {token}
                  </pre>
                </TooltipWrapper>
              ) : (
                <div className="flex items-center gap-2 pl-1">
                  <span>Workspace Owner</span>
                  <Crown className="h-4 w-4 fill-yellow-500 stroke-yellow-500" />
                </div>
              )}
            </div>
            {/* {member.data.joinMethod}? */}
            {/* <span className="text-xs text-muted-foreground">
            {member.joinInfo.created_by}
          </span> */}
          </div>
        );
      },
    },
    {
      id: "teams",
      header: () => <p>Teams</p>,
      cell: ({ row }) => {
        const member = row.original;

        return (
          <Badge className="cursor-pointer" onClick={() => console.log("hi2")}>
            View
          </Badge>
        );
      },
    },

    {
      id: "roles",
      header: () => <p>Roles</p>,
      cell: ({ row }) => {
        const member = row.original;

        return (
          <Badge className="cursor-pointer" onClick={() => console.log("hi2")}>
            View
          </Badge>
        );
      },
    },
    {
      id: "actions",
      cell: ({ row }) => {
        const member = row.original;

        return (
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <SidebarItemBtn Icon={MoreHorizontal} className="z-50" />
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuLabel>Actions</DropdownMenuLabel>
              <DropdownMenuItem
                onClick={() =>
                  navigator.clipboard.writeText(member.data.username)
                }
              >
                Copy username
              </DropdownMenuItem>
              <DropdownMenuItem
                onClick={() => navigator.clipboard.writeText(member.data.email)}
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
}
