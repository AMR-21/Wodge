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
import { Thread, threadMutators } from "@repo/data";
import { Post } from "../post";
import { CommentEditor } from "./comment-editor";
import { cn } from "@/lib/utils";
import { nanoid } from "nanoid";

export function QAPage({ rep }: { rep?: Replicache<typeof threadMutators> }) {
  const path = useChannelPath();

  const { user } = useCurrentUser();

  const { teamId, channelId } = useParams<{
    teamId: string;
    channelId: string;
  }>();

  const { member } = useMember(path?.thread?.createdBy);
  const { workspaceRep } = useCurrentWorkspace();

  async function toggleThread() {
    // add message to thread
    if (user)
      await rep?.mutate.createMessage({
        id: nanoid(),
        author: user.id,
        content: "toggle",
        date: new Date().toISOString(),
        type: path?.thread?.isResolved ? "open" : "close",
      });

    await workspaceRep?.mutate.toggleThread({
      teamId,
      threadId: channelId,
    });
  }

  if (!path || !path.thread) return null;

  const Icon = path?.thread?.isResolved ? CircleDot : CheckCircle2;

  return (
    <div className="flex h-full max-h-dvh w-full flex-col gap-4 p-1.5">
      <ScrollArea className="">
        <div className="relative  flex flex-col gap-2.5">
          <div className="absolute left-5 top-1/2 -z-10 h-[86.5%] w-[2px] -translate-y-1/2 bg-border/70" />

          <div className="flex items-center justify-between">
            <ThreadAction
              msg={{
                id: "",
                author: path?.thread?.createdBy || "",
                content: "",
                type: "open",
                date: path?.thread?.createdAt || "",
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
                  path?.thread?.isResolved
                    ? "text-green-600 dark:text-green-500"
                    : "text-purple-600 dark:text-purple-500",
                )}
              />
              {path?.thread?.isResolved ? "Reopen thread" : "Close thread"}
            </Button>
          </div>

          <Post post={path.thread} opened isQA />

          <ThreadMessagesList thread={path.thread} rep={rep} />
        </div>
      </ScrollArea>
      <CommentEditor rep={rep} isQA />
    </div>
  );
}
