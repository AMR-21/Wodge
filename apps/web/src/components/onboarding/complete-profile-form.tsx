"use client";

import { useRef, useState } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";

import { useOnboarding } from "./onboarding-context";
import { useStepper } from "@repo/ui/components/ui/stepper";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
} from "@repo/ui/components/ui/form";
import { UserAvatar } from "@repo/ui/components/user-avatar";
import { Input } from "@repo/ui/components/ui/input";
import { PublicUserType, UpdateUserSchema } from "@repo/data";
import { updateProfile } from "@/actions/user-actions";
import { toast } from "@repo/ui/components/ui/toast";
import { useMutation, useQueryClient } from "@tanstack/react-query";

export function CompleteProfileForm() {
  const { user, startTransition } = useOnboarding();
  const { nextStep } = useStepper();
  const [localUrl, setLocalUrl] = useState<string>("");
  const queryClient = useQueryClient();
  const avatarFileRef = useRef<HTMLInputElement>(null);

  const { mutateAsync } = useMutation({
    mutationFn: async (data: z.infer<typeof UpdateUserSchema>) => {
      const res = await fetch("/api/update-user", {
        method: "POST",
        body: JSON.stringify(data),
      });

      if (!res.ok) {
        toast.error("Username already exists.");
        return false;
      }

      return true;
    },
  });

  const form = useForm<z.infer<typeof UpdateUserSchema>>({
    resolver: zodResolver(UpdateUserSchema),
    defaultValues: {
      displayName: user?.displayName ?? "",
      username: user?.username ?? "",
      avatar: user?.avatar ?? "",
    },
  });

  function removeAvatar() {
    form.setValue("avatar", "");
    setLocalUrl("");
  }

  // TODO
  async function onAvatarChange(e: React.ChangeEvent<HTMLInputElement>) {
    // 1 Get the file and set preview URL - optionally validate file type and size
    // Optionally set local state to file to upload to server action
    const file = e.target.files?.[0];
    if (!file) return;
    const url = URL.createObjectURL(file);
    setLocalUrl(url);

    // 2 Created presigned url

    // 3 Upload file to R2

    // 4 Set avatar to the new url
    form.setValue("avatar", url);
  }

  async function onSubmit(data: z.infer<typeof UpdateUserSchema>) {
    startTransition(async () => {
      // console.log(typeof updateProfile);
      // updateProfile(data).then(async (res) => {
      //   if (res?.error) {
      //     toast.error(res.error);
      //   }
      //   if (res?.success) {
      //     queryClient.invalidateQueries({
      //       queryKey: ["user"],
      //     });
      //     nextStep();
      //   }
      // });

      const ok = await mutateAsync(data);

      if (ok) {
        queryClient.invalidateQueries({
          queryKey: ["user"],
        });

        nextStep();
      }
    });
  }

  return (
    <Form {...form}>
      <div className="flex flex-col space-y-3">
        <UserAvatar
          inputRef={avatarFileRef}
          localUrl={localUrl}
          onRemoveAvatar={removeAvatar}
          avatar={form.watch("avatar")}
          fallback={form.watch("displayName")}
        />

        <form
          onSubmit={form.handleSubmit(onSubmit)}
          className="flex flex-col space-y-2"
          id="profile-form"
        >
          <Input
            type="file"
            onChange={onAvatarChange}
            ref={avatarFileRef}
            className="hidden"
          />

          <FormField
            control={form.control}
            name="avatar"
            render={({ field }) => (
              <FormItem>
                <FormControl>
                  <Input {...field} type="hidden" />
                </FormControl>
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="displayName"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="text-muted-foreground">
                  Display name
                </FormLabel>
                <FormControl>
                  <Input {...field} placeholder="John Doe" className="peer" />
                </FormControl>
                <FormDescription withError collapsible>
                  This how people will see you. Use whatever you want.
                </FormDescription>
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="username"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="text-muted-foreground">
                  Username
                </FormLabel>
                <FormControl>
                  <Input {...field} className="peer" placeholder="johndoe" />
                </FormControl>
                <FormDescription withError collapsible>
                  Only letters, numbers, dashes, and underscores.
                </FormDescription>
              </FormItem>
            )}
          />
        </form>
      </div>
    </Form>
  );
}
