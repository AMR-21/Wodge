import { Member, PublicUserType } from "@repo/data";
import { queryClient } from "@repo/data/lib/query-client";
import { DataTableActions } from "@repo/ui/components/data-table/data-table-action";
import { Header } from "@repo/ui/components/data-table/header";

import {
  Avatar,
  AvatarFallback,
  AvatarImage,
} from "@repo/ui/components/ui/avatar";
import { buttonVariants } from "@repo/ui/components/ui/button";
import { Checkbox } from "@repo/ui/components/ui/checkbox";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@repo/ui/components/ui/select";
import { useMember } from "@repo/ui/hooks/use-member";
import { cn } from "@repo/ui/lib/utils";
import { ColumnDef } from "@tanstack/react-table";
import { useState } from "react";
import { DeepReadonly } from "replicache";

interface MembersColumnsProps {
  removeMember: (memberId: string) => void;
  changeMemberRole: (memberId: string, role: Member["role"]) => void;
  workspaceId: string;
  inviters?: (Pick<Member, "id"> | undefined)[];
}
export function membersColumns({
  removeMember,
  changeMemberRole,
  workspaceId,
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
      accessorFn: (row) => {
        const members = queryClient.getQueryData<PublicUserType[]>([
          workspaceId,
          "members",
        ]);

        const member = members?.find((m) => m.id === row.id);

        return `${member?.displayName} ${member?.email} ${member?.username}`;
      },
      header: () => <Header>Member</Header>,

      cell: ({ row }) => {
        const { member, isMembersPending } = useMember(row.original.id);

        if (isMembersPending) return null;

        return (
          <div className="flex gap-4">
            <Avatar className="h-8 w-8 rounded-md">
              <AvatarImage
                src={member?.avatar}
                alt={member?.displayName}
                className="rounded-md"
              />
              <AvatarFallback className="rounded-md">
                {/* {member?.displayName[0]} */}
              </AvatarFallback>
            </Avatar>
            <div className="flex flex-col">
              <div className="flex gap-1">
                <p>{member?.displayName}</p>
              </div>
              <span className="text-xs text-muted-foreground">
                {member?.email}
              </span>
            </div>
          </div>
        );
      },
    },

    // {
    //   id: "joinMethod",
    //   header: () => <p className="pl-1">Join Method</p>,
    //   cell: ({ row }) => {
    //     const member = row.original;

    //     const inviter = inviters?.find(
    //       (i) => i?.id === member.joinInfo.created_by,
    //     );

    //     const token = member.joinInfo.token;

    //     return (
    //       <div className="flex flex-col">
    //         <div className="truncate">
    //           {token ? (
    //             <TooltipWrapper content={`Created by ${inviter?.email}`}>
    //               <pre className="truncate rounded-md bg-surface p-1 text-center text-xs">
    //                 {token}
    //               </pre>
    //             </TooltipWrapper>
    //           ) : (
    //             <div className="flex items-center gap-2 pl-1">
    //               <span>Workspace Owner</span>
    //               <Crown className="h-4 w-4 fill-yellow-500 stroke-yellow-500" />
    //             </div>
    //           )}
    //         </div>
    //       </div>
    //     );
    //   },
    // },
    {
      id: "role",
      header: () => <Header className="pl-3">Role</Header>,
      cell: ({ row }) => {
        const [value, setValue] = useState<string>(row.original.role);

        return (
          <div className="flex w-28">
            <Select
              disabled={row.original.role === "owner"}
              defaultValue={value}
              onValueChange={(v) =>
                changeMemberRole(row.original.id, v as Member["role"])
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
                {row.original.role === "owner" && (
                  <SelectItem value="owner">Owner</SelectItem>
                )}
                <SelectItem value="admin">Admin</SelectItem>
                <SelectItem value="member">Member</SelectItem>
              </SelectContent>
            </Select>
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
                label: "Remove from workspace",
                action: () => {
                  removeMember(member.id);
                },
                destructive: true,
                disabled: member.role === "owner",
              },
            ]}
          />
        );
      },
    },
  ];
}
