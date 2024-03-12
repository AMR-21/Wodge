import { zodResolver } from "@hookform/resolvers/zod";
import {
  BRAND_COLOR,
  DrObj,
  Role,
  RoleSchema,
  Team,
  TeamSchema,
  WORKSPACE_ROLE_ID_LENGTH,
  WORKSPACE_TEAM_ID_LENGTH,
} from "@repo/data";
import {
  Avatar,
  AvatarFallback,
  AvatarImage,
  Button,
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  Input,
  cn,
  useIsDesktop,
} from "@repo/ui";
import { useForm } from "react-hook-form";
import { SettingsContext } from "../settings";
import { use, useContext, useEffect, useRef, useState } from "react";
import { nanoid } from "nanoid";
import { useCurrentWorkspace } from "@/components/workspace/workspace-context";
import { ColorPicker } from "../color-picker";

export function RoleGeneralForm({ role }: { role: DrObj<Role> }) {
  const { dispatch } = useContext(SettingsContext);
  const { workspace } = useCurrentWorkspace();
  const isAddition = role.id.startsWith("add-");
  const [colored, setColored] = useState(false);
  const isDesktop = useIsDesktop();
  const form = useForm<DrObj<Role>>({
    resolver: zodResolver(
      RoleSchema.pick({ name: true, color: true, id: true }),
    ),
    defaultValues: {
      id: isAddition ? nanoid(WORKSPACE_TEAM_ID_LENGTH) : role.id,
      name: isAddition ? "" : role.name,
      color: isAddition ? BRAND_COLOR : role?.color,
    },
  });

  useEffect(() => {
    if (isAddition)
      return form.reset({ ...role, id: nanoid(WORKSPACE_ROLE_ID_LENGTH) });

    form.reset(role);
  }, [role]);

  async function onSubmit(data: Partial<DrObj<Role>>) {
    if (role.id === "add") console.log("add role", data.id);
    // console.log("update role general", { ...role, data });

    // await workspace?.createrole({ ...role, ...data });

    console.log("role", data);
    // update/create the role
    // if new role dispatch action to switch to the new role settings
    dispatch({
      type: "openAccordionItem",
      payload: { value: "role", id: data.id, isSidebarOpen: isDesktop },
    });

    // form.reset(team);
    // form.setValue("id", nanoid(WORKSPACE_TEAM_ID_LENGTH));
  }

  return (
    <div className="space-y-2">
      <Form {...form}>
        <form
          onSubmit={form.handleSubmit(onSubmit)}
          className="flex w-full flex-col gap-4"
        >
          <FormField
            control={form.control}
            name="name"
            render={({ field }) => (
              <FormItem className="basis-2/5">
                <FormLabel>Role name</FormLabel>
                <FormControl>
                  <Input {...field} className="" placeholder="Role Name" />
                </FormControl>
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="color"
            render={({ field }) => (
              <FormItem className="basis-2/5">
                <FormLabel>Role color</FormLabel>
                <FormControl>
                  <Input {...field} type="hidden" />
                </FormControl>
                <ColorPicker
                  withSwatches
                  handler={(c) => {
                    form.setValue("color", c);
                    if (c === role?.color) return;
                    setColored(true);
                  }}
                  defaultColor={role?.color || BRAND_COLOR}
                />
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

          <Button
            size="sm"
            type="submit"
            className={cn(
              "invisible mt-1 opacity-0 transition-all",
              form.formState.isDirty && "visible opacity-100",
              (colored || isAddition) && "visible opacity-100",
            )}
          >
            {isAddition ? "Create role" : "Update"}
          </Button>
        </form>
      </Form>
    </div>
  );
}
