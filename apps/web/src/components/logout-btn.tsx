"use client";

import { createClient } from "@/lib/supabase/client";
import { Button } from "@repo/ui/components/ui/button";

export function LogoutBtn() {
  const supabase = createClient();
  return (
    <Button
      onClick={async () => await supabase.auth.signOut()}
      className="w-full"
    >
      Log out
    </Button>
  );
}
