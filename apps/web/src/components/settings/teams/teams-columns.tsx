import * as React from "react";
import { Member, Tag as TagType, Team } from "@repo/data";
import {
  Avatar,
  AvatarFallback,
  AvatarImage,
  Badge,
  Button,
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
import { produce } from "immer";
import { ColumnDef } from "@tanstack/react-table";
import { DeepReadonly } from "replicache";
import { SidebarItemBtn } from "@repo/ui/components/sidebar-item-btn";
import { enableMapSet } from "immer";

import _ from "lodash";
import { TagsComboBox } from "./tags-combobox";
import { ModeratorsCombobox } from "./moderators-combox";
import { ChevronRight, User, UserRoundCog, Users2 } from "lucide-react";
import { TeamMembersDialog } from "./team-members-dialog";
enableMapSet();

export const teamColumns = (
  members: readonly DeepReadonly<Member>[],
): ColumnDef<DeepReadonly<Team>>[] => {
  return [
    {
      id: "select",
      header: ({ table }) => <DataTableHeaderSelect table={table} />,
      cell: ({ row }) => <DataTableRowSelect row={row} />,
      enableSorting: false,
      enableHiding: false,
    },

    {
      accessorKey: "avatar",
      header: () => <Header>Avatar</Header>,
      cell: ({ row, table }) => {
        const name =
          table.options?.meta?.buffer.get(row.index)?.name || row.original.name;
        const avatar =
          table.options?.meta?.buffer.get(row.index)?.avatar ||
          row.original.avatar;

        return (
          <div className="w-fit">
            <Avatar className="h-8 w-8 rounded-md ">
              <AvatarImage src={avatar} alt={name} className="rounded-md" />
              <AvatarFallback className="rounded-md capitalize">
                {name[0]}
              </AvatarFallback>
            </Avatar>
          </div>
        );
      },
    },
    {
      accessorKey: "name",
      header: () => <Header className="px-3">Team name</Header>,
      cell: ({ row, table }) => {
        const initialValue =
          table.options.meta?.buffer.get(row.index)?.name || row.original.name;
        // We need to keep and update the state of the cell normally
        const [value, setValue] = React.useState(initialValue);

        // If the initialValue is changed external, sync it up with our state
        React.useEffect(() => {
          setValue(initialValue);
        }, [initialValue]);

        if (!table.options.meta) return null;

        const { buffer, setBuffer, setEdited } = table.options.meta;

        // When the input is blurred, we'll call our table meta's updateData function
        const onBlur = () => {
          if (value === initialValue) return;

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

    // {
    //   accessorKey: "moderators",
    //   header: () => <Header className="px-3">Moderators</Header>,
    //   cell: ({ row, table }) => {
    //     // Todo:filter members
    //     const teamId = row.original.id;
    //     const teamMembers = members.filter((member) => member);

    //     if (!table.options.meta) return null;

    //     const { buffer, setBuffer, setEdited } = table.options.meta;

    //     const moderators =
    //       buffer.get(row.index)?.moderators || row.original.moderators!;

    //     function handleToggleModerator(
    //       isChecked: boolean | string,
    //       memberId: string,
    //     ) {
    //       setBuffer((draft) => {
    //         if (draft.has(row.index)) {
    //           const curTeam = draft.get(row.index)!;

    //           if (isChecked) {
    //             curTeam.moderators
    //               ? curTeam.moderators.push(memberId)
    //               : (curTeam.moderators = [memberId]);
    //           } else {
    //             curTeam.moderators = moderators.filter(
    //               (mod) => mod !== memberId,
    //             );
    //           }
    //           return;
    //         }

    //         if (isChecked) {
    //           draft.set(row.index, {
    //             moderators: [...moderators, memberId],
    //           });
    //         } else {
    //           draft.set(row.index, {
    //             moderators: moderators.filter((mod) => mod !== memberId),
    //           });
    //         }
    //       });

    //       setEdited((draft) => {
    //         draft.add(row.index);
    //       });
    //     }

    //     return (
    //       <ModeratorsCombobox
    //         members={members}
    //         teamMembers={teamMembers}
    //         moderators={moderators}
    //         handleToggleModerator={handleToggleModerator}
    //       />
    //     );
    //   },
    // },
    // {
    //   id: "members",
    //   header: () => <Header className="px-1">Members</Header>,
    //   cell: ({ row }) => {
    //     return (
    //       <Dialog>
    //         <DialogTrigger asChild>
    //           <Button
    //             size="fit"
    //             variant="ghost"
    //             className="w-20 justify-between font-normal"
    //           >
    //             Manage
    //             <ChevronRight className="h-3.5 w-3.5 shrink-0" />
    //           </Button>
    //         </DialogTrigger>

    //         <DialogContent></DialogContent>
    //       </Dialog>
    //     );
    //   },
    // },
    {
      id: "actions",
      cell: ({ row, table }) => {
        const team = row.original;

        // function addMember(id){}

        return (
          <Dialog open>
            <DialogContent>
              <TeamMembersDialog
                members={members}
                // addMember={}
                moderators={team.moderators}
                // removeMember={}
                teamId={team.id}
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
