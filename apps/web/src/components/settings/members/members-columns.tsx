import { Member, PublicUserType } from "@repo/data";
import { DataTableActions } from "@repo/ui/components/data-table/data-table-action";
import { Header } from "@repo/ui/components/data-table/header";

import { SidebarItemBtn } from "@repo/ui/components/sidebar-item-btn";
import { TooltipWrapper } from "@repo/ui/components/tooltip-wrapper";
import {
  Avatar,
  AvatarFallback,
  AvatarImage,
} from "@repo/ui/components/ui/avatar";
import { Checkbox } from "@repo/ui/components/ui/checkbox";
import { ColumnDef } from "@tanstack/react-table";
import { Crown, MoreHorizontal } from "lucide-react";
import { DeepReadonly } from "replicache";

interface MembersColumnsProps {
  removeMember: (memberId: string) => void;
  inviters?: (Pick<Member, "id" | "data"> | undefined)[];
}
export function membersColumns({
  removeMember,
  inviters,
}: MembersColumnsProps): ColumnDef<DeepReadonly<Member>>[] {
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
      id: "member",
      accessorFn: (row) => row.data.email,
      header: () => <Header>Member</Header>,

      cell: ({ row }) => {
        const member = row.original;

        return (
          <div className="flex gap-4">
            <Avatar className="h-8 w-8 rounded-md">
              {/* <AvatarImage
                src={member.data.avatar}
                alt={member.data.displayName}
                className="rounded-md"
              /> */}
              <AvatarFallback className="rounded-md">
                {member.data.displayName[0]}
              </AvatarFallback>
            </Avatar>
            <div className="flex flex-col">
              <div className="flex gap-1">
                <p>{member.data.displayName}</p>
              </div>
              <span className="text-xs text-muted-foreground">
                {member.data.email}
              </span>
            </div>
          </div>
        );
      },
    },
    {
      id: "joinMethod",
      header: () => <p className="pl-1">Join Method</p>,
      cell: ({ row }) => {
        const member = row.original;

        const inviter = inviters?.find(
          (i) => i?.id === member.joinInfo.created_by,
        );

        const token = member.joinInfo.token;

        return (
          <div className="flex flex-col">
            <div className="truncate">
              {token ? (
                <TooltipWrapper content={`Created by ${inviter?.data.email}`}>
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
          </div>
        );
      },
    },

    {
      id: "actions",
      cell: ({ row, table }) => {
        const member = row.original;

        return (
          <DataTableActions
            row={row}
            table={table}
            menuItems={[
              {
                label: "Delete",
                action: () => {
                  removeMember(member.id);
                },
                destructive: true,
              },
            ]}
          />
        );
      },
    },
  ];
}
