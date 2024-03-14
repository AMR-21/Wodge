import Link from "next/link";

import { EmailForm } from "./email-form";
import { OAuth } from "./oauth";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@repo/ui/components/ui/card";
import { Separator } from "@repo/ui/components/ui/separator";

export function LoginWrapper() {
  return (
    <Card className="flex w-fit max-w-96 flex-col justify-center border-none bg-transparent shadow-none">
      <CardHeader>
        <CardTitle className="text-center text-2xl">Welcome Back</CardTitle>
        <CardDescription className="text-center">
          Enter your email below to continue
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6 ">
        <EmailForm />

        <div className="relative flex justify-center">
          <div className="absolute inset-0 flex items-center">
            <Separator />
          </div>

          <div className="relative flex w-fit justify-center bg-background text-xs uppercase">
            <span className="bg-page px-2 text-muted-foreground">or</span>
          </div>
        </div>

        <OAuth />
      </CardContent>

      <CardFooter className="mt-4 flex px-8 text-sm text-muted-foreground">
        <p>
          By logging in, you agree to our{" "}
          <Link
            href="/terms"
            className="underline underline-offset-4 transition-colors hover:text-foreground"
          >
            Terms of Service
          </Link>{" "}
          and{" "}
          <Link
            href="/privacy"
            className="underline underline-offset-4 transition-colors hover:text-foreground"
          >
            Privacy Policy
          </Link>
          .
        </p>
      </CardFooter>
    </Card>
  );
}
