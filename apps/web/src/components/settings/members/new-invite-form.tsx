import { zodResolver } from "@hookform/resolvers/zod";
import { NewInvite, NewInviteSchema } from "@repo/data";

import { useForm } from "react-hook-form";
import { useCreateInvite } from "./use-create-invite";
import {
  Form,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
} from "@repo/ui/components/ui/form";
import { Input } from "@repo/ui/components/ui/input";
import { Button } from "@repo/ui/components/ui/button";
import { useCurrentWorkspace } from "@repo/ui/hooks/use-current-workspace";

export function NewInviteForm({
  setIsOpen,
}: {
  setIsOpen: (open: boolean) => void;
}) {
  const form = useForm({
    resolver: zodResolver(NewInviteSchema),
    defaultValues: {
      limit: 10,
      method: "link" as "link" | "email",
    },
  });
  const { workspace } = useCurrentWorkspace();

  const { createInvite, isPending } = useCreateInvite(setIsOpen);

  if (!workspace) return null;

  function onSubmit(data: NewInvite) {
    createInvite(data);
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
        <FormField
          control={form.control}
          name="limit"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Limit</FormLabel>
              <Input type="number" {...field} />
              <FormDescription>
                Limit is number of allowed people to use this invite link
              </FormDescription>
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="method"
          render={({ field }) => (
            <FormItem className="hidden">
              <Input type="hidden" {...field} />
            </FormItem>
          )}
        />

        <Button type="submit" className="w-full" isPending={isPending}>
          Generate link
        </Button>
      </form>
    </Form>
  );
}
