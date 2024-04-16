import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@repo/ui/components/ui/form";
import { SettingsContentAction, SettingsContentSection } from "../settings";
import { Input } from "@repo/ui/components/ui/input";
import { useForm } from "react-hook-form";
import { Workspace, WorkspaceSchema } from "@repo/data";
import { useCurrentWorkspace } from "@repo/ui/hooks/use-current-workspace";
import { zodResolver } from "@hookform/resolvers/zod";
import { useEffect, useRef, useState } from "react";
import { Button } from "@repo/ui/components/ui/button";
import { cn } from "@repo/ui/lib/utils";
import { toast } from "@repo/ui/components/ui/toast";
import { Info } from "lucide-react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { env } from "@repo/env";
import { useSubmitToast } from "@/components/use-submit-toast";
import { useRouter } from "next/navigation";

// TODO USE rquery to mutate inside the DO
export function WorkspaceGeneralForm() {
  const { workspace, workspaceRep, workspaceId } = useCurrentWorkspace();
  const queryClient = useQueryClient();

  const form = useForm<Workspace>({
    resolver: zodResolver(WorkspaceSchema.pick({ name: true, slug: true })),
    defaultValues: {
      name: "",
      slug: "",
    },
  });

  const formRef = useRef<HTMLFormElement>(null);

  const router = useRouter();

  useEffect(() => {
    if (workspace) form.reset(workspace);
  }, [workspace]);

  const { mutate, isPending } = useMutation({
    mutationFn: async (data: Pick<Workspace, "name" | "slug">) => {
      await fetch(
        `${env.NEXT_PUBLIC_BACKEND_DOMAIN}/parties/workspace/${workspaceId}/update`,
        {
          method: "POST",
          credentials: "include",
          body: JSON.stringify(data),
        },
      );

      return data;
    },
    onSuccess: (data) => {
      // toast.dismiss(toastId);
      // if (data.slug !== workspace?.slug) {
      queryClient.invalidateQueries({
        queryKey: ["user-workspaces"],
      });
      // }
    },
  });

  // const { toastId } = useSubmitToast<Workspace>(form, formRef);

  async function onSubmit(data: Pick<Workspace, "name" | "slug">) {
    mutate(data);
    router.push(`/${data.slug}/settings`);
    form.reset(data);
  }

  return (
    <div className="space-y-2">
      <Form {...form}>
        <form
          onSubmit={form.handleSubmit(onSubmit)}
          ref={formRef}
          className="flex w-full flex-col gap-4"
        >
          <FormField
            control={form.control}
            name="name"
            render={({ field }) => (
              <FormItem className="space-y-2">
                <FormLabel>Workspace Name</FormLabel>
                <FormControl>
                  <Input {...field} className="w-2/5" />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="slug"
            render={({ field }) => (
              <FormItem className="space-y-2">
                <FormLabel>Workspace URL</FormLabel>
                <FormControl>
                  <Input {...field} className="w-2/5" />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <Button
            className="w-fit"
            disabled={!form.formState.isDirty || isPending}
            size="sm"
          >
            Update workspace
          </Button>
        </form>
      </Form>
    </div>
  );
}
