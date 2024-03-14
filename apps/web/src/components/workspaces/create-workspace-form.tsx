import { zodResolver } from "@hookform/resolvers/zod";
import { ID_LENGTH, NewWorkspaceSchema, type NewWorkspace } from "@repo/data";
import { env } from "@repo/env";

import { HelpCircle } from "lucide-react";
import { nanoid } from "nanoid";
import { useRouter } from "next/navigation";
import { useTransition } from "react";
import { useForm } from "react-hook-form";

import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
} from "@repo/ui/components/ui/form";
import { Input } from "@repo/ui/components/ui/input";
import { TooltipWrapper } from "@repo/ui/components/tooltip-wrapper";
import { Switch } from "@repo/ui/components/ui/switch";
import { DialogClose } from "@repo/ui/components/ui/dialog";
import { Button } from "@repo/ui/components/ui/button";
import { useCurrentUser } from "@repo/ui/hooks/use-current-user";
import { toast } from "@repo/ui/components/ui/toast";
import { useActions, useUserStore } from "@repo/ui/store/store-hooks";

export function CreateWorkspaceForm() {
  const user = useCurrentUser();
  const userStore = useUserStore();
  const { addWorkspace } = useActions();
  const router = useRouter();

  const form = useForm<NewWorkspace>({
    resolver: zodResolver(NewWorkspaceSchema),
    defaultValues: {
      avatar: "https://wsdasda",
      name: "",
      id: nanoid(ID_LENGTH),
      onCloud: false,
    },
  });

  const [isPending, startTransition] = useTransition();

  async function onSubmit(data: NewWorkspace) {
    if (!user) return;
    startTransition(async () => {
      if (data.onCloud) {
        const res = await fetch(
          `${env.NEXT_PUBLIC_BACKEND_DOMAIN}/parties/workspace/${data.id}/create`,
          {
            method: "POST",
            credentials: "include",
          },
        );

        if (!res.ok) {
          toast.error("Failed to create workspace on cloud");

          return;
        }
      }

      // Add workspace to user store
      userStore?.mutate.createWorkspace(data);

      // Create new workspace replicache instance
      const workspace = addWorkspace(
        data.id,
        data.onCloud ? "cloud" : "local",
        user.id,
      );

      // Init the workspace
      workspace.mutate.initWorkspace({
        ...data,
        createdAt: new Date().toISOString(),
        environment: data.onCloud ? "cloud" : "local",
        owner: user.id,
      });

      // for safety and avoiding duplicate ids
      form.setValue("id", nanoid());

      // router.push("/workspaces/" + data.id);
    });
  }

  return (
    <Form {...form}>
      <form
        className="mt-3 flex flex-col gap-4 px-2"
        onSubmit={form.handleSubmit(onSubmit)}
      >
        <FormField
          control={form.control}
          name="avatar"
          render={({ field }) => (
            <FormControl>
              <Input {...field} placeholder="Workspace avatar" type="hidden" />
            </FormControl>
          )}
        />

        <FormField
          control={form.control}
          name="name"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Workspace name</FormLabel>
              <FormControl>
                <Input {...field} placeholder="Workspace name" />
              </FormControl>
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="id"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Workspace name</FormLabel>
              <FormControl>
                <Input {...field} placeholder="Workspace name" />
              </FormControl>
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="onCloud"
          render={({ field }) => (
            <FormItem className="flex w-full flex-row items-center gap-1 space-y-0">
              <FormLabel>Enable cloud access</FormLabel>
              <TooltipWrapper
                className="max-w-64"
                sideOffset={6}
                content={
                  <p className="text-pretty">
                    By default a workspace is created locally, enabling cloud
                    access will allow you to save your workspace to the cloud,
                    access it from anywhere, and invite collaborators.
                  </p>
                }
              >
                <HelpCircle className="h-4 w-4 text-muted-foreground" />
              </TooltipWrapper>

              <FormControl className="ml-auto">
                <Switch
                  checked={field.value}
                  onCheckedChange={field.onChange}
                />
              </FormControl>
            </FormItem>
          )}
        />

        <div className="flex gap-2">
          <DialogClose asChild>
            <Button variant="outline" type="button" className="basis-1/3">
              Cancel
            </Button>
          </DialogClose>
          <Button type="submit" className="basis-2/3" isPending={isPending}>
            Create Workspace
          </Button>
        </div>
      </form>
    </Form>
  );
}
