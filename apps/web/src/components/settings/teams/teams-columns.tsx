import * as React from "react";
import { Tag as TagType, Team } from "@repo/data";
import {
  Avatar,
  AvatarFallback,
  AvatarImage,
  Badge,
  ComboboxCell,
  CommandItem,
  DataTableActions,
  DataTableHeaderSelect,
  DataTableRowSelect,
  Header,
  Input,
  Tag,
} from "@repo/ui";
import { produce } from "immer";
import { ColumnDef } from "@tanstack/react-table";
import { DeepReadonly } from "replicache";
import { SidebarItemBtn } from "@repo/ui/components/sidebar-item-btn";
import { X } from "lucide-react";
import { NewTag } from "./new-tag";
import { enableMapSet } from "immer";
import { set } from "zod";
enableMapSet();

export const teamColumns = (): ColumnDef<DeepReadonly<Team>>[] => {
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
      header: () => <Header className="px-3">Tags</Header>,
      cell: ({ row, table }) => {
        const [open, setOpen] = React.useState(false);
        if (!table.options.meta) return null;

        const { buffer, setBuffer, setEdited } = table.options.meta;

        const orgTags = row.original.tags!;
        const bufferedTags = buffer.get(row.index)?.tags || [];
        const tags = [...orgTags, ...bufferedTags];

        function handleDelete(tagName: string) {
          setBuffer((draft) => {
            if (draft.has(row.index)) {
              return (draft.get(row.index)!.tags = tags?.filter(
                (tag) => tag.name !== tagName,
              ));
            }

            draft.set(row.index, {
              tags: tags?.filter((tag) => tag.name !== tagName),
            });
          });
        }

        function handleNewTag({ name, color = "#1d4ed8" }: TagType) {
          setBuffer((draft) => {
            if (draft.has(row.index)) {
              draft.get(row.index)!.tags?.push({ name, color });
              return;
            }

            draft.set(row.index, {
              tags: [{ name, color }],
            });
          });

          setEdited((draft) => {
            draft.add(row.index);
          });
        }

        return (
          <ComboboxCell
            open={open}
            onOpenChange={setOpen}
            label={
              tags?.length && tags.length > 0 ? (
                <Tag name={tags[0]?.name!} color={tags[0]?.color} />
              ) : (
                "No tags"
              )
            }
            placeholder="Search for tags"
            emptyMsg="No tags found"
            description="Manage tags"
            className="w-[240px]"
            nData={tags?.length}
          >
            {tags?.map((tag, i) => (
              <CommandItem
                key={i}
                value={tag.name}
                className="flex justify-between"
              >
                <Tag name={tag.name} color={tag.color} noBg />
                <SidebarItemBtn
                  Icon={X}
                  destructive
                  side="right"
                  description="Delete tag"
                  onClick={handleDelete.bind(null, tag.name)}
                />
              </CommandItem>
            ))}

            <CommandItem className="px-0 py-0 hover:bg-transparent">
              <NewTag handleNewTag={handleNewTag} />
            </CommandItem>
          </ComboboxCell>
        );
      },
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
      cell: ({ row, table }) => {
        const team = row.original;

        if (team.id === "add-team") return null;

        return <DataTableActions row={row} table={table} menuItems={[]} />;
      },
    },
  ];
};
