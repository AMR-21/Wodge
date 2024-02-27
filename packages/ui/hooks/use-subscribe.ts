"use client";

import { notFound } from "next/navigation";
import { useEffect, useState } from "react";
import { ReadTransaction, Replicache, DeepReadonly } from "replicache";

import { useSubscribe as useSubscribeBase } from "replicache-react";

export function useSubscribe<T>(
  store: Replicache | undefined | null,
  query: (tx: ReadTransaction) => Promise<DeepReadonly<T> | undefined>,
) {
  const [isPending, setIsPending] = useState(true);
  // const [data, setData] = useState<DeepReadonly<T> | undefined>();
  // const [isMounted, setIsMounted] = useState(true);

  const data = useSubscribeBase(store, query, {
    default: { notFound: true },
  });

  // console.log({ dx });
  // useEffect(() => {
  //   setIsMounted(true);
  // }, [store]);

  // if (isMounted)
  //   store?.subscribe(query, {
  //     onData: function (data) {
  //       if (data) {
  //         setData(data);
  //       }
  //       setIsPending(false);
  //     },
  //   });

  return { data, isPending };
}
