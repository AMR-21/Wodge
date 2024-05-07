import { DrObj, Team } from "@repo/data";
import { ScrollArea } from "@repo/ui/components/ui/scroll-area";
import { TabsContent } from "@repo/ui/components/ui/tabs";
import { ThreadEditor } from "./thread-editor";
import { useMemo } from "react";
import { Post } from "./post";

export function PostsList({ team }: { team?: DrObj<Team> }) {
  const posts = useMemo(
    () => team?.threads.filter((thread) => thread.type === "post"),
    [team?.threads],
  );

  return (
    <ScrollArea className="h-full w-full px-2 py-2">
      <div className="pb-4">
        <ThreadEditor />
        <div className="flex flex-col gap-2.5 py-4">
          {posts?.map((post) => <Post key={post.id} post={post} />)}
        </div>
      </div>
    </ScrollArea>
  );
}
