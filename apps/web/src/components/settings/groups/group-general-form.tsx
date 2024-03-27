import { zodResolver } from "@hookform/resolvers/zod";
import {
  BRAND_COLOR,
  DrObj,
  Group,
  GroupSchema,
  WORKSPACE_GROUP_ID_LENGTH,
  WORKSPACE_TEAM_ID_LENGTH,
} from "@repo/data";

import { useForm } from "react-hook-form";
import { SettingsContext } from "../settings";
import { useContext, useEffect, useRef, useState } from "react";
import { nanoid } from "nanoid";
import { ColorPicker } from "../color-picker";
import { useIsDesktop } from "@repo/ui/hooks/use-is-desktop";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
} from "@repo/ui/components/ui/form";
import { Input } from "@repo/ui/components/ui/input";
import { Button } from "@repo/ui/components/ui/button";
import { cn, hexToRgb } from "@repo/ui/lib/utils";
import { useCurrentWorkspace } from "@repo/ui/hooks/use-current-workspace";
import { useSubmitToast } from "@/components/use-submit-toast";
import { toast } from "@repo/ui/components/ui/toast";

export function GroupGeneralForm({ group }: { group: DrObj<Group> }) {
  const { dispatch } = useContext(SettingsContext);
  const { workspaceRep } = useCurrentWorkspace();
  const isAddition = group.id.startsWith("add-");
  const [colored, setColored] = useState(false);
  const isDesktop = useIsDesktop();

  const form = useForm<DrObj<Group>>({
    resolver: zodResolver(GroupSchema.omit({ members: true, createdBy: true })),
    defaultValues: {
      id: isAddition ? nanoid(WORKSPACE_TEAM_ID_LENGTH) : group.id,
      name: isAddition ? "" : group.name,
      color: isAddition ? BRAND_COLOR : group.color,
    },
  });

  const formRef = useRef<HTMLFormElement>(null);

  const { toastId } = useSubmitToast(form, formRef, colored);

  useEffect(() => {
    if (isAddition)
      return form.reset({ ...group, id: nanoid(WORKSPACE_GROUP_ID_LENGTH) });

    form.reset(group);
    setColored(false);
  }, [group, isAddition]);

  async function onSubmit(data: Omit<Group, "members" | "createdBy">) {
    if (isAddition) {
      await workspaceRep?.mutate.createGroup(data);

      dispatch({
        type: "openAccordionItem",
        payload: { value: "groups", id: data.id, isSidebarOpen: isDesktop },
      });
    }

    if (!isAddition)
      await workspaceRep?.mutate.updateGroup({
        groupId: data.id,
        groupUpdate: {
          action: "updateInfo",
          update: {
            name: data.name,
            color: data.color,
          },
        },
      });

    toast.dismiss(toastId);

    setColored(false);
  }

  return (
    <div className="space-y-2">
      <p className="text-sm">Color & Name</p>

      <Form {...form}>
        <form
          ref={formRef}
          onSubmit={form.handleSubmit(onSubmit)}
          className="flex w-full items-end gap-2"
        >
          <FormField
            control={form.control}
            name="color"
            render={({ field }) => (
              <FormItem>
                <FormControl>
                  <Input {...field} type="hidden" />
                </FormControl>
                <ColorPicker
                  key={group?.id}
                  handler={(c) => {
                    form.setValue("color", c);
                    if (c === group?.color) return;
                    setColored(true);
                  }}
                  defaultColor={group.color}
                />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="name"
            render={({ field }) => (
              <FormItem>
                <FormControl>
                  <Input
                    {...field}
                    placeholder="Group Name"
                    style={{
                      backgroundColor: `rgba(${hexToRgb(form.watch("color"))},0.25)`,
                      borderColor: form.watch("color"),
                    }}
                  />
                </FormControl>
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="id"
            render={({ field }) => (
              <FormItem>
                <FormControl>
                  <Input {...field} type="hidden" />
                </FormControl>
              </FormItem>
            )}
          />
        </form>
      </Form>
    </div>
  );
}
