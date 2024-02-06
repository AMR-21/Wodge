"use client";

import { Profile } from "@/data/schemas/db.schema";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  Button,
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
  Input,
  cn,
} from "@repo/ui";
import { useForm } from "react-hook-form";
import { z } from "zod";

const ProfileSchema = z.object({
  username: z
    .string({
      required_error: "Username is required",
    })
    .max(10, "Username is too long")
    .min(3, "Username is too short"),
  displayName: z
    .string({
      required_error: "Display name is required",
    })
    .max(70, "Display name is too long")
    .min(2, "Display name is too short"),
  avatar: z.string().url().optional(),
  bio: z.string().max(512).optional(),
});

export function ProfileForm({ profile }: { profile?: Partial<Profile> }) {
  const form = useForm<z.infer<typeof ProfileSchema>>({
    resolver: zodResolver(ProfileSchema),
    defaultValues: {
      displayName: profile?.displayName ?? "",
      bio: profile?.bio ?? "",
      avatar: profile?.avatar ?? "",
      username: profile?.username ?? "",
    },
  });

  function onSubmit(data: z.infer<typeof ProfileSchema>) {
    console.log(data);
  }

  if (!profile) return null;

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(onSubmit)}
        className="flex flex-col space-y-2"
      >
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
              <FormDescription className="h-0 overflow-hidden transition-all peer-focus:h-4 peer-focus:overflow-visible peer-focus:pb-5">
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
                <Input
                  {...field}
                  // value={profile.displayNames}
                  className="peer"
                  placeholder="johndoe"
                />
              </FormControl>
              <FormDescription className="h-0 overflow-hidden transition-all peer-focus:h-4 peer-focus:overflow-visible peer-focus:pb-5">
                Only letters, numbers, and underscores are allowed.
              </FormDescription>
            </FormItem>
          )}
        />

        {/* <Button type="submit" className="w-full">
          Continue with email
        </Button> */}
      </form>
    </Form>
  );
}
