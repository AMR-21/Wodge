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
} from "@repo/ui";
import { DEFAULT_LOGIN_REDIRECT } from "@/lib/auth/routes";

const EmailFormSchema = z.object({
  email: z.string().email(),
});

export function EmailForm() {
  const [pending, startTransition] = useTransition();

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
        callbackUrl: DEFAULT_LOGIN_REDIRECT,
        email: values.email,
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
              <FormLabel className="text-muted-foreground">Email</FormLabel>
              <FormControl>
                <Input {...field} placeholder="johndoe@example.com" />
              </FormControl>
            </FormItem>
          )}
        />

        <Button type="submit" className="w-full" disabled={pending}>
          Continue with email
        </Button>
      </form>
    </Form>
  );
}
