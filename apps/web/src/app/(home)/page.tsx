"use client";

import { useUser } from "@/lib/client-utils";
import { useRef } from "react";

function HomePage() {
  const user = useUser();

  const input = useRef<HTMLInputElement>(null);

  if (!user) return null;

  // if (searchParams.has("login")) {
  //   (async () => {
  //     const res = await user.persistId();
  //     if (!res) router.push("/login/error");
  //   })();
  // }

  return <div>Me page</div>;
}

export default HomePage;
