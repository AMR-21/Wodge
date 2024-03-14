"use client";

import { makeWorkspacesStoreKey } from "@repo/data";
import { ReadTransaction } from "replicache";
import { useSubscribe } from "replicache-react";

function Home() {
  // const user = useUser();

  // const data = useSubscribe(
  //   useAppState((s) => s.userStore),
  //   (tx: ReadTransaction) => tx.get(makeWorkspacesStoreKey()),
  // );

  // console.log(data);
  // console.log(user);
  return <div>Marketing omar</div>;
}

export default Home;
