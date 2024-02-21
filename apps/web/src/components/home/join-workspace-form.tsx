import { zodResolver } from "@hookform/resolvers/zod";
import { JoinWorkspaceSchema } from "@repo/data/schemas";
import { Button, Form, FormField, FormItem, FormLabel, Input } from "@repo/ui";
import { nanoid } from "nanoid";
import { useForm } from "react-hook-form";
import { z } from "zod";

export function JoinWorkspaceForm() {
  const form = useForm({
    resolver: zodResolver(JoinWorkspaceSchema),
    defaultValues: {
      url: "",
    },
  });

  async function onSubmit(data: z.infer<typeof JoinWorkspaceSchema>) {
    console.log(data);
  }

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(onSubmit)}
        className="mt-3 flex flex-col gap-4 px-2"
      >
        <FormField
          control={form.control}
          name="url"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Invite link</FormLabel>
              <Input
                {...field}
                className="w-full"
                placeholder={"https://domain.com/" + nanoid(6)}
              />
            </FormItem>
          )}
        />

        <div className="flex gap-2">
          <Button variant="outline" className="basis-1/3">
            Cancel
          </Button>
          <Button type="submit" className="basis-2/3">
            Join Workspace
          </Button>
        </div>
      </form>
    </Form>
  );
}
