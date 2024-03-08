import { DrObj, Member, Role, Team } from "@repo/data";
import {
  Checkbox,
  ComboboxCell,
  CommandItem,
  DataTableActions,
  DataTableHeaderSelect,
  DataTableRowSelect,
  Dialog,
  DialogContent,
  DialogTrigger,
  Header,
  Input,
} from "@repo/ui";
import { SidebarItemBtn } from "@repo/ui/components/sidebar-item-btn";
import { ColumnDef } from "@tanstack/react-table";
import { enableMapSet, produce } from "immer";
import _ from "lodash";
import { Check, UserRoundCog } from "lucide-react";
import * as React from "react";
import { TeamMembersDialog } from "../teams/team-members-dialog";

enableMapSet();

interface RoleColumnsProps {
  members: readonly DrObj<Member>[];
  teams: readonly DrObj<Team>[];
  deleteRole: (roleId: string) => void;
}
export const rolesColumns = ({
  members,
  teams,
  deleteRole,
}: RoleColumnsProps): ColumnDef<DrObj<Role>>[] => {
  return [
    {
      id: "select",
      header: ({ table }) => <DataTableHeaderSelect table={table} />,
      cell: ({ row }) => <DataTableRowSelect row={row} />,
      enableSorting: false,
      enableHiding: false,
    },
    {
      accessorKey: "name",
      id: "name",
      header: () => <Header className="px-3">Role</Header>,
      cell: ({ row, table }) => {
        const initialValue =
          table.options.meta?.buffer.get(row.index)?.name || row.original.name;
        // We need to keep and update the state of the cell normally
        const [value, setValue] = React.useState(initialValue);

        // If the initialValue is changed external, sync it up with our state
        React.useEffect(() => {
          setValue(initialValue);
        }, [initialValue]);

        React.useEffect(() => {
          if (
            row.index === table.getRowModel().rows.length - 1 &&
            table.options.meta?.isEditing
          ) {
            inputRef.current?.focus();
          }
        }, [table.options.meta?.isEditing]);

        const inputRef = React.useRef<HTMLInputElement>(null);

        if (!table.options.meta) return null;

        const { buffer, setBuffer, setEdited } = table.options.meta;

        // When the input is blurred, we'll call our table meta's updateData function
        const onBlur = () => {
          if (value === initialValue) return;

          if (value === "") return setValue(initialValue);

          if (buffer.has(row.index))
            return setBuffer((draft) => {
              draft.get(row.index)!.name = value;
            });

          setBuffer((draft) => {
            draft.set(row.index, { name: value });
          });
        };

        return (
          <Input
            value={value}
            ref={inputRef}
            placeholder="Role name"
            onChange={(e) => {
              setValue(e.target.value);
              setEdited(produce((draft) => draft.add(row.index)));
            }}
            onBlur={onBlur}
            inRow
          />
        );
      },
    },
    {
      id: "createdBy",
      header: () => <Header>Created By</Header>,
      cell: ({ row }) => {
        const id = row.original.createdBy;
        return (
          <div className="flex flex-col">
            <p className="max-w-32 truncate">{id}</p>
          </div>
        );
      },
    },
    {
      id: "permissions",
      header: () => <Header className="px-1">Permissions</Header>,
      cell: ({ row, table }) => {
        const [open, setOpen] = React.useState(false);

        if (!table.options.meta) return null;

        const { buffer, setBuffer, setEdited } = table.options.meta;

        // const orgTags = row.original.tags!;
        const permissions =
          buffer.get(row.index)?.permissions || row.original.permissions;

        const basePerms = [
          "read",
          "write",
          "admin",
        ] satisfies Role["permissions"];

        function handlePerm(
          checked: string | boolean,
          name: "admin" | "read" | "write",
        ) {
          setEdited((draft) => {
            draft.add(row.index);
          });

          setBuffer((draft) => {
            if (draft.has(row.index)) {
              const cur = draft.get(row.index)!;
              if (checked === false) {
                cur.permissions = cur.permissions
                  ? (draft.get(row.index)!.permissions = permissions.filter(
                      (perm) => perm !== name,
                    ))
                  : [
                      ...row.original.permissions.filter(
                        (perm) => perm !== name,
                      ),
                    ];
              } else {
                cur.permissions && cur.permissions.push(name);
                !cur.permissions && [...row.original.permissions, name];
              }

              return;
            }

            draft.set(row.index, {
              permissions: [...permissions, name],
            });
          });
        }

        return (
          <ComboboxCell
            open={open}
            onOpenChange={setOpen}
            renderer={
              <div className=" flex gap-1 overflow-hidden">
                {permissions.join(" - ")}
              </div>
            }
            placeholder="Search for permissions"
            emptyMsg="No tags found"
            label="permissions"
            className="w-[240px]"
            nData={permissions?.length}
          >
            {basePerms?.map((permission, i) => (
              <CommandItem
                key={i}
                value={permission}
                className="flex justify-between"
              >
                <p>{permission}</p>
                <Checkbox
                  defaultChecked={permissions.some(
                    (perm) => perm === permission,
                  )}
                  onCheckedChange={(e) => handlePerm(e, permission)}
                />
              </CommandItem>
            ))}
          </ComboboxCell>
        );
      },
    },

    {
      id: "assignedTo",
      header: () => <Header>Assigned To</Header>,
      cell: ({ row }) => {
        const id = row.original.linkedTeams;
        return (
          <div className="flex flex-col">
            <p className="max-w-32 truncate">{id}</p>
          </div>
        );
      },
    },
    {
      id: "actions",
      cell: ({ row, table }) => {
        const role = row.original;
        if (!table.options.meta) return null;

        const { buffer, setBuffer, setEdited } = table.options.meta;

        const curMembersIds = buffer.get(row.index)?.members || role.members;

        function addMember(member: DrObj<Member>) {
          if (role.members.includes(member.id)) return;

          setEdited((draft) => {
            draft.add(row.index);
          });

          setBuffer((draft) => {
            if (draft.has(row.index)) {
              const cur = draft.get(row.index)!;
              cur.members
                ? cur.members.push(member.id)
                : (cur.members = [...row.original.members, member.id]);

              return;
            }

            draft.set(row.index, {
              members: [...row.original.members, member.id],
            });
          });
        }

        function removeMember(memberId: string) {
          setEdited((draft) => {
            draft.add(row.index);
          });

          setBuffer((draft) => {
            if (draft.has(row.index)) {
              const cur = draft.get(row.index)!;
              cur.members = cur.members?.filter((id) => id !== memberId);
              return;
            }

            draft.set(row.index, {
              members: row.original.members.filter((id) => id !== memberId),
            });
          });
        }

        return (
          <Dialog>
            <DialogContent>
              <TeamMembersDialog
                members={members}
                curMembersIds={curMembersIds}
                addMember={addMember}
                removeMember={removeMember}
                creatorId={role.createdBy}
              />
            </DialogContent>
            <DataTableActions
              row={row}
              table={table}
              menuItems={[
                {
                  label: "Delete",
                  action: () => {
                    deleteRole(role.id);
                  },
                  destructive: true,
                },
              ]}
            >
              <DialogTrigger asChild>
                <SidebarItemBtn
                  Icon={UserRoundCog}
                  description="Members settings"
                />
              </DialogTrigger>
            </DataTableActions>
          </Dialog>
        );
      },
    },
  ];
};
