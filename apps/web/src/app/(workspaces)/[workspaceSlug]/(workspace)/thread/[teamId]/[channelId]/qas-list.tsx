import { DrObj, Team, threadMutators, ThreadPost } from "@repo/data";
import { ScrollArea } from "@/components/ui/scroll-area";
import { TabsContent } from "@/components/ui/tabs";
import { Post } from "./post";
import { useMemo } from "react";
import { Replicache } from "replicache";
import { ThreadEditor } from "./thread-editor";

export function QAsList({
  posts,
  rep,
}: {
  posts?: DrObj<ThreadPost[]>;
  rep?: Replicache<typeof threadMutators>;
}) {
  const qas = useMemo(() => posts?.filter((p) => p.type === "qa"), [posts]);

  return (
    <div className="pb-4">
      <ThreadEditor isQA rep={rep} />
      <div className="flex flex-col gap-1.5 py-4">
        {qas?.map((post) => (
          <Post isQA key={post.id} post={post as ThreadPost} rep={rep} />
        ))}
      </div>
    </div>
  );
}
