import { useCurrentWorkspace } from "@/components/workspace/workspace-context";
import { zodResolver } from "@hookform/resolvers/zod";
import { Invite, NewInvite, NewInviteSchema } from "@repo/data";
import { env } from "@repo/env";
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
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useParams } from "next/navigation";
import { useTransition } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";

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
  const { workspaceId } = useParams() as { workspaceId: string };

  const queryClient = useQueryClient();
  const { mutate, isPending } = useMutation({
    mutationFn: async (data: Pick<Invite, "limit">) => {
      await fetch(
        `${env.NEXT_PUBLIC_BACKEND_DOMAIN}/parties/workspace/${metadata?.id}/create-invite`,
        { method: "POST", credentials: "include", body: JSON.stringify(data) },
      );

      queryClient.invalidateQueries({
        queryKey: ["invites", workspaceId],
      });
    },
    onSuccess: () => {
      toast.success("Invite link generated successfully");
      setIsOpen(false);
    },
    onError: () => {
      toast.error("Failed to generate invite link");
    },
  });

  if (!metadata) return null;

  async function onSubmit(data: NewInvite) {
    mutate(data);
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
