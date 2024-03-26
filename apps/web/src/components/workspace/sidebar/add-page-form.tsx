import { MultiSelect } from "@/components/multi-select";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  Channel,
  ChannelSchema,
  ID_LENGTH,
  Page,
  PageSchema,
} from "@repo/data";
import { Button, buttonVariants } from "@repo/ui/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogTrigger,
} from "@repo/ui/components/ui/dialog";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
} from "@repo/ui/components/ui/form";
import { Input } from "@repo/ui/components/ui/input";
import { PopoverClose } from "@repo/ui/components/ui/popover";
import { RadioGroup, RadioGroupItem } from "@repo/ui/components/ui/radio-group";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@repo/ui/components/ui/select";
import { useCurrentWorkspace } from "@repo/ui/hooks/use-current-workspace";
import { nanoid } from "nanoid";
import { useForm } from "react-hook-form";

export function AddPageForm({
  folderId,
  teamId,
}: {
  folderId?: string;
  teamId: string;
}) {
  const { workspaceRep } = useCurrentWorkspace();
  const form = useForm<Page>({
    resolver: zodResolver(PageSchema),
    defaultValues: {
      name: "",
      avatar: "",
      editRoles: ["team-members"],
      viewRoles: ["team-members"],
      id: nanoid(ID_LENGTH),
    },
  });

  async function onSubmit(data: Page) {
    // await workspaceRep?.mutate.createPage({
    //   folderId,
    //   teamId,
    //   ...data,
    // });
    form.reset();
  }

  return (
    <DialogContent>
      <Form {...form}>
        <form
          onSubmit={form.handleSubmit(onSubmit)}
          className="space-y-4 px-1.5"
        >
          <FormField
            control={form.control}
            name="name"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Channel name</FormLabel>
                <FormControl>
                  <Input {...field} />
                </FormControl>
              </FormItem>
            )}
          />

          <MultiSelect data={["a", "b", "c"]} />

          <Button type="submit" className="w-full">
            Create page
          </Button>
        </form>
      </Form>
    </DialogContent>
  );
}
