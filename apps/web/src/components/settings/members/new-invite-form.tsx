import { useCurrentWorkspace } from "@/components/workspace/workspace-provider";
import { zodResolver } from "@hookform/resolvers/zod";
import { InviteLink, InviteLinkSchema } from "@repo/data";
import { env } from "@repo/env";
import {
  Button,
  Form,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  Input,
} from "@repo/ui";
import { useTransition } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";

export function NewInviteForm({
  setLink,
}: {
  setLink: (link: string) => void;
}) {
  const form = useForm({
    resolver: zodResolver(
      z.object({
        limit: z.coerce.number().int().positive(),
      }),
    ),
    defaultValues: {
      limit: 10,
    },
  });

  const { metadata } = useCurrentWorkspace();

  const [isPending, startTransition] = useTransition();

  if (!metadata) return null;

  async function onSubmit(data: Pick<InviteLink, "limit">) {
    startTransition(async () => {
      // Regenerate invite link
      const res = await fetch(
        `${env.NEXT_PUBLIC_BACKEND_DOMAIN}/parties/workspace/${metadata?.id}/create-invite`,
        { method: "POST", credentials: "include", body: JSON.stringify(data) },
      );
      const inv: {
        inviteLink: string;
      } = await res.json();

      setLink(inv.inviteLink);
    });
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

        <Button type="submit" className="w-full" isPending={isPending}>
          Generate link
        </Button>
      </form>
    </Form>
  );
}
