"use client";

import { User } from "@repo/data/client-models";
import { getCsrfToken, getSession } from "next-auth/react";
import { useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";

function MePage() {
  const [isLocalStorageSet, setIsLocalStorageSet] = useState(false);
  const searchParams = useSearchParams();

  // console.log({ searchParams });
  const usr = User.getInstance();
  console.log(usr);

  useEffect(() => {
    async function fn() {
      const session = await getSession();
      const csrf = await getCsrfToken();

      localStorage.setItem("session", JSON.stringify({ session, csrf }));
      setIsLocalStorageSet(true);
    }
    if (searchParams.has("newLogin") && !isLocalStorageSet) fn();
  }, []);

  return (
    <div>
      Me page
      <button
        onClick={async () => {
          const res = await fetch(
            "http://localhost:1999/parties/main/id",
            // "https://backend.amr-21.partykit.dev/parties/main/id",
            {
              // credentials: "include",
              credentials: "include",
            },
          );
          console.log(await res.text());
        }}
      >
        click
      </button>
    </div>
  );
}

export default MePage;
