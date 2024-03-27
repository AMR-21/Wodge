import { zodResolver } from "@hookform/resolvers/zod";
import { DrObj, Team, TeamSchema, WORKSPACE_TEAM_ID_LENGTH } from "@repo/data";

import { useForm } from "react-hook-form";
import { SettingsContext } from "../settings";
import { use, useContext, useEffect, useRef } from "react";
import { nanoid } from "nanoid";
import { useIsDesktop } from "@repo/ui/hooks/use-is-desktop";
import { useCurrentUser } from "@repo/ui/hooks/use-current-user";
import { Avatar, AvatarFallback } from "@repo/ui/components/ui/avatar";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
} from "@repo/ui/components/ui/form";
import { Input } from "@repo/ui/components/ui/input";
import { Button } from "@repo/ui/components/ui/button";
import { cn } from "@repo/ui/lib/utils";
import { useCurrentWorkspace } from "@repo/ui/hooks/use-current-workspace";
import { useSubmitToast } from "@/components/use-submit-toast";
import { toast } from "@repo/ui/components/ui/toast";

export function TeamGeneralForm({ team }: { team: DrObj<Team> }) {
  const { dispatch } = useContext(SettingsContext);
  const { workspaceRep } = useCurrentWorkspace();
  const isAddition = team.id.startsWith("add-");

  const isDesktop = useIsDesktop();
  const { user } = useCurrentUser();
  const formRef = useRef<HTMLFormElement>(null);

  const form = useForm<DrObj<Team>>({
    resolver: zodResolver(
      TeamSchema.pick({ name: true, slug: true, id: true, avatar: true }),
    ),
    defaultValues: {
      id: isAddition ? nanoid(WORKSPACE_TEAM_ID_LENGTH) : team.id,
      name: isAddition ? "" : team?.name,
      avatar: isAddition ? "" : team?.avatar,
      slug: isAddition ? "" : team?.slug,
    },
  });

  const { toastId } = useSubmitToast(form, formRef);

  useEffect(() => {
    if (isAddition)
      return form.reset({
        ...team,
        id: nanoid(WORKSPACE_TEAM_ID_LENGTH),
      });

    form.reset(team);
  }, [team]);

  async function onSubmit(data: Pick<Team, "id" | "name" | "avatar" | "slug">) {
    if (isAddition) {
      await workspaceRep?.mutate.createTeam(data);

      dispatch({
        type: "openAccordionItem",
        payload: { value: "teams", id: data.id, isSidebarOpen: isDesktop },
      });
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
    }
    toast.dismiss(toastId);
    form.reset();
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
        </form>
      </Form>
    </div>
  );
}
