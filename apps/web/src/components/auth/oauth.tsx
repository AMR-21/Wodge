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
    <div className="flex space-x-3">
      <Button
        variant="outline"
        className="w-full bg-transparent hover:bg-[#0057e7] hover:text-white"
        onClick={() => onClick("google")}
      >
        <Google className="h-5 w-5" />
        {/* Continue with Google */}
      </Button>
      <Button
        variant="outline"
        className="w-full bg-transparent text-[#24292e] hover:bg-[#24292e] hover:text-white"
        onClick={() => onClick("github")}
      >
        <Github className="h-5 w-5" />
        {/* Continue with GitHub */}
      </Button>
    </div>
  );
}
