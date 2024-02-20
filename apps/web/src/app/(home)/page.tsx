"use client";

import { UserCard, useLogin } from "@repo/ui";
import { useLocalUser } from "@repo/ui";
import { Button, Separator } from "@repo/ui";
import { useRef } from "react";

function HomePage() {
  const user = useLocalUser();

  const input = useRef<HTMLInputElement>(null);

  useLogin();
  if (!user) return null;

  // if (searchParams.has("login")) {
  //   (async () => {
  //     const res = await user.persistId();
  //     if (!res) router.push("/login/error");
  //   })();
  // }

  return (
    <div className="mx-auto flex h-full w-fit flex-col items-center justify-center overflow-hidden  bg-purple-600">
      <div className="bg-yellow-500">
        {/* <UserCard /> */}
        <div>spaces</div>
        {/* Modal */}
        <Button>Join or create workspace</Button>
      </div>
    </div>
  );
}

export default HomePage;
