import { ScrollArea } from "@/components/ui/scroll-area";
import { Post } from "../post";
import { Replicache } from "replicache";
import { threadMutators } from "@repo/data";
import { useChannelPath } from "@/hooks/use-channel-path";
import { CommentEditor } from "./comment-editor";
import { ThreadMessagesList } from "./thread-msgs-list";

export function PostPage({ rep }: { rep?: Replicache<typeof threadMutators> }) {
  const path = useChannelPath();

  if (!path || !path?.thread) return null;

  return (
    <div className="flex w-full flex-col gap-4 px-2 py-3">
      <Post post={path.thread} opened />
      <ThreadMessagesList thread={path.thread} rep={rep} />
      <CommentEditor rep={rep} />
    </div>
  );
}
