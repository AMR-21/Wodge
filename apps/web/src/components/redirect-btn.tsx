"use client";

import { Button } from "@repo/ui";
import { useRouter } from "next/navigation";

export function RedirectBtn() {
  const router = useRouter();
  return (
    <Button onClick={() => router.replace("/login")} className="w-full">
      Log in
    </Button>
  );
}
