"use client";

import { RiGoogleFill as Google } from "react-icons/ri";
import { GitHubLogoIcon } from "@radix-ui/react-icons";
import { signIn } from "next-auth/react";
import { Button } from "@repo/ui/components/ui/button";
import { DEFAULT_LOGIN_REDIRECT } from "@/routes";

export function OAuth() {
  function onClick(provider: "google" | "github") {
    signIn(provider, {
      callbackUrl: DEFAULT_LOGIN_REDIRECT + "?login",
    });
  }

  return (
    <div className="flex space-x-3">
      <Button
        variant="outline"
        className="w-full bg-transparent transition-all hover:bg-[#0057e7] hover:text-white"
        onClick={() => onClick("google")}
      >
        <Google className="h-5 w-5" />
        {/* Continue with Google */}
      </Button>
      <Button
        variant="outline"
        className="w-full bg-transparent text-[#24292e] transition-all hover:bg-[#24292e] hover:text-[#fafbfc] dark:text-[#fafbfc] dark:hover:bg-[#fafbfc] dark:hover:text-[#24292e]"
        onClick={() => onClick("github")}
      >
        <GitHubLogoIcon className="h-5 w-5" />
        {/* Continue with GitHub */}
      </Button>
    </div>
  );
}
