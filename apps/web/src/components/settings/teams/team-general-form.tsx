import { zodResolver } from "@hookform/resolvers/zod";
import { DrObj, Team, TeamSchema, WORKSPACE_TEAM_ID_LENGTH } from "@repo/data";

import { useForm } from "react-hook-form";
import { useEffect, useRef } from "react";
import { nanoid } from "nanoid";
import { Avatar, AvatarFallback } from "@repo/ui/components/ui/avatar";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
} from "@repo/ui/components/ui/form";
import { Input } from "@repo/ui/components/ui/input";

import { useSubmitToast } from "@/components/use-submit-toast";
import { toast } from "@repo/ui/components/ui/toast";
import { useRouter } from "next/navigation";
import { Button } from "@repo/ui/components/ui/button";
import { useCurrentWorkspace } from "@repo/ui/hooks/use-current-workspace";

export function TeamGeneralForm({ team }: { team?: DrObj<Team> }) {
  const { workspaceRep, workspaceSlug } = useCurrentWorkspace();
  const isAddition = !team;
  const router = useRouter();

  const formRef = useRef<HTMLFormElement>(null);

  const form = useForm<DrObj<Team>>({
    resolver: zodResolver(
      TeamSchema.pick({ name: true, slug: true, id: true, avatar: true }),
    ),
    defaultValues: {
      id: isAddition ? nanoid(WORKSPACE_TEAM_ID_LENGTH) : team?.id,
      name: isAddition ? "" : team?.name,
      avatar: isAddition ? "" : team?.avatar,
      slug: isAddition ? "" : team?.slug,
    },
  });

  // const { toastId } = useSubmitToast(form, formRef);

  useEffect(() => {
    if (isAddition)
      return form.reset({
        id: nanoid(WORKSPACE_TEAM_ID_LENGTH),
      });

    form.reset(team);
  }, [team]);

  async function onSubmit(data: Pick<Team, "id" | "name" | "avatar" | "slug">) {
    let flag = false;

    if (isAddition) {
      await workspaceRep?.mutate.createTeam(data);
      flag = true;
    }

    if (!isAddition) {
      await workspaceRep?.mutate.updateTeam({
        teamId: team.id,
        teamUpdate: {
          action: "updateInfo",
          update: {
            name: data.name,
            avatar: data.avatar,
            slug: data.slug,
          },
        },
      });

      if (team.slug !== data.slug) flag = true;
    }

    form.reset();
    flag && router.push(`/${workspaceSlug}/settings/teams/${data.slug}`);
  }

  return (
    <div className="space-y-2">
      <Form {...form}>
        <form
          onSubmit={form.handleSubmit(onSubmit)}
          ref={formRef}
          className="flex w-full flex-col gap-4"
        >
          <div className="space-y-2">
            <p className="text-sm">Icon & Name</p>

            <div className="flex w-64 items-end gap-2">
              <Avatar className="h-8 w-8 rounded-md">
                {/* <AvatarImage src={form.watch("avatar")} /> */}
                <AvatarFallback className="rounded-md capitalize">
                  {form.watch("name")?.[0] || ""}
                </AvatarFallback>
              </Avatar>
              <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                  <FormItem className="">
                    <FormControl>
                      <Input {...field} className="" placeholder="Team Name" />
                    </FormControl>
                  </FormItem>
                )}
              />
            </div>
          </div>

          <div className="w-64">
            <FormField
              control={form.control}
              name="slug"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Team slug</FormLabel>
                  <FormControl>
                    <Input {...field} className="" placeholder="Team Name" />
                  </FormControl>
                </FormItem>
              )}
            />
          </div>

          <Button className="w-32" disabled={!form.formState.isDirty} size="sm">
            {isAddition ? "Create team" : "Update team"}
          </Button>
        </form>
      </Form>
    </div>
  );
}
