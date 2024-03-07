import * as React from "react";
import { DrObj, Member, Tag as TagType, Team } from "@repo/data";
import {
  Avatar,
  AvatarFallback,
  AvatarImage,
  DataTableActions,
  DataTableHeaderSelect,
  DataTableRowSelect,
  Dialog,
  DialogContent,
  DialogTrigger,
  Header,
  Input,
} from "@repo/ui";
import { produce } from "immer";
import { ColumnDef } from "@tanstack/react-table";
import { SidebarItemBtn } from "@repo/ui/components/sidebar-item-btn";
import _ from "lodash";
import { enableMapSet } from "immer";

import { TagsComboBox } from "./tags-combobox";
import { UserRoundCog } from "lucide-react";
import { TeamMembersDialog } from "./team-members-dialog";

enableMapSet();

export const teamColumns = (
  members: readonly DrObj<Member>[],
): ColumnDef<DrObj<Team>>[] => {
  return [
    {
      id: "select",
      header: ({ table }) => <DataTableHeaderSelect withForm table={table} />,
      cell: ({ row, table }) => <DataTableRowSelect row={row} />,
      enableSorting: false,
      enableHiding: false,
    },

    {
      accessorFn: (team) => team.name,
      id: "team",
      header: () => <Header>Team</Header>,
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
          <div className="flex gap-2">
            <Avatar className="h-8 w-8 rounded-md ">
              <AvatarImage
                src={row.original.avatar}
                alt={value}
                className="rounded-md"
              />
              <AvatarFallback className="rounded-md capitalize">
                {value?.[0] || ""}
              </AvatarFallback>
            </Avatar>
            <Input
              value={value}
              ref={inputRef}
              placeholder="Team name"
              onChange={(e) => {
                setValue(e.target.value);
                setEdited(produce((draft) => draft.add(row.index)));
              }}
              onBlur={onBlur}
              inRow
            />
          </div>
        );
      },
    },
    {
      accessorKey: "tags",
      header: () => <Header className="px-1">Tags</Header>,
      cell: ({ row, table }) => {
        if (!table.options.meta) return null;

        const { buffer, setBuffer, setEdited } = table.options.meta;

        // const orgTags = row.original.tags!;
        const tags = buffer.get(row.index)?.tags || row.original.tags!;
        // const tags = [...bufferedTags];

        function handleDeleteTag(tagName: string) {
          setBuffer((draft) => {
            if (draft.has(row.index)) {
              draft.get(row.index)!.tags = tags.filter(
                (tag) => tag.name !== tagName,
              );

              return;
            }

            draft.set(row.index, {
              tags: tags.filter((tag) => tag.name !== tagName),
            });
          });

          setEdited((draft) => {
            draft.add(row.index);
          });
        }

        function handleNewTag({ name, color = "#1d4ed8" }: TagType) {
          setBuffer((draft) => {
            if (draft.has(row.index)) {
              const curTags = draft.get(row.index)!.tags;
              curTags
                ? curTags.push({ name, color })
                : (draft.get(row.index)!.tags = [...tags, { name, color }]);
              return;
            }

            draft.set(row.index, {
              tags: [...tags, { name, color }],
            });
          });

          setEdited((draft) => {
            draft.add(row.index);
          });
        }

        return (
          <TagsComboBox
            tags={tags}
            handleDeleteTag={handleDeleteTag}
            handleNewTag={handleNewTag}
          />
        );
      },
    },

    {
      id: "actions",
      cell: ({ row, table }) => {
        const team = row.original;
        if (!table.options.meta) return null;

        const { buffer, setBuffer, setEdited } = table.options.meta;

        const curMembersIds = buffer.get(row.index)?.members || team.members;

        function addMember(member: DrObj<Member>) {
          if (team.members.includes(member.id)) return;

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

        return (
          <Dialog>
            <DialogContent>
              <TeamMembersDialog
                members={members}
                curMembersIds={curMembersIds}
                addMember={addMember}
                moderators={team.moderators}
                // removeMember={}
                teamId={team.id}
                parentTable={table}
              />
            </DialogContent>
            <DataTableActions
              row={row}
              table={table}
              menuItems={[
                {
                  label: "Delete",
                  action: () => {
                    console.log("delete team:", team.id);
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
