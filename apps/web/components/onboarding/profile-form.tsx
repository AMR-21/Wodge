"use client";

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
  useStepper,
} from "@repo/ui";

import { useForm } from "react-hook-form";
import { z } from "zod";
import { useOnboarding } from "./onboarding-context";
import { ProfileSchema } from "@repo/data";
import React, { useEffect, useRef } from "react";
import { updateProfile } from "@/actions/users";

export function ProfileForm() {
  const {
    profile,
    startTransition,
    avatar,
    inputRef,
    avatarRef,
    setAvatarFile,
    setAvatar,
    avatarFile,
  } = useOnboarding();

  const { nextStep } = useStepper();

  const formRef = useRef<HTMLFormElement>(null);

  const form = useForm<z.infer<typeof ProfileSchema>>({
    resolver: zodResolver(ProfileSchema),
    defaultValues: {
      displayName: profile?.displayName ?? "",
      username: profile?.username ?? "",
      avatar: profile?.avatar ?? "",
    },
  });

  useEffect(() => {
    if (!avatar) setAvatar(() => "/avatar.jpeg");
    form.setValue("avatar", avatar);
  }, [avatar]);

  useEffect(() => {
    if (!avatarFile) {
      form.setValue("avatar", avatar);
      return form.reset({ avatarFile });
    }
    form.setValue("avatarFile", avatarFile);
  }, [avatarFile]);

  async function onSubmit() {
    const data = new FormData(formRef.current!);

    startTransition(() => {
      updateProfile(data).then((res) => {
        if (res?.error) {
          toast(res.error);
        }

        if (res?.success) {
          nextStep();
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
        ref={formRef}
      >
        <FormField
          control={form.control}
          name="avatarFile"
          // BUG: when using field, it yields type error
          render={() => {
            return (
              <FormItem>
                <FormControl>
                  <Input
                    type="file"
                    id="avatarFile"
                    accept="image/*"
                    className="hidden"
                    {...form.register("avatarFile")}
                    ref={inputRef}
                    onChange={(e) => {
                      setAvatarFile(
                        e.target.files && e.target.files.length > 0
                          ? e.target.files[0]
                          : undefined,
                      );
                    }}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            );
          }}
        />
        <FormField
          control={form.control}
          name="avatar"
          render={({ field }) => (
            <FormItem>
              <FormControl>
                <Input {...field} ref={avatarRef} type="hidden" />
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
