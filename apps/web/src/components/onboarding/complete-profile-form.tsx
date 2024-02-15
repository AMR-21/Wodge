"use client";

import { useRef, useState } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";

import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  Input,
  UserAvatar,
  toast,
  useStepper,
} from "@repo/ui";

import { UserPublicInfoSchema } from "@repo/data/schemas";
import { updateProfile } from "@/actions/users";
import { useOnboarding } from "./onboarding-context";
import { getCsrfToken, getSession } from "next-auth/react";
import { User } from "@repo/data/client-models";

export function CompleteProfileForm() {
  const { user, startTransition } = useOnboarding();
  const { nextStep } = useStepper();
  const [localUrl, setLocalUrl] = useState<string>("");
  const avatarFileRef = useRef<HTMLInputElement>(null);

  const form = useForm<z.infer<typeof UserPublicInfoSchema>>({
    resolver: zodResolver(UserPublicInfoSchema),
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

  async function onSubmit(data: z.infer<typeof UserPublicInfoSchema>) {
    startTransition(() => {
      updateProfile(data).then(async (res) => {
        if (res?.error) {
          toast.error(res.error);
        }
        if (res?.success) {
          const {
            csrf: { csrfToken },
            session: { userId, sessionToken },
          } = await User.getInstance().session();

          const postRes = await fetch(
            `http://localhost:1999/parties/user/${userId}/populate`,
            {
              method: "POST",
              body: JSON.stringify(res.user[0]),
              headers: {
                Accept: "application/json",
                Authorization: `${sessionToken}$${csrfToken}`,
              },
            },
          );

          if (postRes.ok || postRes.status === 304) {
            // nextStep();
            console.log("success");
          } else {
            toast.error("Something went wrong. Please try again.");
          }
        }
      });
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
                <FormDescription
                  withError
                  className="h-0 overflow-hidden transition-all peer-focus:h-4 peer-focus:overflow-visible peer-focus:pb-5"
                >
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
                <FormDescription
                  withError
                  className="h-0 overflow-hidden transition-all peer-focus:h-4 peer-focus:overflow-visible peer-focus:pb-5"
                >
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
