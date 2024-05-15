import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { useChannelPath } from "@/hooks/use-channel-path";
import { ThreadAction } from "./thread-actions";
import { ThreadMessagesList } from "./thread-msgs-list";
import { CheckCircle2, CircleDot } from "lucide-react";
import { useCurrentWorkspace } from "@/components/workspace-provider";
import { useMember } from "@/hooks/use-member";
import { useParams } from "next/navigation";
import { useCurrentUser } from "@/hooks/use-current-user";
import { Replicache } from "replicache";
import { Thread, ThreadMessage, threadMutators, ThreadPost } from "@repo/data";
import { Post } from "./post";
import { CommentEditor } from "./comment-editor";
import { cn } from "@/lib/utils";
import { nanoid } from "nanoid";
import { useSubscribe } from "@/hooks/use-subscribe";
import { useMemo } from "react";
import { toast } from "sonner";

export function QAPage({ rep }: { rep?: Replicache<typeof threadMutators> }) {
  const { postId } = useParams<{ postId: string }>();

  const { snapshot: posts } = useSubscribe(rep, (tx) =>
    tx.get<ThreadPost[]>("posts"),
  );

  const post = useMemo(() => posts?.find((p) => p.id === postId), [posts]);
  const { member } = useMember(post?.author);
  const { user } = useCurrentUser();

  async function toggleThread() {
    const isResolved = post?.isResolved;
    try {
      if (user) {
        await rep?.mutate.togglePost(postId);
        await rep?.mutate.createComment({
          author: user.id,
          content: "toggle",
          createdAt: new Date().toISOString(),
          id: nanoid(6),
          postId: postId,
          type: isResolved ? "open" : "close",
        });
      }
    } catch {
      toast.error("Action failed");
    }
  }

  const Icon = post?.isResolved ? CircleDot : CheckCircle2;

  return (
    <div className="h-full px-2 pt-3">
      <div className="relative flex flex-1 flex-col gap-2.5">
        <div className="absolute left-5 top-1/2 -z-10 h-[86.5%] w-[2px] -translate-y-1/2 bg-border/70" />

        <div className="flex items-center justify-between">
          <ThreadAction
            comment={{
              id: "",
              author: post?.author || "",
              content: "",
              type: "open",
              createdAt: post?.createdAt || "",
            }}
            member={member}
            isFirst
          />

          <Button
            variant="secondary"
            size="sm"
            className={cn("gap-1.5")}
            onClick={toggleThread}
          >
            <Icon
              className={cn(
                "h-4 w-4 shrink-0",
                post?.isResolved
                  ? "text-green-600 dark:text-green-500"
                  : "text-purple-600 dark:text-purple-500",
              )}
            />
            {post?.isResolved ? "Reopen thread" : "Close thread"}
          </Button>
        </div>

        <div
          className={
            post?.comments && post.comments.length === 0 ? "-mb-4" : ""
          }
        >
          <Post post={post as ThreadPost | undefined} opened rep={rep} isQA />
        </div>

        <ThreadMessagesList
          post={post as ThreadPost}
          comments={post?.comments as ThreadMessage[]}
          rep={rep}
          isQA
        />
      </div>
      <div
        className={
          post?.comments && post.comments.length === 0 ? "mt-8" : "mt-4"
        }
      >
        <CommentEditor isResolved={post?.isResolved} rep={rep} isQA />
      </div>
      <div className="h-3 w-full bg-transparent" />
    </div>
  );
}
