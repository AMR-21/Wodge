import { zodResolver } from "@hookform/resolvers/zod";
import { NewWorkspaceSchema, NewWorkspace } from "@repo/data/schemas";
import {
  Button,
  DialogClose,
  Form,
  FormField,
  FormItem,
  FormLabel,
  Input,
  useLocalUser,
} from "@repo/ui";
import { nanoid } from "nanoid";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";

export function CreateWorkspaceForm() {
  const user = useLocalUser();
  const router = useRouter();
  const form = useForm({
    resolver: zodResolver(NewWorkspaceSchema),
    defaultValues: {
      id: nanoid(),
      name: "",
    },
  });

  async function onSubmit(data: NewWorkspace) {
    await user?.createWorkspace(data);

    // for safety and avoiding duplicate ids
    form.setValue("id", nanoid());

    router.replace("/" + data.id);
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
              <Input {...field} placeholder="Workspace name" />
            </FormItem>
          )}
        />

        <div className="flex gap-2">
          <DialogClose asChild>
            <Button variant="outline" type="button" className="basis-1/3">
              Cancel
            </Button>
          </DialogClose>
          <Button type="submit" className="basis-2/3">
            Create Workspace
          </Button>
        </div>
      </form>
    </Form>
  );
}
