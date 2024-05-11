import { zodResolver } from "@hookform/resolvers/zod";
import { NewInvite, InviteSchema } from "@repo/data";

import { useForm } from "react-hook-form";
import { useCreateInvite } from "./use-create-invite";
import {
  Form,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useCurrentWorkspace } from "@/components/workspace-provider";

export function NewInviteForm({
  setIsOpen,
}: {
  setIsOpen: (open: boolean) => void;
}) {
  const form = useForm({
    resolver: zodResolver(InviteSchema),
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
              <Input
                {...field}
                type="number"
                onChange={(e) => field.onChange(+e.target.value)}
              />
              <FormDescription>
                Limit is number of allowed people to use this invite link
              </FormDescription>
              <FormMessage />
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
