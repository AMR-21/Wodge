"use client";

import { Button } from "@/components/ui/button";
import Link from "next/link";

export function GoBtn() {
  return (
    <Link href="/">
      <Button>Back to Wodge</Button>
    </Link>
  );
}
