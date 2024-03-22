import { zodResolver } from "@hookform/resolvers/zod";
import { Channel, ChannelSchema, ID_LENGTH } from "@repo/data";
import { Button } from "@repo/ui/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
} from "@repo/ui/components/ui/form";
import { Input } from "@repo/ui/components/ui/input";
import { RadioGroup, RadioGroupItem } from "@repo/ui/components/ui/radio-group";
import { nanoid } from "nanoid";
import { useForm } from "react-hook-form";

export function AddChannelForm() {
  const form = useForm<Channel>({
    resolver: zodResolver(ChannelSchema),
    defaultValues: {
      name: "",
      avatar: "",
      editRoles: ["team-members"],
      viewRoles: ["team-members"],
      id: nanoid(ID_LENGTH),
      type: "page",
    },
  });

  async function onSubmit(data: Channel) {
    console.log(data);
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)}>
        <FormField
          control={form.control}
          name="type"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Channel type</FormLabel>
              <FormControl>
                <RadioGroup
                  onValueChange={field.onChange}
                  defaultValue={field.value}
                >
                  {["text", "voice", "page", "threads", "stage"].map((c) => (
                    <FormItem
                      key={c}
                      className="flex items-center space-x-3 space-y-0"
                    >
                      <FormControl>
                        <RadioGroupItem value={c} />
                      </FormControl>
                      <FormLabel className="font-normal capitalize">
                        {c}
                      </FormLabel>
                    </FormItem>
                  ))}
                </RadioGroup>
              </FormControl>
            </FormItem>
          )}
        />

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

        <Button type="submit">sub</Button>
      </form>
    </Form>
  );
}
