"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { signIn } from "next-auth/react";
import { useTransition } from "react";

import {
  Button,
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  Input,
  Loader,
  toast,
} from "@repo/ui";
import { DEFAULT_LOGIN_REDIRECT } from "@/lib/auth/routes";

const EmailFormSchema = z.object({
  email: z.string().email(),
});

export function EmailForm() {
  const [isPending, startTransition] = useTransition();

  // Form definition
  const form = useForm<z.infer<typeof EmailFormSchema>>({
    resolver: zodResolver(EmailFormSchema),
    defaultValues: {
      email: "",
    },
  });

  // Submit handler with type-safe and validated values
  function onSubmit(values: z.infer<typeof EmailFormSchema>) {
    startTransition(() => {
      signIn("email", {
        email: values.email,
        redirect: false,
      }).then((res) => {
        if (!res) return toast.error("An error occurred. Please try again.");
        if (res.ok) toast.success("Check your email for a sign-in link");
        else toast.error("An error occurred. Please try again.");
      });
    });
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-3">
        <FormField
          control={form.control}
          name="email"
          render={({ field }) => (
            <FormItem>
              {/* <FormLabel className="text-muted-foreground">Email</FormLabel> */}
              <FormControl>
                <Input {...field} label="Email" />
              </FormControl>
            </FormItem>
          )}
        />

        <Button type="submit" className="w-full" disabled={isPending}>
          {isPending ? (
            <Loader color="rgb(var(--primary-foreground))" />
          ) : (
            "Continue with email"
          )}
        </Button>
      </form>
    </Form>
  );
}
