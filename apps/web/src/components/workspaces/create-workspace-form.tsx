import { zodResolver } from "@hookform/resolvers/zod";
import { NewWorkspaceSchema, type NewWorkspace } from "@repo/data";

import {
  Button,
  DialogClose,
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  Input,
  Switch,
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
  TooltipWrapper,
  useCurrentUser,
} from "@repo/ui";

import { HelpCircle } from "lucide-react";
import { nanoid } from "nanoid";
import { useRouter } from "next/navigation";
import { useTransition } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";

export function CreateWorkspaceForm() {
  const user = useCurrentUser();
  const router = useRouter();
  const form = useForm<NewWorkspace>({
    resolver: zodResolver(NewWorkspaceSchema),
    defaultValues: {
      id: nanoid(),
      name: "",
      onCloud: false,
    },
  });
  const [isPending, startTransition] = useTransition();

  async function onSubmit(data: NewWorkspace) {
    startTransition(async () => {
      await user?.createWorkspace(data);

      // for safety and avoiding duplicate ids
      form.setValue("id", nanoid());

      router.push("/workspaces/" + data.id);
    });
  }

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(onSubmit)}
        className="mt-3 flex flex-col gap-4 px-2"
      >
        <FormField
          control={form.control}
          name="name"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Workspace name</FormLabel>
              <FormControl>
                <Input {...field} placeholder="Workspace name" />
              </FormControl>
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="onCloud"
          render={({ field }) => (
            <FormItem className="flex w-full flex-row items-center gap-1 space-y-0">
              <FormLabel>Enable cloud access</FormLabel>
              <TooltipWrapper
                className="max-w-64"
                sideOffset={6}
                content={
                  <p className="text-pretty">
                    By default a workspace is created locally, enabling cloud
                    access will allow you to save your workspace to the cloud,
                    access it from anywhere, and invite collaborators.
                  </p>
                }
              >
                <HelpCircle className="h-4 w-4 text-muted-foreground" />
              </TooltipWrapper>

              <FormControl className="ml-auto">
                <Switch
                  checked={field.value}
                  onCheckedChange={field.onChange}
                />
              </FormControl>
            </FormItem>
          )}
        />

        <div className="flex gap-2">
          <DialogClose asChild>
            <Button variant="outline" type="button" className="basis-1/3">
              Cancel
            </Button>
          </DialogClose>
          <Button type="submit" className="basis-2/3" isPending={isPending}>
            Create Workspace
          </Button>
        </div>
      </form>
    </Form>
  );
}
