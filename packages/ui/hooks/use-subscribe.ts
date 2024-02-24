import { useState } from "react";
import { ReadTransaction, Replicache, DeepReadonly } from "replicache";

export function useSubscribe<T>(
  store: Replicache | undefined | null,
  query: (tx: ReadTransaction) => Promise<DeepReadonly<T> | undefined>,
) {
  const [isPending, setIsPending] = useState(true);
  const [data, setData] = useState<DeepReadonly<T> | undefined>();

  store?.subscribe(query, {
    onData: function (data) {
      if (data) {
        setIsPending(false);
        setData(data);
      }
    },
  });

  return { data, isPending };
}
