import { GroupMultiSelect } from "@/components/group-multi-select";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  Channel,
  ChannelSchema,
  ID_LENGTH,
  Page,
  PageSchema,
  Room,
  RoomSchema,
} from "@repo/data";
import { Button, buttonVariants } from "@repo/ui/components/ui/button";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogTrigger,
} from "@repo/ui/components/ui/dialog";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
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
import { useRef } from "react";
import { useForm } from "react-hook-form";

export function AddRoomForm({
  folderId,
  teamId,
  room,
}: {
  folderId?: string;
  teamId: string;
  room?: Room;
}) {
  const { workspaceRep, structure } = useCurrentWorkspace();
  const form = useForm<Room>({
    resolver: zodResolver(RoomSchema),
    defaultValues: {
      name: room?.name || "",
      avatar: room?.avatar || "",
      editGroups: room?.editGroups || ["team-members"],
      viewGroups: room?.viewGroups || ["team-members"],
      id: room?.id || nanoid(ID_LENGTH),
    },
  });

  const closeRef = useRef<HTMLButtonElement>(null);

  async function onSubmit(data: Room) {
    if (room) {
      await workspaceRep?.mutate.updateRoom({
        teamId,
        ...data,
      });
      return closeRef.current?.click();
    }

    await workspaceRep?.mutate.createRoom({
      teamId,
      ...data,
    });
    form.reset();
    form.setValue("id", nanoid(ID_LENGTH));
    closeRef.current?.click();
  }

  return (
    <DialogContent className="max-w-80">
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
                <FormLabel>Room name</FormLabel>
                <FormControl>
                  <Input {...field} placeholder="new room" />
                </FormControl>
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="viewGroups"
            render={({ field }) => {
              return (
                <FormItem>
                  <FormLabel>View groups</FormLabel>
                  <FormControl>
                    <GroupMultiSelect
                      onChange={field.onChange}
                      baseGroups={structure.groups}
                      preset={room?.viewGroups}
                    />
                  </FormControl>
                </FormItem>
              );
            }}
          />

          <FormField
            control={form.control}
            name="editGroups"
            render={({ field }) => {
              return (
                <FormItem>
                  <FormLabel>Edit groups</FormLabel>
                  <FormControl>
                    <GroupMultiSelect
                      onChange={field.onChange}
                      baseGroups={structure.groups}
                      preset={room?.editGroups}
                    />
                  </FormControl>
                </FormItem>
              );
            }}
          />

          <Button type="submit" className="w-full">
            {room ? "Update" : "Create"} room
          </Button>

          <DialogClose asChild>
            <button
              ref={closeRef}
              className="hidden"
              aria-label="close dialog"
            />
          </DialogClose>
        </form>
      </Form>
    </DialogContent>
  );
}
