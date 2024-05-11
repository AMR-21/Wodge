"use client";

import { RiGoogleFill as Google } from "react-icons/ri";
import { GitHubLogoIcon } from "@radix-ui/react-icons";
import { Button } from "@/components/ui/button";
import { createClient } from "@/lib/supabase/client";

export function OAuth() {
  const supabase = createClient();

  async function onClick(provider: "google" | "github") {
    await supabase.auth.signInWithOAuth({
      provider,
      options: {
        redirectTo: "http://localhost:3000/auth/callback",
      },
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
