import { GroupMultiSelect } from "@/components/group-multi-select";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  Folder,
  FolderSchema,
  ID_LENGTH,
  WORKSPACE_GROUP_ID_LENGTH,
} from "@repo/data";
import { Button } from "@/components/ui/button";
import { DialogClose, DialogContent } from "@/components/ui/dialog";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { useCurrentWorkspace } from "@/components/workspace-provider";

import { nanoid } from "nanoid";
import { useMemo, useRef } from "react";
import { useForm } from "react-hook-form";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

export function AddFolderForm({
  teamId,
  folder,
  parentOverride,
}: {
  teamId: string;
  folder?: Folder;
  parentOverride?: string;
}) {
  const { workspaceRep, structure } = useCurrentWorkspace();
  const form = useForm<Folder>({
    resolver: zodResolver(FolderSchema),
    defaultValues: {
      name: folder?.name || "",
      id: folder?.id || nanoid(WORKSPACE_GROUP_ID_LENGTH),
      channels: folder?.channels || [],
      parentFolder: folder?.parentFolder || parentOverride || "",
    },
  });

  const closeRef = useRef<HTMLButtonElement>(null);

  const team = useMemo(
    () => structure.teams.find((t) => t.id === teamId),
    [structure.teams, teamId],
  );

  async function onSubmit(data: Folder) {
    if (folder) {
      await workspaceRep?.mutate.updateFolder({
        teamId,
        ...data,
      });

      return closeRef.current?.click();
    }
    await workspaceRep?.mutate.updateTeam({
      teamId,
      teamUpdate: {
        action: "addFolder",
        update: { folder: data },
      },
    });

    form.reset();
    form.setValue("id", nanoid(WORKSPACE_GROUP_ID_LENGTH));
    closeRef.current?.click();
  }

  return (
    <DialogContent className="max-w-80">
      <Form {...form}>
        <form
          onSubmit={form.handleSubmit(onSubmit)}
          className="space-y-4 px-1.5"
        >
          <FormField
            control={form.control}
            name="name"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Folder name</FormLabel>
                <FormControl>
                  <Input {...field} placeholder="new folder" />
                </FormControl>
              </FormItem>
            )}
          />

          {/* <FormField
            control={form.control}
            name="viewGroups"
            render={({ field }) => {
              return (
                <FormItem>
                  <FormLabel>View groups</FormLabel>
                  <FormControl>
                    <GroupMultiSelect
                      onChange={field.onChange}
                      baseGroups={structure.groups}
                    />
                  </FormControl>
                </FormItem>
              );
            }}
          />

          <FormField
            control={form.control}
            name="editGroups"
            render={({ field }) => {
              return (
                <FormItem>
                  <FormLabel>Edit groups</FormLabel>
                  <FormControl>
                    <GroupMultiSelect
                      onChange={field.onChange}
                      baseGroups={structure.groups}
                    />
                  </FormControl>
                </FormItem>
              );
            }}
          /> */}

          <FormField
            control={form.control}
            name="parentFolder"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Parent folder</FormLabel>
                <Select
                  onValueChange={field.onChange}
                  defaultValue={field.value}
                >
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Assign a parent folder" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    {team?.folders
                      .filter((f) => f.id !== folder?.id)
                      .map((f) => (
                        <SelectItem key={f.id} value={f.id}>
                          {f.id.startsWith("root-") ? "Root" : f.name}
                        </SelectItem>
                      ))}
                  </SelectContent>
                </Select>
              </FormItem>
            )}
          />

          <Button type="submit" className="w-full">
            {folder ? "Update" : "Create"} folder
          </Button>

          <DialogClose asChild>
            <button
              ref={closeRef}
              className="hidden"
              aria-label="close dialog"
            />
          </DialogClose>
        </form>
      </Form>
    </DialogContent>
  );
}
