import { zodResolver } from "@hookform/resolvers/zod";
import { JoinWorkspaceSchema } from "@repo/data";

import { nanoid } from "nanoid";
import { useRouter } from "next/navigation";
import { useTransition } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
} from "@repo/ui/components/ui/form";
import { Input } from "@repo/ui/components/ui/input";
import { DialogClose } from "@repo/ui/components/ui/dialog";
import { Button } from "@repo/ui/components/ui/button";
import { toast } from "@repo/ui/components/ui/toast";

export function JoinWorkspaceForm() {
  const form = useForm<z.infer<typeof JoinWorkspaceSchema>>({
    resolver: zodResolver(JoinWorkspaceSchema),
    defaultValues: {
      url: "",
    },
  });

  const [isPending, startTransition] = useTransition();
  const router = useRouter();
  // const user = useCurrentUser();

  async function onSubmit(data: z.infer<typeof JoinWorkspaceSchema>) {
    startTransition(async () => {
      const res = await fetch(data.url, {
        method: "POST",
        credentials: "include",
      });
      if (!res.ok) {
        toast.error("Failed to join workspace");
        return;
      }
      const { workspaceId } = (await res.json()) as { workspaceId: string };
      // router.push(`/workspaces/${workspaceId}`);
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
              <FormControl>
                <Input
                  {...field}
                  className="w-full"
                  placeholder={"https://domain.com/" + nanoid(6)}
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
            Join Workspace
          </Button>
        </div>
      </form>
    </Form>
  );
}
