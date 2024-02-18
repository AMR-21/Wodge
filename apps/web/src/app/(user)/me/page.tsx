"use client";

import { useUser } from "@/lib/client-utils";
import { useRouter, useSearchParams } from "next/navigation";
import { useRef } from "react";
import {
  PushRequest,
  PusherResult,
  Replicache,
  WriteTransaction,
} from "replicache";
import { useSubscribe } from "replicache-react";

function MePage() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const user = useUser();
  const name = useSubscribe(user?.store, async (tx) =>
    tx.get("user:UeIhmvODYEV461nI6mmm8"),
  );

  const input = useRef<HTMLInputElement>(null);

  if (!user) return null;

  // if (searchParams.has("login")) {
  //   (async () => {
  //     const res = await user.persistId();
  //     if (!res) router.push("/login/error");
  //   })();
  // }

  return (
    <div>
      Me page
      <form
        onSubmit={(e) => {
          e.preventDefault();
          user.store?.mutate.createUser(input.current!.value);
        }}
      >
        <input type="text" ref={input} />
        <button type="submit">Create user</button>
      </form>
      <button
        onClick={async () => {
          const res = await fetch(
            "http://localhost:1999/parties/user/" + "L-LrwqIbUxx0qBu5KS3eF",
            {
              credentials: "include",
            },
          );
          console.log(await res.json());
        }}
      >
        amr
      </button>
      {name && <p>{JSON.stringify(name)}</p>}
    </div>
  );
}

export default MePage;
