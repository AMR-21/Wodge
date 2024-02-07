"use client";

import { Profile } from "@repo/data";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
  Input,
  toast,
} from "@repo/ui";

import { useForm } from "react-hook-form";
import { z } from "zod";
import { useOnboarding } from "./onboarding-context";
import { ProfileSchema } from "@repo/data";
import React, { useEffect } from "react";
import { updateProfile } from "@/actions/users";

export function ProfileForm() {
  const { profile, startTransition, api, avatar } = useOnboarding();

  const form = useForm<z.infer<typeof ProfileSchema>>({
    resolver: zodResolver(ProfileSchema),
    defaultValues: {
      displayName: profile?.displayName ?? "",
      username: profile?.username ?? "",
      avatar,
    },
  });

  useEffect(() => {
    form.setValue("avatar", avatar);
  }, [avatar]);

  function onSubmit(data: z.infer<typeof ProfileSchema>) {
    console.log(data);
    return;
    startTransition(() => {
      updateProfile(data).then((res) => {
        if (res?.error) {
          toast(res.error);
        }

        if (res?.success) {
          api?.scrollNext();
        }
      });
    });
  }

  if (!profile) return null;
  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(onSubmit)}
        className="flex flex-col space-y-2"
        id="profile-form"
      >
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
              <FormLabel className="text-muted-foreground">Username</FormLabel>
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
    </Form>
  );
}
