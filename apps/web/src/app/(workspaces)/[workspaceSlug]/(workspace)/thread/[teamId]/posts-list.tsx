import { DrObj, Team } from "@repo/data";
import { ScrollArea } from "@/components/ui/scroll-area";
import { TabsContent } from "@/components/ui/tabs";
import { ThreadEditor } from "./thread-editor";
import { useMemo } from "react";
import { Post } from "./post";

export function PostsList({ team }: { team?: DrObj<Team> }) {
  const posts = useMemo(
    () =>
      team?.threads.filter(
        (thread) => thread.type === "post" || thread.type === "poll",
      ),
    [team?.threads],
  );

  return (
    <div className="pb-4">
      <ThreadEditor />
      <div className="flex flex-col gap-2.5 py-4">
        {posts?.map((post) => <Post key={post.id} post={post} />)}
      </div>
    </div>
  );
}
