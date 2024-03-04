import { zodResolver } from "@hookform/resolvers/zod";
import { JoinWorkspaceSchema, WorkspacesRegistry } from "@repo/data";
import {
  Button,
  DialogClose,
  Form,
  FormField,
  FormItem,
  FormLabel,
  Input,
  useCurrentUser,
  useUserWorkspaces,
} from "@repo/ui";
import { nanoid } from "nanoid";
import { useRouter } from "next/navigation";
import { useTransition } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";

export function JoinWorkspaceForm() {
  const form = useForm({
    resolver: zodResolver(JoinWorkspaceSchema),
    defaultValues: {
      url: "",
    },
  });

  const [isPending, startTransition] = useTransition();
  const router = useRouter();
  const user = useCurrentUser();

  async function onSubmit(data: z.infer<typeof JoinWorkspaceSchema>) {
    startTransition(async () => {
      const res = await fetch(data.url, {
        method: "POST",
        credentials: "include",
      });

      if (!res.ok) {
        console.error("Failed to join workspace");
        return;
      }

      const { workspaceId } = (await res.json()) as { workspaceId: string };

      // Update the user workspaces
      await user?.store.pull();

      // Ensure that the workspace is create with cloud mode
      WorkspacesRegistry.getInstance().reInit(workspaceId);

      router.push(`/${workspaceId}`);
    });
  }

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(onSubmit)}
        className="mt-3 flex flex-col gap-4 px-2"
      >
        <FormField
          control={form.control}
          name="url"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Invite link</FormLabel>
              <Input
                {...field}
                className="w-full"
                placeholder={"https://domain.com/" + nanoid(6)}
              />
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
            Join Workspace
          </Button>
        </div>
      </form>
    </Form>
  );
}
