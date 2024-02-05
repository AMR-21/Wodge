import Link from "next/link";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
  CardFooter,
  Separator,
} from "@repo/ui";
import { EmailForm } from "./email-form";
import { OAuth } from "./oauth";

export function LoginWrapper() {
  return (
    <Card className="flex w-fit max-w-96  flex-col justify-center border-none bg-transparent text-center shadow-none">
      <CardHeader>
        <CardTitle className="text-2xl">Welcome onboard!</CardTitle>
        <CardDescription>Enter your email below to continue</CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
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
