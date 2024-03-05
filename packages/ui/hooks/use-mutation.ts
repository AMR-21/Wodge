import { useCallback, useTransition } from "react";

export function useMutation<TData>({
  mutationFn,
}: {
  mutationFn: (args?: TData) => Promise<void> | void;
}) {
  const [isPending, startTransition] = useTransition();

  const mutate = useCallback(
    (args?: TData) => {
      startTransition(async () => {
        await mutationFn(args);
      });
    },
    [mutationFn],
  );

  return { isPending, mutate };
}

// const { mutate, isPending: ISXX } = useMutation<{ data: string }>({
//   mutationFn: async (data) => {
//     console.log(data);
//     console.log("Inside the function");
//   },
// });
