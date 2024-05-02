import { GroupMultiSelect } from "@/components/group-multi-select";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  Folder,
  FolderSchema,
  ID_LENGTH,
  WORKSPACE_GROUP_ID_LENGTH,
} from "@repo/data";
import { Button } from "@repo/ui/components/ui/button";
import { DialogClose, DialogContent } from "@repo/ui/components/ui/dialog";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
} from "@repo/ui/components/ui/form";
import { Input } from "@repo/ui/components/ui/input";
import { useCurrentWorkspace } from "@repo/ui/hooks/use-current-workspace";

import { nanoid } from "nanoid";
import { useRef } from "react";
import { useForm } from "react-hook-form";

export function AddFolderForm({
  teamId,
  folder,
}: {
  teamId: string;
  folder?: Folder;
}) {
  const { workspaceRep, structure } = useCurrentWorkspace();
  const form = useForm<Folder>({
    resolver: zodResolver(FolderSchema),
    defaultValues: {
      name: folder?.name || "",
      viewGroups: folder?.viewGroups || ["team-members"],
      editGroups: folder?.editGroups || ["team-members"],
      id: folder?.id || nanoid(WORKSPACE_GROUP_ID_LENGTH),
      channels: folder?.channels || [],
    },
  });

  const closeRef = useRef<HTMLButtonElement>(null);

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
