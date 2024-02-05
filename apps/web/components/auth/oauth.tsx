"use client";

import { signIn } from "next-auth/react";
// import { FcGoogle as Google } from "react-icons/fc"; // -> Colored Google icon
import { RiGoogleFill as Google } from "react-icons/ri";
import { FaGithub as Github } from "react-icons/fa";
import { DEFAULT_LOGIN_REDIRECT } from "@/lib/auth/routes";
import { Button } from "@repo/ui";

export function OAuth() {
  async function onClick(provider: "google" | "github") {
    await signIn(provider, {
      callbackUrl: DEFAULT_LOGIN_REDIRECT,
    });
  }

  return (
    <div className="flex flex-col space-y-3">
      <Button
        variant="outline"
        className="w-full items-center gap-2 bg-transparent"
        onClick={() => onClick("google")}
      >
        <Google className="h-4 w-4" />
        Continue with Google
      </Button>
      <Button
        variant="outline"
        className="w-full gap-2 bg-transparent"
        onClick={() => onClick("github")}
      >
        <Github className="h-4 w-4" />
        Continue with GitHub
      </Button>
    </div>
  );
}
