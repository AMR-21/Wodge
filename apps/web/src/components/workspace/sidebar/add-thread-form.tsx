import { GroupMultiSelect } from "@/components/group-multi-select";
import { zodResolver } from "@hookform/resolvers/zod";
import { ID_LENGTH, Room, RoomSchema, Thread, ThreadSchema } from "@repo/data";
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
import { useCurrentUser } from "@repo/ui/hooks/use-current-user";

import { useCurrentWorkspace } from "@repo/ui/hooks/use-current-workspace";
import { nanoid } from "nanoid";
import { useRef } from "react";
import { useForm } from "react-hook-form";

export function AddThreadForm({ teamId }: { teamId: string }) {
  const { workspaceRep, structure } = useCurrentWorkspace();
  const { user } = useCurrentUser();
  const form = useForm<Thread>({
    resolver: zodResolver(
      ThreadSchema.omit({
        createdBy: true,
        isResolved: true,
      }),
    ),
    defaultValues: {
      name: "",
      avatar: "",
      editGroups: ["team-members"],
      viewGroups: ["team-members"],
      id: nanoid(ID_LENGTH),
    },
  });

  const closeRef = useRef<HTMLButtonElement>(null);

  async function onSubmit(data: Thread) {
    if (!user) return;

    await workspaceRep?.mutate.createThread({
      teamId,
      ...data,
      createdBy: user.id,
    });
    form.reset();
    form.setValue("id", nanoid(ID_LENGTH));
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
                <FormLabel>Thread name</FormLabel>
                <FormControl>
                  <Input {...field} placeholder="new thread" />
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
            Create thread
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
