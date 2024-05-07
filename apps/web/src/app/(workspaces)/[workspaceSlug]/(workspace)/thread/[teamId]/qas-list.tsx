import { DrObj, Team } from "@repo/data";
import { ScrollArea } from "@repo/ui/components/ui/scroll-area";
import { TabsContent } from "@repo/ui/components/ui/tabs";
import { ThreadEditor } from "./thread-editor";
import { Post } from "./post";
import { useMemo } from "react";

export function QAsList({ team }: { team?: DrObj<Team> }) {
  const qas = useMemo(
    () => team?.threads.filter((thread) => thread.type === "qa"),
    [team?.threads],
  );

  return (
    <ScrollArea className="h-full w-full px-2 py-2">
      <div className="pb-4">
        <ThreadEditor isQA />
        <div className="flex flex-col gap-1.5 py-4">
          {qas?.map((post) => <Post isQA key={post.id} post={post} />)}
        </div>
      </div>
    </ScrollArea>
  );
}
