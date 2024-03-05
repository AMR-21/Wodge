import { useCurrentWorkspace } from "@/components/workspace/workspace-context";
import { zodResolver } from "@hookform/resolvers/zod";
import { NewInvite, NewInviteSchema } from "@repo/data";
import {
  Button,
  Form,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  Input,
  toast,
} from "@repo/ui";
import { useParams } from "next/navigation";
import { useForm } from "react-hook-form";
import { useCreateInvite } from "./use-create-invite";

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
  const { metadata } = useCurrentWorkspace();

  const { createInvite, isPending } = useCreateInvite(setIsOpen);

  if (!metadata) return null;

  async function onSubmit(data: NewInvite) {
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
