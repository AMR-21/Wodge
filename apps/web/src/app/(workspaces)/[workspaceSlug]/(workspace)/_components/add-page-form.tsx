import { GroupMultiSelect } from "@/components/group-multi-select";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  Channel,
  ChannelSchema,
  ID_LENGTH,
  Page,
  PageSchema,
} from "@repo/data";
import { Button, buttonVariants } from "@repo/ui/components/ui/button";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogTrigger,
} from "@repo/ui/components/ui/dialog";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@repo/ui/components/ui/form";
import { Input } from "@repo/ui/components/ui/input";
import { PopoverClose } from "@repo/ui/components/ui/popover";
import { RadioGroup, RadioGroupItem } from "@repo/ui/components/ui/radio-group";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@repo/ui/components/ui/select";
import { useCurrentWorkspace } from "@repo/ui/hooks/use-current-workspace";
import { nanoid } from "nanoid";
import { useEffect, useRef } from "react";
import { useForm } from "react-hook-form";

export function AddPageForm({
  folderId,
  teamId,
  page,
}: {
  folderId?: string;
  teamId: string;
  page?: Page;
}) {
  const { workspaceRep, structure } = useCurrentWorkspace();
  const form = useForm<Page>({
    resolver: zodResolver(PageSchema),
    defaultValues: {
      name: page?.avatar || "",
      avatar: page?.avatar || "",
      editGroups: page?.editGroups || ["team-members"],
      viewGroups: page?.viewGroups || ["team-members"],
      id: page?.id || nanoid(ID_LENGTH),
    },
  });

  const closeRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    form?.reset(page);
  }, [page]);

  async function onSubmit(data: Page) {
    if (page) {
      await workspaceRep?.mutate.updatePage({
        folderId: folderId || "root-" + teamId,
        teamId,
        ...data,
      });
      return closeRef.current?.click();
    }

    await workspaceRep?.mutate.createPage({
      folderId: folderId || "root-" + teamId,
      teamId,
      ...data,
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
                <FormLabel>Page name</FormLabel>
                <FormControl>
                  <Input {...field} placeholder="new page" />
                </FormControl>
              </FormItem>
            )}
          />

          <FormField
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
                      preset={page?.viewGroups}
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
                      preset={page?.editGroups}
                    />
                  </FormControl>
                </FormItem>
              );
            }}
          />

          <Button type="submit" className="w-full">
            {page ? "Update" : "Create"} page
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
