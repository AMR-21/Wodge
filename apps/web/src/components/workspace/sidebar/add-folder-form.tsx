import { GroupMultiSelect } from "@/components/group-multi-select";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  Folder,
  FolderSchema,
  ID_LENGTH,
  WORKSPACE_GROUP_ID_LENGTH,
} from "@repo/data";
import { Button } from "@repo/ui/components/ui/button";
import { DialogContent } from "@repo/ui/components/ui/dialog";
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
import { useForm } from "react-hook-form";

export function AddFolderForm({ teamId }: { teamId: string }) {
  const { workspaceRep } = useCurrentWorkspace();
  const form = useForm<Folder>({
    resolver: zodResolver(FolderSchema.pick({ name: true, id: true })),
    defaultValues: {
      name: "",
      id: nanoid(WORKSPACE_GROUP_ID_LENGTH),
    },
  });

  async function onSubmit(data: Folder) {
    await workspaceRep?.mutate.updateTeam({
      teamId,
      teamUpdate: {
        action: "addFolder",
        update: { folder: data },
      },
    });

    form.reset();
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

          <Button type="submit" className="w-full">
            Create folder
          </Button>
        </form>
      </Form>
    </DialogContent>
  );
}
